"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

type Base = "decimal" | "binary" | "hex" | "octal";

export default function BaseConverter() {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState<Base>("decimal");
  const [copied, setCopied] = useState("");

  let decimal = NaN;
  let error = "";
  try {
    if (input.trim()) {
      if (from === "decimal") decimal = parseInt(input, 10);
      else if (from === "binary") decimal = parseInt(input, 2);
      else if (from === "hex") decimal = parseInt(input, 16);
      else decimal = parseInt(input, 8);
      if (isNaN(decimal)) throw new Error("Invalid input");
    }
  } catch { error = "Invalid input for selected base."; }

  const results: Record<Base, string> = {
    decimal: isNaN(decimal) ? "" : decimal.toString(10),
    binary: isNaN(decimal) ? "" : decimal.toString(2),
    hex: isNaN(decimal) ? "" : decimal.toString(16).toUpperCase(),
    octal: isNaN(decimal) ? "" : decimal.toString(8),
  };

  const labels: Record<Base, string> = { decimal: "Decimal (Base 10)", binary: "Binary (Base 2)", hex: "Hexadecimal (Base 16)", octal: "Octal (Base 8)" };

  function copy(s: string) { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Input</label>
          <input className="input mt-1 font-mono" placeholder="Enter number…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">From base</label>
          <select className="input mt-1" value={from} onChange={e => setFrom(e.target.value as Base)}>
            {(Object.keys(labels) as Base[]).map(b => <option key={b} value={b}>{labels[b]}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {input && !error && !isNaN(decimal) && (
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(results) as Base[]).map(base => (
            <div key={base} className={`bg-[var(--bg-subtle)] rounded-lg p-3 flex items-center justify-between gap-2 ${base === from ? "ring-2 ring-brand-500" : ""}`}>
              <div>
                <p className="text-xs text-[var(--text-muted)]">{labels[base]}</p>
                <p className="font-mono text-sm font-semibold text-[var(--text)] mt-0.5">{results[base]}</p>
              </div>
              <button onClick={() => copy(results[base])} className="btn-secondary text-xs py-1 px-2 min-h-0 shrink-0 flex items-center gap-1"><Copy size={12} />{copied === results[base] ? "✓" : "Copy"}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
