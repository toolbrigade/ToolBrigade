"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const TIMEZONES = [
  "UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Shanghai", "Asia/Tokyo",
  "Australia/Sydney", "Pacific/Auckland",
];

function formatInTz(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "Invalid timezone";
  }
}

export default function TimestampConverter() {
  const [tsInput, setTsInput] = useState("");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [dateInput, setDateInput] = useState("");
  const [selectedTzs, setSelectedTzs] = useState(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]);
  const [addTz, setAddTz] = useState("");
  const [startTime] = useState(Date.now());

  // Timestamp → Date
  const tsDate = tsInput ? new Date(unit === "seconds" ? Number(tsInput) * 1000 : Number(tsInput)) : null;
  const tsValid = tsDate && !isNaN(tsDate.getTime());

  // Date → Timestamp
  const dateDate = dateInput ? new Date(dateInput) : null;
  const dateValid = dateDate && !isNaN(dateDate.getTime());
  const tsFromDate = dateValid ? Math.floor(dateDate.getTime() / 1000) : null;

  function nowTs() {
    setTsInput(unit === "seconds" ? String(Math.floor(Date.now() / 1000)) : String(Date.now()));
    trackTaskComplete("timestamp-converter", startTime);
  }

  function addTimezone() {
    if (addTz && !selectedTzs.includes(addTz)) {
      setSelectedTzs(prev => [...prev, addTz]);
      setAddTz("");
    }
  }

  return (
    <div className="space-y-6">
      {/* Unix → Human */}
      <div className="border border-[var(--border)] rounded-xl p-4 space-y-3 bg-[var(--surface)]">
        <p className="text-sm font-semibold text-[var(--text)]">Unix Timestamp → Human-readable</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input value={tsInput} onChange={e => setTsInput(e.target.value)} type="number"
            className="flex-1 min-w-[160px] text-sm font-mono border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-brand-400"
            placeholder="1700000000" />
          <div className="flex gap-1">
            {(["seconds", "milliseconds"] as const).map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${unit === u ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {u === "seconds" ? "s" : "ms"}
              </button>
            ))}
          </div>
          <button onClick={nowTs} className="btn-secondary text-xs">Use Now</button>
        </div>
        {tsValid && (
          <div className="space-y-1">
            {selectedTzs.map(tz => (
              <div key={tz} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-[var(--text-muted)] font-mono text-xs w-40 shrink-0">{tz}</span>
                <span className="text-[var(--text)] font-mono flex-1">{formatInTz(tsDate!, tz)}</span>
                <button onClick={() => setSelectedTzs(prev => prev.filter(t => t !== tz))} className="text-red-400 text-xs">✕</button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <select value={addTz} onChange={e => setAddTz(e.target.value)}
                className="flex-1 text-xs border border-[var(--border)] rounded-lg px-2 py-1 bg-[var(--bg)] text-[var(--text)] focus:outline-none">
                <option value="">Add timezone…</option>
                {TIMEZONES.filter(t => !selectedTzs.includes(t)).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={addTimezone} className="btn-secondary text-xs">Add</button>
            </div>
          </div>
        )}
        {tsInput && !tsValid && <p className="text-sm text-red-500">Invalid timestamp</p>}
      </div>

      {/* Human → Unix */}
      <div className="border border-[var(--border)] rounded-xl p-4 space-y-3 bg-[var(--surface)]">
        <p className="text-sm font-semibold text-[var(--text)]">Human-readable → Unix Timestamp</p>
        <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)}
          className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        {dateValid && tsFromDate !== null && (
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">Seconds:</span>
              <span className="font-mono text-sm text-[var(--text)]">{tsFromDate}</span>
              <CopyButton text={String(tsFromDate)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">Milliseconds:</span>
              <span className="font-mono text-sm text-[var(--text)]">{tsFromDate * 1000}</span>
              <CopyButton text={String(tsFromDate * 1000)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
