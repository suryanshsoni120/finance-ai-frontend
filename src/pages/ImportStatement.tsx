import { useState } from "react";
import { previewStatement, confirmStatement } from "../services/statementApi";
import StatementUpload from "../components/StatementUpload";
import StatementPreviewTable from "../components/StatementPreviewTable";
import ConfirmImportBar from "../components/ConfirmImportBar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ImportStatement() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const res = await previewStatement(file);
      setTransactions(res.data.transactions || []);
    } catch {
      toast.error("Failed to parse statement");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await confirmStatement(transactions);
      toast.success("Transactions imported");
      navigate("/transactions");
    } catch {
      toast.error("Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {transactions.length === 0 ? (
        <StatementUpload onUpload={handleUpload} loading={loading} />
      ) : (
        <>
          <StatementPreviewTable
            transactions={transactions}
            onRemove={i =>
              setTransactions(t => t.filter((_, idx) => idx !== i))
            }
          />
          <ConfirmImportBar
            count={transactions.length}
            onConfirm={handleConfirm}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
