"use client";
import { useState } from "react";

const PRESETS = [10, 15, 18, 20, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("50");
  const [tipPct, setTipPct] = useState(18);
  const [custom, setCustom] = useState("");
  const [people, setPeople] = useState("2");

  const effectiveTip = custom !== "" ? parseFloat(custom) || 0 : tipPct;
  const billAmt = parseFloat(bill) || 0;
  const n = Math.max(1, parseInt(people) || 1);

  const tipAmt = billAmt * effectiveTip / 100;
  const total = billAmt + tipAmt;
  const perPerson = total / n;
  const tipPerPerson = tipAmt / n;

  const fmt = (v: number) => v.toFixed(2);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Bill Amount ($)</label>
          <input type="number" min={0} step="0.01" className="input mt-1" value={bill} onChange={e => setBill(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Split Between (people)</label>
          <input type="number" min={1} max={100} className="input mt-1" value={people} onChange={e => setPeople(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Tip Percentage</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setTipPct(p); setCustom(""); }}
              className={custom === "" && tipPct === p ? "btn-primary" : "btn-secondary"}
            >
              {p}%
            </button>
          ))}
          <input
            type="number"
            min={0}
            max={100}
            className="input w-24"
            placeholder="Custom %"
            value={custom}
            onChange={e => setCustom(e.target.value)}
          />
        </div>
      </div>

      {billAmt > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["Tip Amount", `$${fmt(tipAmt)}`],
            ["Total Bill", `$${fmt(total)}`],
            ["Per Person", `$${fmt(perPerson)}`],
            ["Tip / Person", `$${fmt(tipPerPerson)}`],
          ].map(([label, val]) => (
            <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400">{val}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
