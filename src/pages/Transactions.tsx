import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import type { Transaction } from "../types/transaction";
import { ArrowDownRight, ArrowUpRight, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

const categoryColor = (category?: string) => {
    switch ((category ?? "").toLowerCase()) {
        case "food":
            return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
        case "shopping":
            return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
        case "utilities":
            return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
        case "salary":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
        default:
            return "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300";
    }
};

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    type SortKey = "date" | "description" | "category" | "amount";
    type SortOrder = "asc" | "desc";
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await API.get("/transactions");
            setTransactions(Array.isArray(res.data) ? res.data : []);
        } catch {
            toast.error("Failed to fetch transactions");
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const uniqueCategories = useMemo(() => {
        const categories = new Set(
            transactions
                .map(t => t.category)
                .filter(Boolean)
        );
        return Array.from(categories).sort();
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        const searchText = search.toLowerCase();
        return transactions.filter(t => {
            const description = (t.description ?? "").toLowerCase();
            const category = (t.category ?? "").toLowerCase();
            const textMatch =
                description.includes(searchText) ||
                category.includes(searchText);
            const typeMatch =
                typeFilter === "all" || t.type === typeFilter;
            const categoryMatch =
                categoryFilter === "all" || t.category === categoryFilter;
            const amount = Math.abs(t.amount);
            const min = minAmount ? Number(minAmount) : null;
            const max = maxAmount ? Number(maxAmount) : null;
            const effectiveMin =
                min !== null && max !== null ? Math.min(min, max) : min;
            const effectiveMax =
                min !== null && max !== null ? Math.max(min, max) : max;
            const minMatch =
                effectiveMin === null || amount >= effectiveMin;
            const maxMatch =
                effectiveMax === null || amount <= effectiveMax;
            return (textMatch && typeMatch && categoryMatch && minMatch && maxMatch);
        });
    }, [transactions, search, typeFilter, categoryFilter, minAmount, maxAmount]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            let aVal: any;
            let bVal: any;
            switch (sortKey) {
                case "date":
                    aVal = new Date(a.date).getTime();
                    bVal = new Date(b.date).getTime();
                    break;
                case "description":
                    aVal = (a.description ?? "").toLowerCase();
                    bVal = (b.description ?? "").toLowerCase();
                    break;
                case "category":
                    aVal = (a.category ?? "").toLowerCase();
                    bVal = (b.category ?? "").toLowerCase();
                    break;
                case "amount":
                    aVal = Math.abs(a.amount);
                    bVal = Math.abs(b.amount);
                    break;
            }
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredTransactions, sortKey, sortOrder]);

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortKey !== column) return <span className="opacity-30">⇅</span>;
        return (
            <span className="ml-1 text-xs">
                {sortOrder === "asc" ? "▲" : "▼"}
            </span>
        );
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Transactions
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    View and manage your financial history
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search description"
                        className="h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                </div>

                {/* Type */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="h-11 pl-10 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="all">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                {/* Category */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="h-11 pl-10 pr-8 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Min */}
                <input
                    type="number"
                    min={0}
                    value={minAmount}
                    onChange={e => setMinAmount(e.target.value)}
                    placeholder="Min ₹"
                    className="h-11 w-28 px-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />

                {/* Max */}
                <input
                    type="number"
                    min={0}
                    value={maxAmount}
                    onChange={e => setMaxAmount(e.target.value)}
                    placeholder="Max ₹"
                    className="h-11 w-28 px-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800/70 rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Loading transactions...
                    </div>
                ) : sortedTransactions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No transactions found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100/80 dark:bg-slate-700/60 text-xs uppercase tracking-wide text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th onClick={() => handleSort("date")} className="px-6 py-4 cursor-pointer">
                                        Date <SortIcon column="date" />
                                    </th>
                                    <th onClick={() => handleSort("description")} className="px-6 py-4 cursor-pointer">
                                        Description <SortIcon column="description" />
                                    </th>
                                    <th onClick={() => handleSort("category")} className="px-6 py-4 cursor-pointer">
                                        Category <SortIcon column="category" />
                                    </th>
                                    <th onClick={() => handleSort("amount")} className="px-6 py-4 text-right cursor-pointer">
                                        Amount <SortIcon column="amount" />
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200/60 dark:divide-gray-700/60">
                                {sortedTransactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-100/60 dark:hover:bg-slate-700/40">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(t.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {t.description ?? "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor(t.category)}`}>
                                                {t.category ?? "Other"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">
                                            <span className={`inline-flex items-center gap-1 ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                                                {t.type === "income" ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString()}
                                                {t.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}