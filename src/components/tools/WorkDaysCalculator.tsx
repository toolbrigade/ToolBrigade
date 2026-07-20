"use client";
import { useState } from "react";

function isWeekend(d: Date) { const day = d.getDay(); return day === 0 || day === 6; }

function workDaysBetween(start: Date, end: Date, holidays: Set<string>): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  const dir = endD >= cur ? 1 : -1;
  while (cur.getTime() !== endD.getTime()) {
    if (!isWeekend(cur) && !holidays.has(cur.toISOString().slice(0, 10))) count++;
    cur.setDate(cur.getDate() + dir);
  }
  return count;
}

export default function WorkDaysCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [holidayText, setHolidayText] = useState("");

  const holidays = new Set(
    holidayText.split(/[\n,]+/).map(s => s.trim()).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s))
  );

  let result: number | null = null;
  let totalDays: number | null = null;
  if (start && end) {
    const s = new Date(start); const e = new Date(end);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
      totalDays = Math.abs(Math.round((e.getTime() - s.getTime()) / 86400000));
      result = workDaysBetween(s, e, holidays);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Start Date</label>
          <input type="date" className="input mt-1" value={start} onChange={e => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">End Date</label>
          <input type="date" className="input mt-1" value={end} onChange={e => setEnd(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)]">Holiday dates to exclude (optional — one per line or comma-separated, YYYY-MM-DD)</label>
        <textarea
          className="input mt-1 font-mono text-xs"
          rows={3}
          placeholder={"2025-12-25\n2025-01-01"}
          value={holidayText}
          onChange={e => setHolidayText(e.target.value)}
        />
        {holidays.size > 0 && <p className="text-xs text-[var(--text-muted)] mt-1">{holidays.size} holiday(s) loaded</p>}
      </div>
      {result !== null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{result}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Work days (excl. weekends{holidays.size > 0 ? " & holidays" : ""})</p>
          </div>
          <div className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[var(--text)]">{totalDays}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Calendar days</p>
          </div>
        </div>
      )}
    </div>
  );
}
