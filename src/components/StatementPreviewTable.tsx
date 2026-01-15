interface Props {
  transactions: any[];
  onRemove: (index: number) => void;
}

export default function StatementPreviewTable({ transactions, onRemove }: Props) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-slate-700 text-left">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{t.description}</td>
              <td className="px-4 py-2">
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700">
                  {t.category}
                </span>
              </td>
              <td
                className={`px-4 py-2 text-right font-semibold ${
                  t.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {t.type === "income" ? "+" : "-"}₹{t.amount}
              </td>
              <td className="px-4 py-2 text-right">
                <button
                  onClick={() => onRemove(i)}
                  className="text-red-500 hover:underline text-xs"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
