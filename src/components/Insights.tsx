interface Props {
  insights: string[];
}

export default function Insights({ insights }: Props) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-gray-800 h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">🤖</span>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Insights</h3>
      </div>

      <ul className="space-y-4">
        {insights.map((i, idx) => (
          <li
            key={idx}
            className="group flex gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-gray-700 hover:bg-blue-50/30 dark:hover:bg-gray-800/50 transition-colors duration-300 ease-out"
          >
            <div className="w-1 h-auto rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 shrink-0" />
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{i}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}