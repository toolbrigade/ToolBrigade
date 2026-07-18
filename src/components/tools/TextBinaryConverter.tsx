"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function TextBinaryConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  try {
    if (mode === "encode") {
      output = input.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    } else {
      output = input.trim().split(/\s+/).filter(Boolean).map(b => String.fromCharCode(parseInt(b, 2))).join("");
    }
  } catch { error = "Invalid binary input."; }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("encode")} className={mode === "encode" ? "btn-primary" : "btn-secondary"}>Text → Binary</button>
        <button onClick={() => setMode("decode")} className={mode === "decode" ? "btn-primary" : "btn-secondary"}>Binary → Text</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{mode === "encode" ? "Text" : "Binary (space-separated bytes)"}</label>
          <textarea className="textarea min-h-[200px]" placeholder={mode === "encode" ? "Hello World" : "01001000 01100101 01101100 01101100 01101111"} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">{mode === "encode" ? "Binary" : "Text"}</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[200px]" readOnly value={error || output} />
        </div>
      </div>
    </div>
  );
}
