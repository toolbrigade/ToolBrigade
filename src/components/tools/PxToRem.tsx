"use client";

import { useState } from "react";

export default function PxToRem() {
  const [px, setPx] = useState("");
  const [rem, setRem] = useState("");
  const [base, setBase] = useState("16");

  function handlePx(val: string) {
    setPx(val);
    const n = parseFloat(val);
    const b = parseFloat(base) || 16;
    setRem(isNaN(n) ? "" : (n / b).toFixed(4).replace(/\.?0+$/, ""));
  }

  function handleRem(val: string) {
    setRem(val);
    const n = parseFloat(val);
    const b = parseFloat(base) || 16;
    setPx(isNaN(n) ? "" : (n * b).toFixed(2).replace(/\.?0+$/, ""));
  }

  function handleBase(val: string) {
    setBase(val);
    const b = parseFloat(val) || 16;
    const n = parseFloat(px);
    if (!isNaN(n)) setRem((n / b).toFixed(4).replace(/\.?0+$/, ""));
  }

  return (
    <div className="space-y-6 max-w-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">PX</label>
          <input type="number" className="input" placeholder="e.g. 24" value={px}
            onChange={(e) => handlePx(e.target.value)}
            onInput={(e) => handlePx((e.target as HTMLInputElement).value)} />
        </div>
        <span className="text-[var(--text-muted)] mt-5">=</span>
        <div className="flex-1">
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">REM</label>
          <input type="number" className="input" placeholder="e.g. 1.5" value={rem}
            onChange={(e) => handleRem(e.target.value)}
            onInput={(e) => handleRem((e.target as HTMLInputElement).value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Root font size (px)</label>
        <input type="number" className="input" value={base}
          onChange={(e) => handleBase(e.target.value)}
          onInput={(e) => handleBase((e.target as HTMLInputElement).value)} />
      </div>
    </div>
  );
}
