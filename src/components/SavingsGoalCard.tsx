import { Pencil, Trash2, ArrowDownCircle, ArrowUpCircle, Calendar, Target } from "lucide-react";
import type { SavingsGoal } from "../types/savings";

interface Props {
    goal: SavingsGoal;
    onContribute: () => void;
    onWithdraw: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function SavingsGoalCard({ goal, onContribute, onWithdraw, onEdit, onDelete }: Props) {
    const percent =
        goal.targetAmount > 0
            ? Math.min(
                Math.round((goal.currentAmount / goal.targetAmount) * 100),
                100
            )
            : 0;

    // Milestone detection
    const getMilestone = () => {
        if (percent >= 100) return { emoji: "🎉", text: "Goal Completed!", color: "text-green-600 dark:text-green-400" };
        if (percent >= 75) return { emoji: "🔥", text: "Almost There!", color: "text-orange-600 dark:text-orange-400" };
        if (percent >= 50) return { emoji: "💪", text: "Halfway There!", color: "text-blue-600 dark:text-blue-400" };
        if (percent >= 25) return { emoji: "🌟", text: "Great Start!", color: "text-purple-600 dark:text-purple-400" };
        return null;
    };

    const milestone = getMilestone();

    // Contribution suggestion based on target date
    const getContributionSuggestion = () => {
        if (!goal.targetDate || percent >= 100) return null;

        const today = new Date();
        const target = new Date(goal.targetDate);
        const daysRemaining = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysRemaining <= 0) return null;

        const remaining = goal.targetAmount - goal.currentAmount;
        const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));
        const suggestedMonthly = Math.ceil(remaining / monthsRemaining);

        return {
            daysRemaining,
            monthsRemaining,
            suggestedMonthly
        };
    };

    const suggestion = getContributionSuggestion();

    // Simple sparkline data (simulated - in real app, fetch from history)
    const generateSparklineData = () => {
        // Simulate progress over 8 points
        const points = 8;
        const data: number[] = [];
        for (let i = 0; i < points; i++) {
            data.push((percent / 100) * (i / (points - 1)));
        }
        return data;
    };

    const sparklineData = generateSparklineData();
    const maxValue = Math.max(...sparklineData, 0.1);

    return (
        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lift">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {goal.name}
                    </h3>
                    {milestone && (
                        <p className={`text-xs font-semibold ${milestone.color} mt-1`}>
                            {milestone.emoji} {milestone.text}
                        </p>
                    )}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    ₹{goal.currentAmount.toLocaleString()} / ₹
                    {goal.targetAmount.toLocaleString()}
                </span>
            </div>

            {/* Sparkline Chart */}
            <div className="h-12 flex items-end gap-0.5">
                {sparklineData.map((value, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300"
                        style={{
                            height: `${(value / maxValue) * 100}%`,
                            minHeight: '2px'
                        }}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>

                {/* Percentage */}
                <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {percent}% completed
                    </p>
                    {goal.targetDate && percent < 100 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Contribution Suggestion */}
            {suggestion && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800/40">
                    <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                                Suggested: ₹{suggestion.suggestedMonthly.toLocaleString()}/month
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                                {suggestion.daysRemaining} days ({suggestion.monthsRemaining} months) to reach your goal
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={onContribute}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <ArrowUpCircle size={16} />
                    Add
                </button>
                <button
                    onClick={onWithdraw}
                    disabled={goal.currentAmount === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowDownCircle size={16} />
                    Withdraw
                </button>
                <button
                    onClick={onEdit}
                    className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    title="Edit goal"
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
                    title="Delete goal"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}