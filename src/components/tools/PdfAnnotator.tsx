"use client";
import { useRef, useState, useEffect } from "react";
import { Upload, Download, Highlighter, PenLine, StickyNote } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type Tool = "highlight" | "draw" | "note";

export default function PdfAnnotator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [tool, setTool] = useState<Tool>("highlight");
  const [drawing, setDrawing] = useState(false);
  const [annotations, setAnnotations] = useState<Record<number, ImageData>>({});
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  async function handleFile(file: File) {
    setLoading(true); setError(""); setPdfPages([]); setAnnotations({});
    try {
      const ab = await file.arrayBuffer();
      setBuf(ab);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@$\{pdfjsLib.version\}/build/pdf.worker.min.mjs`;
      const pdf = await pdfjsLib.getDocument({ data: ab.slice(0) }).promise;
      const urls: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const c = document.createElement("canvas");
        c.width = vp.width; c.height = vp.height;
        await page.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp }).promise;
        urls.push(c.toDataURL());
      }
      setPdfPages(urls); setCurrentPage(0);
    } catch { setError("Could not render PDF."); }
    setLoading(false);
  }

  useEffect(() => {
    if (!pdfPages[currentPage] || !canvasRef.current || !overlayRef.current) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.width; c.height = img.height;
      c.getContext("2d")!.drawImage(img, 0, 0);
      const ov = overlayRef.current!;
      ov.width = img.width; ov.height = img.height;
      if (annotations[currentPage]) ov.getContext("2d")!.putImageData(annotations[currentPage], 0, 0);
    };
    img.src = pdfPages[currentPage];
  }, [currentPage, pdfPages, annotations]);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = overlayRef.current!.getBoundingClientRect();
    const scaleX = overlayRef.current!.width / r.width;
    const scaleY = overlayRef.current!.height / r.height;
    return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    if (tool === "note") {
      const text = prompt("Enter note text:");
      if (text) {
        const ctx = overlayRef.current!.getContext("2d")!;
        ctx.fillStyle = "rgba(255,255,0,0.7)";
        ctx.fillRect(pos.x, pos.y - 20, text.length * 8 + 8, 24);
        ctx.fillStyle = "#000"; ctx.font = "14px sans-serif";
        ctx.fillText(text, pos.x + 4, pos.y - 2);
        saveAnnotation();
      }
      setDrawing(false);
    }
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing || tool === "note") return;
    const ctx = overlayRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    if (tool === "highlight") {
      ctx.globalAlpha = 0.3; ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 16;
    } else {
      ctx.globalAlpha = 1; ctx.strokeStyle = "#E53E3E"; ctx.lineWidth = 2;
    }
    ctx.lineCap = "round";
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    lastPos.current = pos;
  }

  function onMouseUp() { setDrawing(false); saveAnnotation(); }

  function saveAnnotation() {
    const ov = overlayRef.current!;
    const data = ov.getContext("2d")!.getImageData(0, 0, ov.width, ov.height);
    setAnnotations(prev => ({ ...prev, [currentPage]: data }));
  }

  async function exportAnnotated() {
    if (!buf) return;
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf);
    for (const [pageIdx, imgData] of Object.entries(annotations)) {
      const c = document.createElement("canvas");
      c.width = imgData.width; c.height = imgData.height;
      c.getContext("2d")!.putImageData(imgData, 0, 0);
      const pngBytes = await new Promise<Uint8Array>(res => c.toBlob(async b => res(new Uint8Array(await b!.arrayBuffer())), "image/png"));
      const img = await doc.embedPng(pngBytes);
      const page = doc.getPage(Number(pageIdx));
      const { width, height } = page.getSize();
      page.drawImage(img, { x: 0, y: 0, width, height, opacity: 1 });
    }
    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = "annotated.pdf"; a.click();
    trackTaskComplete("pdf-annotator", startTime);
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
      {pdfPages.length > 0 && (
        <>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setTool("highlight")} className={tool === "highlight" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><Highlighter size={14} />Highlight</button>
            <button onClick={() => setTool("draw")} className={tool === "draw" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><PenLine size={14} />Draw</button>
            <button onClick={() => setTool("note")} className={tool === "note" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><StickyNote size={14} />Note</button>
          </div>
          <div className="relative border border-[var(--border)] rounded-lg overflow-hidden" style={{ cursor: "crosshair" }}>
            <canvas ref={canvasRef} className="block w-full" />
            <canvas ref={overlayRef} className="absolute inset-0 w-full h-full"
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="btn-secondary px-3">←</button>
            <span className="text-sm text-[var(--text-muted)]">Page {currentPage + 1} / {pdfPages.length}</span>
            <button onClick={() => setCurrentPage(p => Math.min(pdfPages.length - 1, p + 1))} disabled={currentPage === pdfPages.length - 1} className="btn-secondary px-3">→</button>
          </div>
          <button onClick={exportAnnotated} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Export Annotated PDF
          </button>
        </>
      )}
    </div>
  );
}
