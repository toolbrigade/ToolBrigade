"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfSplitter() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab);
    const count = doc.getPageCount();
    setPageCount(count); setFrom(1); setTo(count);
  }

  async function split() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const src = await PDFDocument.load(buf);
    const out = await PDFDocument.create();
    const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
    const pages = await out.copyPages(src, indices);
    pages.forEach(p => out.addPage(p));
    const bytes = await out.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-pages-${from}-${to}.pdf`; a.click();
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
          <p className="text-sm text-[var(--text-muted)] text-center">PDF has <strong className="text-[var(--text)]">{pageCount}</strong> pages</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)]">From page</label>
              <input type="number" min={1} max={to} value={from} className="input mt-1" onChange={e => setFrom(Math.min(+e.target.value, to))} />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">To page</label>
              <input type="number" min={from} max={pageCount} value={to} className="input mt-1" onChange={e => setTo(Math.max(+e.target.value, from))} />
            </div>
          </div>
          <button onClick={split} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Splitting…" : `Split pages ${from}–${to}`}
          </button>
        </>
      )}
    </div>
  );
}
