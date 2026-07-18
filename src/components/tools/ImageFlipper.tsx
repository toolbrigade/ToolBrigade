"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageFlipper() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function flip(img: HTMLImageElement, h: boolean, v: boolean) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.save();
    ctx.translate(h ? c.width : 0, v ? c.height : 0);
    ctx.scale(h ? -1 : 1, v ? -1 : 1);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; flip(img, false, false); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function toggle(axis: "h" | "v") {
    const newH = axis === "h" ? !flipH : flipH;
    const newV = axis === "v" ? !flipV : flipV;
    setFlipH(newH); setFlipV(newV);
    if (imgRef.current) flip(imgRef.current, newH, newV);
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
          <div className="flex gap-3">
            <button onClick={() => toggle("h")} className={flipH ? "btn-primary" : "btn-secondary"}>↔ Flip Horizontal</button>
            <button onClick={() => toggle("v")} className={flipV ? "btn-primary" : "btn-secondary"}>↕ Flip Vertical</button>
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="flipped" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-flipped.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download</a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
