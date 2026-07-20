"use client";
import { useRef, useState } from "react";
import { Upload, Download, X } from "lucide-react";

const LAYOUTS = ["grid", "mosaic", "film-strip"] as const;
type Layout = typeof LAYOUTS[number];

export default function ImageCollageMaker() {
  const [images, setImages] = useState<{ url: string; img: HTMLImageElement }[]>([]);
  const [layout, setLayout] = useState<Layout>("grid");
  const [spacing, setSpacing] = useState(8);
  const [border, setBorder] = useState(0);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [out, setOut] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function addFiles(files: FileList) {
    Array.from(files).slice(0, 6 - images.length).forEach(file => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => setImages(prev => [...prev, { url, img }]);
      img.src = url;
    });
  }

  function generate() {
    const imgs = images.map(i => i.img);
    if (imgs.length < 2) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const size = 400;
    const n = imgs.length;

    if (layout === "grid") {
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const cellW = Math.floor((size - spacing * (cols + 1)) / cols);
      const cellH = Math.floor((size - spacing * (rows + 1)) / rows);
      c.width = size + border * 2; c.height = size + border * 2;
      ctx.fillStyle = borderColor; ctx.fillRect(0, 0, c.width, c.height);
      imgs.forEach((img, i) => {
        const col = i % cols, row = Math.floor(i / cols);
        const x = border + spacing + col * (cellW + spacing);
        const y = border + spacing + row * (cellH + spacing);
        ctx.drawImage(img, x, y, cellW, cellH);
      });
    } else if (layout === "film-strip") {
      const cellW = Math.floor((size - spacing * (n + 1)) / n);
      c.width = size + border * 2; c.height = Math.floor(size * 0.6) + border * 2;
      ctx.fillStyle = borderColor; ctx.fillRect(0, 0, c.width, c.height);
      const cellH = c.height - border * 2 - spacing * 2;
      imgs.forEach((img, i) => {
        const x = border + spacing + i * (cellW + spacing);
        ctx.drawImage(img, x, border + spacing, cellW, cellH);
      });
    } else {
      // mosaic: first image large left, rest stacked right
      c.width = size + border * 2; c.height = size + border * 2;
      ctx.fillStyle = borderColor; ctx.fillRect(0, 0, c.width, c.height);
      const mainW = Math.floor((size - spacing * 3) * 0.6);
      const sideW = size - mainW - spacing * 3;
      const sideH = Math.floor((size - spacing * (n)) / (n - 1));
      ctx.drawImage(imgs[0], border + spacing, border + spacing, mainW, size - spacing * 2);
      imgs.slice(1).forEach((img, i) => {
        ctx.drawImage(img, border + mainW + spacing * 2, border + spacing + i * (sideH + spacing), sideW, sideH);
      });
    }
    setOut(c.toDataURL("image/png"));
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Upload 2–6 images</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>
      {images.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-16 w-16 object-cover rounded border border-[var(--border)]" />
                <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {LAYOUTS.map(l => (
              <button key={l} onClick={() => setLayout(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${layout === l ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Spacing: {spacing}px</label>
              <input type="range" min={0} max={32} value={spacing} className="w-full accent-brand-600" onChange={e => setSpacing(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Border: {border}px</label>
              <input type="range" min={0} max={40} value={border} className="w-full accent-brand-600" onChange={e => setBorder(+e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Border color</label>
              <input type="color" value={borderColor} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]" onChange={e => setBorderColor(e.target.value)} />
            </div>
          </div>
          <button onClick={generate} className="btn-primary" disabled={images.length < 2}>Generate Collage</button>
        </>
      )}
      {out && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="collage" className="max-h-80 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <a href={out} download="collage.png" className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Collage
          </a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
