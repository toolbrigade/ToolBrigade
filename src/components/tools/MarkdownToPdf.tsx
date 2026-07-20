"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function MarkdownToPdf() {
  const [input, setInput] = useState("");
  const [startTime] = useState(Date.now());

  async function convert() {
    if (!input.trim()) return;
    const { marked } = await import("marked");
    const html = await marked(input);
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head><style>
      body{font-family:sans-serif;margin:2cm;line-height:1.6;}
      h1,h2,h3{margin-top:1.5em;}
      pre{background:#f4f4f4;padding:1em;border-radius:4px;overflow-x:auto;}
      code{background:#f4f4f4;padding:2px 4px;border-radius:3px;}
      blockquote{border-left:4px solid #ccc;margin:0;padding-left:1em;color:#666;}
    </style></head><body>${html}</body></html>`);
    doc.close();
    await new Promise(r => setTimeout(r, 400));
    iframe.contentWindow!.print();
    document.body.removeChild(iframe);
    trackTaskComplete("markdown-to-pdf", startTime);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--text)]">Markdown Input</label>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder={"# Hello World\n\nWrite your **markdown** here…"}
          className="w-full h-72 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none focus:outline-none focus:border-brand-400" />
      </div>
      <button onClick={convert} disabled={!input.trim()} className="btn-primary text-sm disabled:opacity-50">
        Convert to PDF
      </button>
      <p className="text-xs text-[var(--text-muted)]">A print dialog will open — choose &quot;Save as PDF&quot; to download.</p>
    </div>
  );
}
