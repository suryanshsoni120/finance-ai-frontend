import Papa from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "../types/transaction";
import logo from "../assets/logo.png";
import { formatDate } from "../services/formatter";

export function exportTransactionsToCSV(transactions: Transaction[], filename = "transactions.csv") {
  if (!transactions.length) return;

  const data = transactions.map(t => ({
    Date: formatDate(t.date),
    Description: t.description,
    Category: t.category,
    Type: t.type,
    Amount: t.amount
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function exportTransactionsToExcel(transactions: Transaction[], filename = "transactions.xlsx") {
  if (!transactions.length) return;

  const data = transactions.map(t => ({
    Date: formatDate(t.date),
    Description: t.description,
    Category: t.category,
    Type: t.type,
    Amount: t.amount
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, filename);
}

export function exportTransactionsToPDF(
  transactions: Transaction[],
  filename = "transactions.pdf"
) {
  if (!transactions.length) return;

  const doc = new jsPDF();

  doc.addImage(logo, "PNG", 14, 12, 12, 12);

  doc.setFontSize(18);
  doc.setTextColor(33, 37, 41);
  doc.text("Finance AI", 30, 20);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Smart expense tracking with AI-powered insights", 30, 26);

  doc.setDrawColor(220);
  doc.line(14, 30, 196, 30);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 36);

  autoTable(doc, {
    startY: 42,
    head: [["Date", "Description", "Category", "Type", "Amount"]],
    body: transactions.map(t => [
      formatDate(t.date),
      t.description,
      t.category,
      t.type.toUpperCase(),
      `${t.type === "income" ? "+" : "-"}Rs. ${Math.abs(t.amount)}`
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },

    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 4) {
        const transaction = transactions[data.row.index];
        if (transaction.type === "income") {
          data.cell.styles.textColor = [22, 163, 74]; // green-600
        } else {
          data.cell.styles.textColor = [220, 38, 38]; // red-600
        }
      }
    }
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Finance AI • Page ${i} of ${pageCount}`, 14, 290);
  }

  doc.save(filename);
}