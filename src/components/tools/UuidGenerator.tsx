"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  function generate() { setUuids(Array.from({ length: count }, uuid)); }
  function copy(s: string) { navigator.clipboard.writeText(s); setCopied(s); setTimeout(() => setCopied(""), 1500); }
  function copyAll() { navigator.clipboard.writeText(uuids.join("\n")); setCopied("all"); setTimeout(() => setCopied(""), 1500); }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Count</label>
          <input type="number" min={1} max={100} value={count} className="input mt-1 w-24"
            onChange={e => setCount(+e.target.value)}
            onInput={e => setCount(+(e.target as HTMLInputElement).value)} />
        </div>
        <button onClick={generate} className="btn-primary">Generate</button>
        {uuids.length > 0 && <button onClick={copyAll} className="btn-secondary text-sm">{copied === "all" ? "Copied all!" : "Copy all"}</button>}
      </div>
      {uuids.length > 0 && (
        <ul className="space-y-2">
          {uuids.map((u, i) => (
            <li key={i} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-3 py-2 gap-2">
              <code className="text-sm font-mono text-[var(--text)]">{u}</code>
              <button onClick={() => copy(u)} className="btn-secondary text-xs py-1 px-2 min-h-0 shrink-0 flex items-center gap-1"><Copy size={12} />{copied === u ? "✓" : "Copy"}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
