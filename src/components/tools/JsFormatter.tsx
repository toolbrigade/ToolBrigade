"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function basicFormat(js: string): string {
  let depth = 0;
  const lines: string[] = [];
  let current = "";
  let inStr: string | null = null;

  for (let i = 0; i < js.length; i++) {
    const c = js[i];
    if (inStr) { current += c; if (c === inStr && js[i - 1] !== "\\") inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; current += c; continue; }
    if (c === "{" || c === "[") { current += c; lines.push("  ".repeat(depth) + current.trim()); current = ""; depth++; }
    else if (c === "}" || c === "]") { if (current.trim()) { lines.push("  ".repeat(depth) + current.trim()); current = ""; } depth = Math.max(0, depth - 1); lines.push("  ".repeat(depth) + c); }
    else if (c === ";") { current += c; lines.push("  ".repeat(depth) + current.trim()); current = ""; }
    else { current += c; }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.filter(Boolean).join("\n");
}

export default function JsFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function format() { setOutput(basicFormat(input)); }
  function minify() { setOutput(input.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim()); }
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input JavaScript</label>
          <textarea className="textarea min-h-[240px]" placeholder="function hello(){console.log('hi')}" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            {output && <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>}
          </div>
          <textarea className="textarea min-h-[240px]" value={output} placeholder="Result appears here…" onChange={() => {}} />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={format} className="btn-primary">Format</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
      </div>
    </div>
  );
}
