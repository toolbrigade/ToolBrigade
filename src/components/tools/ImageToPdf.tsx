"use client";
import { useState } from "react";
import { Upload, Download, X } from "lucide-react";

export default function ImageToPdf() {
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  function addFiles(files: FileList) {
    const newImgs = Array.from(files).filter(f => f.type.startsWith("image/")).map(f => ({
      url: URL.createObjectURL(f), name: f.name
    }));
    setImages(prev => [...prev, ...newImgs]);
  }

  function remove(i: number) { setImages(prev => prev.filter((_, idx) => idx !== i)); }

  async function generate() {
    setLoading(true);
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    for (const { url } of images) {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      let img;
      try { img = await pdf.embedJpg(buf); } catch { img = await pdf.embedPng(buf); }
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const bytes = await pdf.save();
    const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "images.pdf"; a.click();
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload images (JPG / PNG)</span>
        <input type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded-lg border border-[var(--border)]" />
                <button onClick={() => remove(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={loading} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />{loading ? "Generating PDF…" : `Generate PDF (${images.length} page${images.length > 1 ? "s" : ""})`}
          </button>
        </>
      )}
    </div>
  );
}
