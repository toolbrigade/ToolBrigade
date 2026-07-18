"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfRotator() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(ab);
    const count = doc.getPageCount();
    setPageCount(count); setRotations(Array(count).fill(0));
  }

  function setRot(i: number, deg: number) {
    setRotations(prev => { const a = [...prev]; a[i] = deg; return a; });
  }

  async function save() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument, degrees } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf);
    doc.getPages().forEach((p, i) => { if (rotations[i]) p.setRotation(degrees(rotations[i])); });
    const bytes = await doc.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-rotated.pdf`; a.click();
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
          <ul className="space-y-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <li key={i} className="flex items-center gap-3 bg-[var(--bg-subtle)] rounded-lg px-3 py-2 text-sm">
                <span className="text-[var(--text)] flex-1">Page {i + 1}</span>
                {[0, 90, 180, 270].map(deg => (
                  <button key={deg} onClick={() => setRot(i, deg)}
                    className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${rotations[i] === deg ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
                    {deg}°
                  </button>
                ))}
              </li>
            ))}
          </ul>
          <button onClick={save} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Saving…" : "Download Rotated PDF"}
          </button>
        </>
      )}
    </div>
  );
}
