import { useEffect, useState } from "react";
import API from "../services/api";
import AI_API from "../services/aiApi";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

const INCOME_CATEGORIES = [
    "Salary",
    "Freelance",
    "Business",
    "Bonus",
    "Investment",
    "Other"
];

export default function AddTransaction({ onClose, onSuccess }: Props) {
    const [type, setType] = useState<"expense" | "income">("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
    const [loading, setLoading] = useState(false);

    /* -------------------------------
       Reset category when type changes
    -------------------------------- */
    useEffect(() => {
        setCategory("");
    }, [type]);

    /* -------------------------------
       AI CATEGORY SUGGESTION (EXPENSE ONLY)
    -------------------------------- */
    useEffect(() => {
        if (type !== "expense") return;
        if (description.trim().length < 4) return;

        const timer = setTimeout(async () => {
            try {
                const res = await AI_API.post("/predict-category", {
                    description
                });

                if (res.data?.category) {
                    setCategory(res.data.category);
                }
            } catch {
                // silent fail (AI should never block UX)
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [description, type]);

    /* -------------------------------
       SUBMIT TRANSACTION
    -------------------------------- */
    const submit = async () => {
        if (!amount || !category) {
            toast.error("Amount and category are required");
            return;
        }

        try {
            setLoading(true);

            await API.post("/transactions", {
                type,
                amount: Number(amount),
                category,
                description,
                isRecurring,
                frequency: isRecurring ? frequency : undefined
            });

            toast.success("Transaction added");
            onSuccess();
        } catch {
            toast.error("Failed to add transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-card rounded-2xl p-6 w-full max-w-md shadow-lift">
                <h2 className="text-lg font-semibold mb-4">
                    Add Transaction
                </h2>

                <div className="space-y-4">
                    {/* TYPE TOGGLE */}
                    <div className="flex gap-2">
                        {["expense", "income"].map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t as any)}
                                className={`cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium transition ${type === t
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* AMOUNT */}
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                    />

                    {/* DESCRIPTION */}
                    <input
                        placeholder={
                            type === "expense"
                                ? "Description (e.g. Swiggy order)"
                                : "Description (optional)"
                        }
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                    />

                    {/* CATEGORY */}
                    {type === "expense" && (
                        <input
                            placeholder="Category (AI suggested)"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-900 outline-none"
                        />
                    )}

                    {/* RECURRING TOGGLE */}
                    <div className="flex items-center justify-between py-1">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recurring Transaction?</label>
                        <button
                            onClick={() => setIsRecurring(!isRecurring)}
                            className={`cursor-pointer w-12 h-6 rounded-full transition-colors relative ${isRecurring ? "bg-blue-600" : "bg-gray-200 dark:bg-slate-700"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isRecurring ? "translate-x-6" : ""
                                    }`}
                            />
                        </button>
                    </div>

                    {/* FREQUENCY DROPDOWN */}
                    {isRecurring && (
                        <select
                            value={frequency}
                            onChange={e => setFrequency(e.target.value as any)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-900 outline-none"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    )}

                    {type === "income" && (
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="cursor-pointer w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 outline-none"
                        >
                            <option value="">Select category</option>
                            {INCOME_CATEGORIES.map(c => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="cursor-pointer px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            onClick={submit}
                            className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}