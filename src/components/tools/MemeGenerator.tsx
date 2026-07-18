"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function MemeGenerator() {
  const [src, setSrc] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function draw(img: HTMLImageElement, top: string, bottom: string, size: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineWidth = size / 8;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    if (top) { ctx.strokeText(top.toUpperCase(), c.width / 2, size + 10); ctx.fillText(top.toUpperCase(), c.width / 2, size + 10); }
    if (bottom) { ctx.strokeText(bottom.toUpperCase(), c.width / 2, c.height - 15); ctx.fillText(bottom.toUpperCase(), c.width / 2, c.height - 15); }
  }

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(img, topText, bottomText, fontSize); URL.revokeObjectURL(url); };
    img.src = url;
  }

  function update(top: string, bottom: string, size: number) {
    if (imgRef.current) draw(imgRef.current, top, bottom, size);
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
          <label className="text-xs text-[var(--text-muted)]">Top text</label>
          <input className="input mt-1" placeholder="TOP TEXT" value={topText} onChange={e => { setTopText(e.target.value); update(e.target.value, bottomText, fontSize); }} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Bottom text</label>
          <input className="input mt-1" placeholder="BOTTOM TEXT" value={bottomText} onChange={e => { setBottomText(e.target.value); update(topText, e.target.value, fontSize); }} />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--text)]">Font size: {fontSize}px</label>
        <input type="range" min={16} max={120} value={fontSize} className="w-full accent-brand-600"
          onChange={e => { setFontSize(+e.target.value); update(topText, bottomText, +e.target.value); }} />
      </div>
      {src && (
        <div className="space-y-3 text-center">
          <canvas ref={canvasRef} className="max-h-64 mx-auto rounded-lg border border-[var(--border)] max-w-full" />
          <a href={canvasRef.current?.toDataURL("image/png") ?? "#"} download="meme.png" className="btn-primary inline-flex items-center gap-2" onClick={e => { (e.currentTarget as HTMLAnchorElement).href = canvasRef.current!.toDataURL("image/png"); }}>
            <Download size={16} />Download Meme
          </a>
        </div>
      )}
      {!src && <canvas ref={canvasRef} className="hidden" />}
    </div>
  );
}
