"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [quality, setQuality] = useState(80);
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const compress = useCallback((file: File, q: number) => {
    setLoading(true);
    setError("");
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob) { setLoading(false); return; }
          setCompressed({ url: URL.createObjectURL(blob), size: blob.size });
          setLoading(false);
        },
        mime,
        q / 100
      );
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }, []);

  function handleFile(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      setError(`Unsupported format: ${file.type || "unknown"}. Please use JPG, PNG, or WebP.`);
      return;
    }
    setError("");
    setCompressed(null);
    setOriginal({ url: URL.createObjectURL(file), size: file.size, name: file.name });
    compress(file, quality);
  }

  const fileRef = useRef<File | null>(null);

  function handleFileInput(file: File) {
    fileRef.current = file;
    handleFile(file);
  }

  function applyQuality(q: number) {
    setQuality(q);
    if (fileRef.current) compress(fileRef.current, q);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileInput(file);
  }

  const saving = original && compressed ? Math.round((1 - compressed.size / original.size) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => document.getElementById("compressor-upload")?.click()}
        onKeyDown={(e) => e.key === "Enter" && document.getElementById("compressor-upload")?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20" : "border-[var(--border)] hover:border-brand-400"
        }`}
      >
        {original ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={original.url} alt="Original preview" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
            <Upload size={28} />
            <p className="text-sm font-medium">Drop an image or click to upload</p>
            <p className="text-xs">JPG, PNG, WebP supported</p>
          </div>
        )}
        <input
          id="compressor-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileInput(e.target.files[0])}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {original && (
        <>
          {/* Quality slider */}
          <div className="space-y-1">
            <label htmlFor="quality-slider" className="text-sm font-medium text-[var(--text)]">
              Compression Quality: <span className="text-brand-600 dark:text-brand-400">{quality}%</span>
            </label>
            <input
              id="quality-slider"
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => applyQuality(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)]">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
              <p className="text-sm font-semibold text-[var(--text)]">{fmt(original.size)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Original</p>
            </div>
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
              <p className="text-sm font-semibold text-[var(--text)]">
                {loading ? "…" : compressed ? fmt(compressed.size) : "—"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Compressed</p>
            </div>
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
              <p className={`text-sm font-semibold ${saving > 0 ? "text-green-600 dark:text-green-400" : "text-[var(--text)]"}`}>
                {loading ? "…" : compressed ? `${saving > 0 ? "-" : ""}${Math.abs(saving)}%` : "—"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Saved</p>
            </div>
          </div>

          {/* Preview + download */}
          {compressed && !loading && (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={compressed.url} alt="Compressed preview" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <div className="flex justify-center">
                <a
                  href={compressed.url}
                  download={`compressed-${original.name}`}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Compressed
                </a>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-6 text-[var(--text-muted)] text-sm gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
              Processing…
            </div>
          )}
        </>
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
