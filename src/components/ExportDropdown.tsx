import { useState, useRef, useEffect } from "react";
import { Download, FileText, FileSpreadsheet, Table } from "lucide-react";
import type { Transaction } from "../types/transaction";
import { exportTransactionsToCSV, exportTransactionsToExcel, exportTransactionsToPDF } from "../services/export";

interface Props {
    transactions: Transaction[];
}

const options = [
    { label: "CSV", icon: Table, action: exportTransactionsToCSV },
    { label: "Excel", icon: FileSpreadsheet, action: exportTransactionsToExcel },
    { label: "PDF", icon: FileText, action: exportTransactionsToPDF }
];

export default function ExportDropdown({ transactions }: Props) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const disabled = transactions.length === 0;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!open) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") setActive(i => (i + 1) % options.length);
            if (e.key === "ArrowUp") setActive(i => (i - 1 + options.length) % options.length);
            if (e.key === "Enter") {
                options[active].action(transactions);
                setOpen(false);
            }
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, active, transactions]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                disabled={disabled}
                title="Export filtered data"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700
                disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
                <Download size={16} />
                Download
            </button>

            {open && !disabled && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-800 border border-slate-700 shadow-lg z-50">
                    {options.map((opt, idx) => {
                        const Icon = opt.icon;
                        return (
                            <button
                                key={opt.label}
                                onClick={() => {
                                    opt.action(transactions);
                                    setOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-left
                  ${idx === active ? "bg-slate-700" : "hover:bg-slate-700"}
                  transition
                `}
                            >
                                <Icon size={16} />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}