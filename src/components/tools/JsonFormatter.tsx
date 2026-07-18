"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function format() {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError("");
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      setOutput("");
    }
  }

  function minify() {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
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
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input JSON</label>
          <textarea
            className="textarea min-h-[240px]"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onInput={(e) => handleInput((e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[240px]" readOnly value={output} placeholder="Result appears here…" />
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
