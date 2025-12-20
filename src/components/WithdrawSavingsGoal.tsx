import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import type { SavingsGoal } from "../types/savings";

interface Props {
    goal: SavingsGoal;
    onClose: () => void;
    onSuccess: () => void;
}

export default function WithdrawSavingsGoal({
    goal,
    onClose,
    onSuccess
}: Props) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const maxWithdraw = goal.currentAmount;

    const submit = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Enter valid amount");
            return;
        }

        if (Number(amount) > maxWithdraw) {
            toast.error(`Cannot withdraw more than ₹${maxWithdraw.toLocaleString()}`);
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            await API.post(`/savings-goals/${goal._id}/withdraw`, {
                amount: Number(amount)
            });
            toast.success("Withdrawal successful");
            onSuccess();
        } catch {
            toast.error("Failed to withdraw");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4">
                <h2 className="text-lg font-bold">Withdraw from {goal.name}</h2>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Available: <span className="font-bold">₹{maxWithdraw.toLocaleString()}</span>
                    </p>
                </div>

                <input
                    type="number"
                    min="1"
                    max={maxWithdraw}
                    step="1"
                    placeholder="Enter amount to withdraw"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />

                <div className="flex gap-2 mt-2">
                    {[100, 500, 1000].map(v => (
                        <button
                            key={v}
                            onClick={() => setAmount(String(Math.min(v, maxWithdraw)))}
                            disabled={v > maxWithdraw}
                            className="cursor-pointer px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700
                            hover:bg-gray-200 dark:bg-orange-900/30 dark:text-orange-300
                            dark:hover:bg-orange-800/50 dark:hover:text-orange-200 border border-transparent
                            dark:border-orange-800/40 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ₹{v}
                        </button>
                    ))}
                </div>



                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 active:bg-orange-800 disabled:opacity-70 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                    >
                        {loading ? "Processing..." : "Withdraw"}
                    </button>
                </div>
            </div>
        </div>
    );
}
