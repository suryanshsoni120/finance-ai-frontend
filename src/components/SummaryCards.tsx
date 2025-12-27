import type { Summary } from "../types/analytics";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Props {
  summary: Summary;
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label: "Income",
      value: summary.income ?? 0,
      color: "text-green-600 dark:text-green-400",
      icon: TrendingUp,
      bg: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40"
    },
    {
      label: "Expense",
      value: summary.expense ?? 0,
      color: "text-red-600 dark:text-red-400",
      icon: TrendingDown,
      bg: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40"
    },
    {
      label: "Savings",
      value: summary.savings ?? 0,
      color: "text-blue-600 dark:text-blue-400",
      icon: Wallet,
      bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lift"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${card.bg} shadow-inner`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase">{card.label}</p>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            ₹{card.value.toLocaleString()}
          </h2>
        </div>
      ))}
    </div>
  );
}