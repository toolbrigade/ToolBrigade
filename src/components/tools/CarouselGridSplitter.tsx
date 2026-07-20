"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

const GRIDS = [
  { label: "3×1", cols: 3, rows: 1 },
  { label: "3×3", cols: 3, rows: 3 },
  { label: "2×2", cols: 2, rows: 2 },
];

export default function CarouselGridSplitter() {
  const [tiles, setTiles] = useState<string[]>([]);
  const [name, setName] = useState("image");
  const [grid, setGrid] = useState(GRIDS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function split(img: HTMLImageElement, g: typeof GRIDS[0]) {
    const tileW = Math.floor(img.naturalWidth / g.cols);
    const tileH = Math.floor(img.naturalHeight / g.rows);
    const result: string[] = [];
    const c = canvasRef.current!;
    for (let row = 0; row < g.rows; row++) {
      for (let col = 0; col < g.cols; col++) {
        c.width = tileW; c.height = tileH;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, col * tileW, row * tileH, tileW, tileH, 0, 0, tileW, tileH);
        result.push(c.toDataURL("image/png"));
      }
    }
    setTiles(result);
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { imgRef.current = img; split(img, grid); URL.revokeObjectURL(url); };
    img.src = url;
  }

  async function downloadAll() {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    tiles.forEach((dataUrl, i) => {
      const base64 = dataUrl.split(",")[1];
      zip.file(`${name}-tile-${i + 1}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}-grid.zip`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      <div className="flex gap-2">
        {GRIDS.map(g => (
          <button key={g.label} onClick={() => { setGrid(g); if (imgRef.current) split(imgRef.current, g); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${grid.label === g.label ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
            {g.label}
          </button>
        ))}
      </div>
      {tiles.length > 0 && (
        <>
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}>
            {tiles.map((t, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t} alt={`tile ${i + 1}`} className="w-full rounded border border-[var(--border)]" />
                <a href={t} download={`${name}-tile-${i + 1}.png`}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded text-white text-xs font-medium">
                  <Download size={16} className="mr-1" />Save
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button onClick={downloadAll} className="btn-primary inline-flex items-center gap-2">
              <Download size={16} />Download All as ZIP
            </button>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
