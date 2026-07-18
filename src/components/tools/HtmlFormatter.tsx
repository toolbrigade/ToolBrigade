"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function formatHtml(html: string): string {
  let depth = 0;
  const INLINE = new Set(["a","abbr","b","bdi","bdo","br","cite","code","data","dfn","em","i","kbd","mark","q","rp","rt","ruby","s","samp","small","span","strong","sub","sup","time","u","var","wbr"]);
  return html
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map(line => {
      line = line.trim();
      if (!line) return "";
      const isClose = /^<\//.test(line);
      const isSelf = /\/>$/.test(line) || /^<(br|hr|img|input|link|meta|area|base|col|embed|param|source|track)[\s>]/i.test(line);
      const tag = line.match(/^<\/?(\w+)/)?.[1]?.toLowerCase() ?? "";
      if (isClose && !INLINE.has(tag)) depth = Math.max(0, depth - 1);
      const out = "  ".repeat(depth) + line;
      if (!isClose && !isSelf && !INLINE.has(tag) && /^<\w/.test(line)) depth++;
      return out;
    })
    .filter(Boolean)
    .join("\n");
}

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function format() { setOutput(formatHtml(input)); }
  function minify() { setOutput(input.replace(/\s+/g, " ").replace(/>\s</g, "><").trim()); }
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input HTML</label>
          <textarea className="textarea min-h-[240px]" placeholder="<div><p>Hello</p></div>" value={input} onChange={e => setInput(e.target.value)} />
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
        <button onClick={format} className="btn-primary">Format / Beautify</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
      </div>
    </div>
  );
}
