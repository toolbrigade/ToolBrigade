"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");

  const isValid = /^#[0-9a-fA-F]{6}$/.test(hex);
  const rgb = isValid ? hexToRgb(hex) : null;
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input type="color" value={isValid ? hex : "#000000"} onChange={(e) => setHex(e.target.value)} className="w-14 h-14 rounded-lg border border-[var(--border)] cursor-pointer bg-transparent" />
        <div className="flex-1">
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">HEX</label>
          <input type="text" className="input font-mono" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#3b82f6" maxLength={7} />
        </div>
      </div>

      {isValid && rgb && hsl ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            { label: "RGB Object", value: `r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}` },
            { label: "HSL Object", value: `h: ${hsl.h}°, s: ${hsl.s}%, l: ${hsl.l}%` },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--bg-subtle)] rounded-lg p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">{item.label}</p>
                <p className="font-mono text-sm text-[var(--text)]">{item.value}</p>
              </div>
              <CopyButton text={item.value} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-red-500">Enter a valid 6-digit HEX color.</p>
      )}

      {isValid && (
        <div className="h-16 rounded-xl border border-[var(--border)]" style={{ backgroundColor: hex }} />
      )}
    </div>
  );
}
