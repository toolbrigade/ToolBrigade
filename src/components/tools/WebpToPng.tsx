"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function WebpToPng() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext("2d")!.drawImage(img, 0, 0);
      setOut(c.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload WebP</span>
        <input type="file" accept="image/webp" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original WebP</p><img src={src} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Output PNG</p><img src={out} alt="output" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
          </div>
          <div className="flex justify-center">
            <a href={out} download={`${name}.png`} className="btn-primary flex items-center gap-2"><Download size={16} />Download PNG</a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
