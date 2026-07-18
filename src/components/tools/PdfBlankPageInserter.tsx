"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfBlankPageInserter() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [insertAfter, setInsertAfter] = useState(1);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab);
    setPageCount(doc.getPageCount()); setInsertAfter(doc.getPageCount());
  }

  async function insert() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument, PageSizes } = await import("pdf-lib");
    const src = await PDFDocument.load(buf);
    const out = await PDFDocument.create();
    const srcPages = await out.copyPages(src, src.getPageIndices());
    srcPages.forEach((p, i) => {
      out.addPage(p);
      if (i + 1 === insertAfter) {
        for (let j = 0; j < count; j++) out.addPage(PageSizes.A4);
      }
    });
    const bytes = await out.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-with-blanks.pdf`; a.click();
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
              <label className="text-xs text-[var(--text-muted)]">Insert after page</label>
              <input type="number" min={0} max={pageCount} value={insertAfter} className="input mt-1" onChange={e => setInsertAfter(+e.target.value)} />
              <p className="text-xs text-[var(--text-muted)] mt-1">0 = insert at beginning</p>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Number of blank pages</label>
              <input type="number" min={1} max={20} value={count} className="input mt-1" onChange={e => setCount(+e.target.value)} />
            </div>
          </div>
          <button onClick={insert} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Processing…" : "Insert Blank Pages & Download"}
          </button>
        </>
      )}
    </div>
  );
}
