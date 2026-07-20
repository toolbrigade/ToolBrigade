"use client";
import { useState } from "react";

type Unit = { label: string; binaryFactor: number; decimalFactor: number };

const UNITS: Unit[] = [
  { label: "Bytes (B)",      binaryFactor: 1,                    decimalFactor: 1 },
  { label: "Kibibytes (KiB)",binaryFactor: 1024,                 decimalFactor: 0 },
  { label: "Kilobytes (KB)", binaryFactor: 0,                    decimalFactor: 1e3 },
  { label: "Mebibytes (MiB)",binaryFactor: 1024 ** 2,            decimalFactor: 0 },
  { label: "Megabytes (MB)", binaryFactor: 0,                    decimalFactor: 1e6 },
  { label: "Gibibytes (GiB)",binaryFactor: 1024 ** 3,            decimalFactor: 0 },
  { label: "Gigabytes (GB)", binaryFactor: 0,                    decimalFactor: 1e9 },
  { label: "Tebibytes (TiB)",binaryFactor: 1024 ** 4,            decimalFactor: 0 },
  { label: "Terabytes (TB)", binaryFactor: 0,                    decimalFactor: 1e12 },
  { label: "Pebibytes (PiB)",binaryFactor: 1024 ** 5,            decimalFactor: 0 },
  { label: "Petabytes (PB)", binaryFactor: 0,                    decimalFactor: 1e15 },
];

const BINARY_UNITS = [
  { label: "Bytes (B)",       factor: 1 },
  { label: "Kibibytes (KiB)", factor: 1024 },
  { label: "Mebibytes (MiB)", factor: 1024 ** 2 },
  { label: "Gibibytes (GiB)", factor: 1024 ** 3 },
  { label: "Tebibytes (TiB)", factor: 1024 ** 4 },
  { label: "Pebibytes (PiB)", factor: 1024 ** 5 },
];

const DECIMAL_UNITS = [
  { label: "Bytes (B)",       factor: 1 },
  { label: "Kilobytes (KB)",  factor: 1e3 },
  { label: "Megabytes (MB)",  factor: 1e6 },
  { label: "Gigabytes (GB)",  factor: 1e9 },
  { label: "Terabytes (TB)",  factor: 1e12 },
  { label: "Petabytes (PB)",  factor: 1e15 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  if (n >= 1e15) return n.toExponential(4);
  return n.toPrecision(7).replace(/\.?0+$/, "");
}

export default function DataStorageConverter() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("Gigabytes (GB)");

  const v = parseFloat(value) || 0;

  // Convert input to bytes
  const binaryUnit = BINARY_UNITS.find(u => u.label === fromUnit);
  const decimalUnit = DECIMAL_UNITS.find(u => u.label === fromUnit);
  const bytes = binaryUnit ? v * binaryUnit.factor : decimalUnit ? v * decimalUnit.factor : 0;

  const allFromUnits = [...BINARY_UNITS.map(u => u.label), ...DECIMAL_UNITS.filter(u => u.label !== "Bytes (B)").map(u => u.label)];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input type="number" min={0} step="any" className="input mt-1" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">From Unit</label>
          <select className="input mt-1" value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
            <optgroup label="Binary (1024-based)">
              {BINARY_UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </optgroup>
            <optgroup label="Decimal (1000-based)">
              {DECIMAL_UNITS.filter(u => u.label !== "Bytes (B)").map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
            </optgroup>
          </select>
        </div>
      </div>

      {v > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-[var(--text)] mb-2">Binary (1024-based)</p>
            <div className="space-y-1">
              {BINARY_UNITS.map(u => (
                <div key={u.label} className={`flex justify-between text-sm px-3 py-1.5 rounded-lg ${u.label === fromUnit ? "bg-[var(--brand-light)] dark:bg-brand-900/30" : "bg-[var(--bg-subtle)]"}`}>
                  <span className="text-[var(--text-muted)]">{u.label}</span>
                  <span className="font-medium">{fmt(bytes / u.factor)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text)] mb-2">Decimal (1000-based)</p>
            <div className="space-y-1">
              {DECIMAL_UNITS.map(u => (
                <div key={u.label} className={`flex justify-between text-sm px-3 py-1.5 rounded-lg ${u.label === fromUnit ? "bg-[var(--brand-light)] dark:bg-brand-900/30" : "bg-[var(--bg-subtle)]"}`}>
                  <span className="text-[var(--text-muted)]">{u.label}</span>
                  <span className="font-medium">{fmt(bytes / u.factor)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-[var(--text-muted)]">Binary units (KiB, MiB, GiB…) use powers of 1024. Decimal units (KB, MB, GB…) use powers of 1000. Hard drive manufacturers use decimal; operating systems typically report binary.</p>
    </div>
  );
}
