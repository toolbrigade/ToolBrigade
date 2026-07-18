"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export default function ImageResizer() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [preview, setPreview] = useState("");
  const [original, setOriginal] = useState<{ w: number; h: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setOriginal({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(String(img.naturalWidth));
      setHeight(String(img.naturalHeight));
      setPreview(url);
    };
    img.src = url;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  }

  function resize() {
    if (!preview || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.onload = () => {
      canvas.width = parseInt(width) || img.naturalWidth;
      canvas.height = parseInt(height) || img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement("a");
      link.download = "resized.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = preview;
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("img-upload")?.click()}
        className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
            <Upload size={28} />
            <p className="text-sm">Drop an image or click to upload</p>
          </div>
        )}
        <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {original && (
        <p className="text-xs text-[var(--text-muted)]">Original: {original.w} × {original.h}px</p>
      )}

      <div className="flex gap-3 items-end">
        <div>
          <label htmlFor="resize-width" className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Width (px)</label>
          <input id="resize-width" type="number" className="input w-32" value={width} onChange={(e) => setWidth(e.target.value)} />
        </div>
        <span className="text-[var(--text-muted)] mb-3">×</span>
        <div>
          <label htmlFor="resize-height" className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Height (px)</label>
          <input id="resize-height" type="number" className="input w-32" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <button onClick={resize} disabled={!preview} className="btn-primary disabled:opacity-50">
          Download Resized
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
