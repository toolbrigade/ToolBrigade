"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function WaveformGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState("#A84A2E");
  const [bgColor, setBgColor] = useState("#FAFAF8");
  const [height, setHeight] = useState(200);
  const [style, setStyle] = useState<"bars" | "line" | "mirror">("bars");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = { current: Date.now() };

  const draw = useCallback(async (f: File, c: string, bg: string, h: number, s: typeof style) => {
    const arrayBuf = await f.arrayBuffer();
    const ctx = new AudioContext();
    const buffer = await ctx.decodeAudioData(arrayBuf);
    const data = buffer.getChannelData(0);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 800;
    canvas.width = W;
    canvas.height = h;
    const cctx = canvas.getContext("2d")!;
    cctx.fillStyle = bg;
    cctx.fillRect(0, 0, W, h);
    cctx.strokeStyle = c;
    cctx.fillStyle = c;
    const step = Math.ceil(data.length / W);
    const mid = h / 2;

    if (s === "bars") {
      for (let i = 0; i < W; i++) {
        let max = 0;
        for (let j = 0; j < step; j++) max = Math.max(max, Math.abs(data[i * step + j] || 0));
        const barH = max * h * 0.9;
        cctx.fillRect(i, mid - barH / 2, 1, barH);
      }
    } else if (s === "line") {
      cctx.lineWidth = 1.5;
      cctx.beginPath();
      for (let i = 0; i < W; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) sum += data[i * step + j] || 0;
        const avg = sum / step;
        const y = mid + avg * mid * 0.9;
        i === 0 ? cctx.moveTo(i, y) : cctx.lineTo(i, y);
      }
      cctx.stroke();
    } else {
      // mirror
      for (let i = 0; i < W; i++) {
        let max = 0;
        for (let j = 0; j < step; j++) max = Math.max(max, Math.abs(data[i * step + j] || 0));
        const barH = max * mid * 0.9;
        cctx.fillRect(i, mid - barH, 1, barH);
        cctx.fillRect(i, mid, 1, barH);
      }
    }
    setGenerated(true);
    trackTaskComplete("waveform-generator", startRef.current);
  }, []);

  async function generate() {
    if (!file) return;
    startRef.current = Date.now();
    await draw(file, color, bgColor, height, style);
  }

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "waveform.png";
    a.click();
  }

  function downloadSvg() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "waveform.svg";
    a.click();
  }

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload audio (MP3, WAV, OGG)</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setGenerated(false); }} />
      </label>

      {file && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Wave color</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-9 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Background</label>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-9 rounded cursor-pointer border border-[var(--border)]" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Height: {height}px</label>
              <input type="range" min={80} max={400} step={10} value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Style</label>
              <select value={style} onChange={e => setStyle(e.target.value as typeof style)} className="input w-full text-sm">
                <option value="bars">Bars</option>
                <option value="line">Line</option>
                <option value="mirror">Mirror</option>
              </select>
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Waveform</button>
        </>
      )}

      <canvas ref={canvasRef} className={`w-full rounded-lg border border-[var(--border)] ${!generated ? "hidden" : ""}`} />

      {generated && (
        <div className="flex gap-3">
          <button onClick={downloadPng} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download PNG
          </button>
          <button onClick={downloadSvg} className="btn-secondary inline-flex items-center gap-2">
            <Download size={16} />Download SVG
          </button>
        </div>
      )}
    </div>
  );
}
