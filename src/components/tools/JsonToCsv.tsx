"use client";
import { useState } from "react";
import { Download } from "lucide-react";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert() {
    try {
      const data = JSON.parse(input);
      const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
      const keys = Array.from(new Set(arr.flatMap(o => Object.keys(o))));
      const escape = (v: unknown) => {
        const s = v == null ? "" : String(v);
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const csv = [keys.join(","), ...arr.map(row => keys.map(k => escape(row[k])).join(","))].join("\n");
      setOutput(csv); setError("");
    } catch (e) { setError((e as Error).message); setOutput(""); }
  }

  function download() {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([output], { type: "text/csv" })); a.download = "data.csv"; a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">JSON (array of objects)</label>
          <textarea className="textarea min-h-[240px]" placeholder='[{"name":"Alice","age":30}]' value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">CSV output</label>
          <textarea className="textarea min-h-[240px]" value={output} placeholder="CSV appears here…" onChange={() => {}} />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary">Convert</button>
        {output && <button onClick={download} className="btn-secondary flex items-center gap-2"><Download size={16} />Download CSV</button>}
      </div>
    </div>
  );
}
