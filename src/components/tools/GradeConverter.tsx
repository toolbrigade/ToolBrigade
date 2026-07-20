"use client";
import { useState } from "react";

type GradeEntry = { min: number; max: number; letter: string };

const DEFAULT_SCALE: GradeEntry[] = [
  { min: 90, max: 100, letter: "A" },
  { min: 80, max: 89,  letter: "B" },
  { min: 70, max: 79,  letter: "C" },
  { min: 60, max: 69,  letter: "D" },
  { min: 0,  max: 59,  letter: "F" },
];

export default function GradeConverter() {
  const [percentage, setPercentage] = useState("85");
  const [scale, setScale] = useState<GradeEntry[]>(DEFAULT_SCALE);

  const pct = parseFloat(percentage);
  const match = isNaN(pct) ? null : scale.find(e => pct >= e.min && pct <= e.max);

  function updateScale(i: number, field: keyof GradeEntry, val: string) {
    setScale(s => s.map((row, idx) => idx === i ? { ...row, [field]: field === "letter" ? val : parseFloat(val) || 0 } : row));
  }
  function addRow() {
    setScale(s => [...s, { min: 0, max: 0, letter: "" }]);
  }
  function removeRow(i: number) {
    setScale(s => s.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)]">Percentage / Score</label>
        <input type="number" min={0} max={100} step="0.1" className="input mt-1 w-40" value={percentage} onChange={e => setPercentage(e.target.value)} />
      </div>

      {match ? (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-6xl font-bold text-brand-600 dark:text-brand-400">{match.letter}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{pct}% → {match.letter} ({match.min}–{match.max})</p>
        </div>
      ) : !isNaN(pct) ? (
        <p className="text-sm text-red-500">No matching grade range found for {pct}%.</p>
      ) : null}

      <div>
        <p className="text-xs font-semibold text-[var(--text)] mb-2">Grading Scale (editable)</p>
        <div className="space-y-1">
          {scale.map((row, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center text-xs">
              <input type="number" className="input col-span-3" placeholder="Min" value={row.min} onChange={e => updateScale(i, "min", e.target.value)} />
              <span className="col-span-1 text-center text-[var(--text-muted)]">–</span>
              <input type="number" className="input col-span-3" placeholder="Max" value={row.max} onChange={e => updateScale(i, "max", e.target.value)} />
              <input className="input col-span-3" placeholder="Letter" value={row.letter} onChange={e => updateScale(i, "letter", e.target.value)} />
              <button onClick={() => removeRow(i)} className="col-span-2 btn-secondary text-red-500 text-xs">✕</button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="btn-secondary text-xs mt-2">+ Add Row</button>
      </div>
    </div>
  );
}
