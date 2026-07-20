"use client";
import { useState } from "react";

// Volume conversions (base: ml)
const VOL_UNITS = [
  { label: "teaspoon (tsp)",    toMl: 4.92892 },
  { label: "tablespoon (tbsp)", toMl: 14.7868 },
  { label: "fluid oz (fl oz)",  toMl: 29.5735 },
  { label: "cup (US)",          toMl: 236.588 },
  { label: "pint (US)",         toMl: 473.176 },
  { label: "milliliter (ml)",   toMl: 1 },
  { label: "liter (L)",         toMl: 1000 },
];

// Ingredient density g/ml
const INGREDIENTS: { label: string; gPerMl: number }[] = [
  { label: "Water",              gPerMl: 1.0 },
  { label: "All-purpose flour",  gPerMl: 0.529 },
  { label: "Bread flour",        gPerMl: 0.529 },
  { label: "Cake flour",         gPerMl: 0.476 },
  { label: "White sugar",        gPerMl: 0.845 },
  { label: "Brown sugar (packed)",gPerMl: 0.930 },
  { label: "Powdered sugar",     gPerMl: 0.560 },
  { label: "Butter",             gPerMl: 0.911 },
  { label: "Vegetable oil",      gPerMl: 0.910 },
  { label: "Honey",              gPerMl: 1.420 },
  { label: "Milk (whole)",       gPerMl: 1.030 },
  { label: "Salt (table)",       gPerMl: 1.217 },
  { label: "Cocoa powder",       gPerMl: 0.529 },
  { label: "Rolled oats",        gPerMl: 0.340 },
  { label: "Rice (uncooked)",    gPerMl: 0.850 },
];

function fmt(n: number) {
  if (n === 0) return "0";
  return parseFloat(n.toPrecision(5)).toString();
}

export default function CookingMeasurementConverter() {
  const [tab, setTab] = useState<"volume" | "weight">("volume");
  const [value, setValue] = useState("1");
  const [fromVol, setFromVol] = useState("cup (US)");
  const [ingredient, setIngredient] = useState("All-purpose flour");
  const [grams, setGrams] = useState("120");
  const [toVolUnit, setToVolUnit] = useState("cup (US)");

  const v = parseFloat(value) || 0;
  const fromUnit = VOL_UNITS.find(u => u.label === fromVol)!;
  const ml = v * fromUnit.toMl;

  const ing = INGREDIENTS.find(i => i.label === ingredient)!;
  const gramsVal = parseFloat(grams) || 0;
  const mlFromGrams = gramsVal / ing.gPerMl;
  const toUnit = VOL_UNITS.find(u => u.label === toVolUnit)!;
  const volResult = mlFromGrams / toUnit.toMl;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTab("volume")} className={tab === "volume" ? "btn-primary" : "btn-secondary"}>Volume ↔ Volume</button>
        <button onClick={() => setTab("weight")} className={tab === "weight" ? "btn-primary" : "btn-secondary"}>Grams ↔ Volume</button>
      </div>

      {tab === "volume" ? (
        <>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Value</label>
              <input type="number" min={0} step="any" className="input mt-1" value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">From Unit</label>
              <select className="input mt-1" value={fromVol} onChange={e => setFromVol(e.target.value)}>
                {VOL_UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
              </select>
            </div>
          </div>
          {v > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VOL_UNITS.map(u => (
                <div key={u.label} className={`rounded-xl p-3 text-center ${u.label === fromVol ? "bg-[var(--brand-light)] dark:bg-brand-900/30 ring-1 ring-[var(--brand)]" : "bg-[var(--bg-subtle)]"}`}>
                  <p className="text-base font-bold text-brand-600 dark:text-brand-400">{fmt(ml / u.toMl)}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{u.label}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200">
            ⚠️ Gram ↔ volume conversions depend on ingredient density. Select the ingredient for an accurate result. Densities are approximate averages.
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Grams</label>
              <input type="number" min={0} step="any" className="input mt-1" value={grams} onChange={e => setGrams(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Ingredient</label>
              <select className="input mt-1" value={ingredient} onChange={e => setIngredient(e.target.value)}>
                {INGREDIENTS.map(i => <option key={i.label} value={i.label}>{i.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Convert to</label>
              <select className="input mt-1" value={toVolUnit} onChange={e => setToVolUnit(e.target.value)}>
                {VOL_UNITS.map(u => <option key={u.label} value={u.label}>{u.label}</option>)}
              </select>
            </div>
          </div>
          {gramsVal > 0 && (
            <div className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{fmt(volResult)} {toVolUnit}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{gramsVal}g of {ingredient} ≈ {fmt(mlFromGrams)} ml</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
