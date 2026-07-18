"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

function formatCss(css: string): string {
  return css
    .replace(/\s*{\s*/g, " {\n  ")
    .replace(/;\s*/g, ";\n  ")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/  \n}/g, "\n}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function CssFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  function format() { setOutput(formatCss(input)); }
  function minify() { setOutput(input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>~+])\s*/g, "$1").trim()); }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input CSS</label>
          <textarea className="textarea min-h-[240px]" placeholder=".btn{color:red;font-size:16px}" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[240px]" value={output} placeholder="Result appears here…" readOnly />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={format} className="btn-primary">Format</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
      </div>
    </div>
  );
}
