"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={copy}
      disabled={!text}
      aria-label="Copy to clipboard"
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 min-h-0 disabled:opacity-40 disabled:cursor-not-allowed
        ${copied
          ? "bg-[var(--brand-secondary)] border-[var(--brand-secondary)] text-white scale-95"
          : "bg-transparent border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--brand)]"
        } ${className}`}
    >
      <span className={`transition-all duration-150 ${copied ? "scale-110" : "scale-100"}`}>
        {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={1.75} />}
      </span>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
