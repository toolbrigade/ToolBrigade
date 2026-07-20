"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function CsvEditor() {
  const [rows, setRows] = useState<string[][]>([["", "", ""], ["", "", ""], ["", "", ""]]);
  const [fileName, setFileName] = useState("data");
  const [startTime] = useState(Date.now());

  function parseCsv(text: string): string[][] {
    return text.trim().split("\n").map(line => line.split(",").map(c => c.replace(/^"|"$/g, "")));
  }

  function toCsv(data: string[][]): string {
    return data.map(row => row.map(c => c.includes(",") ? `"${c}"` : c).join(",")).join("\n");
  }

  function handleFile(file: File) {
    setFileName(file.name.replace(/\.csv$/i, ""));
    const reader = new FileReader();
    reader.onload = e => setRows(parseCsv(e.target?.result as string));
    reader.readAsText(file);
  }

  function updateCell(r: number, c: number, val: string) {
    setRows(prev => prev.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? val : cell) : row));
  }

  function addRow() { setRows(prev => [...prev, Array(prev[0]?.length || 1).fill("")]); }
  function addCol() { setRows(prev => prev.map(row => [...row, ""])); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, ri) => ri !== i)); }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([toCsv(rows)], { type: "text/csv" }));
    a.download = `${fileName}.csv`;
    a.click();
    trackTaskComplete("csv-editor", startTime);
  }

  const cols = rows[0]?.length ?? 0;

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={24} />
        <span className="text-sm font-medium">Upload CSV (or edit the blank table below)</span>
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-full">
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-[var(--border)] p-0">
                    <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full px-2 py-1 bg-transparent focus:outline-none focus:bg-brand-50 dark:focus:bg-brand-900/20 min-w-[80px]" />
                  </td>
                ))}
                <td className="border border-[var(--border)] px-1">
                  <button onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={addRow} className="btn-secondary text-sm">+ Row</button>
        <button onClick={addCol} className="btn-secondary text-sm">+ Column</button>
        <button onClick={download} className="btn-primary text-sm flex items-center gap-1"><Download size={14} />Download CSV</button>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{rows.length} rows × {cols} columns</p>
    </div>
  );
}
