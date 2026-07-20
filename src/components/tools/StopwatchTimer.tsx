"use client";
import { useState, useEffect, useRef } from "react";

type Lap = { index: number; split: number; total: number };

function fmtMs(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const pad = (n: number, w = 2) => String(n).padStart(w, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}.${pad(cs)}` : `${pad(m)}:${pad(s)}.${pad(cs)}`;
}

export default function StopwatchTimer() {
  const [tab, setTab] = useState<"stopwatch" | "timer">("stopwatch");

  // Stopwatch
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const swStart = useRef(0);
  const swAccum = useRef(0);
  const swInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function swToggle() {
    if (swRunning) {
      clearInterval(swInterval.current!);
      swAccum.current += Date.now() - swStart.current;
      setSwRunning(false);
    } else {
      swStart.current = Date.now();
      swInterval.current = setInterval(() => setSwElapsed(swAccum.current + Date.now() - swStart.current), 50);
      setSwRunning(true);
    }
  }
  function swReset() {
    clearInterval(swInterval.current!);
    swAccum.current = 0; setSwElapsed(0); setSwRunning(false); setLaps([]);
  }
  function swLap() {
    const total = swAccum.current + Date.now() - swStart.current;
    const prev = laps.length > 0 ? laps[laps.length - 1].total : 0;
    setLaps(l => [...l, { index: l.length + 1, split: total - prev, total }]);
  }

  // Countdown timer
  const [timerInput, setTimerInput] = useState("05:00");
  const [timerMs, setTimerMs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerEnd = useRef(0);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function parseTimerInput(s: string): number {
    const parts = s.split(":").map(p => parseInt(p) || 0);
    if (parts.length === 3) return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
    if (parts.length === 2) return (parts[0] * 60 + parts[1]) * 1000;
    return parts[0] * 1000;
  }

  function timerToggle() {
    if (timerRunning) {
      clearInterval(timerInterval.current!);
      setTimerRunning(false);
    } else {
      const ms = timerMs > 0 ? timerMs : parseTimerInput(timerInput);
      if (ms <= 0) return;
      timerEnd.current = Date.now() + ms;
      timerInterval.current = setInterval(() => {
        const rem = timerEnd.current - Date.now();
        if (rem <= 0) {
          clearInterval(timerInterval.current!);
          setTimerMs(0); setTimerRunning(false); setTimerDone(true);
        } else {
          setTimerMs(rem); setTimerDone(false);
        }
      }, 50);
      setTimerRunning(true); setTimerDone(false);
    }
  }
  function timerReset() {
    clearInterval(timerInterval.current!);
    setTimerRunning(false); setTimerDone(false);
    setTimerMs(parseTimerInput(timerInput));
  }

  useEffect(() => { setTimerMs(parseTimerInput(timerInput)); }, [timerInput]);
  useEffect(() => () => { clearInterval(swInterval.current!); clearInterval(timerInterval.current!); }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setTab("stopwatch")} className={tab === "stopwatch" ? "btn-primary" : "btn-secondary"}>Stopwatch</button>
        <button onClick={() => setTab("timer")} className={tab === "timer" ? "btn-primary" : "btn-secondary"}>Countdown Timer</button>
      </div>

      {tab === "stopwatch" ? (
        <div className="space-y-4">
          <div className="bg-[var(--bg-subtle)] rounded-xl p-8 text-center">
            <p className="text-5xl font-bold font-mono text-brand-600 dark:text-brand-400">{fmtMs(swElapsed)}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={swToggle} className="btn-primary w-24">{swRunning ? "Pause" : swElapsed > 0 ? "Resume" : "Start"}</button>
            {swRunning && <button onClick={swLap} className="btn-secondary">Lap</button>}
            {!swRunning && swElapsed > 0 && <button onClick={swReset} className="btn-secondary">Reset</button>}
          </div>
          {laps.length > 0 && (
            <div className="overflow-auto max-h-48 rounded-xl border border-[var(--border)]">
              <table className="w-full text-xs">
                <thead className="bg-[var(--bg-subtle)] sticky top-0">
                  <tr>{["Lap", "Split", "Total"].map(h => <th key={h} className="px-3 py-2 text-left font-medium text-[var(--text-muted)]">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[...laps].reverse().map(l => (
                    <tr key={l.index} className="border-t border-[var(--border)]">
                      <td className="px-3 py-1.5 text-[var(--text-muted)]">{l.index}</td>
                      <td className="px-3 py-1.5 font-mono">{fmtMs(l.split)}</td>
                      <td className="px-3 py-1.5 font-mono">{fmtMs(l.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-muted)]">Set Duration (MM:SS or HH:MM:SS)</label>
            <input className="input mt-1 font-mono w-40" value={timerInput} onChange={e => setTimerInput(e.target.value)} disabled={timerRunning} />
          </div>
          <div className={`bg-[var(--bg-subtle)] rounded-xl p-8 text-center ${timerDone ? "ring-2 ring-green-500" : ""}`}>
            <p className={`text-5xl font-bold font-mono ${timerDone ? "text-green-500" : "text-brand-600 dark:text-brand-400"}`}>
              {timerDone ? "Done! 🎉" : fmtMs(timerMs > 0 ? timerMs : parseTimerInput(timerInput))}
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <button onClick={timerToggle} className="btn-primary w-24">{timerRunning ? "Pause" : "Start"}</button>
            <button onClick={timerReset} className="btn-secondary">Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
