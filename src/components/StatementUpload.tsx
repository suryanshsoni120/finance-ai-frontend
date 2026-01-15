interface Props {
    onUpload: (file: File) => void;
    loading: boolean;
}

export default function StatementUpload({ onUpload, loading }: Props) {
    return (
        <div className="border-2 border-dashed rounded-2xl p-8 text-center bg-white dark:bg-slate-800">
            <input
                type="file"
                accept=".csv"
                hidden
                id="statement-upload"
                onChange={e => e.target.files && onUpload(e.target.files[0])}
            />

            <label
                htmlFor="statement-upload"
                className="cursor-pointer inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
                {loading ? "Uploading..." : "Upload CSV Statement"}
            </label>

            <p className="text-sm text-gray-500 mt-3">
                Supported format: CSV
            </p>
        </div>
    );
}
