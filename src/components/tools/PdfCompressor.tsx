"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

function fmt(b: number) { return b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(2)} MB`; }

export default function PdfCompressor() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [origSize, setOrigSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ size: number; url: string } | null>(null);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setOrigSize(file.size); setFileName(file.name.replace(".pdf", "")); setResult(null);
  }

  async function compress() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    const bytes = await doc.save({ useObjectStreams: true });
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    setResult({ size: blob.size, url: URL.createObjectURL(blob) });
    setLoading(false);
  }

  const saving = result ? Math.round((1 - result.size / origSize) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
        This tool re-saves the PDF with object stream compression. Results vary — PDFs already optimised may not shrink further.
      </div>
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {buf && (
        <>
          <p className="text-sm text-[var(--text-muted)] text-center">Original size: <strong className="text-[var(--text)]">{fmt(origSize)}</strong></p>
          <button onClick={compress} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            {loading ? "Compressing…" : "Compress PDF"}
          </button>
          {result && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center"><p className="text-sm font-semibold text-[var(--text)]">{fmt(origSize)}</p><p className="text-xs text-[var(--text-muted)]">Original</p></div>
              <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center"><p className="text-sm font-semibold text-[var(--text)]">{fmt(result.size)}</p><p className="text-xs text-[var(--text-muted)]">Compressed</p></div>
              <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center"><p className={`text-sm font-semibold ${saving > 0 ? "text-green-600" : "text-[var(--text)]"}`}>{saving > 0 ? `-${saving}%` : `+${Math.abs(saving)}%`}</p><p className="text-xs text-[var(--text-muted)]">Change</p></div>
            </div>
          )}
          {result && (
            <a href={result.url} download={`${fileName}-compressed.pdf`} className="btn-primary flex items-center gap-2 w-full justify-center">
              <Download size={16} />Download Compressed PDF
            </a>
          )}
        </>
      )}
    </div>
  );
}
