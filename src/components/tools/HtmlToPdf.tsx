"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function HtmlToPdf() {
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now());

  function convert() {
    if (!input.trim()) return;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(input);
    doc.close();
    setTimeout(() => {
      iframe.contentWindow!.print();
      document.body.removeChild(iframe);
      trackTaskComplete("html-to-pdf", startTime);
    }, 400);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--text)]">HTML Input</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder={"<h1>Hello</h1>\n<p>Your HTML here…</p>"}
          className="w-full h-72 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none focus:outline-none focus:border-brand-400" />
      </div>
      <button onClick={convert} disabled={!input.trim()} className="btn-primary text-sm disabled:opacity-50">
        Convert to PDF
      </button>
      <p className="text-xs text-[var(--text-muted)]">A print dialog will open — choose &quot;Save as PDF&quot; to download.</p>
    </div>
  );
}
