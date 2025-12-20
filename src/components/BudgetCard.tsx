import type { BudgetUI } from "../types/budget";
import { DollarSign, Edit2, AlertCircle } from "lucide-react";

interface Props {
    budget: BudgetUI;
    onEdit: (budget: BudgetUI) => void;
}

export default function BudgetCard({ budget, onEdit }: Props) {
    const percentage = Math.min((budget.spent / budget.amount) * 100, 100);

    // Determine color based on usage
    let statusColor = "bg-green-500";
    let textColor = "text-green-600 dark:text-green-400";
    let bgColor = "bg-green-50 dark:bg-green-900/20";

    if (percentage >= 100) {
        statusColor = "bg-red-500";
        textColor = "text-red-600 dark:text-red-400";
        bgColor = "bg-red-50 dark:bg-red-900/20";
    } else if (percentage >= 80) {
        statusColor = "bg-yellow-500";
        textColor = "text-yellow-600 dark:text-yellow-400";
        bgColor = "bg-yellow-50 dark:bg-yellow-900/20";
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lift">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${bgColor} ${textColor}`}>
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {budget.category}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Limit</p>
                    </div>
                </div>
                <button
                    onClick={() => onEdit(budget)}
                    className="cursor-pointer p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                    <Edit2 size={16} />
                </button>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{budget.spent.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                            / ₹{budget.amount.toLocaleString()}
                        </span>
                    </div>
                    <span className={`text-sm font-medium ${textColor}`}>
                        {percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="h-3 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${statusColor} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {percentage >= 100 && (
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-red-500">
                        <AlertCircle size={12} />
                        <span>Budget exceeded!</span>
                    </div>
                )}
            </div>
        </div>
    );
}
