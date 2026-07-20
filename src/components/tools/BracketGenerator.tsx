"use client";
import { useState, useRef } from "react";
import { Download, Shuffle } from "lucide-react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

type Match = { p1: string; p2: string; winner?: string };
type Round = Match[];

function buildBracket(participants: string[]): Round[] {
  const size = nextPow2(participants.length);
  const padded = [...participants, ...Array(size - participants.length).fill("BYE")];
  const rounds: Round[] = [];
  let current = padded;
  while (current.length > 1) {
    const round: Match[] = [];
    for (let i = 0; i < current.length; i += 2) {
      round.push({ p1: current[i], p2: current[i + 1] });
    }
    rounds.push(round);
    current = round.map(m => m.winner ?? (m.p2 === "BYE" ? m.p1 : "TBD"));
  }
  return rounds;
}

export default function BracketGenerator() {
  const [input, setInput] = useState("Alice\nBob\nCarol\nDavid\nEmma\nFrank\nGrace\nHenry");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [mutableRounds, setMutableRounds] = useState<Round[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  function generate(randomize = false) {
    const names = input.split("\n").map(n => n.trim()).filter(Boolean);
    if (names.length < 2) return;
    const ordered = randomize ? shuffle(names) : names;
    const b = buildBracket(ordered);
    setRounds(b);
    setMutableRounds(JSON.parse(JSON.stringify(b)));
  }

  function setWinner(roundIdx: number, matchIdx: number, winner: string) {
    setMutableRounds(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as Round[];
      next[roundIdx][matchIdx].winner = winner;
      // Propagate to next round
      if (roundIdx + 1 < next.length) {
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const slot = matchIdx % 2 === 0 ? "p1" : "p2";
        next[roundIdx + 1][nextMatchIdx][slot] = winner;
      }
      return next;
    });
  }

  function printBracket() {
    const el = containerRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Bracket</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse}td{padding:4px 8px;border:1px solid #ccc;font-size:12px}.winner{font-weight:bold;color:#6366f1}</style></head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  }

  const roundNames = ["Round 1","Quarterfinals","Semifinals","Final","Champion"];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Participants (one per line, min 2)</label>
          <textarea
            className="input h-40 resize-none font-mono text-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 justify-start pt-5">
          <button onClick={() => generate(false)} className="btn-primary">Generate Bracket</button>
          <button onClick={() => generate(true)} className="btn-secondary flex items-center gap-2 justify-center"><Shuffle size={14} />Randomize Seeding</button>
          {rounds.length > 0 && (
            <button onClick={printBracket} className="btn-secondary flex items-center gap-2 justify-center"><Download size={14} />Print / Export</button>
          )}
        </div>
      </div>

      {mutableRounds.length > 0 && (
        <div ref={containerRef} className="overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {mutableRounds.map((round, ri) => (
              <div key={ri} className="flex flex-col justify-around gap-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] text-center mb-1">
                  {roundNames[Math.min(ri, roundNames.length - 1)] || `Round ${ri + 1}`}
                </p>
                {round.map((match, mi) => (
                  <div key={mi} className="bg-[var(--bg-subtle)] rounded-lg border border-[var(--border)] overflow-hidden w-40">
                    {[match.p1, match.p2].map((p, pi) => (
                      <button
                        key={pi}
                        onClick={() => p !== "BYE" && p !== "TBD" && setWinner(ri, mi, p)}
                        className={`w-full text-left px-3 py-2 text-xs border-b border-[var(--border)] last:border-0 transition-colors
                          ${match.winner === p ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-bold" : "hover:bg-[var(--border)] text-[var(--text)]"}
                          ${p === "BYE" || p === "TBD" ? "text-[var(--text-muted)] cursor-default" : "cursor-pointer"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {/* Champion */}
            {mutableRounds.length > 0 && (() => {
              const last = mutableRounds[mutableRounds.length - 1];
              const champ = last[0]?.winner;
              return champ ? (
                <div className="flex flex-col justify-center">
                  <p className="text-xs font-semibold text-[var(--text-muted)] text-center mb-1">Champion</p>
                  <div className="bg-brand-100 dark:bg-brand-900/30 border-2 border-brand-500 rounded-lg px-4 py-3 text-center">
                    <p className="text-sm font-bold text-brand-700 dark:text-brand-300">🏆 {champ}</p>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        </div>
      )}
      {mutableRounds.length > 0 && <p className="text-xs text-[var(--text-muted)]">Click a participant&apos;s name to advance them to the next round.</p>}
    </div>
  );
}
