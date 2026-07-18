"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function PdfWatermark() {
  const [buf, setBuf] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    const ab = await file.arrayBuffer();
    setBuf(ab); setFileName(file.name.replace(".pdf", ""));
  }

  async function apply() {
    if (!buf) return;
    setLoading(true);
    const { PDFDocument, rgb, degrees } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
    const pages = doc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 2 - (text.length * 18) / 2,
        y: height / 2,
        size: 48,
        color: rgb(0.5, 0.5, 0.5),
        opacity: opacity / 100,
        rotate: degrees(45),
      });
    }
    const bytes = await doc.save();
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = `${fileName}-watermarked.pdf`; a.click();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {buf && (
        <>
          <div>
            <label className="text-xs text-[var(--text-muted)]">Watermark text</label>
            <input className="input mt-1" value={text} onChange={e => setText(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[var(--text)]">Opacity: {opacity}%</label>
            <input type="range" min={5} max={100} value={opacity} className="w-full accent-brand-600" onChange={e => setOpacity(+e.target.value)} />
          </div>
          <button onClick={apply} disabled={loading || !text} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Applying…" : "Apply Watermark & Download"}
          </button>
        </>
      )}
    </div>
  );
}
