"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function HeicToJpg() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFile(file: File) {
    setError(""); setOut(""); setLoading(true);
    setName(file.name.replace(/\.[^.]+$/, ""));
    try {
      // Dynamically load heic2any only when needed
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.92 }) as Blob;
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const c = canvasRef.current!;
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext("2d")!.drawImage(img, 0, 0);
        setOut(c.toDataURL("image/jpeg", 0.92));
        URL.revokeObjectURL(url);
        setLoading(false);
      };
      img.src = url;
    } catch {
      setError("Could not convert this file. Make sure it is a valid HEIC/HEIF image.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload HEIC / HEIF</span>
        <p className="text-xs">Taken on iPhone? This converts it to JPG.</p>
        <input type="file" accept=".heic,.heif,image/heic,image/heif" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Converting… this may take a moment.</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {out && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="converted" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <a href={out} download={`${name}.jpg`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download JPG</a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
