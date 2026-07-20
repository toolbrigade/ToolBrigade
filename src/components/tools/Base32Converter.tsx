"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = 0, value = 0, output = "";
  for (let j = 0; j < bytes.length; j++) {
    const byte = bytes[j];
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  while (output.length % 8 !== 0) output += "=";
  return output;
}

function base32Decode(input: string): string {
  const clean = input.toUpperCase().replace(/=+$/, "");
  let bits = 0, value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error(`Invalid Base32 character: ${char}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export default function Base32Converter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function convert() {
    setError("");
    try {
      setOutput(mode === "encode" ? base32Encode(input) : base32Decode(input));
      trackTaskComplete("base32-converter", startTime);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setOutput(""); setError(""); }}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors capitalize ${mode === m ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{mode === "encode" ? "Plain text" : "Base32 string"}</label>
          <textarea className="textarea min-h-[180px] font-mono text-sm" value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Hello, World!" : "JBSWY3DPEB3W64TMMQ======"} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[180px] font-mono text-sm" value={output} readOnly placeholder="Result appears here…" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={convert} className="btn-primary text-sm">{mode === "encode" ? "Encode →" : "Decode →"}</button>
    </div>
  );
}
