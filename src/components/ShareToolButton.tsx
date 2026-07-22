"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareToolButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/tools/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] rounded-lg px-3 py-1.5 transition-colors hover:bg-[var(--bg-subtle)] whitespace-nowrap shrink-0"
      title="Copy link to this tool"
    >
      {copied ? (
        <>
          <Check size={13} className="text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={13} />
          Share this tool
        </>
      )}
    </button>
  );
}
