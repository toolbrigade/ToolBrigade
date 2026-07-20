"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageVignetteGenerator() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [intensity, setIntensity] = useState(0.7);
  const [size, setSize] = useState(0.7);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyVignette(img: HTMLImageElement, intens: number, sz: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const cx = c.width / 2, cy = c.height / 2;
    const r = Math.sqrt(cx * cx + cy * cy) * sz;
    const grad = ctx.createRadialGradient(cx, cy, r * (1 - intens * 0.5), cx, cy, r);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, `rgba(0,0,0,${intens})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, c.width, c.height);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; applyVignette(img, intensity, size); URL.revokeObjectURL(url); };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Intensity: {Math.round(intensity * 100)}%</label>
              <input type="range" min={0.1} max={1} step={0.05} value={intensity} className="w-full accent-brand-600"
                onChange={e => { setIntensity(+e.target.value); if (imgRef.current) applyVignette(imgRef.current, +e.target.value, size); }} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Size: {Math.round(size * 100)}%</label>
              <input type="range" min={0.3} max={1.2} step={0.05} value={size} className="w-full accent-brand-600"
                onChange={e => { setSize(+e.target.value); if (imgRef.current) applyVignette(imgRef.current, intensity, +e.target.value); }} />
            </div>
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="vignette" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <button onClick={() => { const a = document.createElement("a"); a.href = out; a.download = `${name}-vignette.png`; a.click(); }} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download PNG
              </button>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
