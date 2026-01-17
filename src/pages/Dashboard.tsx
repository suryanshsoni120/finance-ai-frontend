import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import SummaryCards from "../components/SummaryCards";
import ExpenseChart from "../components/ExpenseChart";
import Insights from "../components/Insights";
import SavingsSummary from "../components/SavingsSummary";
import AddTransaction from "../components/AddTransaction";
import type { Summary, CategoryBreakdown } from "../types/analytics";
import type { Transaction } from "../types/transaction";
import { DEFAULT_INSIGHTS } from "../services/default";
import { Calendar, ChevronDown, RefreshCw } from "lucide-react";

export default function Dashboard() {
  // --- Data State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Filter State ---
  const [filterMode, setFilterMode] = useState<"month" | "range">("month");

  // Month Mode State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Range Mode State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Insights State
  const [insights, setInsights] = useState<string[]>(DEFAULT_INSIGHTS);
  const [aiLoading, setAiLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // --- Initial Fetch ---
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- AI Insights Fetching (Only for Month Mode) ---
  useEffect(() => {
    if (filterMode === "month") {
      const fetchInsights = async () => {
        try {
          setAiLoading(true);
          const res = await API.get(`/insights/monthly?month=${selectedMonth}&year=${selectedYear}`);
          setInsights(res.data.insights || DEFAULT_INSIGHTS);
        } catch {
          setInsights(DEFAULT_INSIGHTS);
        } finally {
          setAiLoading(false);
        }
      };

      // Debounce slightly to avoid rapid calls during mount/change
      const timer = setTimeout(fetchInsights, 200);
      return () => clearTimeout(timer);
    } else {
      // In range mode, AI insights aren't supported by backend yet
      setInsights([]);
    }
  }, [filterMode, selectedMonth, selectedYear]);

  // --- Derived Data (Filtering & Aggregation) ---
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      // Reset time to midnight for consistent comparison
      tDate.setHours(0, 0, 0, 0);

      // 1. Date Filter
      let dateMatch = true;
      if (filterMode === "month") {
        dateMatch = (tDate.getMonth() + 1 === selectedMonth) && (tDate.getFullYear() === selectedYear);
      } else {
        if (fromDate) {
          const start = new Date(fromDate);
          start.setHours(0, 0, 0, 0);
          if (tDate < start) dateMatch = false;
        }
        if (toDate && dateMatch) {
          const end = new Date(toDate);
          end.setHours(0, 0, 0, 0);
          if (tDate > end) dateMatch = false;
        }
      }

      if (!dateMatch) return false;

      // 2. Category Filter
      if (selectedCategory !== "All") {
        if (t.category !== selectedCategory) return false;
      }

      return true;
    });
  }, [transactions, filterMode, selectedMonth, selectedYear, fromDate, toDate, selectedCategory]);

  // --- Statistics Calculation ---
  const summary = useMemo<Summary>(() => {
    let income = 0;
    let expense = 0;

    filteredData.forEach(t => {
      if (t.type === "income") income += t.amount;
      if (t.type === "expense") expense += t.amount;
    });

    return { income, expense, savings: income - expense };
  }, [filteredData]);

  const breakdown = useMemo<CategoryBreakdown[]>(() => {
    const map: Record<string, number> = {};

    filteredData.forEach(t => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(map)
      .map(([cat, total]) => ({ _id: cat, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredData]);

  const expenseCount = useMemo(() => {
    return filteredData.filter(t => t.type === "expense").length;
  }, [filteredData]);

  // --- Dynamic Category List ---
  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [transactions]);

  // --- Handlers ---
  const refresh = () => {
    fetchTransactions();
    // Re-trigger insights if in month mode (effect handles it)
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">

        {/* LEFT: MODE & DATES */}
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
          {/* Mode Toggle */}
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setFilterMode("month")}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${filterMode === "month" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setFilterMode("range")}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${filterMode === "range" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700"}`}
            >
              Range
            </button>
          </div>

          {/* Date Controls */}
          <div className="flex items-center gap-2">
            {filterMode === "month" ? (
              <>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="p-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="p-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none cursor-pointer"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="p-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="p-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CATEGORY, ADD & REFRESH */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Dropdown */}
          <div className="relative group">
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg outline-none cursor-pointer min-w-[140px]"
            >
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={refresh}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setOpen(true)}
            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 ml-auto lg:ml-0"
          >
            + Add Transaction
          </button>
        </div>
      </div>

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart data={breakdown} loading={loading} count={expenseCount} />
        {/* Only show Insights if supported or default to empty/message */}
        {filterMode === "month" ? (
          <Insights insights={insights} loading={aiLoading} />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Monthly Insights</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                AI insights are generated for full monthly periods. Switch to <b>Monthly</b> view to see them.
              </p>
            </div>
          </div>
        )}
      </div>

      <SavingsSummary />

      {open && (
        <AddTransaction
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}