"use client";
import { useRef, useState } from "react";
import { Upload, Copy } from "lucide-react";

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
}

export default function ImageColorPicker() {
  const [src, setSrc] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [picked, setPicked] = useState("");
  const [copied, setCopied] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    setSrc(url); setColors([]); setPicked("");
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function pickColor(e: React.MouseEvent<HTMLImageElement>) {
    const img = imgRef.current!;
    const c = canvasRef.current!;
    const rect = img.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const px = Math.round((e.clientX - rect.left) * scaleX);
    const py = Math.round((e.clientY - rect.top) * scaleY);
    const d = c.getContext("2d")!.getImageData(px, py, 1, 1).data;
    const r = d[0], g = d[1], b = d[2];
    const hex = rgbToHex(r, g, b);
    setPicked(hex);
    setColors(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 12));
  }

  function copy(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          <p className="text-xs text-[var(--text-muted)] text-center">Click anywhere on the image to pick a color</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imgRef} src={src} alt="source" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)] cursor-crosshair" onClick={pickColor} />
          {picked && (
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-lg border border-[var(--border)]" style={{ background: picked }} />
              <span className="font-mono text-sm text-[var(--text)]">{picked}</span>
              <button onClick={() => copy(picked)} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0">
                <Copy size={12} />{copied === picked ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
          {colors.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Picked colors</p>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button key={c} onClick={() => copy(c)} title={c} className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[var(--border)] text-xs font-mono hover:bg-[var(--bg-subtle)]">
                    <span className="w-4 h-4 rounded" style={{ background: c }} />
                    {c} {copied === c ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
