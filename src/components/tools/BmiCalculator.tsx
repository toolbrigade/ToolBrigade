"use client";
import { useState } from "react";

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  let bmi = 0;
  if (unit === "metric" && weight && height) {
    const h = +height / 100;
    bmi = +weight / (h * h);
  } else if (unit === "imperial" && weight && (heightFt || heightIn)) {
    const totalIn = (+heightFt || 0) * 12 + (+heightIn || 0);
    bmi = (+weight / (totalIn * totalIn)) * 703;
  }

  const category = bmi === 0 ? "" : bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal weight" : bmi < 30 ? "Overweight" : "Obese";
  const color = bmi === 0 ? "" : bmi < 18.5 ? "text-blue-500" : bmi < 25 ? "text-green-600 dark:text-green-400" : bmi < 30 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setUnit("metric")} className={unit === "metric" ? "btn-primary" : "btn-secondary"}>Metric (kg/cm)</button>
        <button onClick={() => setUnit("imperial")} className={unit === "imperial" ? "btn-primary" : "btn-secondary"}>Imperial (lb/ft)</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Weight ({unit === "metric" ? "kg" : "lb"})</label>
          <input type="number" min={0} className="input mt-1" placeholder={unit === "metric" ? "70" : "154"} value={weight} onChange={e => setWeight(e.target.value)} />
        </div>
        {unit === "metric" ? (
          <div>
            <label className="text-xs text-[var(--text-muted)]">Height (cm)</label>
            <input type="number" min={0} className="input mt-1" placeholder="175" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Feet</label>
              <input type="number" min={0} className="input mt-1" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Inches</label>
              <input type="number" min={0} max={11} className="input mt-1" placeholder="9" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
            </div>
          </div>
        )}
      </div>
      {bmi > 0 && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-5xl font-bold text-brand-600 dark:text-brand-400">{bmi.toFixed(1)}</p>
          <p className={`text-lg font-semibold mt-2 ${color}`}>{category}</p>
          <div className="mt-4 grid grid-cols-4 gap-1 text-xs">
            {[["< 18.5", "Underweight", "bg-blue-100 dark:bg-blue-900/30"], ["18.5–24.9", "Normal", "bg-green-100 dark:bg-green-900/30"], ["25–29.9", "Overweight", "bg-amber-100 dark:bg-amber-900/30"], ["≥ 30", "Obese", "bg-red-100 dark:bg-red-900/30"]].map(([range, label, cls]) => (
              <div key={label} className={`rounded p-2 ${cls}`}>
                <p className="font-semibold text-[var(--text)]">{range}</p>
                <p className="text-[var(--text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
