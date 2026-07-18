"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

function formatXml(xml: string, indent = 2): string {
  let formatted = ""; let depth = 0;
  const pad = () => " ".repeat(depth * indent);
  xml.replace(/>\s*</g, ">\n<").split("\n").forEach(node => {
    node = node.trim();
    if (!node) return;
    if (node.match(/^<\/\w/)) depth--;
    formatted += pad() + node + "\n";
    if (node.match(/^<\w[^>]*[^/]>.*$/) && !node.match(/<.*>.*<\/.*>/)) depth++;
  });
  return formatted.trim();
}

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      const err = doc.querySelector("parsererror");
      if (err) throw new Error(err.textContent ?? "Invalid XML");
      setOutput(formatXml(input)); setError("");
    } catch (e) { setError((e as Error).message); setOutput(""); }
  }

  function minify() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "application/xml");
      if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
      setOutput(input.replace(/>\s+</g, "><").trim()); setError("");
    } catch (e) { setError((e as Error).message); setOutput(""); }
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input XML</label>
          <textarea className="textarea min-h-[240px]" placeholder="<root><item>value</item></root>" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[240px]" value={output} placeholder="Result appears here…" readOnly />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={format} className="btn-primary">Format</button>
        <button onClick={minify} className="btn-secondary">Minify</button>
      </div>
    </div>
  );
}
