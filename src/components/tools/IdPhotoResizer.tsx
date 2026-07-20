"use client";
import { useState, useRef, useCallback } from "react";
import { Download, Upload } from "lucide-react";

const PRESETS = [
  { label: "US Passport (2×2 in)", w: 600, h: 600, dpi: 300, desc: "600×600px at 300 DPI" },
  { label: "UK Passport (35×45 mm)", w: 413, h: 531, dpi: 300, desc: "413×531px at 300 DPI" },
  { label: "Schengen Visa (35×45 mm)", w: 413, h: 531, dpi: 300, desc: "413×531px at 300 DPI" },
  { label: "India Passport (2×2 in)", w: 600, h: 600, dpi: 300, desc: "600×600px at 300 DPI" },
  { label: "Canada Passport (50×70 mm)", w: 591, h: 827, dpi: 300, desc: "591×827px at 300 DPI" },
  { label: "Australia Passport (35×45 mm)", w: 413, h: 531, dpi: 300, desc: "413×531px at 300 DPI" },
  { label: "China Visa (33×48 mm)", w: 390, h: 567, dpi: 300, desc: "390×567px at 300 DPI" },
  { label: "LinkedIn Profile (400×400 px)", w: 400, h: 400, dpi: 72, desc: "400×400px" },
];

export default function IdPhotoResizer() {
  const [preset, setPreset] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        imgRef.current = img;
        setImgSrc(src);
        setCropX(0);
        setCropY(0);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  function renderCrop() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const p = PRESETS[preset];
    canvas.width = p.w;
    canvas.height = p.h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, p.w, p.h);

    // Scale to fit height, center horizontally
    const scale = p.h / img.height;
    const scaledW = img.width * scale;
    const offsetX = (p.w - scaledW) / 2 + cropX;
    ctx.drawImage(img, offsetX, cropY, scaledW, p.h);
  }

  function download() {
    renderCrop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/jpeg", 0.95);
    a.download = `id-photo-${PRESETS[preset].label.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.jpg`;
    a.click();
  }

  const p = PRESETS[preset];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">Photo size preset</label>
        <select className="input" value={preset} onChange={e => setPreset(+e.target.value)}>
          {PRESETS.map((p, i) => (
            <option key={i} value={i}>{p.label} — {p.desc}</option>
          ))}
        </select>
      </div>

      {!imgSrc ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-8 cursor-pointer hover:border-brand-500 transition-colors">
          <Upload size={32} className="text-[var(--text-muted)] mb-2" />
          <span className="text-sm text-[var(--text-muted)]">Click to upload photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Original: {origW}×{origH}px → Target: {p.w}×{p.h}px</p>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Horizontal offset: {cropX}px</label>
                <input type="range" min={-origW / 2} max={origW / 2} value={cropX} onChange={e => setCropX(+e.target.value)} className="w-full" />
              </div>
              <div className="mt-2">
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Vertical offset: {cropY}px</label>
                <input type="range" min={-origH / 2} max={origH / 2} value={cropY} onChange={e => setCropY(+e.target.value)} className="w-full" />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={renderCrop} className="btn-secondary text-sm flex-1">Preview</button>
                <button onClick={download} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                  <Download size={14} />Download
                </button>
              </div>
              <button onClick={() => setImgSrc(null)} className="btn-secondary text-xs w-full mt-2">Upload different photo</button>
            </div>
            <div className="flex flex-col items-center gap-2">
              <canvas ref={canvasRef} className="rounded-lg border border-[var(--border)] max-w-full" style={{ maxHeight: 300 }} />
              <p className="text-xs text-[var(--text-muted)]">Preview (click Preview to update)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
