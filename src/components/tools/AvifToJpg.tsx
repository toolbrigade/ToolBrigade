"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function AvifToJpg() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [fmt, setFmt] = useState<"jpg" | "png">("jpg");
  const [quality, setQuality] = useState(92);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function draw(img: HTMLImageElement, f: "jpg" | "png", q: number) {
    const c = canvasRef.current!;
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d")!;
    if (f === "jpg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0);
    setOut(f === "jpg" ? c.toDataURL("image/jpeg", q / 100) : c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setError(""); setOut("");
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { imgRef.current = img; draw(img, fmt, quality); URL.revokeObjectURL(url); };
    img.onerror = () => {
      setError("Your browser could not decode this AVIF file. AVIF decoding requires Chrome 85+, Firefox 93+, or Safari 16+. Try updating your browser.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload AVIF</span>
        <input type="file" accept="image/avif,.avif" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        {(["jpg", "png"] as const).map(f => (
          <button key={f} onClick={() => { setFmt(f); if (imgRef.current) draw(imgRef.current, f, quality); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${fmt === f ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      {fmt === "jpg" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Quality: {quality}%</label>
          <input type="range" min={1} max={100} value={quality} className="w-full accent-brand-600"
            onChange={e => { const q = +e.target.value; setQuality(q); if (imgRef.current) draw(imgRef.current, fmt, q); }} />
        </div>
      )}
      {out && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={out} alt="converted" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
          <a href={out} download={`${name}.${fmt}`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download {fmt.toUpperCase()}
          </a>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
