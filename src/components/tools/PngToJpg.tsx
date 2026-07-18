"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PngToJpg() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [quality, setQuality] = useState(92);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);

  function drawToCanvas(img: HTMLImageElement, q: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0);
    setOut(c.toDataURL("image/jpeg", q / 100));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; drawToCanvas(img, quality); };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PNG</span>
        <input type="file" accept="image/png" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {previewUrl && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Quality: {quality}%</label>
            <input type="range" min={1} max={100} value={quality} className="w-full accent-brand-600"
              onChange={e => { const q = +e.target.value; setQuality(q); if (imgRef.current) drawToCanvas(imgRef.current, q); }} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original PNG</p><img src={previewUrl} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Output JPG</p><img src={out} alt="output" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
          </div>
          <div className="flex justify-center">
            <a href={out} download={`${name}.jpg`} className="btn-primary flex items-center gap-2"><Download size={16} />Download JPG</a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
