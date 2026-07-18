"use client";
import { useState } from "react";
import { Upload, Download, ArrowUp, ArrowDown } from "lucide-react";

export default function PdfPageReorder() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [order, setOrder] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab);
    setOrder(Array.from({ length: doc.getPageCount() }, (_, i) => i + 1));
  }

  function move(i: number, dir: -1 | 1) {
    setOrder(prev => { const a = [...prev]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; return a; });
  }

  async function save() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const src = await PDFDocument.load(buf);
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, order.map(p => p - 1));
    pages.forEach(p => out.addPage(p));
    const bytes = await out.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-reordered.pdf`; a.click();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {order.length > 0 && (
        <>
          <p className="text-xs text-[var(--text-muted)]">Use arrows to reorder pages:</p>
          <ul className="space-y-2">
            {order.map((p, i) => (
              <li key={i} className="flex items-center gap-2 bg-[var(--bg-subtle)] rounded-lg px-3 py-2 text-sm">
                <span className="text-[var(--text)] flex-1">Page {p}</span>
                <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 disabled:opacity-30 hover:text-brand-600"><ArrowUp size={14} /></button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="p-1 disabled:opacity-30 hover:text-brand-600"><ArrowDown size={14} /></button>
              </li>
            ))}
          </ul>
          <button onClick={save} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Saving…" : "Download Reordered PDF"}
          </button>
        </>
      )}
    </div>
  );
}
