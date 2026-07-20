"use client";
import { useState } from "react";
import { Shuffle, Copy } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TeamShuffler() {
  const [namesInput, setNamesInput] = useState("Alice\nBob\nCarol\nDavid\nEmma\nFrank\nGrace\nHenry");
  const [numGroups, setNumGroups] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const names = namesInput.split("\n").map(n => n.trim()).filter(Boolean);
    if (names.length < 2) return;
    const n = Math.min(names.length, Math.max(2, numGroups));
    const shuffled = shuffle(names);
    const result: string[][] = Array.from({ length: n }, () => []);
    shuffled.forEach((name, i) => result[i % n].push(name));
    setTeams(result);
  }

  function copyAll() {
    const text = teams.map((t, i) => `Team ${i + 1}:\n${t.join("\n")}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const names = namesInput.split("\n").map(n => n.trim()).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Names (one per line) — {names.length} total</label>
          <textarea
            className="input h-48 resize-none font-mono text-sm"
            value={namesInput}
            onChange={e => setNamesInput(e.target.value)}
            placeholder="Alice&#10;Bob&#10;Carol&#10;..."
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Number of groups</label>
            <input
              type="number"
              min={2}
              max={Math.max(2, names.length)}
              value={numGroups}
              onChange={e => setNumGroups(+e.target.value)}
              className="input w-24"
            />
          </div>
          <button onClick={generate} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Shuffle size={16} />Shuffle into {numGroups} teams
          </button>
          {teams.length > 0 && (
            <button onClick={copyAll} className="btn-secondary flex items-center gap-2 w-full justify-center text-sm">
              <Copy size={14} />{copied ? "Copied!" : "Copy all teams"}
            </button>
          )}
        </div>
      </div>

      {teams.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teams.map((team, i) => (
            <div key={i} className="bg-[var(--bg-subtle)] rounded-xl p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-[var(--text)]">Team {i + 1}</h3>
                <span className="text-xs text-[var(--text-muted)]">{team.length} members</span>
              </div>
              <ul className="space-y-1">
                {team.map((name, j) => (
                  <li key={j} className="text-sm text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs flex items-center justify-center font-medium">{j + 1}</span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
