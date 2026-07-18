"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function dedupe(input: string, caseSensitive: boolean) {
  const lines = input.split("\n");
  const seen = new Set<string>();
  const unique = lines.filter(l => {
    const key = caseSensitive ? l : l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
  return { unique, removed: lines.length - unique.length, total: lines.length };
}

export default function DuplicateLineRemover() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [copied, setCopied] = useState(false);

  const { unique, removed, total } = dedupe(input, caseSensitive);
  const output = unique.join("\n");

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  function handleInput(val: string) { setInput(val); }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
        <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-brand-600" />
        Case-sensitive comparison
      </label>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input ({total} lines)</label>
          <textarea
            className="textarea min-h-[240px]"
            placeholder="Paste lines here…"
            value={input}
            onChange={e => handleInput(e.target.value)}
            onInput={e => handleInput((e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output ({unique.length} lines{removed > 0 ? `, ${removed} removed` : ""})</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[240px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
