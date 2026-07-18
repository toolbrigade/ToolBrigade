"use client";
import { useState } from "react";

const UNITS: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 };
const LABELS: Record<string, string> = { mm: "Millimeter (mm)", cm: "Centimeter (cm)", m: "Meter (m)", km: "Kilometer (km)", inch: "Inch (in)", ft: "Foot (ft)", yd: "Yard (yd)", mi: "Mile (mi)" };

export default function LengthConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState("m");

  const base = parseFloat(value) * UNITS[from];

  function handleValue(val: string) { setValue(val); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input type="number" className="input mt-1" placeholder="Enter value…" value={value}
            onChange={e => handleValue(e.target.value)}
            onInput={e => handleValue((e.target as HTMLInputElement).value)} />
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
