"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function CsvToXlsx() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState("data");
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setDone(false);
    setFileName(file.name.replace(/\.csv$/i, ""));
    try {
      const XLSX = await import("xlsx");
      const text = await file.text();
      const ws = XLSX.utils.aoa_to_sheet(text.trim().split("\n").map(r => r.split(",")));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
      a.download = `${file.name.replace(/\.csv$/i, "")}.xlsx`;
      a.click();
      setDone(true);
      trackTaskComplete("csv-to-xlsx", startTime);
    } catch { setError("Could not convert file. Please upload a valid CSV."); }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload CSV</span>
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Converting…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <Download size={16} />{fileName}.xlsx downloaded successfully.
        </div>
      )}
    </div>
  );
}
