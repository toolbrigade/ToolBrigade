"use client";
import { useState } from "react";

const ZONES = ["UTC","America/New_York","America/Chicago","America/Denver","America/Los_Angeles","America/Toronto","America/Vancouver","America/Sao_Paulo","America/Mexico_City","Europe/London","Europe/Paris","Europe/Berlin","Europe/Madrid","Europe/Rome","Europe/Amsterdam","Europe/Moscow","Africa/Cairo","Africa/Johannesburg","Asia/Dubai","Asia/Kolkata","Asia/Dhaka","Asia/Bangkok","Asia/Singapore","Asia/Shanghai","Asia/Tokyo","Asia/Seoul","Australia/Sydney","Australia/Melbourne","Pacific/Auckland","Pacific/Honolulu"];

export default function TimeZoneConverter() {
  const [datetime, setDatetime] = useState(() => new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState("UTC");
  const [targets, setTargets] = useState(["America/New_York", "Europe/London", "Asia/Tokyo"]);

  function addZone(z: string) { if (!targets.includes(z)) setTargets(p => [...p, z]); }
  function removeZone(z: string) { setTargets(p => p.filter(t => t !== z)); }

  function convert(tz: string) {
    try {
      // Parse the local datetime string as if it's in the `from` timezone
      const localDate = new Date(datetime);
      const fromOffset = getTimezoneOffset(from, localDate);
      const utcMs = localDate.getTime() - fromOffset;
      return new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "medium", timeStyle: "short" }).format(new Date(utcMs));
    } catch { return "—"; }
  }

  function getTimezoneOffset(tz: string, date: Date): number {
    const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
    const tzStr = date.toLocaleString("en-US", { timeZone: tz });
    return new Date(tzStr).getTime() - new Date(utcStr).getTime();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Date & time</label>
          <input type="datetime-local" className="input mt-1" value={datetime} onChange={e => setDatetime(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Source time zone</label>
          <select className="input mt-1" value={from} onChange={e => setFrom(e.target.value)}>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-[var(--text-muted)]">Add time zone</label>
          <select className="input mt-1" onChange={e => { addZone(e.target.value); e.target.value = ""; }} defaultValue="">
            <option value="" disabled>Select zone to add…</option>
            {ZONES.filter(z => !targets.includes(z)).map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        {targets.map(tz => (
          <div key={tz} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-4 py-3">
            <div>
              <p className="text-xs text-[var(--text-muted)]">{tz}</p>
              <p className="text-sm font-semibold text-[var(--text)]">{convert(tz)}</p>
            </div>
            <button onClick={() => removeZone(tz)} className="text-[var(--text-muted)] hover:text-red-500 text-xs">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
