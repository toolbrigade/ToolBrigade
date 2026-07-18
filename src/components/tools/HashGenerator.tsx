"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

async function hash(algo: string, text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  async function generate() {
    const [sha1, sha256, sha512] = await Promise.all([
      hash("SHA-1", input),
      hash("SHA-256", input),
      hash("SHA-512", input),
    ]);
    setHashes({ "SHA-1": sha1, "SHA-256": sha256, "SHA-512": sha512 });
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2 text-xs text-amber-700 dark:text-amber-300">
        Note: MD5 is not available in the Web Crypto API. SHA-1, SHA-256, and SHA-512 are provided instead.
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input text</label>
        <textarea
          className="textarea min-h-[100px]"
          placeholder="Enter text to hash…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onInput={e => setInput((e.target as HTMLTextAreaElement).value)}
        />
      </div>
      <button onClick={generate} disabled={!input} className="btn-primary">Generate Hashes</button>
      {Object.entries(hashes).map(([algo, val]) => (
        <div key={algo} className="space-y-1">
          <label className="text-xs font-medium text-[var(--text-muted)]">{algo}</label>
          <div className="flex items-center gap-2 bg-[var(--bg-subtle)] rounded-lg px-3 py-2">
            <code className="text-xs font-mono text-[var(--text)] break-all flex-1">{val}</code>
            <CopyButton text={val} />
          </div>
        </div>
      ))}
    </div>
  );
}
