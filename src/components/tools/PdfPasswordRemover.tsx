"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfPasswordRemover() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", "")); setError("");
  }

  async function remove() {
    if (!buf) return;
    setLoading(true); setError("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(buf, { ...(password ? { password } : { ignoreEncryption: true }) } as Parameters<typeof PDFDocument.load>[1]);
      const bytes = await doc.save();
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      a.download = `${fileName}-unlocked.pdf`; a.click();
    } catch {
      setError("Could not unlock this PDF. The password may be incorrect, or the PDF uses strong user-level encryption that cannot be removed client-side.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
        This tool only removes owner/permissions passwords. It cannot bypass strong user-level encryption without the correct password.
      </div>
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {buf && (
        <>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Password (if required)</label>
            <input type="password" className="input mt-1" placeholder="Leave blank if no password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button onClick={remove} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Processing…" : "Remove Password & Download"}
          </button>
        </>
      )}
    </div>
  );
}
