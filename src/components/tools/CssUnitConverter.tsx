"use client";
import { useState } from "react";

const UNITS = ["px", "rem", "em", "pt", "vh", "vw", "%"] as const;
type Unit = typeof UNITS[number];

export default function CssUnitConverter() {
  const [value, setValue] = useState("16");
  const [fromUnit, setFromUnit] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportW, setViewportW] = useState(1440);
  const [viewportH, setViewportH] = useState(900);
  const [parentSize, setParentSize] = useState(16);

  function toPx(val: number, unit: Unit): number {
    switch (unit) {
      case "px": return val;
      case "rem": return val * baseFontSize;
      case "em": return val * parentSize;
      case "pt": return val * (96 / 72);
      case "vh": return (val / 100) * viewportH;
      case "vw": return (val / 100) * viewportW;
      case "%": return (val / 100) * parentSize;
    }
  }

  function fromPx(px: number, unit: Unit): number {
    switch (unit) {
      case "px": return px;
      case "rem": return px / baseFontSize;
      case "em": return px / parentSize;
      case "pt": return px * (72 / 96);
      case "vh": return (px / viewportH) * 100;
      case "vw": return (px / viewportW) * 100;
      case "%": return (px / parentSize) * 100;
    }
  }

  const num = parseFloat(value) || 0;
  const px = toPx(num, fromUnit);

  function fmt(n: number) {
    return parseFloat(n.toFixed(6)).toString();
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Value</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">From Unit</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400">
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Base Font Size (px)</label>
          <input type="number" value={baseFontSize} onChange={e => setBaseFontSize(Number(e.target.value))}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Parent/Em Size (px)</label>
          <input type="number" value={parentSize} onChange={e => setParentSize(Number(e.target.value))}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Viewport Width (px)</label>
          <input type="number" value={viewportW} onChange={e => setViewportW(Number(e.target.value))}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Viewport Height (px)</label>
          <input type="number" value={viewportH} onChange={e => setViewportH(Number(e.target.value))}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {UNITS.map(u => (
          <div key={u} className={`p-3 rounded-xl border text-center ${u === fromUnit ? "border-brand-400 bg-[var(--brand-light)] dark:bg-brand-900/20" : "border-[var(--border)] bg-[var(--surface)]"}`}>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-1">{u}</p>
            <p className="text-sm font-mono font-semibold text-[var(--text)]">{fmt(fromPx(px, u))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
