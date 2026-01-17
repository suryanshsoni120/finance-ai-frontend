import {
    Utensils, Car, ShoppingBag, Repeat, Plug, HeartPulse, Briefcase, Gift,
    Percent, TrendingUp, BarChart, RotateCcw, Tag
} from "lucide-react";

export const categoryColor = (category?: string) => {
    switch ((category ?? "").toLowerCase()) {
        case "food":
            return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
        case "transport":
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
        case "shopping":
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
        case "subscriptions":
            return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
        case "utilities":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
        case "health":
            return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
        case "salary":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
        case "bonus":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
        case "cashback":
            return "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300";
        case "interest":
            return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
        case "dividend":
            return "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300";
        case "refund":
            return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
    }
};

export const categoryIcon = (category?: string) => {
    switch ((category ?? "").toLowerCase()) {
        case "food": return Utensils;
        case "transport": return Car;
        case "shopping": return ShoppingBag;
        case "subscriptions": return Repeat;
        case "utilities": return Plug;
        case "health": return HeartPulse;
        case "salary": return Briefcase;
        case "bonus": return Gift;
        case "cashback": return Percent;
        case "interest": return TrendingUp;
        case "dividend": return BarChart;
        case "refund": return RotateCcw;
        default: return Tag;
    }
};