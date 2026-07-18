"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const [x, setX] = useState(""); const [y, setY] = useState("");
  const [p, setP] = useState(""); const [q, setQ] = useState("");

  const r1 = a && b ? ((+a / 100) * +b).toFixed(4).replace(/\.?0+$/, "") : "";
  const r2 = x && y ? ((+x / +y) * 100).toFixed(4).replace(/\.?0+$/, "") + "%" : "";
  const r3 = p && q ? ((+q - +p) / +p * 100).toFixed(4).replace(/\.?0+$/, "") + "%" : "";

  const row = (label: string, inputs: React.ReactNode, result: string) => (
    <div className="bg-[var(--bg-subtle)] rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium text-[var(--text)]">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{inputs}</div>
      {result && <p className="text-lg font-bold text-brand-600 dark:text-brand-400">= {result}</p>}
    </div>
  );

  const inp = (val: string, set: (v: string) => void, ph: string) => (
    <input type="number" className="input w-28" placeholder={ph} value={val} onChange={e => set(e.target.value)} />
  );

  return (
    <div className="space-y-4">
      {row("What is A% of B?",
        <>{inp(a, setA, "A %")} <span className="text-[var(--text-muted)]">% of</span> {inp(b, setB, "B")}</>,
        r1)}
      {row("X is what % of Y?",
        <>{inp(x, setX, "X")} <span className="text-[var(--text-muted)]">is what % of</span> {inp(y, setY, "Y")}</>,
        r2)}
      {row("% change from P to Q",
        <>{inp(p, setP, "From")} <span className="text-[var(--text-muted)]">to</span> {inp(q, setQ, "To")}</>,
        r3)}
    </div>
  );
}
