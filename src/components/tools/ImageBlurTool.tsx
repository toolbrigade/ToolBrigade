"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageBlurTool() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [blurAmount, setBlurAmount] = useState(5);
  const [mode, setMode] = useState<"full" | "region">("full");
  const [region, setRegion] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPt, setStartPt] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyFullBlur(img: HTMLImageElement, amt: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.filter = `blur(${amt}px)`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = "none";
    setOut(c.toDataURL("image/png"));
  }

  function applyRegionBlur(img: HTMLImageElement, r: { x: number; y: number; w: number; h: number }, amt: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.save();
    ctx.filter = `blur(${amt}px)`;
    ctx.drawImage(img, r.x, r.y, r.w, r.h, r.x, r.y, r.w, r.h);
    ctx.restore();
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      if (mode === "full") applyFullBlur(img, blurAmount);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function getScaledCoords(e: React.MouseEvent<HTMLCanvasElement>) {
    const ov = overlayRef.current!;
    const rect = ov.getBoundingClientRect();
    const scaleX = ov.width / rect.width;
    const scaleY = ov.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const pt = getScaledCoords(e);
    setStartPt(pt); setDrawing(true);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const pt = getScaledCoords(e);
    const ov = overlayRef.current!;
    const ctx = ov.getContext("2d")!;
    ctx.clearRect(0, 0, ov.width, ov.height);
    ctx.strokeStyle = "rgba(255,100,100,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(startPt.x, startPt.y, pt.x - startPt.x, pt.y - startPt.y);
  }

  function onMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    setDrawing(false);
    const pt = getScaledCoords(e);
    const r = { x: Math.min(startPt.x, pt.x), y: Math.min(startPt.y, pt.y), w: Math.abs(pt.x - startPt.x), h: Math.abs(pt.y - startPt.y) };
    setRegion(r);
    if (imgRef.current && r.w > 0 && r.h > 0) applyRegionBlur(imgRef.current, r, blurAmount);
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
          <div className="flex gap-2">
            {(["full", "region"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); if (m === "full" && imgRef.current) applyFullBlur(imgRef.current, blurAmount); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${mode === m ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {m === "full" ? "Full image" : "Click-to-blur region"}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Blur amount: {blurAmount}px</label>
            <input type="range" min={1} max={40} value={blurAmount} className="w-full accent-brand-600"
              onChange={e => {
                setBlurAmount(+e.target.value);
                if (mode === "full" && imgRef.current) applyFullBlur(imgRef.current, +e.target.value);
                else if (mode === "region" && region && imgRef.current) applyRegionBlur(imgRef.current, region, +e.target.value);
              }} />
          </div>
          {mode === "region" && (
            <div className="relative inline-block max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="source" className="max-w-full max-h-80 rounded-lg border border-[var(--border)]" />
              <canvas ref={overlayRef}
                width={imgRef.current?.naturalWidth} height={imgRef.current?.naturalHeight}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
              <p className="text-xs text-[var(--text-muted)] mt-1">Draw a rectangle over the area to blur (useful for redacting faces or sensitive info).</p>
            </div>
          )}
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="blurred" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-blurred.png`} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download PNG
              </a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
