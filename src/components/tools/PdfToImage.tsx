"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfToImage() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setLoading(true); setError(""); setPages([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const results: string[] = [];
      const dpr = window.devicePixelRatio || 1;
      const scale = 2.5 * dpr;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d")! as unknown as CanvasRenderingContext2D, canvas, viewport: vp }).promise;
        results.push(canvas.toDataURL("image/png", 1.0));
      }
      setPages(results);
    } catch {
      setError("Could not render this PDF. It may be encrypted or corrupted.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Rendering pages…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {pages.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)] text-center">{pages.length} page{pages.length > 1 ? "s" : ""} rendered</p>
          {pages.map((url, i) => (
            <div key={i} className="space-y-2 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Page ${i + 1}`} className="mx-auto rounded-lg border border-[var(--border)] max-w-full" />
              <a href={url} download={`page-${i + 1}.png`} className="btn-secondary inline-flex items-center gap-2 text-sm">
                <Download size={14} />Download Page {i + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
