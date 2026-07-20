"use client";
import { useState, useRef } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

const ACTIONS = [
  { cmd: "bold", label: "B", style: "font-bold" },
  { cmd: "italic", label: "I", style: "italic" },
  { cmd: "underline", label: "U", style: "underline" },
  { cmd: "strikeThrough", label: "S", style: "line-through" },
];

export default function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  function exec(cmd: string) {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  }

  function copyHtml() {
    const html = editorRef.current?.innerHTML ?? "";
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackTaskComplete("rich-text-editor", startTime);
  }

  function downloadHtml() {
    const html = `<!DOCTYPE html><html><body>${editorRef.current?.innerHTML ?? ""}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = "document.html";
    a.click();
    trackTaskComplete("rich-text-editor", startTime);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
        {ACTIONS.map(({ cmd, label, style }) => (
          <button key={cmd} onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className={`px-3 py-1 text-sm rounded hover:bg-[var(--border)] ${style}`}>
            {label}
          </button>
        ))}
        <button onMouseDown={e => { e.preventDefault(); exec("insertOrderedList"); }}
          className="px-3 py-1 text-sm rounded hover:bg-[var(--border)]">OL</button>
        <button onMouseDown={e => { e.preventDefault(); exec("insertUnorderedList"); }}
          className="px-3 py-1 text-sm rounded hover:bg-[var(--border)]">UL</button>
        <select onMouseDown={e => e.stopPropagation()}
          onChange={e => { exec("formatBlock"); document.execCommand("formatBlock", false, e.target.value); editorRef.current?.focus(); }}
          className="px-2 py-1 text-sm rounded border border-[var(--border)] bg-[var(--surface)]">
          <option value="p">Paragraph</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
      </div>
      <div ref={editorRef} contentEditable suppressContentEditableWarning
        className="min-h-[300px] p-4 border border-[var(--border)] rounded-xl focus:outline-none focus:border-brand-400 text-[var(--text)] bg-[var(--surface)]"
        data-placeholder="Start typing here…"
      />
      <div className="flex gap-2">
        <button onClick={copyHtml} className="btn-primary text-sm">
          {copied ? "Copied!" : "Copy HTML"}
        </button>
        <button onClick={downloadHtml} className="btn-secondary text-sm">Download HTML</button>
      </div>
    </div>
  );
}
