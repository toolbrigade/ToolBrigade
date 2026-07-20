"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function CssGridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [colGap, setColGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [colTemplate, setColTemplate] = useState("1fr");
  const [rowTemplate, setRowTemplate] = useState("auto");

  const gridCss = `display: grid;
grid-template-columns: repeat(${cols}, ${colTemplate});
grid-template-rows: repeat(${rows}, ${rowTemplate});
column-gap: ${colGap}px;
row-gap: ${rowGap}px;`;

  const style: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${colTemplate})`,
    gridTemplateRows: `repeat(${rows}, ${rowTemplate})`,
    columnGap: `${colGap}px`,
    rowGap: `${rowGap}px`,
  };

  const cellCount = cols * rows;
  const colors = ["#1E5F4E", "#2d7a65", "#3d9478", "#4dae8b"];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Columns", value: cols, set: setCols, min: 1, max: 8 },
          { label: "Rows", value: rows, set: setRows, min: 1, max: 6 },
          { label: "Column gap", value: colGap, set: setColGap, min: 0, max: 40, unit: "px" },
          { label: "Row gap", value: rowGap, set: setRowGap, min: 0, max: 40, unit: "px" },
        ].map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">{s.label}</label>
              <span className="text-xs font-mono text-[var(--text)]">{s.value}{s.unit ?? ""}</span>
            </div>
            <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Column template (per track)</label>
          <select value={colTemplate} onChange={e => setColTemplate(e.target.value)}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400">
            <option value="1fr">1fr (equal)</option>
            <option value="auto">auto</option>
            <option value="minmax(0, 1fr)">minmax(0, 1fr)</option>
            <option value="200px">200px (fixed)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Row template (per track)</label>
          <select value={rowTemplate} onChange={e => setRowTemplate(e.target.value)}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400">
            <option value="auto">auto</option>
            <option value="1fr">1fr</option>
            <option value="100px">100px (fixed)</option>
            <option value="minmax(80px, auto)">minmax(80px, auto)</option>
          </select>
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-subtle)] p-4">
        <div style={style}>
          {Array.from({ length: cellCount }, (_, i) => (
            <div key={i} className="rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ minHeight: 60, background: colors[i % colors.length] }}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-medium text-[var(--text-muted)]">CSS</label>
          <CopyButton text={gridCss} />
        </div>
        <pre className="textarea font-mono text-sm">{gridCss}</pre>
      </div>
    </div>
  );
}
