"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function PdfTextEditor() {
  const [pages, setPages] = useState<string[]>([]);
  const [edited, setEdited] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setPages([]); setEdited([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const texts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        texts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
      }
      setPages(texts); setEdited(texts);
    } catch { setError("Could not read PDF. It may be encrypted or corrupted."); }
    setLoading(false);
  }

  async function exportPdf() {
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    for (const text of edited) {
      const page = doc.addPage([595, 842]);
      const lines = text.match(/.{1,90}/g) ?? [text];
      let y = 800;
      for (const line of lines) {
        if (y < 40) break;
        page.drawText(line, { x: 40, y, size: 11, font, color: rgb(0, 0, 0) });
        y -= 16;
      }
    }
    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = "edited.pdf"; a.click();
    trackTaskComplete("pdf-text-editor", startTime);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Extracting text…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {pages.length > 0 && (
        <>
          <p className="text-xs text-[var(--text-muted)]">Edit each page&apos;s text below. On export, text is overlaid as a new layer via pdf-lib.</p>
          {edited.map((text, i) => (
            <div key={i}>
              <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Page {i + 1}</label>
              <textarea className="textarea min-h-[120px]" value={text} onChange={e => { const c = [...edited]; c[i] = e.target.value; setEdited(c); }} />
            </div>
          ))}
          <button onClick={exportPdf} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Export Edited PDF
          </button>
        </>
      )}
    </div>
  );
}
