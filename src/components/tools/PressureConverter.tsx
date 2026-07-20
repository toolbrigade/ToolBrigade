"use client";
import { useState } from "react";

const UNITS = [
  { label: "Pascal (Pa)",          toPa: 1 },
  { label: "Kilopascal (kPa)",     toPa: 1000 },
  { label: "Megapascal (MPa)",     toPa: 1e6 },
  { label: "Bar",                  toPa: 100000 },
  { label: "Millibar (mbar)",      toPa: 100 },
  { label: "PSI (lb/in²)",         toPa: 6894.757 },
  { label: "Atmosphere (atm)",     toPa: 101325 },
  { label: "Torr (mmHg)",          toPa: 133.322 },
  { label: "inHg",                 toPa: 3386.389 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e9 || (Math.abs(n) < 1e-5 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(7)).toString();
}

export default function PressureConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("Atmosphere (atm)");

  const v = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.label === from)!;
  const pa = v * fromUnit.toPa;

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
              <p className="text-base font-bold text-brand-600 dark:text-brand-400">{fmt(pa / u.toPa)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
