"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function TextReverser() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chars" | "words" | "lines">("chars");
  const [copied, setCopied] = useState(false);

  const output = mode === "chars" ? input.split("").reverse().join("")
    : mode === "words" ? input.split(/\s+/).reverse().join(" ")
    : input.split("\n").reverse().join("\n");

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["chars", "words", "lines"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} className={mode === m ? "btn-primary text-sm" : "btn-secondary text-sm"}>
            {m === "chars" ? "Characters" : m === "words" ? "Words" : "Lines"}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea className="textarea min-h-[200px]" placeholder="Type or paste text…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Reversed</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[200px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
