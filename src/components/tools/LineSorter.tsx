"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function LineSorter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"az" | "za" | "len-asc" | "len-desc" | "random">("az");
  const [copied, setCopied] = useState(false);

  const lines = input.split("\n");
  const sorted = [...lines].sort((a, b) => {
    if (mode === "az") return a.localeCompare(b);
    if (mode === "za") return b.localeCompare(a);
    if (mode === "len-asc") return a.length - b.length;
    if (mode === "len-desc") return b.length - a.length;
    return Math.random() - 0.5;
  });
  const output = sorted.join("\n");

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const modes = [{ id: "az", label: "A → Z" }, { id: "za", label: "Z → A" }, { id: "len-asc", label: "Shortest first" }, { id: "len-desc", label: "Longest first" }, { id: "random", label: "Shuffle" }] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={mode === m.id ? "btn-primary text-sm" : "btn-secondary text-sm"}>{m.label}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea className="textarea min-h-[240px]" placeholder="Paste lines here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Sorted</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[240px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
