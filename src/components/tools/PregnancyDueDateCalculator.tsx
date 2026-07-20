"use client";
import { useState } from "react";
import Link from "next/link";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function PregnancyDueDateCalculator() {
  const [lmp, setLmp] = useState("");

  let dueDate: Date | null = null;
  let conception: Date | null = null;
  let trimester2: Date | null = null;
  let trimester3: Date | null = null;

  if (lmp) {
    const lmpDate = new Date(lmp);
    if (!isNaN(lmpDate.getTime())) {
      dueDate = addDays(lmpDate, 280); // Naegele's rule: LMP + 280 days
      conception = addDays(lmpDate, 14);
      trimester2 = addDays(lmpDate, 84);  // week 13
      trimester3 = addDays(lmpDate, 196); // week 28
    }
  }

  const today = new Date();
  const weeksPregnant = lmp && dueDate
    ? Math.floor((today.getTime() - new Date(lmp).getTime()) / (7 * 86400000))
    : null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200">
        ⚠️ <strong>Medical disclaimer:</strong> This calculator provides an estimate for informational purposes only and is not medical advice. Due dates are estimates — only about 5% of babies are born on their calculated due date. Always consult your healthcare provider for accurate pregnancy dating and medical guidance. See our{" "}
        <Link href="/disclaimer" className="underline">Disclaimer</Link>.
      </div>

      <div>
        <label className="text-xs text-[var(--text-muted)]">First day of last menstrual period (LMP)</label>
        <input
          type="date"
          className="input mt-1"
          value={lmp}
          max={today.toISOString().slice(0, 10)}
          onChange={e => setLmp(e.target.value)}
        />
      </div>

      {dueDate && (
        <div className="space-y-3">
          <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">Estimated Due Date (Naegele&apos;s Rule)</p>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{formatDate(dueDate)}</p>
            {weeksPregnant !== null && weeksPregnant >= 0 && weeksPregnant <= 42 && (
              <p className="text-sm text-[var(--text-muted)] mt-1">Approximately {weeksPregnant} weeks pregnant today</p>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ["Estimated Conception", formatDate(conception!)],
              ["2nd Trimester Begins", formatDate(trimester2!)],
              ["3rd Trimester Begins", formatDate(trimester3!)],
            ].map(([label, val]) => (
              <div key={label} className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-[var(--text)]">{val}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
