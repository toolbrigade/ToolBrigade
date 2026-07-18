"use client";

import { useState } from "react";

const conversions = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: (s: string) => s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { label: "camelCase", fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { label: "snake_case", fn: (s: string) => s.toLowerCase().replace(/\s+/g, "_") },
  { label: "kebab-case", fn: (s: string) => s.toLowerCase().replace(/\s+/g, "-") },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function convert(fn: (s: string) => string) {
    setResult(fn(text));
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <textarea
        className="textarea min-h-[120px]"
        placeholder="Enter text…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
      />
      <div className="flex flex-wrap gap-2">
        {conversions.map((c) => (
          <button key={c.label} onClick={() => convert(c.fn)} className="btn-secondary text-sm">
            {c.label}
          </button>
        ))}
      </div>
      <div className="relative">
        <textarea className="textarea min-h-[120px]" readOnly value={result} />
        {result && (
          <button onClick={copy} className="absolute top-2 right-2 btn-secondary text-xs px-3 py-1 min-h-[32px]">
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}
