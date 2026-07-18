"use client";
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";

export default function QrGenerator() {
  const [text, setText] = useState("https://toolbrigade.com");
  const [size, setSize] = useState(256);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!text) return;
    import("qrcode").then(QRCode => {
      QRCode.toCanvas(canvasRef.current!, text, {
        width: size, color: { dark: fg, light: bg }, margin: 2,
      });
    });
  }, [text, size, fg, bg]);

  function download() {
    const a = document.createElement("a");
    a.href = canvasRef.current!.toDataURL("image/png");
    a.download = "qrcode.png"; a.click();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Text or URL</label>
        <input className="input" placeholder="https://example.com" value={text} onChange={e => setText(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Size (px)</label>
          <input type="number" min={64} max={1024} step={32} value={size} className="input mt-1" onChange={e => setSize(+e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Foreground</label>
          <input type="color" value={fg} className="input mt-1 h-10 p-1 cursor-pointer" onChange={e => setFg(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Background</label>
          <input type="color" value={bg} className="input mt-1 h-10 p-1 cursor-pointer" onChange={e => setBg(e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <canvas ref={canvasRef} className="rounded-lg border border-[var(--border)]" />
        {text && (
          <button onClick={download} className="btn-primary flex items-center gap-2">
            <Download size={16} />Download PNG
          </button>
        )}
      </div>
    </div>
  );
}
