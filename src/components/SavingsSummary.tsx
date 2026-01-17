import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PiggyBank, TrendingUp } from "lucide-react";
import API from "../services/api";
import type { SavingsGoal } from "../types/savings";

export default function SavingsSummary() {
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const res = await API.get("/savings-goals");
            setGoals(Array.isArray(res.data) ? res.data : []);
        } catch {
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (goals.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <PiggyBank className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Savings Goals
                    </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    No savings goals yet. Start saving for your future!
                </p>
                <Link
                    to="/savings"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                    Create your first goal →
                </Link>
            </div>
        );
    }

    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    // Get top 3 goals by progress percentage
    const topGoals = [...goals]
        .map(g => ({
            ...g,
            progress: g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0
        }))
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-card space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <PiggyBank className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Savings Goals
                    </h3>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
                </span>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Progress</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                        ₹{totalSaved.toLocaleString()} / ₹{totalTarget.toLocaleString()}
                    </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${Math.min(overallProgress, 100)}%` }}
                    />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{overallProgress}% completed</span>
                </div>
            </div>

            {/* Top Goals */}
            {topGoals.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Top Goals
                    </p>
                    {topGoals.map(goal => (
                        <div key={goal._id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                                {goal.name}
                            </span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 ml-2">
                                {Math.round(goal.progress)}%
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* View All Link */}
            <Link
                to="/savings"
                className="block text-center text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline pt-2"
            >
                View all goals →
            </Link>
        </div>
    );
}
