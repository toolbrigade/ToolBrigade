"use client";
import { useState } from "react";

type Unit = "C" | "F" | "K";

function convert(val: number, from: Unit): Record<Unit, number> {
  const c = from === "C" ? val : from === "F" ? (val - 32) * 5 / 9 : val - 273.15;
  return { C: c, F: c * 9 / 5 + 32, K: c + 273.15 };
}

export default function TemperatureConverter() {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<Unit>("C");

  const results = value && !isNaN(+value) ? convert(+value, from) : null;
  const labels: Record<Unit, string> = { C: "Celsius (°C)", F: "Fahrenheit (°F)", K: "Kelvin (K)" };

  function handleValue(val: string) {
    setValue(val);
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input
            type="number"
            className="input mt-1"
            placeholder="Enter temperature…"
            value={value}
            onChange={e => handleValue(e.target.value)}
            onInput={e => handleValue((e.target as HTMLInputElement).value)}
          />
        </div>
        <div>
          <label htmlFor="temp-from" className="text-xs text-[var(--text-muted)]">From unit</label>
          <select id="temp-from" className="input mt-1" value={from} onChange={e => setFrom(e.target.value as Unit)}>
            {(["C", "F", "K"] as Unit[]).map(u => <option key={u} value={u}>{labels[u]}</option>)}
          </select>
        </div>
      </div>
      {results && (
        <div className="grid grid-cols-3 gap-3">
          {(["C", "F", "K"] as Unit[]).map(u => (
            <div key={u} className={`bg-[var(--bg-subtle)] rounded-lg p-4 text-center ${u === from ? "ring-2 ring-brand-500" : ""}`}>
              <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400">{+results[u].toFixed(2)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{labels[u]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
