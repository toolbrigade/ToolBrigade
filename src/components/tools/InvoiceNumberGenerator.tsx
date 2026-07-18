"use client";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

export default function InvoiceNumberGenerator() {
  const [prefix, setPrefix] = useState("INV");
  const [separator, setSeparator] = useState("-");
  const [year, setYear] = useState(true);
  const [month, setMonth] = useState(true);
  const [digits, setDigits] = useState(4);
  const [start, setStart] = useState(1);
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  function generate() {
    const now = new Date();
    const y = now.getFullYear().toString();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const nums = Array.from({ length: count }, (_, i) => {
      const num = String(start + i).padStart(digits, "0");
      const parts = [prefix, year ? y : null, month ? m : null, num].filter(Boolean);
      return parts.join(separator);
    });
    setResults(nums);
  }

  function copy(s: string) { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); }
  function copyAll() { navigator.clipboard.writeText(results.join("\n")); setCopied("all"); setTimeout(() => setCopied(""), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-[var(--text-muted)]">Prefix</label><input className="input mt-1" value={prefix} onChange={e => setPrefix(e.target.value)} /></div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Separator</label>
          <select className="input mt-1" value={separator} onChange={e => setSeparator(e.target.value)}>
            {["-", "/", "_", "."].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="text-xs text-[var(--text-muted)]">Number digits</label><input type="number" min={1} max={10} value={digits} className="input mt-1" onChange={e => setDigits(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Starting number</label><input type="number" min={1} value={start} className="input mt-1" onChange={e => setStart(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">How many to generate</label><input type="number" min={1} max={100} value={count} className="input mt-1" onChange={e => setCount(+e.target.value)} /></div>
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={year} onChange={e => setYear(e.target.checked)} className="accent-brand-600" />Include year</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={month} onChange={e => setMonth(e.target.checked)} className="accent-brand-600" />Include month</label>
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary flex items-center gap-2"><RefreshCw size={16} />Generate</button>
        {results.length > 0 && <button onClick={copyAll} className="btn-secondary text-sm">{copied === "all" ? "Copied!" : "Copy all"}</button>}
      </div>
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li key={i} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-3 py-2 gap-2">
              <code className="text-sm font-mono text-[var(--text)]">{r}</code>
              <button onClick={() => copy(r)} className="btn-secondary text-xs py-1 px-2 min-h-0 shrink-0 flex items-center gap-1"><Copy size={12} />{copied === r ? "✓" : "Copy"}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
