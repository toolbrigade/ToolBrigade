"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

function jsonToXml(obj: unknown, tag = "root", indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return `${pad}<${tag}/>`;
  if (typeof obj !== "object") return `${pad}<${tag}>${String(obj)}</${tag}>`;
  if (Array.isArray(obj)) return obj.map(item => jsonToXml(item, tag, indent)).join("\n");
  const children = Object.entries(obj as Record<string, unknown>)
    .map(([k, v]) => jsonToXml(v, k, indent + 1)).join("\n");
  return `${pad}<${tag}>\n${children}\n${pad}</${tag}>`;
}

export default function JsonToXml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function convert() {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(`<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(parsed)}`);
      trackTaskComplete("json-to-xml", startTime);
    } catch { setError("Invalid JSON. Please check your input."); }
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "application/xml" }));
    a.download = "output.xml";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">JSON Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder='{"name":"John","age":30}'
            className="w-full h-64 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none focus:outline-none focus:border-brand-400" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">XML Output</label>
          <textarea readOnly value={output}
            className="w-full h-64 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary text-sm">Convert to XML</button>
        {output && <button onClick={download} className="btn-secondary text-sm">Download XML</button>}
      </div>
    </div>
  );
}
