"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

const PRESETS = [
  { label: "Instagram Post", w: 1080, h: 1080 },
  { label: "Instagram Story", w: 1080, h: 1920 },
  { label: "Twitter/X Post", w: 1200, h: 675 },
  { label: "LinkedIn Post", w: 1200, h: 627 },
  { label: "YouTube Thumbnail", w: 1280, h: 720 },
  { label: "Facebook Cover", w: 820, h: 312 },
];

type Mode = "crop" | "fit" | "pad";

export default function SocialMediaResizer() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [preset, setPreset] = useState(PRESETS[0]);
  const [mode, setMode] = useState<Mode>("fit");
  const [padColor, setPadColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function render(p: typeof PRESETS[0], m: Mode, color: string) {
    const img = imgRef.current;
    if (!img) return;
    const c = canvasRef.current!;
    c.width = p.w; c.height = p.h;
    const ctx = c.getContext("2d")!;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    if (m === "crop") {
      const scale = Math.max(p.w / iw, p.h / ih);
      const sw = p.w / scale, sh = p.h / scale;
      const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, p.w, p.h);
    } else if (m === "fit") {
      const scale = Math.min(p.w / iw, p.h / ih);
      const dw = iw * scale, dh = ih * scale;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.drawImage(img, (p.w - dw) / 2, (p.h - dh) / 2, dw, dh);
    } else {
      const scale = Math.min(p.w / iw, p.h / ih);
      const dw = iw * scale, dh = ih * scale;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, p.w, p.h);
      ctx.drawImage(img, (p.w - dw) / 2, (p.h - dh) / 2, dw, dh);
    }
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { imgRef.current = img; render(preset, mode, padColor); URL.revokeObjectURL(url); };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Platform preset</label>
          <select className="input w-full" value={preset.label}
            onChange={e => { const p = PRESETS.find(p => p.label === e.target.value)!; setPreset(p); render(p, mode, padColor); }}>
            {PRESETS.map(p => <option key={p.label}>{p.label} ({p.w}×{p.h})</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Fit mode</label>
          <div className="flex gap-2">
            {(["crop", "fit", "pad"] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); render(preset, m, padColor); }}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${mode === m ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      {mode === "pad" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Pad color</label>
          <input type="color" value={padColor} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
            onChange={e => { setPadColor(e.target.value); render(preset, mode, e.target.value); }} />
        </div>
      )}
      {out && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="resized" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <p className="text-xs text-[var(--text-muted)]">{preset.w}×{preset.h}px</p>
          <a href={out} download={`${name}-${preset.label.replace(/\//g, "-").replace(/ /g, "-")}.png`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download PNG
          </a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
