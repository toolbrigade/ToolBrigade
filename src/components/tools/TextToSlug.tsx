"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function toSlug(input: string, separator: string) {
  return input.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim().replace(/\s+/g, separator);
}

export default function TextToSlug() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = toSlug(input, separator);

  function copy() { navigator.clipboard.writeText(slug); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  function handleInput(val: string) { setInput(val); }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)]">Separator</label>
        <div className="flex gap-2 mt-1">
          {["-", "_", "."].map(s => (
            <button key={s} onClick={() => setSeparator(s)} className={separator === s ? "btn-primary text-sm px-3" : "btn-secondary text-sm px-3"}>{s === "-" ? "Hyphen (-)" : s === "_" ? "Underscore (_)" : "Dot (.)"}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input text</label>
        <input
          className="input"
          placeholder="My Blog Post Title Here!"
          value={input}
          onChange={e => handleInput(e.target.value)}
          onInput={e => handleInput((e.target as HTMLInputElement).value)}
        />
      </div>
      {slug && (
        <div className="bg-[var(--bg-subtle)] rounded-lg p-4 flex items-center justify-between gap-3">
          <code className="text-sm text-brand-600 dark:text-brand-400 break-all">{slug}</code>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0 shrink-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
        </div>
      )}
    </div>
  );
}
