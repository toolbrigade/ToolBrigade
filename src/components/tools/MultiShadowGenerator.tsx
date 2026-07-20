"use client";
import { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";

type Shadow = { x: number; y: number; blur: number; spread: number; color: string; inset: boolean };

const DEFAULT: Shadow = { x: 4, y: 4, blur: 8, spread: 0, color: "#00000033", inset: false };

export default function MultiShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 0, y: 4, blur: 6, spread: -1, color: "#00000033", inset: false },
    { x: 0, y: 10, blur: 15, spread: -3, color: "#0000001a", inset: false },
  ]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [boxColor, setBoxColor] = useState("#6366f1");
  const [copied, setCopied] = useState(false);

  const shadowStr = shadows.map(s =>
    `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`
  ).join(",\n  ");

  const css = `box-shadow: ${shadowStr};`;

  function add() {
    setShadows(s => [...s, { ...DEFAULT }]);
  }
  function remove(i: number) {
    setShadows(s => s.filter((_, idx) => idx !== i));
  }
  function update(i: number, key: keyof Shadow, val: string | number | boolean) {
    setShadows(s => s.map((sh, idx) => idx === i ? { ...sh, [key]: val } : sh));
  }
  function copy() {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[var(--text)]">Shadow Layers ({shadows.length})</h3>
            <button onClick={add} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Plus size={12} />Add layer
            </button>
          </div>
          {shadows.map((s, i) => (
            <div key={i} className="bg-[var(--bg-subtle)] rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-[var(--text)]">Layer {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-[var(--text-muted)] cursor-pointer">
                    <input type="checkbox" checked={s.inset} onChange={e => update(i, "inset", e.target.checked)} className="rounded" />
                    inset
                  </label>
                  <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(["x","y","blur","spread"] as const).map(k => (
                  <div key={k}>
                    <label className="text-[var(--text-muted)] block mb-0.5">{k}: {s[k]}px</label>
                    <input type="range" min={k === "spread" ? -30 : 0} max={k === "x" || k === "y" ? 60 : 80} value={s[k] as number}
                      onChange={e => update(i, k, +e.target.value)} className="w-full" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[var(--text-muted)]">Color</label>
                <input type="color" value={s.color.slice(0,7)} onChange={e => update(i, "color", e.target.value + s.color.slice(7))} className="h-7 w-10 rounded cursor-pointer border border-[var(--border)]" />
                <input className="input text-xs font-mono flex-1" value={s.color} onChange={e => update(i, "color", e.target.value)} maxLength={9} />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-center">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Page bg</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Box color</label>
              <input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-[var(--border)]" />
            </div>
          </div>
          <div className="rounded-xl flex items-center justify-center" style={{ background: bgColor, minHeight: 220 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 12,
              background: boxColor,
              boxShadow: shadows.map(s => `${s.inset?"inset ":""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`).join(", "),
            }} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-[var(--text-muted)]">Generated CSS</label>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
            <Copy size={12} />{copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
        <pre className="bg-[var(--bg-subtle)] rounded-xl p-4 text-xs font-mono text-[var(--text)] overflow-x-auto whitespace-pre-wrap">{css}</pre>
      </div>
    </div>
  );
}
