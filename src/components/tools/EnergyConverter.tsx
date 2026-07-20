"use client";
import { useState } from "react";

const UNITS = [
  { label: "Joules (J)",              toJ: 1 },
  { label: "Kilojoules (kJ)",         toJ: 1000 },
  { label: "Calories (cal)",          toJ: 4.184 },
  { label: "Kilocalories (kcal)",     toJ: 4184 },
  { label: "Watt-hours (Wh)",         toJ: 3600 },
  { label: "Kilowatt-hours (kWh)",    toJ: 3600000 },
  { label: "BTU",                     toJ: 1055.06 },
  { label: "Electronvolts (eV)",      toJ: 1.60218e-19 },
  { label: "Foot-pounds (ft·lb)",     toJ: 1.35582 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(7)).toString();
}

export default function EnergyConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("Kilowatt-hours (kWh)");

  const v = parseFloat(value) || 0;
  const fromUnit = UNITS.find(u => u.label === from)!;
  const joules = v * fromUnit.toJ;

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
              <p className="text-base font-bold text-brand-600 dark:text-brand-400">{fmt(joules / u.toJ)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
