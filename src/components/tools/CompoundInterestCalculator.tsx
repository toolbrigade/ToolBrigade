"use client";
import { useState } from "react";

const FREQ_OPTIONS = [
  { label: "Annually (1×/yr)", value: 1 },
  { label: "Semi-annually (2×/yr)", value: 2 },
  { label: "Quarterly (4×/yr)", value: 4 },
  { label: "Monthly (12×/yr)", value: 12 },
  { label: "Daily (365×/yr)", value: 365 },
];

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [freq, setFreq] = useState(12);

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const n = freq;

  const A = P > 0 && r >= 0 && t > 0 ? P * Math.pow(1 + r / n, n * t) : 0;
  const interest = A - P;

  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const tableRows: { year: number; balance: number; earned: number }[] = [];
  if (A > 0) {
    for (let y = 1; y <= Math.min(Math.ceil(t), 100); y++) {
      const bal = P * Math.pow(1 + r / n, n * y);
      tableRows.push({ year: y, balance: bal, earned: bal - P });
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Principal ($)</label>
          <input type="number" min={0} className="input mt-1" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Annual Interest Rate (%)</label>
          <input type="number" min={0} step="0.1" className="input mt-1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Time (years)</label>
          <input type="number" min={0} step="0.5" className="input mt-1" value={years} onChange={e => setYears(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Compounding Frequency</label>
          <select className="input mt-1" value={freq} onChange={e => setFreq(+e.target.value)}>
            {FREQ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {A > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[["Final Balance", fmt(A)], ["Principal", fmt(P)], ["Interest Earned", fmt(interest)]].map(([label, val]) => (
              <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-brand-600 dark:text-brand-400">${val}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="overflow-auto max-h-64 rounded-xl border border-[var(--border)]">
            <table className="w-full text-xs">
              <thead className="bg-[var(--bg-subtle)] sticky top-0">
                <tr>
                  {["Year", "Balance", "Interest Earned"].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-medium text-[var(--text-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(row => (
                  <tr key={row.year} className="border-t border-[var(--border)]">
                    <td className="px-3 py-1.5 text-[var(--text-muted)]">{row.year}</td>
                    <td className="px-3 py-1.5 font-medium">${fmt(row.balance)}</td>
                    <td className="px-3 py-1.5 text-green-600 dark:text-green-400">${fmt(row.earned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
