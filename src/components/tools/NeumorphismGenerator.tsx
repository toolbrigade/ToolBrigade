"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function hexToRgb(hex: string) {
  const m = hex.replace("#","").match(/([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
  return m ? [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)] : [200,200,200];
}
function lighten(hex: string, amt: number) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex: string, amt: number) {
  const [r,g,b] = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

export default function NeumorphismGenerator() {
  const [mode, setMode] = useState<"neumorphism"|"glassmorphism">("neumorphism");
  // Neumorphism
  const [bgColor, setBgColor] = useState("#e0e5ec");
  const [distance, setDistance] = useState(10);
  const [blur, setBlur] = useState(20);
  const [intensity, setIntensity] = useState(0.15);
  const [shape, setShape] = useState<"flat"|"concave"|"convex">("flat");
  // Glassmorphism
  const [glassBlur, setGlassBlur] = useState(12);
  const [glassBg, setGlassBg] = useState("#ffffff");
  const [glassOpacity, setGlassOpacity] = useState(20);
  const [glassBorder, setGlassBorder] = useState(20);
  const [copied, setCopied] = useState(false);

  const lightShadow = lighten(bgColor, Math.round(intensity * 255));
  const darkShadow = darken(bgColor, Math.round(intensity * 255));

  const neuCSS = `background: ${bgColor};
border-radius: 16px;
box-shadow: ${distance}px ${distance}px ${blur}px ${darkShadow},
            -${distance}px -${distance}px ${blur}px ${lightShadow};`;

  const [gr,gg,gb] = hexToRgb(glassBg);
  const glassCSS = `background: rgba(${gr}, ${gg}, ${gb}, ${glassOpacity/100});
backdrop-filter: blur(${glassBlur}px);
-webkit-backdrop-filter: blur(${glassBlur}px);
border-radius: 16px;
border: 1px solid rgba(${gr}, ${gg}, ${gb}, ${glassBorder/100});
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);`;

  function copy() {
    navigator.clipboard.writeText(mode === "neumorphism" ? neuCSS : glassCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button onClick={() => setMode("neumorphism")} className={mode === "neumorphism" ? "btn-primary" : "btn-secondary"}>Neumorphism</button>
        <button onClick={() => setMode("glassmorphism")} className={mode === "glassmorphism" ? "btn-primary" : "btn-secondary"}>Glassmorphism</button>
      </div>

      {mode === "neumorphism" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Background color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-[var(--border)]" />
                <span className="text-sm font-mono text-[var(--text)]">{bgColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Distance: {distance}px</label>
              <input type="range" min={2} max={30} value={distance} onChange={e => setDistance(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Blur: {blur}px</label>
              <input type="range" min={5} max={60} value={blur} onChange={e => setBlur(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Intensity: {Math.round(intensity*100)}%</label>
              <input type="range" min={5} max={40} value={Math.round(intensity*100)} onChange={e => setIntensity(+e.target.value/100)} className="w-full" />
            </div>
          </div>
          <div className="flex items-center justify-center" style={{ background: bgColor, borderRadius: 16, minHeight: 200 }}>
            <div style={{
              width: 120, height: 120, borderRadius: 16,
              background: bgColor,
              boxShadow: `${distance}px ${distance}px ${blur}px ${darkShadow}, -${distance}px -${distance}px ${blur}px ${lightShadow}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: darken(bgColor, 60),
            }}>
              Preview
            </div>
          </div>
        </div>
      )}

      {mode === "glassmorphism" && (
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Glass color</label>
              <input type="color" value={glassBg} onChange={e => setGlassBg(e.target.value)} className="h-9 w-14 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Blur: {glassBlur}px</label>
              <input type="range" min={2} max={40} value={glassBlur} onChange={e => setGlassBlur(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Opacity: {glassOpacity}%</label>
              <input type="range" min={5} max={60} value={glassOpacity} onChange={e => setGlassOpacity(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Border opacity: {glassBorder}%</label>
              <input type="range" min={5} max={60} value={glassBorder} onChange={e => setGlassBorder(+e.target.value)} className="w-full" />
            </div>
          </div>
          <div className="flex items-center justify-center rounded-xl min-h-[200px]" style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)" }}>
            <div style={{
              width: 140, height: 140, borderRadius: 16,
              background: `rgba(${gr},${gg},${gb},${glassOpacity/100})`,
              backdropFilter: `blur(${glassBlur}px)`,
              WebkitBackdropFilter: `blur(${glassBlur}px)`,
              border: `1px solid rgba(${gr},${gg},${gb},${glassBorder/100})`,
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 13,
            }}>
              Glass Card
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-[var(--text-muted)]">Generated CSS</label>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
            <Copy size={12} />{copied ? "Copied!" : "Copy CSS"}
          </button>
        </div>
        <pre className="bg-[var(--bg-subtle)] rounded-xl p-4 text-xs font-mono text-[var(--text)] overflow-x-auto whitespace-pre-wrap">
          {mode === "neumorphism" ? neuCSS : glassCSS}
        </pre>
      </div>
    </div>
  );
}
