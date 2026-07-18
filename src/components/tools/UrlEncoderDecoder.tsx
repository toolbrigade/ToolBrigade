"use client";

import { useState } from "react";

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function encode() {
    try {
      setOutput(encodeURIComponent(input));
      setError("");
    } catch {
      setError("Encoding failed.");
    }
  }

  function decode() {
    try {
      setOutput(decodeURIComponent(input));
      setError("");
    } catch {
      setError("Invalid URL-encoded string.");
    }
  }

  function handleInput(val: string) {
    setInput(val);
    setOutput("");
    setError("");
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea
            className="textarea min-h-[180px]"
            placeholder="Enter URL or encoded string…"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onInput={(e) => handleInput((e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Output</label>
          <textarea className="textarea min-h-[180px]" readOnly value={output} placeholder="Result appears here…" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button onClick={encode} className="btn-primary">Encode</button>
        <button onClick={decode} className="btn-secondary">Decode</button>
      </div>
    </div>
  );
}
