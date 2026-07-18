"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function SvgToPng() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [scale, setScale] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgSrc, setSvgSrc] = useState("");

  function convert(svg: string, s: number) {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = (img.naturalWidth || 800) * s;
      c.height = (img.naturalHeight || 600) * s;
      const ctx = c.getContext("2d")!;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(s, s);
      ctx.drawImage(img, 0, 0);
      setOut(c.toDataURL("image/png"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const reader = new FileReader();
    reader.onload = e => { const svg = e.target!.result as string; setSvgSrc(svg); convert(svg, scale); };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload SVG</span>
        <input type="file" accept="image/svg+xml,.svg" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {svgSrc && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Scale: {scale}×</label>
            <input type="range" min={1} max={4} step={0.5} value={scale} className="w-full accent-brand-600"
              onChange={e => { setScale(+e.target.value); convert(svgSrc, +e.target.value); }} />
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="converted" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}.png`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download PNG</a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
