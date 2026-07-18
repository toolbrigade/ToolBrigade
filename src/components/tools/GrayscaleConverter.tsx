"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function GrayscaleConverter() {
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
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < data.data.length; i += 4) {
        const g = data.data[i] * 0.299 + data.data[i + 1] * 0.587 + data.data[i + 2] * 0.114;
        data.data[i] = data.data[i + 1] = data.data[i + 2] = g;
      }
      ctx.putImageData(data, 0, 0);
      setOut(c.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && out && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Original</p><img src={src} alt="original" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="text-center"><p className="text-xs text-[var(--text-muted)] mb-1">Grayscale</p><img src={out} alt="grayscale" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)]" /></div>
          </div>
          <div className="flex justify-center">
            <a href={out} download={`${name}-grayscale.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download Grayscale</a>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
