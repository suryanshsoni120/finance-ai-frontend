import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Search, Filter, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";
import type { Transaction } from "../types/transaction";
import ExportDropdown from "../components/ExportDropdown";
import { formatDate } from "../services/formatter";
import { categoryColor, categoryIcon } from "../services/category";

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, typeFilter, categoryFilter, minAmount, maxAmount]);

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

    // Pagination logic
    const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Transactions
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        View and manage your financial history
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link
                        to="/import"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                    >
                        <Upload size={16} />
                        Import Statement
                    </Link>
                </div>
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
                <ExportDropdown transactions={filteredTransactions} />
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
                    <>
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

                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {paginatedTransactions.map(t => {
                                        const Icon = categoryIcon(t.category);
                                        return (
                                            <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors">
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{formatDate(t.date)}</td>
                                                <td className="px-6 py-4 text-gray-900 dark:text-white">{t.description}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${categoryColor(t.category)}`}>
                                                        <Icon size={14} />
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold">
                                                    <span className={`inline-flex items-center gap-1 ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                                                        {t.type === "income" ? "+" : "-"}₹{Math.abs(t.amount).toLocaleString()}
                                                        {t.type === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50">
                            {/* Results Info & Items Per Page */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    Showing {startIndex + 1}-{Math.min(endIndex, sortedTransactions.length)} of {sortedTransactions.length} results
                                </span>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="itemsPerPage" className="text-sm">
                                        Per page:
                                    </label>
                                    <select
                                        id="itemsPerPage"
                                        value={itemsPerPage}
                                        onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer text-sm"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>

                            {/* Page Navigation */}
                            {totalPages > 1 && (
                                <div className="flex items-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                    >
                                        <ChevronLeft size={16} />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            page === "..." ? (
                                                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page as number)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}