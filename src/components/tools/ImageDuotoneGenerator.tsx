"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

function hexToRgb(hex: string) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

export default function ImageDuotoneGenerator() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [color1, setColor1] = useState("#1a1a2e");
  const [color2, setColor2] = useState("#e94560");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyDuotone(img: HTMLImageElement, c1: string, c2: string) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    const [r1, g1, b1] = hexToRgb(c1);
    const [r2, g2, b2] = hexToRgb(c2);
    for (let i = 0; i < data.data.length; i += 4) {
      const lum = (data.data[i] * 0.299 + data.data[i + 1] * 0.587 + data.data[i + 2] * 0.114) / 255;
      data.data[i] = Math.round(r1 + (r2 - r1) * lum);
      data.data[i + 1] = Math.round(g1 + (g2 - g1) * lum);
      data.data[i + 2] = Math.round(b1 + (b2 - b1) * lum);
    }
    ctx.putImageData(data, 0, 0);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; applyDuotone(img, color1, color2); URL.revokeObjectURL(url); };
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
          <div className="flex gap-6 items-center">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Shadow color</label>
              <input type="color" value={color1} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
                onChange={e => { setColor1(e.target.value); if (imgRef.current) applyDuotone(imgRef.current, e.target.value, color2); }} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Highlight color</label>
              <input type="color" value={color2} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
                onChange={e => { setColor2(e.target.value); if (imgRef.current) applyDuotone(imgRef.current, color1, e.target.value); }} />
            </div>
          </div>
          {out && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original</p><img src={src} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Duotone</p><img src={out} alt="duotone" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            </div>
          )}
          {out && (
            <div className="flex justify-center">
              <a href={out} download={`${name}-duotone.png`} className="btn-primary inline-flex items-center gap-2">
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
