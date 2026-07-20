"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function PdfToWord() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setDone(false);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      const paragraphs: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ").trim();
        if (text) paragraphs.push(text);
      }

      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({ text: file.name.replace(/\.pdf$/i, ""), heading: HeadingLevel.HEADING_1 }),
            ...paragraphs.map(p => new Paragraph({ children: [new TextRun(p)] })),
          ],
        }],
      });
      const blob = await Packer.toBlob(doc);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name.replace(/\.pdf$/i, ".docx"); a.click();
      setDone(true);
      trackTaskComplete("pdf-to-word", startTime);
    } catch { setError("Could not convert PDF. It may be scanned or encrypted."); }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Extracting text and building DOCX via the docx library…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <Download size={16} />
          DOCX downloaded. Note: complex layouts, tables, and images may not be preserved — only text content is extracted.
        </div>
      )}
    </div>
  );
}
