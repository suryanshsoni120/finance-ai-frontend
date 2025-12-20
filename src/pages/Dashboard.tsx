import { useEffect, useState } from "react";
import API from "../services/api";
import SummaryCards from "../components/SummaryCards";
import ExpenseChart from "../components/ExpenseChart";
import Insights from "../components/Insights";
import SavingsSummary from "../components/SavingsSummary";
import AddTransaction from "../components/AddTransaction";
import type { Summary, CategoryBreakdown } from "../types/analytics";

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    // Use current month and year instead of hardcoded values
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    const [s, b, i] = await Promise.all([
      API.get(`/analytics/summary?month=${currentMonth}&year=${currentYear}`),
      API.get(`/analytics/category-breakdown?month=${currentMonth}&year=${currentYear}`),
      API.get(`/insights/monthly?month=${currentMonth}&year=${currentYear}`)
    ]);

    setSummary(s.data);
    setBreakdown(b.data);
    setInsights(i.data.insights);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!summary) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          + Add Transaction
        </button>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart data={breakdown} />
        <Insights insights={insights} />
      </div>

      <SavingsSummary />

      {open && (
        <AddTransaction
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}