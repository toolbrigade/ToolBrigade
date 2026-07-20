"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, X, Download } from "lucide-react";

type Frame = { src: string; name: string };

export default function ImagesToGif() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [delay, setDelay] = useState(200);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [generating, setGenerating] = useState(false);

  const addFiles = useCallback((files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        setFrames(f => [...f, { src: e.target?.result as string, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  function removeFrame(i: number) {
    setFrames(f => f.filter((_, idx) => idx !== i));
    setGifUrl(null);
  }

  async function generate() {
    if (frames.length < 2) { setStatus("Add at least 2 images."); return; }
    setGenerating(true);
    setStatus("Loading gif.js…");
    setGifUrl(null);

    try {
      // Dynamically load gif.js from CDN
      await new Promise<void>((resolve, reject) => {
        if ((window as any).GIF) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load gif.js"));
        document.head.appendChild(script);
      });

      setStatus("Loading images…");
      const images = await Promise.all(frames.map(f => new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = f.src;
      })));

      const maxW = Math.max(...images.map(i => i.width));
      const maxH = Math.max(...images.map(i => i.height));
      const scale = Math.min(1, 600 / maxW, 600 / maxH);
      const W = Math.round(maxW * scale);
      const H = Math.round(maxH * scale);

      setStatus("Encoding GIF…");
      const GIF = (window as any).GIF;
      const gif = new GIF({ workers: 2, quality: 10, width: W, height: H, workerScript: "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js" });

      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      images.forEach(img => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(img, 0, 0, W, H);
        gif.addFrame(canvas, { delay, copy: true });
      });

      gif.on("finished", (blob: Blob) => {
        setGifUrl(URL.createObjectURL(blob));
        setStatus(`Done! ${(blob.size / 1024).toFixed(0)} KB`);
        setGenerating(false);
      });

      gif.render();
    } catch (e: any) {
      setStatus("Error: " + e.message);
      setGenerating(false);
    }
  }

  function download() {
    if (!gifUrl) return;
    const a = document.createElement("a");
    a.href = gifUrl;
    a.download = "animation.gif";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Uses <strong>gif.js</strong> (MIT license, by Johan Nordberg) for client-side GIF encoding. No files are uploaded.
      </div>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-6 cursor-pointer hover:border-brand-500 transition-colors">
        <Upload size={24} className="text-[var(--text-muted)] mb-1" />
        <span className="text-sm text-[var(--text-muted)]">Click to add images (JPG, PNG, WebP)</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>

      {frames.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {frames.map((f, i) => (
              <div key={i} className="relative group">
                <img src={f.src} alt={f.name} className="w-16 h-16 object-cover rounded-lg border border-[var(--border)]" />
                <button onClick={() => removeFrame(i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/50 text-white rounded-b-lg">{i+1}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Frame delay: {delay}ms</label>
              <input type="range" min={50} max={2000} step={50} value={delay} onChange={e => setDelay(+e.target.value)} className="w-40" />
            </div>
            <span className="text-xs text-[var(--text-muted)]">{frames.length} frames · ~{(1000/delay).toFixed(1)} fps</span>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <button onClick={generate} disabled={generating} className="btn-primary">
              {generating ? "Generating…" : `Create GIF (${frames.length} frames)`}
            </button>
            {status && <span className="text-xs text-[var(--text-muted)]">{status}</span>}
          </div>
        </div>
      )}

      {gifUrl && (
        <div className="space-y-3">
          <img src={gifUrl} alt="Generated GIF" className="rounded-xl border border-[var(--border)] max-w-full max-h-64" />
          <button onClick={download} className="btn-primary flex items-center gap-2">
            <Download size={16} />Download GIF
          </button>
        </div>
      )}
    </div>
  );
}
