"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function DocxToPdf() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());

  async function handleFile(file: File) {
    setLoading(true); setError(""); setDone(false);
    try {
      const mammoth = await import("mammoth");
      const ab = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: ab });

      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument!;
      doc.open();
      doc.write(`<!DOCTYPE html><html><head><style>body{font-family:sans-serif;margin:2cm;}</style></head><body>${html}</body></html>`);
      doc.close();

      await new Promise(r => setTimeout(r, 500));
      iframe.contentWindow!.print();
      document.body.removeChild(iframe);

      setDone(true);
      trackTaskComplete("docx-to-pdf", startTime);
    } catch { setError("Could not convert file. Please try a valid .docx file."); }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload DOCX</span>
        <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Converting… use the print dialog to save as PDF.</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {done && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <Download size={16} />
          Print dialog opened — choose &quot;Save as PDF&quot; to download.
        </div>
      )}
    </div>
  );
}
