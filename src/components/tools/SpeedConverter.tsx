"use client";
import { useState } from "react";

const UNITS = [
  { label: "mph",    toMs: 0.44704 },
  { label: "km/h",   toMs: 1 / 3.6 },
  { label: "m/s",    toMs: 1 },
  { label: "knots",  toMs: 0.514444 },
  { label: "ft/s",   toMs: 0.3048 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  return parseFloat(n.toPrecision(7)).toString();
}

export default function SpeedConverter() {
  const [value, setValue] = useState("60");
  const [from, setFrom] = useState("mph");

  const v = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.label === from)!;
  const ms = v * fromUnit.toMs;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input type="number" step="any" className="input mt-1" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">From Unit</label>
          <select className="input mt-1" value={from} onChange={e => setFrom(e.target.value)}>
            {UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
          </select>
        </div>
      </div>
      {v !== 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {UNITS.map(u => (
            <div key={u.label} className={`rounded-xl p-4 text-center ${u.label === from ? "bg-[var(--brand-light)] dark:bg-brand-900/30 ring-1 ring-[var(--brand)]" : "bg-[var(--bg-subtle)]"}`}>
              <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{fmt(ms / u.toMs)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
