"use client";
import { useState } from "react";

export default function CoinDice() {
  const [coinResult, setCoinResult] = useState<"Heads" | "Tails" | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [diceResults, setDiceResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  function flipCoin() {
    setCoinFlipping(true); setCoinResult(null);
    setTimeout(() => { setCoinResult(Math.random() < 0.5 ? "Heads" : "Tails"); setCoinFlipping(false); }, 600);
  }

  function rollDice() {
    setRolling(true); setDiceResults([]);
    setTimeout(() => {
      setDiceResults(Array.from({ length: diceCount }, () => Math.floor(Math.random() * diceSides) + 1));
      setRolling(false);
    }, 400);
  }

  const diceTotal = diceResults.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Coin flip */}
      <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Coin Flip</h3>
        <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-3xl transition-all duration-300 ${coinFlipping ? "animate-spin border-brand-400" : coinResult === "Heads" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : coinResult === "Tails" ? "border-slate-400 bg-slate-50 dark:bg-slate-800" : "border-[var(--border)]"}`}>
          {coinFlipping ? "🪙" : coinResult === "Heads" ? "👑" : coinResult === "Tails" ? "🦅" : "🪙"}
        </div>
        {coinResult && !coinFlipping && <p className="text-2xl font-bold text-[var(--text)]">{coinResult}</p>}
        <button onClick={flipCoin} disabled={coinFlipping} className="btn-primary">Flip Coin</button>
      </div>

      {/* Dice roller */}
      <div className="bg-[var(--bg-subtle)] rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)] text-center">Dice Roller</h3>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-xs text-[var(--text-muted)]">Number of dice</label><input type="number" min={1} max={20} value={diceCount} className="input mt-1" onChange={e => setDiceCount(+e.target.value)} /></div>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Sides</label>
            <select className="input mt-1" value={diceSides} onChange={e => setDiceSides(+e.target.value)}>
              {[4, 6, 8, 10, 12, 20, 100].map(s => <option key={s} value={s}>d{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={rollDice} disabled={rolling} className="btn-primary w-full">{rolling ? "Rolling…" : `Roll ${diceCount}d${diceSides}`}</button>
        {diceResults.length > 0 && (
          <div className="text-center space-y-2">
            <div className="flex flex-wrap gap-2 justify-center">
              {diceResults.map((r, i) => (
                <span key={i} className="w-12 h-12 rounded-lg bg-white dark:bg-slate-700 border-2 border-brand-400 flex items-center justify-center text-lg font-bold text-brand-600 dark:text-brand-400">{r}</span>
              ))}
            </div>
            {diceCount > 1 && <p className="text-sm text-[var(--text-muted)]">Total: <strong className="text-[var(--text)]">{diceTotal}</strong></p>}
          </div>
        )}
      </div>
    </div>
  );
}
