"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function TextToHtml() {
  const [input, setInput] = useState("");
  const [wrapTag, setWrapTag] = useState<"p" | "div" | "span">("p");
  const [copied, setCopied] = useState(false);

  const output = input.split("\n\n").filter(p => p.trim()).map(p => {
    const escaped = p.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
    return `<${wrapTag}>${escaped}</${wrapTag}>`;
  }).join("\n");

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <span className="text-sm text-[var(--text-muted)]">Wrap paragraphs in:</span>
        {(["p", "div", "span"] as const).map(t => (
          <button key={t} onClick={() => setWrapTag(t)} className={wrapTag === t ? "btn-primary text-sm px-3" : "btn-secondary text-sm px-3"}>&lt;{t}&gt;</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Plain text (blank line = new paragraph)</label>
          <textarea className="textarea min-h-[240px]" placeholder="First paragraph.&#10;&#10;Second paragraph." value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">HTML</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[240px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
