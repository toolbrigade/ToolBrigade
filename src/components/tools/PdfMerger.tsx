"use client";
import { useState } from "react";
import { Upload, Download, X } from "lucide-react";

export default function PdfMerger() {
  const [files, setFiles] = useState<{ name: string; buf: ArrayBuffer }[]>([]);
  const [loading, setLoading] = useState(false);

  function addFiles(fl: FileList) {
    Array.from(fl).filter(f => f.type === "application/pdf").forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setFiles(prev => [...prev, { name: f.name, buf: e.target!.result as ArrayBuffer }]);
      reader.readAsArrayBuffer(f);
    });
  }

  async function merge() {
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const merged = await PDFDocument.create();
    for (const { buf } of files) {
      const doc = await PDFDocument.load(buf);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const bytes = await merged.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" })); a.download = "merged.pdf"; a.click();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDFs</span>
        <input type="file" accept="application/pdf" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>
      {files.length > 0 && (
        <>
          <ul className="space-y-2">
            {files.map((f, i) => (
              <li key={i} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-3 py-2 text-sm">
                <span className="text-[var(--text)] truncate">{f.name}</span>
                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-[var(--text-muted)] hover:text-red-500 ml-2"><X size={14} /></button>
              </li>
            ))}
          </ul>
          <button onClick={merge} disabled={loading || files.length < 2} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Merging…" : `Merge ${files.length} PDFs`}
          </button>
          {files.length < 2 && <p className="text-xs text-[var(--text-muted)] text-center">Add at least 2 PDFs to merge.</p>}
        </>
      )}
    </div>
  );
}
