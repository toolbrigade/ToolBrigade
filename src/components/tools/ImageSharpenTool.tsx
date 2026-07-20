"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

function convolve(src: ImageData, kernel: number[], w: number, h: number): ImageData {
  const dst = new ImageData(w, h);
  const kSize = Math.sqrt(kernel.length);
  const half = Math.floor(kSize / 2);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = 0; ky < kSize; ky++) {
        for (let kx = 0; kx < kSize; kx++) {
          const px = Math.min(w - 1, Math.max(0, x + kx - half));
          const py = Math.min(h - 1, Math.max(0, y + ky - half));
          const idx = (py * w + px) * 4;
          const k = kernel[ky * kSize + kx];
          r += src.data[idx] * k;
          g += src.data[idx + 1] * k;
          b += src.data[idx + 2] * k;
        }
      }
      const i = (y * w + x) * 4;
      dst.data[i] = Math.min(255, Math.max(0, r));
      dst.data[i + 1] = Math.min(255, Math.max(0, g));
      dst.data[i + 2] = Math.min(255, Math.max(0, b));
      dst.data[i + 3] = src.data[i + 3];
    }
  }
  return dst;
}

export default function ImageSharpenTool() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [strength, setStrength] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applySharpen(img: HTMLImageElement, s: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    const center = 1 + 4 * s;
    const edge = -s;
    const kernel = [0, edge, 0, edge, center, edge, 0, edge, 0];
    const sharpened = convolve(data, kernel, c.width, c.height);
    ctx.putImageData(sharpened, 0, 0);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; applySharpen(img, strength); URL.revokeObjectURL(url); };
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
            <label className="text-sm font-medium text-[var(--text)]">Sharpen strength: {strength}</label>
            <input type="range" min={1} max={5} step={0.5} value={strength} className="w-full accent-brand-600"
              onChange={e => { setStrength(+e.target.value); if (imgRef.current) applySharpen(imgRef.current, +e.target.value); }} />
          </div>
          {out && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original</p><img src={src} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Sharpened</p><img src={out} alt="sharpened" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            </div>
          )}
          {out && (
            <div className="flex justify-center">
              <button onClick={() => { const a = document.createElement("a"); a.href = out; a.download = `${name}-sharpened.png`; a.click(); }} className="btn-primary inline-flex items-center gap-2">
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
