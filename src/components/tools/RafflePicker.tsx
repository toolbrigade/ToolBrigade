"use client";
import { useState } from "react";
import { Trophy, RefreshCw, Copy } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RafflePicker() {
  const [entriesInput, setEntriesInput] = useState("Alice\nBob\nCarol\nDavid\nEmma\nFrank\nGrace\nHenry\nIvy\nJack");
  const [numWinners, setNumWinners] = useState(3);
  const [excludeDupes, setExcludeDupes] = useState(true);
  const [winners, setWinners] = useState<string[]>([]);
  const [picking, setPicking] = useState(false);
  const [copied, setCopied] = useState(false);

  const entries = entriesInput.split("\n").map(e => e.trim()).filter(Boolean);
  const uniqueEntries = excludeDupes ? Array.from(new Set(entries)) : entries;

  function pick() {
    if (uniqueEntries.length === 0) return;
    setPicking(true);
    setWinners([]);
    const n = Math.min(numWinners, uniqueEntries.length);
    let count = 0;
    const interval = setInterval(() => {
      setWinners(shuffle(uniqueEntries).slice(0, n));
      count++;
      if (count > 12) {
        clearInterval(interval);
        setPicking(false);
        setWinners(shuffle(uniqueEntries).slice(0, n));
      }
    }, 80);
  }

  function copyWinners() {
    navigator.clipboard.writeText(winners.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">
            Entries (one per line) — {entries.length} total{excludeDupes && entries.length !== uniqueEntries.length ? `, ${uniqueEntries.length} unique` : ""}
          </label>
          <textarea
            className="input h-48 resize-none font-mono text-sm"
            value={entriesInput}
            onChange={e => setEntriesInput(e.target.value)}
            placeholder="Alice&#10;Bob&#10;Carol&#10;..."
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Number of winners</label>
            <input
              type="number"
              min={1}
              max={uniqueEntries.length || 1}
              value={numWinners}
              onChange={e => setNumWinners(+e.target.value)}
              className="input w-24"
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={excludeDupes}
              onChange={e => setExcludeDupes(e.target.checked)}
              className="rounded"
            />
            <span className="text-[var(--text)]">Exclude duplicate entries</span>
          </label>
          <button
            onClick={pick}
            disabled={picking || uniqueEntries.length === 0}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            <Trophy size={16} />{picking ? "Picking…" : `Pick ${Math.min(numWinners, uniqueEntries.length)} Winner${numWinners !== 1 ? "s" : ""}`}
          </button>
          {winners.length > 0 && !picking && (
            <button onClick={pick} className="btn-secondary flex items-center gap-2 w-full justify-center text-sm">
              <RefreshCw size={14} />Re-draw
            </button>
          )}
        </div>
      </div>

      {winners.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[var(--text)]">🎉 Winners</h3>
            <button onClick={copyWinners} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Copy size={12} />{copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <div className="space-y-2">
            {winners.map((w, i) => (
              <div key={i} className="flex items-center gap-3 bg-[var(--bg-subtle)] rounded-xl px-4 py-3">
                <span className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-[var(--text)] font-medium">{w}</span>
                {i === 0 && <span className="ml-auto text-lg">🥇</span>}
                {i === 1 && <span className="ml-auto text-lg">🥈</span>}
                {i === 2 && <span className="ml-auto text-lg">🥉</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
