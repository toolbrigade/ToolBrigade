"use client";
import { useState, useEffect } from "react";

function parseTarget(param: string | null): Date | null {
  if (!param) return null;
  const ts = parseInt(param);
  if (!isNaN(ts)) { const d = new Date(ts); return isNaN(d.getTime()) ? null : d; }
  const d = new Date(param);
  return isNaN(d.getTime()) ? null : d;
}

function getCountdown(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: false };
}

export default function CountdownGenerator() {
  const [eventName, setEventName] = useState("My Event");
  const [targetDate, setTargetDate] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdown> | null>(null);
  const [sharedTarget, setSharedTarget] = useState<Date | null>(null);
  const [sharedName, setSharedName] = useState("");

  // On mount, check URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = parseTarget(params.get("t"));
    const n = params.get("n");
    if (t) { setSharedTarget(t); setSharedName(n || "Countdown"); }
  }, []);

  // Live countdown for shared target
  useEffect(() => {
    if (!sharedTarget) return;
    const tick = () => setCountdown(getCountdown(sharedTarget));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sharedTarget]);

  function generate() {
    if (!targetDate) return;
    const d = new Date(targetDate);
    if (isNaN(d.getTime())) return;
    const params = new URLSearchParams({ t: d.getTime().toString(), n: eventName });
    setShareUrl(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
    setSharedTarget(d);
    setSharedName(eventName);
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="space-y-4">
      {sharedTarget && countdown && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center space-y-3">
          <p className="text-lg font-semibold text-[var(--text)]">{sharedName}</p>
          {countdown.done ? (
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">🎉 Event has passed!</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {[["Days", countdown.days], ["Hours", countdown.hours], ["Minutes", countdown.minutes], ["Seconds", countdown.seconds]].map(([label, val]) => (
                <div key={label} className="bg-[var(--bg)] rounded-lg p-3">
                  <p className="text-3xl font-bold font-mono text-brand-600 dark:text-brand-400">{pad(val as number)}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-[var(--text-muted)]">Target: {sharedTarget.toLocaleString()}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Event Name</label>
          <input className="input mt-1" value={eventName} onChange={e => setEventName(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Target Date & Time</label>
          <input type="datetime-local" className="input mt-1" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Countdown</button>

      {shareUrl && (
        <div className="space-y-2">
          <label className="text-xs text-[var(--text-muted)]">Shareable Link (encodes date in URL — no backend needed)</label>
          <div className="flex gap-2">
            <input readOnly className="input font-mono text-xs flex-1" value={shareUrl} />
            <button className="btn-secondary text-xs" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</button>
          </div>
        </div>
      )}
    </div>
  );
}
