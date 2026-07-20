"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

const PRESETS = [
  { label: "1:1", w: 1, h: 1 },
  { label: "4:5", w: 4, h: 5 },
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
];

export default function ImageCanvasExtender() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [blur, setBlur] = useState(false);
  const [customW, setCustomW] = useState(1);
  const [customH, setCustomH] = useState(1);
  const [preset, setPreset] = useState("1:1");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function render(ratioW: number, ratioH: number, color: string, useBlur: boolean) {
    const img = imgRef.current;
    if (!img) return;
    const c = canvasRef.current!;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const targetRatio = ratioW / ratioH;
    const imgRatio = iw / ih;
    let cw: number, ch: number;
    if (imgRatio > targetRatio) { cw = iw; ch = Math.round(iw / targetRatio); }
    else { ch = ih; cw = Math.round(ih * targetRatio); }
    c.width = cw; c.height = ch;
    const ctx = c.getContext("2d")!;
    if (useBlur) {
      ctx.filter = "blur(20px)";
      ctx.drawImage(img, -20, -20, cw + 40, ch + 40);
      ctx.filter = "none";
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, cw, ch);
    }
    const x = Math.round((cw - iw) / 2);
    const y = Math.round((ch - ih) / 2);
    ctx.drawImage(img, x, y);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { imgRef.current = img; render(1, 1, bgColor, blur); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function applyPreset(label: string) {
    setPreset(label);
    const p = PRESETS.find(p => p.label === label);
    if (p) render(p.w, p.h, bgColor, blur);
    else render(customW, customH, bgColor, blur);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {imgRef.current && (
        <>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => applyPreset(p.label)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${preset === p.label ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {p.label}
              </button>
            ))}
            <button onClick={() => { setPreset("custom"); render(customW, customH, bgColor, blur); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${preset === "custom" ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
              Custom
            </button>
          </div>
          {preset === "custom" && (
            <div className="flex gap-3 items-center">
              <input type="number" min={1} value={customW} className="input w-20" onChange={e => setCustomW(+e.target.value)} />
              <span className="text-[var(--text-muted)]">:</span>
              <input type="number" min={1} value={customH} className="input w-20" onChange={e => setCustomH(+e.target.value)} />
              <button onClick={() => render(customW, customH, bgColor, blur)} className="btn-primary text-sm">Apply</button>
            </div>
          )}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Background color</label>
              <input type="color" value={bgColor} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
                onChange={e => { setBgColor(e.target.value); if (!blur) { const p = PRESETS.find(p => p.label === preset); render(p?.w ?? customW, p?.h ?? customH, e.target.value, false); } }} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer mt-4">
              <input type="checkbox" checked={blur} onChange={e => { setBlur(e.target.checked); const p = PRESETS.find(p => p.label === preset); render(p?.w ?? customW, p?.h ?? customH, bgColor, e.target.checked); }} />
              Blurred-edge padding
            </label>
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="extended" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-extended.png`} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download PNG
              </a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
