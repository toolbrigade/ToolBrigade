"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageGrainEffect() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [intensity, setIntensity] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyGrain(img: HTMLImageElement, amt: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < data.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * amt * 2;
      data.data[i] = Math.min(255, Math.max(0, data.data[i] + noise));
      data.data[i + 1] = Math.min(255, Math.max(0, data.data[i + 1] + noise));
      data.data[i + 2] = Math.min(255, Math.max(0, data.data[i + 2] + noise));
    }
    ctx.putImageData(data, 0, 0);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; applyGrain(img, intensity); URL.revokeObjectURL(url); };
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
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Grain intensity: {intensity}</label>
            <input type="range" min={1} max={100} value={intensity} className="w-full accent-brand-600"
              onChange={e => { setIntensity(+e.target.value); if (imgRef.current) applyGrain(imgRef.current, +e.target.value); }} />
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="grain effect" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <button onClick={() => { const a = document.createElement("a"); a.href = out; a.download = `${name}-grain.png`; a.click(); }} className="btn-primary inline-flex items-center gap-2">
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
