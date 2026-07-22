"use client";
import { useState } from "react";
import { Upload, Copy } from "lucide-react";

export default function PdfToText() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleFile(file: File) {
    setLoading(true); setError(""); setText("");
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
      let result = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        result += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n\n";
      }
      setText(result.trim());
    } catch {
      setError("Could not extract text. The PDF may be scanned or encrypted.");
    }
    setLoading(false);
  }

  function copy() { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PDF</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Extracting text…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <>
        {text && (
          <div className="flex justify-between items-center">
            <p className="text-xs text-[var(--text-muted)]">{text.split(/\s+/).length} words extracted</p>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
        )}
        <textarea className="textarea min-h-[300px]" readOnly value={text} />
      </>
    </div>
  );
}
