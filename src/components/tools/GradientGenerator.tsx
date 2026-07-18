"use client";
import { useState } from "react";
import { Copy, Plus, X } from "lucide-react";

type Stop = { color: string; pos: number };

export default function GradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([{ color: "#6366f1", pos: 0 }, { color: "#ec4899", pos: 100 }]);
  const [copied, setCopied] = useState(false);

  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(", ");
  const css = type === "linear" ? `linear-gradient(${angle}deg, ${stopStr})` : `radial-gradient(circle, ${stopStr})`;

  function updateStop(i: number, field: keyof Stop, val: string | number) {
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  }
  function addStop() { setStops(prev => [...prev, { color: "#ffffff", pos: 50 }]); }
  function removeStop(i: number) { if (stops.length > 2) setStops(prev => prev.filter((_, idx) => idx !== i)); }

  function copy() { navigator.clipboard.writeText(`background: ${css};`); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="h-32 rounded-xl border border-[var(--border)]" style={{ background: css }} />
      <div className="flex gap-2">
        <button onClick={() => setType("linear")} className={type === "linear" ? "btn-primary text-sm" : "btn-secondary text-sm"}>Linear</button>
        <button onClick={() => setType("radial")} className={type === "radial" ? "btn-primary text-sm" : "btn-secondary text-sm"}>Radial</button>
      </div>
      {type === "linear" && (
        <div className="space-y-1">
          <label className="text-sm text-[var(--text)]">Angle: {angle}°</label>
          <input type="range" min={0} max={360} value={angle} className="w-full accent-brand-600" onChange={e => setAngle(+e.target.value)} />
        </div>
      )}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-[var(--text-muted)]">Color stops</label>
          <button onClick={addStop} className="btn-secondary text-xs py-1 px-2 min-h-0 flex items-center gap-1"><Plus size={12} />Add stop</button>
        </div>
        {stops.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="color" value={s.color} className="w-10 h-10 rounded border border-[var(--border)] p-0.5 cursor-pointer" onChange={e => updateStop(i, "color", e.target.value)} />
            <input type="number" min={0} max={100} value={s.pos} className="input w-20 text-sm" onChange={e => updateStop(i, "pos", +e.target.value)} />
            <span className="text-xs text-[var(--text-muted)]">%</span>
            <button onClick={() => removeStop(i)} disabled={stops.length <= 2} className="text-[var(--text-muted)] hover:text-red-500 disabled:opacity-30"><X size={14} /></button>
          </div>
        ))}
      </div>
      <div className="bg-[var(--bg-subtle)] rounded-lg p-3 flex items-center justify-between gap-2">
        <code className="text-xs font-mono text-[var(--text)] break-all">background: {css};</code>
        <button onClick={copy} className="btn-secondary text-xs py-1 px-2 min-h-0 shrink-0 flex items-center gap-1"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
      </div>
    </div>
  );
}
