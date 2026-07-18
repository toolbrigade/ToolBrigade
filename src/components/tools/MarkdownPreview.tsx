"use client";

import { useState } from "react";

// Minimal markdown parser — no external deps
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

const PLACEHOLDER = `# Hello, ToolBrigade!

Write **Markdown** here and see a *live preview*.

## Features
- Headings
- Bold and italic
- \`inline code\`
- [Links](https://toolbrigade.com)
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(PLACEHOLDER);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Markdown</label>
        <textarea className="textarea min-h-[320px]" value={md} onChange={(e) => setMd(e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Preview</label>
        <div
          className="min-h-[320px] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text)] prose-headings:font-semibold overflow-auto"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }}
        />
      </div>
    </div>
  );
}
