"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ExifViewerRemover() {
  const [exif, setExif] = useState<Record<string, unknown> | null>(null);
  const [stripped, setStripped] = useState("");
  const [name, setName] = useState("image");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function handleFile(file: File) {
    setExif(null); setStripped(""); setLoading(true);
    setName(file.name.replace(/\.[^.]+$/, ""));
    try {
      const exifr = await import("exifr");
      const data = await exifr.parse(file, true);
      setExif(data ?? {});
    } catch { setExif({}); }
    // Strip via canvas re-encode
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext("2d")!.drawImage(img, 0, 0);
      setStripped(c.toDataURL("image/jpeg", 0.95));
      URL.revokeObjectURL(url);
      setLoading(false);
    };
    img.onerror = () => { setLoading(false); };
    img.src = url;
  }

  const formatValue = (v: unknown): string => {
    if (v === null || v === undefined) return "—";
    if (v instanceof Uint8Array || v instanceof ArrayBuffer) return "[binary data]";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image (JPG recommended)</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Reading EXIF data…</p>}
      {exif !== null && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">EXIF Metadata</h3>
          {Object.keys(exif).length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No EXIF metadata found in this file.</p>
          ) : (
            <div className="overflow-auto max-h-64 rounded-lg border border-[var(--border)]">
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(exif).map(([k, v]) => (
                    <tr key={k} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-3 py-1.5 font-medium text-[var(--text)] w-1/3">{k}</td>
                      <td className="px-3 py-1.5 text-[var(--text-muted)] break-all">{formatValue(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {stripped && (
            <div className="pt-2">
              <p className="text-xs text-[var(--text-muted)] mb-2">The stripped version is re-encoded via Canvas, which removes all EXIF metadata.</p>
              <a href={stripped} download={`${name}-no-exif.jpg`} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download Stripped JPG (no EXIF)
              </a>
            </div>
          )}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
