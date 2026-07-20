"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function TiffToJpg() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [fmt, setFmt] = useState<"jpg" | "png">("jpg");
  const [quality, setQuality] = useState(92);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelDataRef = useRef<{ data: Uint8ClampedArray<ArrayBuffer>; w: number; h: number } | null>(null);

  function renderToCanvas(f: "jpg" | "png", q: number) {
    const pd = pixelDataRef.current;
    if (!pd) return;
    const c = canvasRef.current!;
    c.width = pd.w; c.height = pd.h;
    const ctx = c.getContext("2d")!;
    if (f === "jpg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, c.width, c.height); }
    const imgData = new ImageData(pd.data, pd.w, pd.h);
    ctx.putImageData(imgData, 0, 0);
    setOut(f === "jpg" ? c.toDataURL("image/jpeg", q / 100) : c.toDataURL("image/png"));
  }

  async function handleFile(file: File) {
    setError(""); setOut(""); setLoading(true);
    setName(file.name.replace(/\.[^.]+$/, ""));
    try {
      const UTIF = (await import("utif")).default ?? (await import("utif"));
      const buf = await file.arrayBuffer();
      const ifds = UTIF.decode(buf);
      UTIF.decodeImage(buf, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const w = ifds[0].width as number;
      const h = ifds[0].height as number;
      const buf8 = new Uint8ClampedArray((rgba as any).buffer ?? rgba);
      pixelDataRef.current = { data: buf8 as Uint8ClampedArray<ArrayBuffer>, w, h };
      renderToCanvas(fmt, quality);
    } catch (e) {
      setError("Could not decode this TIFF file. Make sure it is a valid TIFF image.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload TIFF</span>
        <input type="file" accept="image/tiff,.tif,.tiff" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Decoding TIFF…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        {(["jpg", "png"] as const).map(f => (
          <button key={f} onClick={() => { setFmt(f); renderToCanvas(f, quality); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${fmt === f ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      {fmt === "jpg" && pixelDataRef.current && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Quality: {quality}%</label>
          <input type="range" min={1} max={100} value={quality} className="w-full accent-brand-600"
            onChange={e => { const q = +e.target.value; setQuality(q); renderToCanvas(fmt, q); }} />
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
