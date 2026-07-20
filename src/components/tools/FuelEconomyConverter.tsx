"use client";
import { useState } from "react";

// L/100km ↔ mpg conversions
// US gallon = 3.785411784 L, UK gallon = 4.54609 L
// 1 mile = 1.609344 km
const US_GAL_L = 3.785411784;
const UK_GAL_L = 4.54609;
const MILE_KM = 1.609344;

function mpgUsToL100(mpg: number) { return (100 * US_GAL_L) / (mpg * MILE_KM); }
function mpgUkToL100(mpg: number) { return (100 * UK_GAL_L) / (mpg * MILE_KM); }
function l100ToMpgUs(l100: number) { return (100 * US_GAL_L) / (l100 * MILE_KM); }
function l100ToMpgUk(l100: number) { return (100 * UK_GAL_L) / (l100 * MILE_KM); }
function fmt(n: number) { return parseFloat(n.toPrecision(5)).toString(); }

export default function FuelEconomyConverter() {
  const [mode, setMode] = useState<"mpg-us" | "mpg-uk" | "l100">("mpg-us");
  const [value, setValue] = useState("30");

  const v = parseFloat(value) || 0;

  let mpgUs = 0, mpgUk = 0, l100 = 0;
  if (v > 0) {
    if (mode === "mpg-us") {
      mpgUs = v;
      l100 = mpgUsToL100(v);
      mpgUk = l100ToMpgUk(l100);
    } else if (mode === "mpg-uk") {
      mpgUk = v;
      l100 = mpgUkToL100(v);
      mpgUs = l100ToMpgUs(l100);
    } else {
      l100 = v;
      mpgUs = l100ToMpgUs(v);
      mpgUk = l100ToMpgUk(v);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {([["mpg-us", "MPG (US)"], ["mpg-uk", "MPG (UK)"], ["l100", "L/100km"]] as const).map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} className={mode === m ? "btn-primary" : "btn-secondary"}>{label}</button>
        ))}
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)]">
          {mode === "mpg-us" ? "Miles per gallon (US)" : mode === "mpg-uk" ? "Miles per gallon (UK/Imperial)" : "Litres per 100 km"}
        </label>
        <input type="number" min={0} step="any" className="input mt-1" value={value} onChange={e => setValue(e.target.value)} />
      </div>
      {v > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[["MPG (US)", fmt(mpgUs)], ["MPG (UK)", fmt(mpgUk)], ["L/100km", fmt(l100)]].map(([label, val]) => (
            <div key={label} className={`rounded-xl p-4 text-center ${(label === "MPG (US)" && mode === "mpg-us") || (label === "MPG (UK)" && mode === "mpg-uk") || (label === "L/100km" && mode === "l100") ? "bg-[var(--brand-light)] dark:bg-brand-900/30 ring-1 ring-[var(--brand)]" : "bg-[var(--bg-subtle)]"}`}>
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400">{val}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-[var(--text-muted)]">US gallon = 3.785 L · UK/Imperial gallon = 4.546 L · 1 mile = 1.609 km. Note: a lower L/100km means better fuel economy; a higher MPG means better fuel economy.</p>
    </div>
  );
}
