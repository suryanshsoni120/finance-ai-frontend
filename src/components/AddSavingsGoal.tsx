import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import type { SavingsGoal } from "../types/savings";

interface Props {
    goal?: SavingsGoal | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddSavingsGoal({ goal, onClose, onSuccess }: Props) {
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (goal) {
            setName(goal.name);
            setTargetAmount(goal.targetAmount.toString());
            setTargetDate(goal.targetDate || "");
        }
    }, [goal]);

    const submit = async () => {
        if (!name || !targetAmount) {
            toast.error("Name and target amount are required");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);

            if (goal) {
                // Edit existing goal - update name, targetAmount, targetDate only
                await API.put(`/savings-goals/${goal._id}`, {
                    name,
                    targetAmount: Number(targetAmount),
                    targetDate: targetDate || null
                });
                toast.success("Goal updated successfully");
            } else {
                // Create new goal
                await API.post("/savings-goals", {
                    name,
                    targetAmount: Number(targetAmount),
                    ...(targetDate && { targetDate })
                });
                toast.success("Savings goal created");
            }

            onSuccess();
        } catch {
            toast.error(goal ? "Failed to update goal" : "Failed to create goal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4">
                <h2 className="text-lg font-bold">
                    {goal ? "Edit Savings Goal" : "Create Savings Goal"}
                </h2>

                <input
                    placeholder="Goal name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />

                <input
                    type="number"
                    placeholder="Target amount"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />

                <input
                    type="date"
                    placeholder="Target date (optional)"
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                    >
                        {loading ? "Saving..." : (goal ? "Update" : "Create")}
                    </button>
                </div>
            </div>
        </div>
    );
}
