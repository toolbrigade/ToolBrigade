"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfMetadata() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [info, setInfo] = useState<{ pageCount: number; title: string; author: string; subject: string; creator: string } | null>(null);
  const [title, setTitle] = useState(""); const [author, setAuthor] = useState(""); const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab, { ignoreEncryption: true });
    const meta = { pageCount: doc.getPageCount(), title: doc.getTitle() ?? "", author: doc.getAuthor() ?? "", subject: doc.getSubject() ?? "", creator: doc.getCreator() ?? "" };
    setInfo(meta); setTitle(meta.title); setAuthor(meta.author); setSubject(meta.subject);
  }

  async function save() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    doc.setTitle(title); doc.setAuthor(author); doc.setSubject(subject);
    const bytes = await doc.save();
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
      {info && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center"><p className="text-xl font-semibold text-brand-600 dark:text-brand-400">{info.pageCount}</p><p className="text-xs text-[var(--text-muted)]">Pages</p></div>
            <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center"><p className="text-sm font-semibold text-[var(--text)] truncate">{info.creator || "Unknown"}</p><p className="text-xs text-[var(--text-muted)]">Creator</p></div>
          </div>
          <div className="space-y-3">
            {[["Title", title, setTitle], ["Author", author, setAuthor], ["Subject", subject, setSubject]].map(([label, val, set]) => (
              <div key={label as string}>
                <label className="text-xs text-[var(--text-muted)]">{label as string}</label>
                <input className="input mt-1" value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Saving…" : "Save with Updated Metadata"}
          </button>
        </>
      )}
    </div>
  );
}
