"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

export default function WatermarkPatternGenerator() {
  const [text, setText] = useState("CONFIDENTIAL");
  const [angle, setAngle] = useState(45);
  const [opacity, setOpacity] = useState(15);
  const [spacing, setSpacing] = useState(120);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#000000");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { draw(); }, [text, angle, opacity, spacing, fontSize, color]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 600, H = 400;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const rad = (angle * Math.PI) / 180;
    const diagonal = Math.sqrt(W * W + H * H);
    const step = spacing;

    for (let x = -diagonal; x < diagonal * 2; x += step) {
      for (let y = -diagonal; y < diagonal * 2; y += step) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rad);
        ctx.fillText(text || "WATERMARK", 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "watermark-pattern.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Watermark text</label>
            <input className="input" value={text} onChange={e => setText(e.target.value)} placeholder="CONFIDENTIAL" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Angle: {angle}°</label>
            <input type="range" min={0} max={90} value={angle} onChange={e => setAngle(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Opacity: {opacity}%</label>
            <input type="range" min={5} max={80} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Spacing: {spacing}px</label>
            <input type="range" min={60} max={300} value={spacing} onChange={e => setSpacing(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Font size: {fontSize}px</label>
            <input type="range" min={12} max={60} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Color</label>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-16 rounded cursor-pointer border border-[var(--border)]" />
          </div>
          <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Download PNG (transparent)
          </button>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Preview</label>
          <canvas ref={canvasRef} className="rounded-xl border border-[var(--border)] max-w-full" style={{ background: "repeating-conic-gradient(#e2e8f0 0% 25%, #f8fafc 0% 50%) 0 0 / 20px 20px" }} />
        </div>
      </div>
    </div>
  );
}
