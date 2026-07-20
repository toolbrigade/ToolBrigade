"use client";
import { useState, useRef, useCallback } from "react";
import { Download, Upload } from "lucide-react";

const PAGE_SIZES = [
  { label: "A4 (210×297mm)", w: 2480, h: 3508 },
  { label: "Letter (8.5×11in)", w: 2550, h: 3300 },
  { label: "A5 (148×210mm)", w: 1748, h: 2480 },
];

export default function PrintLayoutGenerator() {
  const [pageIdx, setPageIdx] = useState(0);
  const [cols, setCols] = useState(2);
  const [rows, setRows] = useState(3);
  const [margin, setMargin] = useState(40);
  const [gap, setGap] = useState(20);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => { imgRef.current = img; setImgSrc(src); };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  function generate() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const page = PAGE_SIZES[pageIdx];
    const scale = 0.25; // Preview scale
    const W = page.w * scale;
    const H = page.h * scale;
    const m = margin * scale;
    const g = gap * scale;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const cellW = (W - 2 * m - (cols - 1) * g) / cols;
    const cellH = (H - 2 * m - (rows - 1) * g) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = m + c * (cellW + g);
        const y = m + r * (cellH + g);
        // Fit image in cell maintaining aspect ratio
        const imgAspect = img.width / img.height;
        const cellAspect = cellW / cellH;
        let dw, dh, dx, dy;
        if (imgAspect > cellAspect) {
          dw = cellW; dh = cellW / imgAspect;
          dx = x; dy = y + (cellH - dh) / 2;
        } else {
          dh = cellH; dw = cellH * imgAspect;
          dy = y; dx = x + (cellW - dw) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        // Cell border
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, cellW, cellH);
      }
    }
  }

  function download() {
    generate();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "print-layout.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Page size</label>
            <select className="input" value={pageIdx} onChange={e => setPageIdx(+e.target.value)}>
              {PAGE_SIZES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Columns: {cols}</label>
              <input type="range" min={1} max={6} value={cols} onChange={e => setCols(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Rows: {rows}</label>
              <input type="range" min={1} max={8} value={rows} onChange={e => setRows(+e.target.value)} className="w-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Margin: {margin}px</label>
              <input type="range" min={0} max={100} value={margin} onChange={e => setMargin(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Gap: {gap}px</label>
              <input type="range" min={0} max={60} value={gap} onChange={e => setGap(+e.target.value)} className="w-full" />
            </div>
          </div>
          {!imgSrc ? (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-6 cursor-pointer hover:border-brand-500 transition-colors">
              <Upload size={24} className="text-[var(--text-muted)] mb-1" />
              <span className="text-sm text-[var(--text-muted)]">Upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
          ) : (
            <div className="flex gap-2">
              <button onClick={generate} className="btn-secondary flex-1 text-sm">Preview Layout</button>
              <button onClick={download} className="btn-primary flex items-center gap-2 flex-1 justify-center text-sm">
                <Download size={14} />Download
              </button>
            </div>
          )}
          {imgSrc && (
            <button onClick={() => setImgSrc(null)} className="btn-secondary text-xs w-full">Change image</button>
          )}
          <p className="text-xs text-[var(--text-muted)]">{cols * rows} images per page</p>
        </div>
        <div className="overflow-auto">
          <canvas ref={canvasRef} className="rounded-xl border border-[var(--border)] max-w-full shadow" />
        </div>
      </div>
    </div>
  );
}
