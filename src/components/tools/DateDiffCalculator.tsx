"use client";
import { useState } from "react";

export default function DateDiffCalculator() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  let result = null;
  if (start && end) {
    const s = new Date(start); const e = new Date(end);
    const diff = Math.abs(e.getTime() - s.getTime());
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.abs((e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()));
    const years = Math.abs(e.getFullYear() - s.getFullYear());
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    result = { days, weeks, months, years, hours, minutes, future: e > s };
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Start date</label>
          <input type="date" className="input mt-1" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">End date</label>
          <input type="date" className="input mt-1" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </div>
      {result && (
        <>
          {result.future !== undefined && start !== end && (
            <p className="text-xs text-center text-[var(--text-muted)]">End date is {result.future ? "after" : "before"} start date</p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {[["Days", result.days], ["Weeks", result.weeks], ["Months", result.months], ["Years", result.years], ["Hours", result.hours.toLocaleString()], ["Minutes", result.minutes.toLocaleString()]].map(([label, val]) => (
              <div key={label} className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
                <p className="text-lg font-semibold text-brand-600 dark:text-brand-400">{val}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
