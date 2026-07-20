"use client";
import { useState } from "react";

type HMS = { h: number; m: number; s: number };

function parseHMS(str: string): HMS | null {
  const parts = str.split(":").map(p => parseInt(p) || 0);
  if (parts.length === 3) return { h: parts[0], m: parts[1], s: parts[2] };
  if (parts.length === 2) return { h: 0, m: parts[0], s: parts[1] };
  if (parts.length === 1 && !isNaN(parseInt(str))) return { h: 0, m: 0, s: parts[0] };
  return null;
}

function toSeconds(hms: HMS) { return hms.h * 3600 + hms.m * 60 + hms.s; }
function fromSeconds(total: number): HMS {
  const abs = Math.abs(total);
  return { h: Math.floor(abs / 3600), m: Math.floor((abs % 3600) / 60), s: abs % 60 };
}
function fmtHMS(hms: HMS, negative = false) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${negative ? "-" : ""}${pad(hms.h)}:${pad(hms.m)}:${pad(hms.s)}`;
}

export default function TimeDurationCalculator() {
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [inputs, setInputs] = useState(["01:30:00", "00:45:30"]);

  function updateInput(i: number, val: string) {
    setInputs(arr => arr.map((v, idx) => idx === i ? val : v));
  }
  function addRow() { setInputs(arr => [...arr, "00:00:00"]); }
  function removeRow(i: number) { setInputs(arr => arr.filter((_, idx) => idx !== i)); }

  const parsed = inputs.map(parseHMS);
  const valid = parsed.every(p => p !== null);

  let totalSec = 0;
  if (valid) {
    const secs = parsed.map(p => toSeconds(p!));
    if (mode === "add") {
      totalSec = secs.reduce((a, b) => a + b, 0);
    } else {
      totalSec = secs[0] ?? 0;
      for (let i = 1; i < secs.length; i++) totalSec -= secs[i];
    }
  }

  const negative = totalSec < 0;
  const result = fromSeconds(totalSec);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("add")} className={mode === "add" ? "btn-primary" : "btn-secondary"}>Add Durations</button>
        <button onClick={() => setMode("subtract")} className={mode === "subtract" ? "btn-primary" : "btn-secondary"}>Subtract Durations</button>
      </div>
      <div className="space-y-2">
        {inputs.map((val, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)] w-4">{i === 0 ? "" : mode === "add" ? "+" : "−"}</span>
            <input className="input font-mono" placeholder="HH:MM:SS" value={val} onChange={e => updateInput(i, e.target.value)} />
            {inputs.length > 2 && (
              <button onClick={() => removeRow(i)} className="btn-secondary text-red-500 text-xs px-2">✕</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addRow} className="btn-secondary text-sm">+ Add Duration</button>
      {valid && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-4xl font-bold font-mono text-brand-600 dark:text-brand-400">{fmtHMS(result, negative)}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">{Math.abs(totalSec).toLocaleString()} seconds total</p>
        </div>
      )}
      <p className="text-xs text-[var(--text-muted)]">Format: HH:MM:SS or MM:SS. Example: 1:30:00 = 1 hour 30 minutes.</p>
    </div>
  );
}
