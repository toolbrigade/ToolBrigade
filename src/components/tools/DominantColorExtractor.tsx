"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

function quantize(r: number, g: number, b: number, buckets: number) {
  const step = 256 / buckets;
  return `${Math.floor(r / step)},${Math.floor(g / step)},${Math.floor(b / step)}`;
}

function toHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

export default function DominantColorExtractor() {
  const [palette, setPalette] = useState<string[]>([]);
  const [paletteUrl, setPaletteUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palCanvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      const maxSize = 100;
      const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight, 1);
      c.width = Math.floor(img.naturalWidth * scale);
      c.height = Math.floor(img.naturalHeight * scale);
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const counts: Record<string, { r: number; g: number; b: number; count: number }> = {};
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const key = quantize(data[i], data[i + 1], data[i + 2], 16);
        if (!counts[key]) counts[key] = { r: 0, g: 0, b: 0, count: 0 };
        counts[key].r += data[i]; counts[key].g += data[i + 1]; counts[key].b += data[i + 2]; counts[key].count++;
      }
      const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
      const colors = sorted.map(e => toHex(Math.round(e.r / e.count), Math.round(e.g / e.count), Math.round(e.b / e.count)));
      setPalette(colors);
      // Draw palette image
      const pc = palCanvasRef.current!;
      pc.width = colors.length * 80; pc.height = 80;
      const pctx = pc.getContext("2d")!;
      colors.forEach((col, i) => { pctx.fillStyle = col; pctx.fillRect(i * 80, 0, 80, 80); });
      setPaletteUrl(pc.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function copyHex(hex: string) { navigator.clipboard.writeText(hex); }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {palette.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {palette.map((hex, i) => (
              <button key={i} onClick={() => copyHex(hex)} title="Click to copy"
                className="flex flex-col items-center gap-1 group">
                <div className="w-16 h-16 rounded-lg border border-[var(--border)] shadow-sm group-hover:scale-105 transition-transform" style={{ background: hex }} />
                <span className="text-xs font-mono text-[var(--text-muted)]">{hex}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)]">Click any swatch to copy its hex code.</p>
          {paletteUrl && (
            <a href={paletteUrl} download="palette.png" className="btn-primary inline-flex items-center gap-2">
              <Download size={16} />Download Palette Image
            </a>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={palCanvasRef} className="hidden" />
    </div>
  );
}
