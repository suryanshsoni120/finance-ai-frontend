import { useMemo, useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryBreakdown } from "../types/analytics";
import EmptyChart from "./EmptyChart";
import { getCategoryChartColor } from "../services/category";

interface Props {
  data: CategoryBreakdown[];
  loading?: boolean;
  count?: number;
}

const ITEMS_PER_PAGE = 3;

export default function ExpenseChart({ data, loading, count }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalExpense = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.total, 0);
  }, [data]);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [data, currentPage]);

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 h-96 flex flex-col">
        <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Expense Breakdown
        </h3>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            Loading expense breakdown…
          </span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyChart />;
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 flex flex-col min-h-[28rem]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Expense Breakdown
        </h3>
        {count !== undefined && (
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-full">
            {count} transactions
          </span>
        )}
      </div>

      {/* Chart Section */}
      <div className="h-60 w-full shrink-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={95}
              innerRadius={60}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getCategoryChartColor(entry._id)}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                borderColor: "#374151",
                color: "#f3f4f6",
                borderRadius: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              itemStyle={{ color: "#f3f4f6" }}
              formatter={(value: any) => [`₹${value.toLocaleString()}`, "Amount"]}
            />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
              <tspan x="50%" dy="-0.6em" className="fill-gray-500 dark:fill-gray-400 text-xs font-medium uppercase tracking-wide">
                Total
              </tspan>
              <tspan x="50%" dy="1.4em" className="fill-gray-900 dark:fill-white text-xl font-bold tracking-tight">
                ₹{totalExpense.toLocaleString()}
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Pagination List */}
      <div className="flex flex-col flex-1 mt-2">
        <div className="space-y-2 mb-2">
          {paginatedList.map((item) => {
            const percentage = ((item.total / totalExpense) * 100).toFixed(1);
            const color = getCategoryChartColor(item._id);

            return (
              <div key={item._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white" style={{ color: color }}>
                        {percentage}%
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item._id}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  ₹{item.total.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls - Only show if pages > 1 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-800 shrink-0">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${currentPage === page ? 'bg-blue-600 scale-125' : 'bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600'}`}
                  title={`Page ${page}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1.5"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}