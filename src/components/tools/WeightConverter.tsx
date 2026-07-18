"use client";
import { useState } from "react";

const UNITS: Record<string, number> = { mg: 0.000001, g: 0.001, kg: 1, t: 1000, oz: 0.0283495, lb: 0.453592, st: 6.35029 };
const LABELS: Record<string, string> = { mg: "Milligram (mg)", g: "Gram (g)", kg: "Kilogram (kg)", t: "Metric Ton (t)", oz: "Ounce (oz)", lb: "Pound (lb)", st: "Stone (st)" };

export default function WeightConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("kg");
  const base = parseFloat(value) * UNITS[from];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input type="number" className="input mt-1" placeholder="Enter value…" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">From unit</label>
          <select className="input mt-1" value={from} onChange={e => setFrom(e.target.value)}>
            {Object.keys(UNITS).map(u => <option key={u} value={u}>{LABELS[u]}</option>)}
          </select>
        </div>
      </div>
      {value && !isNaN(base) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(UNITS).map(([unit, factor]) => (
            <div key={unit} className={`bg-[var(--bg-subtle)] rounded-lg p-3 ${unit === from ? "ring-2 ring-brand-500" : ""}`}>
              <p className="text-sm font-semibold text-[var(--text)]">{(base / factor).toPrecision(7).replace(/\.?0+$/, "")}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{LABELS[unit]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
