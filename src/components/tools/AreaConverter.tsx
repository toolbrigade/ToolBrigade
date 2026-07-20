"use client";
import { useState } from "react";

const UNITS = [
  { label: "sq ft",    toSqM: 0.092903 },
  { label: "sq m",     toSqM: 1 },
  { label: "sq km",    toSqM: 1e6 },
  { label: "sq miles", toSqM: 2589988.11 },
  { label: "acres",    toSqM: 4046.8564 },
  { label: "hectares", toSqM: 10000 },
  { label: "sq in",    toSqM: 0.00064516 },
  { label: "sq yd",    toSqM: 0.836127 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-4 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(7)).toString();
}

export default function AreaConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("acres");

  const v = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.label === from)!;
  const sqM = v * fromUnit.toSqM;

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {UNITS.map(u => (
            <div key={u.label} className={`rounded-xl p-4 text-center ${u.label === from ? "bg-[var(--brand-light)] dark:bg-brand-900/30 ring-1 ring-[var(--brand)]" : "bg-[var(--bg-subtle)]"}`}>
              <p className="text-base font-bold text-brand-600 dark:text-brand-400">{fmt(sqM / u.toSqM)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
