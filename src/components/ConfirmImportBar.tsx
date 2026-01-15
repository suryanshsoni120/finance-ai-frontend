interface Props {
  count: number;
  onConfirm: () => void;
  loading: boolean;
}

export default function ConfirmImportBar({ count, onConfirm, loading }: Props) {
  return (
    <div className="flex justify-between items-center bg-blue-50 dark:bg-slate-700 p-4 rounded-xl">
      <p className="text-sm font-medium">
        {count} transactions ready to import
      </p>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
      >
        {loading ? "Importing..." : "Confirm Import"}
      </button>
    </div>
  );
}
