"use client";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function RandomStringGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: false });
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  function generate() {
    const pool = Object.entries(opts).filter(([, v]) => v).map(([k]) => CHARS[k as keyof typeof CHARS]).join("");
    if (!pool) return;
    setResults(Array.from({ length: count }, () =>
      Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join("")
    ));
  }

  function copy(s: string) { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Length</label>
          <input type="number" min={1} max={256} value={length} className="input mt-1" onChange={e => setLength(+e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">How many</label>
          <input type="number" min={1} max={50} value={count} className="input mt-1" onChange={e => setCount(+e.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        {(Object.keys(opts) as (keyof typeof opts)[]).map(k => (
          <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={opts[k]} onChange={e => setOpts(p => ({ ...p, [k]: e.target.checked }))} className="accent-brand-600" />
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </label>
        ))}
      </div>
      <button onClick={generate} className="btn-primary flex items-center gap-2"><RefreshCw size={16} />Generate</button>
      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li key={i} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-3 py-2 gap-2">
              <code className="text-sm text-[var(--text)] break-all">{r}</code>
              <button onClick={() => copy(r)} className="btn-secondary text-xs py-1 px-2 min-h-0 shrink-0 flex items-center gap-1"><Copy size={12} />{copied === r ? "✓" : "Copy"}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
