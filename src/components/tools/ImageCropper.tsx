"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageCropper() {
  const [src, setSrc] = useState("");
  const [name, setName] = useState("image");
  const [x, setX] = useState(0); const [y, setY] = useState(0);
  const [w, setW] = useState(200); const [h, setH] = useState(200);
  const [natW, setNatW] = useState(0); const [natH, setNatH] = useState(0);
  const [out, setOut] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    setOut("");
    const img = new Image();
    img.onload = () => { setNatW(img.naturalWidth); setNatH(img.naturalHeight); setW(Math.min(200, img.naturalWidth)); setH(Math.min(200, img.naturalHeight)); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function crop() {
    const img = imgRef.current!;
    const c = canvasRef.current!;
    c.width = w; c.height = h;
    c.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
    setOut(c.toDataURL("image/png"));
  }

  const field = (label: string, val: number, set: (n: number) => void, max: number) => (
    <div>
      <label className="text-xs text-[var(--text-muted)]">{label}</label>
      <input type="number" min={0} max={max} value={val} className="input mt-1" onChange={e => set(Math.min(+e.target.value, max))} />
    </div>
  );

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={src} alt="source" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <p className="text-xs text-[var(--text-muted)] text-center">Image size: {natW} × {natH}px</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {field("X (px)", x, setX, natW)} {field("Y (px)", y, setY, natH)}
            {field("Width (px)", w, setW, natW - x)} {field("Height (px)", h, setH, natH - y)}
          </div>
          <button onClick={crop} className="btn-primary w-full">Crop Image</button>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="cropped" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-cropped.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download Cropped</a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
