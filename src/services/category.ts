import { BarChart, Briefcase, Car, Gift, HeartPulse, Percent, Plug, Repeat, RotateCcw, ShoppingBag, Tag, TrendingUp, Utensils, type LucideIcon } from "lucide-react";

interface CategoryStyle {
    badge: string;
    icon: LucideIcon;
    color: string;
}

const DEFAULT_STYLE: CategoryStyle = {
    badge: "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300",
    icon: Tag,
    color: "#6b7280"
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
    food: {
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
        icon: Utensils,
        color: "#f97316"
    },
    transport: {
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        icon: Car,
        color: "#f59e0b"
    },
    shopping: {
        badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        icon: ShoppingBag,
        color: "#a855f7"
    },
    subscriptions: {
        badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
        icon: Repeat,
        color: "#14b8a6"
    },
    utilities: {
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        icon: Plug,
        color: "#3b82f6"
    },
    health: {
        badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
        icon: HeartPulse,
        color: "#f43f5e"
    },
    salary: {
        badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        icon: Briefcase,
        color: "#22c55e"
    },
    bonus: {
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        icon: Gift,
        color: "#10b981"
    },
    cashback: {
        badge: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300",
        icon: Percent,
        color: "#84cc16"
    },
    interest: {
        badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
        icon: TrendingUp,
        color: "#6366f1"
    },
    dividend: {
        badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
        icon: BarChart,
        color: "#0ea5e9"
    },
    refund: {
        badge: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
        icon: RotateCcw,
        color: "#64748b"
    }
};

const getStyle = (category?: string) => {
    const key = (category ?? "").toLowerCase();
    return CATEGORY_STYLES[key] || DEFAULT_STYLE;
};

export const categoryColor = (category?: string) => getStyle(category).badge;
export const categoryIcon = (category?: string) => getStyle(category).icon;
export const getCategoryChartColor = (category?: string) => getStyle(category).color;