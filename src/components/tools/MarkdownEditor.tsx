"use client";
import { useState, useRef } from "react";
import { Download, Bold, Italic, Heading1, Heading2, Link, List } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

function parseMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, "<p>$1</p>");
}

const PLACEHOLDER = `# My Document\n\nWrite **Markdown** here.\n\n## Section\n\n- Item one\n- Item two\n`;

export default function MarkdownEditor() {
  const [md, setMd] = useState(PLACEHOLDER);
  const [startTime] = useState(Date.now());
  const taRef = useRef<HTMLTextAreaElement>(null);

  function insert(before: string, after = "") {
    const ta = taRef.current!;
    const start = ta.selectionStart; const end = ta.selectionEnd;
    const sel = md.slice(start, end);
    const next = md.slice(0, start) + before + sel + after + md.slice(end);
    setMd(next);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + sel.length); }, 0);
  }

  function downloadMd() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    a.download = "document.md"; a.click();
    trackTaskComplete("markdown-editor", startTime);
  }

  function downloadHtml() {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Document</title></head><body>${parseMarkdown(md)}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = "document.html"; a.click();
    trackTaskComplete("markdown-editor", startTime);
  }

  async function downloadPdf() {
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const lines = md.split("\n");
    let page = doc.addPage([595, 842]);
    let y = 800;
    for (const line of lines) {
      if (y < 40) { page = doc.addPage([595, 842]); y = 800; }
      const size = line.startsWith("# ") ? 18 : line.startsWith("## ") ? 14 : 11;
      const text = line.replace(/^#{1,3} /, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
      page.drawText(text || " ", { x: 40, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 6;
    }
    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
    a.download = "document.pdf"; a.click();
    trackTaskComplete("markdown-editor", startTime);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 p-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg">
        <button onClick={() => insert("**", "**")} className="btn-secondary p-1.5 min-h-0" title="Bold" aria-label="Bold"><Bold size={14} /></button>
        <button onClick={() => insert("*", "*")} className="btn-secondary p-1.5 min-h-0" title="Italic" aria-label="Italic"><Italic size={14} /></button>
        <button onClick={() => insert("# ")} className="btn-secondary p-1.5 min-h-0" title="H1" aria-label="Heading 1"><Heading1 size={14} /></button>
        <button onClick={() => insert("## ")} className="btn-secondary p-1.5 min-h-0" title="H2" aria-label="Heading 2"><Heading2 size={14} /></button>
        <button onClick={() => insert("[", "](url)")} className="btn-secondary p-1.5 min-h-0" title="Link" aria-label="Link"><Link size={14} /></button>
        <button onClick={() => insert("- ")} className="btn-secondary p-1.5 min-h-0" title="List item" aria-label="List item"><List size={14} /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Markdown</label>
          <textarea ref={taRef} className="textarea min-h-[360px] font-mono text-sm" value={md} onChange={e => setMd(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Preview</label>
          <div className="min-h-[360px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text)] overflow-auto prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }} />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button onClick={downloadMd} className="btn-primary flex items-center gap-2"><Download size={14} />Download .md</button>
        <button onClick={downloadHtml} className="btn-secondary flex items-center gap-2"><Download size={14} />Download .html</button>
        <button onClick={downloadPdf} className="btn-secondary flex items-center gap-2"><Download size={14} />Download .pdf</button>
      </div>
    </div>
  );
}
