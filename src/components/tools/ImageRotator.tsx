"use client";
import { useRef, useState } from "react";
import { Upload, Download, RotateCw } from "lucide-react";

export default function ImageRotator() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [angle, setAngle] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function rotate(img: HTMLImageElement, deg: number) {
    const rad = (deg * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad)); const cos = Math.abs(Math.cos(rad));
    const w = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
    const h = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
    const c = canvasRef.current!;
    c.width = w; c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; rotate(img, 0); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function applyAngle(a: number) {
    setAngle(a);
    if (imgRef.current) rotate(imgRef.current, a);
  }

  const presets = [90, 180, 270];

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text)]">Rotation: {angle}°</label>
            <input type="range" min={0} max={359} value={angle} className="w-full accent-brand-600" onChange={e => applyAngle(+e.target.value)} />
            <div className="flex gap-2">
              {presets.map(p => (
                <button key={p} onClick={() => applyAngle(p)} className="btn-secondary flex items-center gap-1 text-sm">
                  <RotateCw size={14} />{p}°
                </button>
              ))}
              <button onClick={() => applyAngle(0)} className="btn-secondary text-sm">Reset</button>
            </div>
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="rotated" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-rotated.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download</a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
