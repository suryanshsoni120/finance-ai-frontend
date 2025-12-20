import { PieChart } from "lucide-react";

export default function EmptyChart() {
    return (
        <div className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 h-96 flex flex-col">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
                Expense Breakdown
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-800/50 mb-4">
                    <PieChart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                </div>
                <h4 className="text-gray-900 dark:text-white font-medium mb-1">
                    No expenses recorded
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                    Start adding expenses to see your spending breakdown here.
                </p>
            </div>
        </div>
    );
}
