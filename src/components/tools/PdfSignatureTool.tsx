"use client";
import { useRef, useState } from "react";
import { Upload, Download, Type, ImageIcon, PenLine } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type Mode = "draw" | "type" | "upload";

export default function PdfSignatureTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("draw");
  const [drawing, setDrawing] = useState(false);
  const [typedSig, setTypedSig] = useState("");
  const [sigDataUrl, setSigDataUrl] = useState("");
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [sigPos, setSigPos] = useState({ x: 50, y: 50 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  function clearCanvas() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setSigDataUrl("");
  }

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) { setDrawing(true); lastPos.current = getPos(e); }
  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!drawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath(); ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y); ctx.lineTo(pos.x, pos.y); ctx.stroke();
    lastPos.current = pos;
  }
  function onMouseUp() { setDrawing(false); setSigDataUrl(canvasRef.current!.toDataURL()); }

  function renderTyped() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "italic 36px Georgia, serif"; ctx.fillStyle = "#1a1a1a";
    ctx.fillText(typedSig, 10, 50);
    setSigDataUrl(c.toDataURL());
  }

  function handleSigUpload(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      setSigDataUrl(c.toDataURL());
    };
    img.src = url;
  }

  async function handlePdfFile(file: File) {
    setLoading(true); setError(""); setPdfPages([]);
    try {
      const ab = await file.arrayBuffer();
      setBuf(ab);
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const pdf = await pdfjsLib.getDocument({ data: ab.slice(0) }).promise;
      const urls: string[] = [];
      const dpr = window.devicePixelRatio || 1;
      const scale = 2.5 * dpr;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale });
        const c = document.createElement("canvas");
        c.width = vp.width; c.height = vp.height;
        await page.render({ canvas: c, canvasContext: c.getContext("2d")!, viewport: vp }).promise;
        urls.push(c.toDataURL("image/png", 1.0));
      }
      setPdfPages(urls);
    } catch { setError("Could not render PDF."); }
    setLoading(false);
  }

  async function exportSigned() {
    if (!buf || !sigDataUrl) return;
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf);
    const resp = await fetch(sigDataUrl);
    const pngBytes = new Uint8Array(await resp.arrayBuffer());
    const img = await doc.embedPng(pngBytes);
    const page = doc.getPage(currentPage);
    const { height } = page.getSize();
    page.drawImage(img, { x: sigPos.x, y: height - sigPos.y - 60, width: 200, height: 60, opacity: 0.9 });
    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = "signed.pdf"; a.click();
    trackTaskComplete("pdf-signature", startTime);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-[var(--text)] mb-2">Step 1: Create your signature</p>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode("draw")} className={mode === "draw" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><PenLine size={14} />Draw</button>
          <button onClick={() => setMode("type")} className={mode === "type" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><Type size={14} />Type</button>
          <button onClick={() => setMode("upload")} className={mode === "upload" ? "btn-primary flex items-center gap-1" : "btn-secondary flex items-center gap-1"}><ImageIcon size={14} />Upload</button>
        </div>
        {mode === "draw" && (
          <div>
            <canvas ref={canvasRef} width={400} height={100} className="border border-[var(--border)] rounded-lg bg-white w-full cursor-crosshair"
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} />
            <button onClick={clearCanvas} className="btn-secondary text-xs mt-1">Clear</button>
          </div>
        )}
        {mode === "type" && (
          <div className="flex gap-2">
            <canvas ref={canvasRef} width={400} height={100} className="hidden" />
            <input type="text" className="input flex-1" placeholder="Type your name…" value={typedSig} onChange={e => setTypedSig(e.target.value)} />
            <button onClick={renderTyped} className="btn-primary">Render</button>
          </div>
        )}
        {mode === "upload" && (
          <div>
            <canvas ref={canvasRef} width={400} height={100} className="hidden" />
            <label className="btn-secondary cursor-pointer">
              Upload signature image
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleSigUpload(e.target.files[0])} />
            </label>
          </div>
        )}
        {sigDataUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sigDataUrl} alt="signature preview" className="mt-2 h-16 border border-[var(--border)] rounded bg-white" />
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-[var(--text)] mb-2">Step 2: Upload PDF</p>
        <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
          <Upload size={24} />
          <span className="text-sm">Click to upload PDF</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handlePdfFile(e.target.files[0])} />
        </label>
        {loading && <p className="text-sm text-center text-[var(--text-muted)] mt-2">Rendering…</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {pdfPages.length > 0 && (
        <>
          <div>
            <p className="text-sm font-medium text-[var(--text)] mb-2">Step 3: Set signature position (X, Y from top-left)</p>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-[var(--text-muted)]">X (px)</label><input type="number" className="input mt-1" value={sigPos.x} onChange={e => setSigPos(p => ({ ...p, x: +e.target.value }))} /></div>
              <div><label className="text-xs text-[var(--text-muted)]">Y (px)</label><input type="number" className="input mt-1" value={sigPos.y} onChange={e => setSigPos(p => ({ ...p, y: +e.target.value }))} /></div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="btn-secondary px-3">←</button>
            <span className="text-sm text-[var(--text-muted)]">Page {currentPage + 1} / {pdfPages.length}</span>
            <button onClick={() => setCurrentPage(p => Math.min(pdfPages.length - 1, p + 1))} disabled={currentPage === pdfPages.length - 1} className="btn-secondary px-3">→</button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pdfPages[currentPage]} alt={`page ${currentPage + 1}`} className="w-full border border-[var(--border)] rounded-lg" />
          <button onClick={exportSigned} disabled={!sigDataUrl} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Export Signed PDF
          </button>
        </>
      )}
    </div>
  );
}
