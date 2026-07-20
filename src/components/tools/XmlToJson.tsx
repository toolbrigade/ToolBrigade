"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

function xmlNodeToObj(node: Element): unknown {
  if (node.children.length === 0) return node.textContent ?? "";
  const obj: Record<string, unknown> = {};
  for (const child of Array.from(node.children)) {
    const key = child.tagName;
    const val = xmlNodeToObj(child);
    if (key in obj) {
      if (!Array.isArray(obj[key])) obj[key] = [obj[key]];
      (obj[key] as unknown[]).push(val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

export default function XmlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function convert() {
    setError("");
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      const err = doc.querySelector("parsererror");
      if (err) throw new Error("parse error");
      const result = xmlNodeToObj(doc.documentElement);
      setOutput(JSON.stringify(result, null, 2));
      trackTaskComplete("xml-to-json", startTime);
    } catch { setError("Invalid XML. Please check your input."); }
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    a.download = "output.json";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">XML Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="<root><name>John</name></root>"
            className="w-full h-64 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none focus:outline-none focus:border-brand-400" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">JSON Output</label>
          <textarea readOnly value={output}
            className="w-full h-64 p-3 text-sm font-mono border border-[var(--border)] rounded-xl bg-[var(--surface)] resize-none" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={convert} className="btn-primary text-sm">Convert to JSON</button>
        {output && <button onClick={download} className="btn-secondary text-sm">Download JSON</button>}
      </div>
    </div>
  );
}
