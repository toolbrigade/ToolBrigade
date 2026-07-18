"use client";
import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(255 * c).toString(16).padStart(2, "0"); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(base: number, type: string): string[] {
  if (type === "monochromatic") return [20, 35, 50, 65, 80].map(l => hslToHex(base, 70, l));
  if (type === "analogous") return [-30, -15, 0, 15, 30].map(o => hslToHex((base + o + 360) % 360, 70, 55));
  if (type === "complementary") return [0, 15, 30].map(o => hslToHex((base + o) % 360, 70, 55)).concat([0, 15].map(o => hslToHex((base + 180 + o) % 360, 70, 55)));
  if (type === "triadic") return [0, 120, 240].flatMap(o => [hslToHex((base + o) % 360, 70, 45), hslToHex((base + o) % 360, 70, 65)]).slice(0, 5);
  return [0, 60, 120, 180, 240].map(o => hslToHex((base + o) % 360, 70, 55));
}

export default function ColorPaletteGenerator() {
  const [hue, setHue] = useState(220);
  const [type, setType] = useState("monochromatic");
  const [palette, setPalette] = useState<string[]>(() => generatePalette(220, "monochromatic"));
  const [copied, setCopied] = useState("");

  function generate() { setPalette(generatePalette(hue, type)); }
  function randomize() { const h = Math.floor(Math.random() * 360); setHue(h); setPalette(generatePalette(h, type)); }
  function copy(c: string) { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(""), 1500); }

  const types = ["monochromatic", "analogous", "complementary", "triadic", "rainbow"];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Base hue: {hue}°</label>
          <input type="range" min={0} max={359} value={hue} className="w-full mt-1 accent-brand-600" onChange={e => setHue(+e.target.value)} style={{ background: `hsl(${hue},70%,55%)` }} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Palette type</label>
          <select className="input mt-1" value={type} onChange={e => setType(e.target.value)}>
            {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={generate} className="btn-primary">Generate</button>
        <button onClick={randomize} className="btn-secondary flex items-center gap-2"><RefreshCw size={14} />Random</button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {palette.map((color, i) => (
          <div key={i} className="space-y-1">
            <div className="h-20 rounded-lg border border-[var(--border)] cursor-pointer hover:scale-105 transition-transform" style={{ background: color }} onClick={() => copy(color)} title="Click to copy" />
            <p className="text-xs font-mono text-center text-[var(--text-muted)]">{color}</p>
            <button onClick={() => copy(color)} className="w-full text-xs text-center text-brand-600 dark:text-brand-400 hover:underline flex items-center justify-center gap-0.5">
              <Copy size={10} />{copied === color ? "Copied!" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
