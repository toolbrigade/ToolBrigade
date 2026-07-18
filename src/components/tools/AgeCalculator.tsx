"use client";
import { useState } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));

  let result = null;
  if (dob && asOf) {
    const birth = new Date(dob); const ref = new Date(asOf);
    if (birth <= ref) {
      let years = ref.getFullYear() - birth.getFullYear();
      let months = ref.getMonth() - birth.getMonth();
      let days = ref.getDate() - birth.getDate();
      if (days < 0) { months--; days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((ref.getTime() - birth.getTime()) / 86400000);
      result = { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7) };
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Date of birth</label>
          <input type="date" className="input mt-1" value={dob}
            onChange={e => setDob(e.target.value)}
            onInput={e => setDob((e.target as HTMLInputElement).value)}
            max={asOf} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">As of date</label>
          <input type="date" className="input mt-1" value={asOf}
            onChange={e => setAsOf(e.target.value)}
            onInput={e => setAsOf((e.target as HTMLInputElement).value)} />
        </div>
      </div>
      {result && (
        <>
          <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-brand-600 dark:text-brand-400">{result.years}</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">years old</p>
            <p className="text-base text-[var(--text)] mt-2">{result.years} years, {result.months} months, {result.days} days</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
              <p className="text-lg font-semibold text-[var(--text)]">{result.totalDays.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Total days</p>
            </div>
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
              <p className="text-lg font-semibold text-[var(--text)]">{result.totalWeeks.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-muted)]">Total weeks</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
