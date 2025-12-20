export default function ChartSkeleton() {
  return (
    <div className="bg-card dark:bg-darkcard rounded-xl p-6 shadow-lg h-90 animate-pulse">
      <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded mb-6" />
      <div className="flex items-center justify-center h-full">
        <div className="h-40 w-40 bg-slate-300 dark:bg-slate-700 rounded-full" />
      </div>
    </div>
  );
}