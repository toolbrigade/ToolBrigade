"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

const SIZES = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [src, setSrc] = useState("");
  const [outputs, setOutputs] = useState<{ size: number; url: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      const results = SIZES.map(size => {
        const c = canvasRef.current!;
        c.width = size; c.height = size;
        c.getContext("2d")!.drawImage(img, 0, 0, size, size);
        return { size, url: c.toDataURL("image/png") };
      });
      setOutputs(results);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Upload image (square recommended)</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="source" className="w-24 h-24 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {outputs.map(({ size, url }) => (
              <div key={size} className="text-center space-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${size}px`} className="mx-auto rounded border border-[var(--border)] bg-[var(--bg-subtle)]" style={{ width: Math.min(size, 64), height: Math.min(size, 64) }} />
                <p className="text-xs text-[var(--text-muted)]">{size}×{size}</p>
                <a href={url} download={`favicon-${size}.png`} className="text-xs text-brand-600 dark:text-brand-400 flex items-center justify-center gap-0.5 hover:underline">
                  <Download size={10} />Save
                </a>
              </div>
            ))}
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
