"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function XlsxToCsv() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sheets, setSheets] = useState<{ name: string; csv: string }[]>([]);
  const [selected, setSelected] = useState(0);
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setSheets([]);
    try {
      const XLSX = await import("xlsx");
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const result = wb.SheetNames.map(name => ({
        name,
        csv: XLSX.utils.sheet_to_csv(wb.Sheets[name]),
      }));
      setSheets(result);
      setSelected(0);
      trackTaskComplete("xlsx-to-csv", startTime);
    } catch { setError("Could not read file. Please upload a valid .xlsx file."); }
    setLoading(false);
  }

  function download() {
    const s = sheets[selected];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([s.csv], { type: "text/csv" }));
    a.download = `${s.name}.csv`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload XLSX</span>
        <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Reading spreadsheet…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {sheets.length > 0 && (
        <div className="space-y-3">
          {sheets.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {sheets.map((s, i) => (
                <button key={i} onClick={() => setSelected(i)}
                  className={`px-3 py-1 text-sm rounded-lg border ${i === selected ? "border-brand-500 text-brand-600" : "border-[var(--border)]"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          )}
          <textarea readOnly value={sheets[selected].csv}
            className="w-full h-48 p-3 text-xs font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none" />
          <button onClick={download} className="btn-primary flex items-center gap-2 text-sm">
            <Download size={16} />Download {sheets[selected].name}.csv
          </button>
        </div>
      )}
    </div>
  );
}
