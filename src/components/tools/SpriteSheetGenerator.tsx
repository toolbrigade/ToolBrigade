"use client";
import { useRef, useState } from "react";
import { Upload, Download, X } from "lucide-react";

interface SpriteFrame { name: string; x: number; y: number; w: number; h: number; }

export default function SpriteSheetGenerator() {
  const [images, setImages] = useState<{ name: string; url: string; w: number; h: number }[]>([]);
  const [padding, setPadding] = useState(4);
  const [cols, setCols] = useState(4);
  const [sheetUrl, setSheetUrl] = useState("");
  const [jsonMap, setJsonMap] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function addFiles(files: FileList) {
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setImages(prev => [...prev, { name: file.name.replace(/\.[^.]+$/, ""), url, w: img.naturalWidth, h: img.naturalHeight }]);
      };
      img.src = url;
    });
  }

  function generate() {
    if (images.length === 0) return;
    const c = canvasRef.current!;
    const rows = Math.ceil(images.length / cols);
    const cellW = Math.max(...images.map(i => i.w)) + padding * 2;
    const cellH = Math.max(...images.map(i => i.h)) + padding * 2;
    c.width = cellW * cols;
    c.height = cellH * rows;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    const frames: SpriteFrame[] = [];
    images.forEach((img, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = col * cellW + padding;
      const y = row * cellH + padding;
      const el = new Image();
      el.src = img.url;
      ctx.drawImage(el, x, y, img.w, img.h);
      frames.push({ name: img.name, x, y, w: img.w, h: img.h });
    });
    setSheetUrl(c.toDataURL("image/png"));
    setJsonMap(JSON.stringify({ frames }, null, 2));
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload images (multiple)</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>
      {images.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="h-16 w-16 object-contain rounded border border-[var(--border)]" />
                <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Columns: {cols}</label>
              <input type="range" min={1} max={10} value={cols} className="w-full accent-brand-600" onChange={e => setCols(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Padding: {padding}px</label>
              <input type="range" min={0} max={32} value={padding} className="w-full accent-brand-600" onChange={e => setPadding(+e.target.value)} />
            </div>
          </div>
          <button onClick={generate} className="btn-primary">Generate Sprite Sheet</button>
        </>
      )}
      {sheetUrl && (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sheetUrl} alt="sprite sheet" className="max-w-full rounded-lg border border-[var(--border)]" />
          <div className="flex gap-3 flex-wrap">
            <a href={sheetUrl} download="sprite-sheet.png" className="btn-primary inline-flex items-center gap-2">
              <Download size={16} />Download PNG
            </a>
            <a href={`data:application/json;charset=utf-8,${encodeURIComponent(jsonMap)}`} download="sprite-map.json"
              className="btn-secondary inline-flex items-center gap-2">
              <Download size={16} />Download JSON Map
            </a>
          </div>
          <pre className="text-xs bg-[var(--surface)] border border-[var(--border)] rounded-lg p-3 overflow-auto max-h-48">{jsonMap}</pre>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
