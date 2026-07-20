"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImagePixelator() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [blockSize, setBlockSize] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyPixelate(img: HTMLImageElement, bs: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    // Draw small then scale up for pixelation
    const w = Math.max(1, Math.floor(img.naturalWidth / bs));
    const h = Math.max(1, Math.floor(img.naturalHeight / bs));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.drawImage(c, 0, 0, w, h, 0, 0, c.width, c.height);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; applyPixelate(img, blockSize); URL.revokeObjectURL(url); };
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
            <label className="text-sm font-medium text-[var(--text)]">Block size: {blockSize}px</label>
            <input type="range" min={2} max={64} value={blockSize} className="w-full accent-brand-600"
              onChange={e => { setBlockSize(+e.target.value); if (imgRef.current) applyPixelate(imgRef.current, +e.target.value); }} />
          </div>
          {out && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original</p><img src={src} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Pixelated</p><img src={out} alt="pixelated" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            </div>
          )}
          {out && (
            <div className="flex justify-center">
              <a href={out} download={`${name}-pixelated.png`} className="btn-primary inline-flex items-center gap-2">
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
