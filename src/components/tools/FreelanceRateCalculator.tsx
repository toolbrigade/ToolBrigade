"use client";
import { useState } from "react";

export default function FreelanceRateCalculator() {
  const [mode, setMode] = useState<"hourly" | "annual">("hourly");
  const [value, setValue] = useState("75");
  const [billableHours, setBillableHours] = useState("30");
  const [weeksPerYear, setWeeksPerYear] = useState("48");

  const v = parseFloat(value) || 0;
  const bh = parseFloat(billableHours) || 0;
  const wy = parseFloat(weeksPerYear) || 0;

  let hourly = 0, daily = 0, weekly = 0, monthly = 0, annual = 0;
  if (mode === "hourly") {
    hourly = v;
    daily = v * 8;
    weekly = v * bh;
    monthly = (v * bh * wy) / 12;
    annual = v * bh * wy;
  } else {
    annual = v;
    hourly = bh > 0 && wy > 0 ? v / (bh * wy) : 0;
    daily = hourly * 8;
    weekly = hourly * bh;
    monthly = v / 12;
  }

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode("hourly")} className={mode === "hourly" ? "btn-primary" : "btn-secondary"}>Start from Hourly Rate</button>
        <button onClick={() => setMode("annual")} className={mode === "annual" ? "btn-primary" : "btn-secondary"}>Start from Annual Target</button>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">{mode === "hourly" ? "Hourly Rate ($)" : "Annual Target ($)"}</label>
          <input type="number" min={0} step="0.01" className="input mt-1" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Billable Hours / Week</label>
          <input type="number" min={1} max={80} className="input mt-1" value={billableHours} onChange={e => setBillableHours(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Billable Weeks / Year</label>
          <input type="number" min={1} max={52} className="input mt-1" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} />
        </div>
      </div>
      {v > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[["Hourly", fmt(hourly)], ["Daily (8 hrs)", fmt(daily)], ["Weekly", fmt(weekly)], ["Monthly", fmt(monthly)], ["Annual", fmt(annual)]].map(([label, val]) => (
            <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-brand-600 dark:text-brand-400">${val}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-[var(--text-muted)]">Daily rate assumes 8 billable hours. Weekly/monthly/annual use your billable hours/week and weeks/year inputs.</p>
    </div>
  );
}
