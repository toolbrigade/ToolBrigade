"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PngToSvg() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [threshold, setThreshold] = useState(128);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgData, setImgData] = useState<ImageData | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  function trace(data: ImageData, w: number, h: number, t: number) {
    const d = data.data;
    let paths = "";
    for (let row = 0; row < h; row++) {
      for (let col = 0; col < w; col++) {
        const i = (row * w + col) * 4;
        const brightness = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
        const alpha = d[i + 3];
        if (brightness < t && alpha > 128) {
          paths += `<rect x="${col}" y="${row}" width="1" height="1" fill="black"/>`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paths}</svg>`;
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxDim = 200;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const c = canvasRef.current!;
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      const data = c.getContext("2d")!.getImageData(0, 0, w, h);
      setImgData(data); setDims({ w, h });
      const svg = trace(data, w, h, threshold);
      setOut("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function reTrace(t: number) {
    if (!imgData) return;
    const svg = trace(imgData, dims.w, dims.h, t);
    setOut("data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg));
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
        Basic pixel-level tracing — best for simple logos and icons. For complex photos, results will be approximate.
      </div>
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PNG</span>
        <input type="file" accept="image/png" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {imgData && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Darkness threshold: {threshold}</label>
            <input type="range" min={1} max={255} value={threshold} className="w-full accent-brand-600"
              onChange={e => { setThreshold(+e.target.value); reTrace(+e.target.value); }} />
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="svg output" className="max-h-48 mx-auto rounded-lg object-contain border border-[var(--border)] bg-white" />
              <a href={out} download={`${name}.svg`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download SVG</a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
