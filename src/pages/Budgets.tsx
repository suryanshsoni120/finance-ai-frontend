import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import API from "../services/api";
import type { BudgetUI, BudgetDocument } from "../types/budget";
import type { CategoryBreakdown } from "../types/analytics";
import BudgetCard from "../components/BudgetCard";
import AddBudget from "../components/AddBudget";

export default function Budgets() {
    const [budgets, setBudgets] = useState<BudgetUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetUI | null>(null);
    const [currentDocument, setCurrentDocument] = useState<BudgetDocument | null>(null);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const [budgetRes, breakdownRes] = await Promise.all([
                API.get(`/budgets?month=${month}&year=${year}`), // Returns BudgetDocument object
                API.get(`/analytics/category-breakdown?month=${month}&year=${year}`)
            ]);

            // Parse Limits (BudgetDocument)
            const budgetDoc: BudgetDocument | null = budgetRes.data;
            setCurrentDocument(budgetDoc);

            // Parse Usage (Breakdown)
            const breakdown: CategoryBreakdown[] = breakdownRes.data || [];
            const spentMap = new Map<string, number>();
            breakdown.forEach(b => {
                spentMap.set(b._id, b.total);
            });

            // Merge
            const mergedBudgets: BudgetUI[] = [];

            if (budgetDoc && budgetDoc.categoryBudgets) {
                Object.entries(budgetDoc.categoryBudgets).forEach(([category, limit]) => {
                    mergedBudgets.push({
                        category,
                        amount: limit,
                        spent: spentMap.get(category) || 0
                    });
                });
            }

            setBudgets(mergedBudgets);
        } catch (error) {
            console.error("Failed to fetch budgets", error);
            setBudgets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (budget: BudgetUI) => {
        setEditingBudget(budget);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingBudget(null);
    };

    const handleSuccess = () => {
        handleClose();
        fetchBudgets();
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Budgets</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track your spending limits per category</p>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>Set Budget</span>
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center text-gray-500">Loading budgets...</div>
            ) : budgets.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No budgets set for this month</p>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="cursor-pointer text-blue-600 font-medium hover:underline"
                    >
                        Create your first budget
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgets.map(budget => (
                        <BudgetCard
                            key={budget._id}
                            budget={budget}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {modalOpen && (
                <AddBudget
                    budget={editingBudget}
                    currentBudgetDoc={currentDocument}
                    onClose={handleClose}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}