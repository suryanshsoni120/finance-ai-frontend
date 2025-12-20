import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import type { BudgetUI, BudgetDocument } from "../types/budget";
import { X } from "lucide-react";

interface Props {
    budget?: BudgetUI | null;
    currentBudgetDoc?: BudgetDocument | null;
    onClose: () => void;
    onSuccess: () => void;
}

const COMMON_CATEGORIES = [
    "Food", "Travel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Other"
];

export default function AddBudget({ budget, currentBudgetDoc, onClose, onSuccess }: Props) {
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (budget) {
            setCategory(budget.category);
            setAmount(budget.amount.toString());
        }
        // Set month/year from currentBudgetDoc if available
        if (currentBudgetDoc) {
            setMonth(currentBudgetDoc.month);
            setYear(currentBudgetDoc.year);
        }
    }, [budget, currentBudgetDoc]);

    const handleSubmit = async () => {
        if (!category || !amount) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setLoading(true);

            // Prepare the category budgets map
            const categoryBudgets = { ...currentBudgetDoc?.categoryBudgets };
            categoryBudgets[category] = Number(amount);

            // Calculate new total budget
            const totalBudget = Object.values(categoryBudgets).reduce((sum, val) => sum + val, 0);

            // Send full upsert payload with selected month/year
            await API.post("/budgets", {
                month,
                year,
                totalBudget,
                categoryBudgets
            });

            toast.success(budget ? "Budget updated" : "Budget set successfully");
            onSuccess();
        } catch (error) {
            toast.error("Failed to save budget");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl scale-100 transition-all">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {budget ? "Edit Budget" : "Set New Budget"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={!!budget}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none ${budget ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                    }`}
                            >
                                <option value="" disabled>Select category</option>
                                {COMMON_CATEGORIES.map(c => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {budget && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Category cannot be changed when editing
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Limit</label>
                        <input
                            type="number"
                            placeholder="e.g. 5000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                disabled={!!budget}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${budget ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                            >
                                <option value={1}>January</option>
                                <option value={2}>February</option>
                                <option value={3}>March</option>
                                <option value={4}>April</option>
                                <option value={5}>May</option>
                                <option value={6}>June</option>
                                <option value={7}>July</option>
                                <option value={8}>August</option>
                                <option value={9}>September</option>
                                <option value={10}>October</option>
                                <option value={11}>November</option>
                                <option value={12}>December</option>
                            </select>
                            {budget && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Month cannot be changed when editing
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                            <input
                                type="number"
                                min={2020}
                                max={2100}
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                disabled={!!budget}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${budget ? 'opacity-60 cursor-not-allowed' : ''
                                    }`}
                            />
                            {budget && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Year cannot be changed when editing
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="cursor-pointer flex-1 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="cursor-pointer flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            {loading ? "Saving..." : "Save Budget"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
