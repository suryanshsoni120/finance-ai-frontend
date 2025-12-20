import { useEffect, useState } from "react";
import { Plus, PiggyBank } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import type { SavingsGoal } from "../types/savings";
import SavingsGoalCard from "../components/SavingsGoalCard";
import AddSavingsGoal from "../components/AddSavingsGoal";
import ContributeSavingsGoal from "../components/ContributeSavingsGoal";
import WithdrawSavingsGoal from "../components/WithdrawSavingsGoal";

export default function Savings() {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [editGoal, setEditGoal] = useState<SavingsGoal | null>(null);
    const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
    const [withdrawGoal, setWithdrawGoal] = useState<SavingsGoal | null>(null);
    const [deleteGoal, setDeleteGoal] = useState<SavingsGoal | null>(null);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const res = await API.get("/savings-goals");
            setGoals(res.data);
        } catch (err) {
            console.error("Failed to fetch savings goals", err);
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteGoal) return;

        try {
            await API.delete(`/savings-goals/${deleteGoal._id}`);
            toast.success("Goal deleted successfully");
            setDeleteGoal(null);
            fetchGoals();
        } catch {
            toast.error("Failed to delete goal");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                        <PiggyBank size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Savings Goals
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Save for what matters to you
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                >
                    <Plus size={20} />
                    New Goal
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            className="h-48 bg-gray-100 dark:bg-slate-800 rounded-2xl"
                        />
                    ))}
                </div>
            ) : goals.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed rounded-3xl border-gray-200 dark:border-gray-700">
                    <PiggyBank size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-bold mb-2">No goals yet</h3>
                    <p className="text-gray-500 mb-6">
                        Create your first savings goal to get started.
                    </p>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="cursor-pointer text-blue-600 font-semibold hover:underline"
                    >
                        Create a goal
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <SavingsGoalCard
                            key={goal._id}
                            goal={goal}
                            onContribute={() => setContributeGoal(goal)}
                            onWithdraw={() => setWithdrawGoal(goal)}
                            onEdit={() => setEditGoal(goal)}
                            onDelete={() => setDeleteGoal(goal)}
                        />
                    ))}
                </div>
            )}

            {/* Create Goal Modal */}
            {createOpen && (
                <AddSavingsGoal
                    onClose={() => setCreateOpen(false)}
                    onSuccess={() => {
                        setCreateOpen(false);
                        fetchGoals();
                    }}
                />
            )}

            {/* Edit Goal Modal */}
            {editGoal && (
                <AddSavingsGoal
                    goal={editGoal}
                    onClose={() => setEditGoal(null)}
                    onSuccess={() => {
                        setEditGoal(null);
                        fetchGoals();
                    }}
                />
            )}

            {/* Contribute Modal */}
            {contributeGoal && (
                <ContributeSavingsGoal
                    goal={contributeGoal}
                    onClose={() => setContributeGoal(null)}
                    onSuccess={() => {
                        setContributeGoal(null);
                        fetchGoals();
                    }}
                />
            )}

            {/* Withdraw Modal */}
            {withdrawGoal && (
                <WithdrawSavingsGoal
                    goal={withdrawGoal}
                    onClose={() => setWithdrawGoal(null)}
                    onSuccess={() => {
                        setWithdrawGoal(null);
                        fetchGoals();
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteGoal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-card rounded-2xl p-6 w-full max-w-sm space-y-4">
                        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
                            Delete Goal?
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete <span className="font-bold">"{deleteGoal.name}"</span>?
                            {deleteGoal.currentAmount > 0 && (
                                <span className="block mt-2 text-sm text-orange-600 dark:text-orange-400">
                                    ⚠️ This goal has ₹{deleteGoal.currentAmount.toLocaleString()} saved.
                                </span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteGoal(null)}
                                className="flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-500/20 transition-all cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}