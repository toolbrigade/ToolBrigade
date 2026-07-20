"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) return null;
  const l1 = relativeLuminance(...fgRgb);
  const l2 = relativeLuminance(...bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${pass ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"}`}>
      <span>{pass ? "✓" : "✗"}</span>
      <span>{label}</span>
    </div>
  );
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState("#1e293b");
  const [bg, setBg] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const ratio = contrastRatio(fg, bg);
  const ratioStr = ratio ? ratio.toFixed(2) : "—";

  const aaLarge = ratio ? ratio >= 3 : false;
  const aaNormal = ratio ? ratio >= 4.5 : false;
  const aaaLarge = ratio ? ratio >= 4.5 : false;
  const aaaNormal = ratio ? ratio >= 7 : false;

  function copyRatio() {
    navigator.clipboard.writeText(`${ratioStr}:1`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Foreground (text) color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-[var(--border)]" />
            <input className="input font-mono text-sm" value={fg} onChange={e => setFg(e.target.value)} maxLength={7} />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Background color</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-[var(--border)]" />
            <input className="input font-mono text-sm" value={bg} onChange={e => setBg(e.target.value)} maxLength={7} />
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl p-6 border border-[var(--border)]" style={{ background: bg }}>
        <p className="text-2xl font-bold mb-1" style={{ color: fg }}>Large Text Sample (18pt+)</p>
        <p className="text-base" style={{ color: fg }}>Normal text sample — The quick brown fox jumps over the lazy dog.</p>
        <p className="text-sm mt-1" style={{ color: fg }}>Small text — Lorem ipsum dolor sit amet consectetur.</p>
      </div>

      {/* Ratio */}
      <div className="flex items-center gap-3">
        <div className="bg-[var(--bg-subtle)] rounded-xl px-6 py-4 text-center">
          <p className="text-xs text-[var(--text-muted)] mb-1">Contrast Ratio</p>
          <p className="text-4xl font-bold font-mono text-[var(--text)]">{ratioStr}<span className="text-xl">:1</span></p>
        </div>
        <button onClick={copyRatio} className="btn-secondary flex items-center gap-1 text-xs">
          <Copy size={12} />{copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* WCAG results */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">WCAG 2.1 Results</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Badge pass={aaNormal} label="AA Normal text" />
          <Badge pass={aaLarge} label="AA Large text" />
          <Badge pass={aaaNormal} label="AAA Normal text" />
          <Badge pass={aaaLarge} label="AAA Large text" />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          AA requires 4.5:1 (normal) / 3:1 (large ≥18pt or 14pt bold). AAA requires 7:1 (normal) / 4.5:1 (large).
        </p>
      </div>
    </div>
  );
}
