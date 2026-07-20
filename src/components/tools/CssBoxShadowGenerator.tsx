"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function CssBoxShadowGenerator() {
  const [x, setX] = useState(4);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
  }

  const rgba = hexToRgba(color, opacity);
  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const css = `box-shadow: ${shadow};`;

  const sliders = [
    { label: "Horizontal (X)", value: x, set: setX, min: -50, max: 50 },
    { label: "Vertical (Y)", value: y, set: setY, min: -50, max: 50 },
    { label: "Blur", value: blur, set: setBlur, min: 0, max: 100 },
    { label: "Spread", value: spread, set: setSpread, min: -50, max: 50 },
    { label: "Opacity (%)", value: opacity, set: setOpacity, min: 0, max: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {sliders.map(s => (
            <div key={s.label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-[var(--text-muted)]">{s.label}</label>
                <span className="text-xs font-mono text-[var(--text)]">{s.value}{s.label.includes("%") ? "%" : "px"}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))}
                className="w-full accent-[var(--brand)]" />
            </div>
          ))}
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-16 rounded border border-[var(--border)] cursor-pointer" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-4">
              <input type="checkbox" checked={inset} onChange={e => setInset(e.target.checked)} className="accent-[var(--brand)]" />
              <span className="text-sm text-[var(--text)]">Inset</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 flex items-center justify-center bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)] min-h-[200px]">
            <div className="w-32 h-32 rounded-xl bg-white dark:bg-gray-700" style={{ boxShadow: shadow }} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">CSS</label>
              <CopyButton text={css} />
            </div>
            <pre className="textarea font-mono text-sm">{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
