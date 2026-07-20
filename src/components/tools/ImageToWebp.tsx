"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function ImageToWebp() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [quality, setQuality] = useState(85);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [preview, setPreview] = useState("");
  const [startTime] = useState(Date.now());

  function draw(img: HTMLImageElement, q: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext("2d")!.drawImage(img, 0, 0);
    setOut(c.toDataURL("image/webp", q / 100));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(img, quality); trackTaskComplete("image-to-webp", startTime); };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image (PNG, JPG, GIF…)</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {preview && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Quality: {quality}%</label>
            <input type="range" min={1} max={100} value={quality} className="w-full accent-brand-600"
              onChange={e => { const q = +e.target.value; setQuality(q); if (imgRef.current) draw(imgRef.current, q); }} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original</p><img src={preview} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">WebP Output</p><img src={out} alt="webp" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
          </div>
          <div className="flex justify-center">
            <a href={out} download={`${name}.webp`} className="btn-primary flex items-center gap-2"><Download size={16} />Download WebP</a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
