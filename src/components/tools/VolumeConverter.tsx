"use client";
import { useState } from "react";

const UNITS = [
  { label: "Liters (L)",       toLiters: 1 },
  { label: "Milliliters (mL)", toLiters: 0.001 },
  { label: "Cubic meters (m³)",toLiters: 1000 },
  { label: "US gallons",       toLiters: 3.785411784 },
  { label: "UK gallons",       toLiters: 4.54609 },
  { label: "US fluid oz",      toLiters: 0.0295735296 },
  { label: "UK fluid oz",      toLiters: 0.0284130625 },
  { label: "US cups",          toLiters: 0.2365882365 },
  { label: "US pints",         toLiters: 0.473176473 },
  { label: "US quarts",        toLiters: 0.946352946 },
  { label: "Cubic inches",     toLiters: 0.016387064 },
  { label: "Cubic feet",       toLiters: 28.316846592 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-5 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(7)).toString();
}

export default function VolumeConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("Liters (L)");

  const v = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.label === from)!;
  const liters = v * fromUnit.toLiters;

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
            <div key={u.label} className={`rounded-xl p-3 text-center ${u.label === from ? "bg-[var(--brand-light)] dark:bg-brand-900/30 ring-1 ring-[var(--brand)]" : "bg-[var(--bg-subtle)]"}`}>
              <p className="text-base font-bold text-brand-600 dark:text-brand-400">{fmt(liters / u.toLiters)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
