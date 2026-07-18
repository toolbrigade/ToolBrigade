"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function MarkdownToHtml() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  function convert(md: string): string {
    return md
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, (_, text, href) => {
        const safe = href.replace(/&amp;/g, "&");
        if (/^javascript:/i.test(safe.trim())) return text;
        return `<a href="${href}">${text}</a>`;
      })
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[hHuUlLpP])(.+)$/gm, "<p>$1</p>");
  }

  const output = convert(input);

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Markdown</label>
          <textarea className="textarea min-h-[280px]" placeholder="# Hello World&#10;**Bold** and *italic*" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">HTML</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[280px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
