"use client";
import { useRef, useState } from "react";
import { Download } from "lucide-react";

export default function PlaceholderImage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bg, setBg] = useState("#e2e8f0");
  const [fg, setFg] = useState("#64748b");
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [out, setOut] = useState("");

  function generate() {
    const c = canvasRef.current!;
    c.width = width; c.height = height;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height);
    const label = text || `${width} × ${height}`;
    const fontSize = Math.max(14, Math.min(width, height) / 8);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, width / 2, height / 2);
    setOut(c.toDataURL("image/png"));
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-[var(--text-muted)]">Width (px)</label><input type="number" min={1} max={4096} value={width} className="input mt-1" onChange={e => setWidth(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Height (px)</label><input type="number" min={1} max={4096} value={height} className="input mt-1" onChange={e => setHeight(+e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Background color</label><input type="color" value={bg} className="input mt-1 h-10 p-1 cursor-pointer" onChange={e => setBg(e.target.value)} /></div>
        <div><label className="text-xs text-[var(--text-muted)]">Text color</label><input type="color" value={fg} className="input mt-1 h-10 p-1 cursor-pointer" onChange={e => setFg(e.target.value)} /></div>
      </div>
      <div><label className="text-xs text-[var(--text-muted)]">Custom label (optional)</label><input className="input mt-1" placeholder={`${width} × ${height}`} value={text} onChange={e => setText(e.target.value)} /></div>
      <div className="flex flex-wrap gap-2">
        {[["16:9", 1280, 720], ["4:3", 800, 600], ["1:1", 500, 500], ["OG Image", 1200, 630], ["Banner", 1500, 500]].map(([label, w, h]) => (
          <button key={label as string} onClick={() => { setWidth(w as number); setHeight(h as number); }} className="btn-secondary text-xs py-1 px-2 min-h-0">{label as string}</button>
        ))}
      </div>
      <button onClick={generate} className="btn-primary w-full">Generate Placeholder</button>
      {out && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="placeholder" className="max-h-48 mx-auto rounded-lg border border-[var(--border)] object-contain" />
          <a href={out} download={`placeholder-${width}x${height}.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download</a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
