"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageWatermark() {
  const [src, setSrc] = useState("");
  const [name, setName] = useState("image");
  const [text, setText] = useState("© ToolBrigade");
  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function draw(img: HTMLImageElement, t: string, op: number, pos: string, size: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = op / 100;
    ctx.font = `bold ${size}px Arial, sans-serif`;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = size / 12;
    const pad = 20;
    const tw = ctx.measureText(t).width;
    let x = pad, y = size + pad;
    if (pos === "top-right") { x = c.width - tw - pad; y = size + pad; }
    else if (pos === "bottom-left") { x = pad; y = c.height - pad; }
    else if (pos === "bottom-right") { x = c.width - tw - pad; y = c.height - pad; }
    else if (pos === "center") { x = (c.width - tw) / 2; y = c.height / 2; }
    ctx.strokeText(t, x, y); ctx.fillText(t, x, y);
    ctx.globalAlpha = 1;
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(img, text, opacity, position, fontSize); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function update(t = text, op = opacity, pos = position, size = fontSize) {
    if (imgRef.current) draw(imgRef.current, t, op, pos, size);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Watermark text</label>
          <input className="input mt-1" value={text} onChange={e => { setText(e.target.value); update(e.target.value); }} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Position</label>
          <select className="input mt-1" value={position} onChange={e => { setPosition(e.target.value); update(text, opacity, e.target.value); }}>
            {["top-left","top-right","bottom-left","bottom-right","center"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm text-[var(--text)]">Opacity: {opacity}%</label>
          <input type="range" min={10} max={100} value={opacity} className="w-full accent-brand-600" onChange={e => { setOpacity(+e.target.value); update(text, +e.target.value); }} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-[var(--text)]">Font size: {fontSize}px</label>
          <input type="range" min={12} max={120} value={fontSize} className="w-full accent-brand-600" onChange={e => { setFontSize(+e.target.value); update(text, opacity, position, +e.target.value); }} />
        </div>
      </div>
      {src && (
        <div className="space-y-3 text-center">
          <canvas ref={canvasRef} className="max-h-64 mx-auto rounded-lg border border-[var(--border)] max-w-full" />
          <a href="#" download={`${name}-watermarked.png`} className="btn-primary inline-flex items-center gap-2"
            onClick={e => { (e.currentTarget as HTMLAnchorElement).href = canvasRef.current!.toDataURL("image/png"); }}>
            <Download size={16} />Download
          </a>
        </div>
      )}
      {!src && <canvas ref={canvasRef} className="hidden" />}
    </div>
  );
}
