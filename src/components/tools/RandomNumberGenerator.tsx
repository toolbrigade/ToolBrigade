"use client";
import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function generate() {
    setError("");
    if (min >= max) { setError("Min must be less than max."); return; }
    if (unique && count > max - min + 1) { setError(`Cannot generate ${count} unique numbers in range ${min}–${max}.`); return; }
    if (unique) {
      const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const shuffled = pool.sort(() => Math.random() - 0.5);
      setResults(shuffled.slice(0, count));
    } else {
      setResults(Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min));
    }
  }

  function copy() { navigator.clipboard.writeText(results.join(", ")); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div><label className="text-xs text-[var(--text-muted)]">Min</label><input type="number" className="input mt-1" value={min} onChange={e => setMin(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Max</label><input type="number" className="input mt-1" value={max} onChange={e => setMax(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Count</label><input type="number" min={1} max={1000} className="input mt-1" value={count} onChange={e => setCount(+e.target.value)} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={unique} onChange={e => setUnique(e.target.checked)} className="accent-brand-600" />
        No duplicates (unique numbers)
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={generate} className="btn-primary flex items-center gap-2 w-full justify-center">
        <RefreshCw size={16} />Generate
      </button>
      {results.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-xs text-[var(--text-muted)]">{results.length} number{results.length > 1 ? "s" : ""} generated</p>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy all"}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {results.map((n, i) => (
              <span key={i} className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-mono font-semibold text-brand-600 dark:text-brand-400">{n}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
