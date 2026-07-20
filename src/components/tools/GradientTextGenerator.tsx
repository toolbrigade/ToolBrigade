"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function GradientTextGenerator() {
  const [text, setText] = useState("Gradient Text");
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [color3, setColor3] = useState("#f97316");
  const [useThree, setUseThree] = useState(false);
  const [angle, setAngle] = useState(90);
  const [fontSize, setFontSize] = useState(64);
  const [fontWeight, setFontWeight] = useState("bold");
  const [copied, setCopied] = useState(false);

  const gradient = useThree
    ? `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`
    : `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const css = `.gradient-text {
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
}`;

  function copy() {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">Preview text</label>
        <input className="input text-lg" value={text} onChange={e => setText(e.target.value)} placeholder="Your text here" />
      </div>
      <div className="bg-[var(--bg-subtle)] rounded-xl p-8 flex items-center justify-center min-h-[120px]">
        <span
          style={{
            background: gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: `${Math.min(fontSize, 80)}px`,
            fontWeight,
            lineHeight: 1.2,
            textAlign: "center",
            display: "block",
          }}
        >
          {text || "Gradient Text"}
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex gap-3 items-center flex-wrap">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Color 1</label>
              <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Color 2</label>
              <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            {useThree && (
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Color 3</label>
                <input type="color" value={color3} onChange={e => setColor3(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-[var(--border)]" />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={useThree} onChange={e => setUseThree(e.target.checked)} className="rounded" />
            <span className="text-[var(--text)]">Use 3 colors</span>
          </label>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Angle: {angle}°</label>
            <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full" />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Font size: {fontSize}px</label>
            <input type="range" min={16} max={120} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Font weight</label>
            <select className="input text-sm" value={fontWeight} onChange={e => setFontWeight(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="900">Black (900)</option>
            </select>
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
