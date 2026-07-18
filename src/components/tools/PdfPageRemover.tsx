"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfPageRemover() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [toRemove, setToRemove] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", "")); setToRemove(new Set());
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab);
    setPageCount(doc.getPageCount());
  }

  function toggle(page: number) {
    setToRemove(prev => { const s = new Set(prev); s.has(page) ? s.delete(page) : s.add(page); return s; });
  }

  async function remove() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const src = await PDFDocument.load(buf);
    const out = await PDFDocument.create();
    const keep = Array.from({ length: pageCount }, (_, i) => i).filter(i => !toRemove.has(i + 1));
    const pages = await out.copyPages(src, keep);
    pages.forEach(p => out.addPage(p));
    const bytes = await out.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-edited.pdf`; a.click();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {pageCount > 0 && (
        <>
          <p className="text-sm text-[var(--text-muted)]">Select pages to <strong className="text-red-500">remove</strong>:</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => toggle(p)}
                className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${toRemove.has(p) ? "bg-red-500 text-white border-red-500" : "bg-[var(--bg-subtle)] text-[var(--text)] border-[var(--border)] hover:border-brand-400"}`}>
                {p}
              </button>
            ))}
          </div>
          {toRemove.size > 0 && <p className="text-xs text-[var(--text-muted)]">Removing {toRemove.size} page(s). {pageCount - toRemove.size} will remain.</p>}
          <button onClick={remove} disabled={loading || toRemove.size === 0 || toRemove.size === pageCount} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Processing…" : "Download PDF without selected pages"}
          </button>
        </>
      )}
    </div>
  );
}
