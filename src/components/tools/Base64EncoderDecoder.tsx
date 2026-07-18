"use client";

import { useState } from "react";

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function encode() {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch {
      setError("Encoding failed.");
    }
  }

  function decode() {
    try {
      const cleaned = input.replace(/\s/g, "");
      if (!cleaned) throw new Error("empty");
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) throw new Error("invalid");
      setOutput(decodeURIComponent(escape(atob(cleaned))));
      setError("");
    } catch {
      setError("Invalid Base64 string.");
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
            placeholder="Enter text or Base64…"
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
