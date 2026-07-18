"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function WhitespaceRemover() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"trim" | "all" | "extra" | "lines">("trim");

  const output = mode === "trim" ? input.split("\n").map(l => l.trim()).join("\n")
    : mode === "all" ? input.replace(/\s/g, "")
    : mode === "extra" ? input.replace(/[ \t]+/g, " ").split("\n").map(l => l.trim()).join("\n")
    : input.split("\n").filter(l => l.trim()).join("\n");

  const modes = [
    { id: "trim", label: "Trim lines" },
    { id: "extra", label: "Remove extra spaces" },
    { id: "lines", label: "Remove blank lines" },
    { id: "all", label: "Remove all whitespace" },
  ] as const;

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
          <textarea className="textarea min-h-[200px]" placeholder="Paste text here…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[200px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
