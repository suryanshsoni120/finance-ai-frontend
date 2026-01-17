import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import type { CategoryBreakdown } from "../types/analytics";
import EmptyChart from "./EmptyChart";
import { getCategoryChartColor } from "../services/category";

interface Props {
  data: CategoryBreakdown[];
  loading?: boolean;
}

export default function ExpenseChart({ data, loading }: Props) {
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
    <div className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 h-96 flex flex-col">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Expense Breakdown
      </h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={105}
              innerRadius={65}
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
              formatter={(value: any) => [`₹${value}`, "Amount"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}