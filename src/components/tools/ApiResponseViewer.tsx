"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

function typeLabel(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return `array[${v.length}]`;
  return typeof v;
}

function typeColor(v: JsonValue): string {
  if (v === null) return "text-gray-400";
  if (typeof v === "string") return "text-green-600 dark:text-green-400";
  if (typeof v === "number") return "text-blue-600 dark:text-blue-400";
  if (typeof v === "boolean") return "text-purple-600 dark:text-purple-400";
  return "text-[var(--text-muted)]";
}

function TreeNode({ name, value, depth = 0 }: { name?: string; value: JsonValue; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isComplex = typeof value === "object" && value !== null;
  const entries = isComplex ? (Array.isArray(value) ? value.map((v, i) => [String(i), v] as [string, JsonValue]) : Object.entries(value as Record<string, JsonValue>)) : [];

  return (
    <div className="text-sm font-mono">
      <div className="flex items-start gap-1 hover:bg-[var(--bg-subtle)] rounded px-1 py-0.5 cursor-pointer" onClick={() => isComplex && setOpen(o => !o)}>
        <span className="shrink-0 w-4 mt-0.5">
          {isComplex ? (open ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : null}
        </span>
        {name !== undefined && <span className="text-[var(--text)] font-semibold">{name}: </span>}
        {isComplex ? (
          <span className="text-[var(--text-muted)]">
            {Array.isArray(value) ? "[" : "{"}
            {!open && <span className="text-xs"> {entries.length} {Array.isArray(value) ? "items" : "keys"} </span>}
            {!open && (Array.isArray(value) ? "]" : "}")}
          </span>
        ) : (
          <span className={typeColor(value)}>
            {typeof value === "string" ? `"${value}"` : String(value)}
            <span className="text-xs text-[var(--text-muted)] ml-2 opacity-60">{typeLabel(value)}</span>
          </span>
        )}
      </div>
      {isComplex && open && (
        <div className="ml-5 border-l border-[var(--border)] pl-3">
          {entries.map(([k, v]) => <TreeNode key={k} name={k} value={v} depth={depth + 1} />)}
          <div className="text-[var(--text-muted)] px-1">{Array.isArray(value) ? "]" : "}"}</div>
        </div>
      )}
    </div>
  );
}

export default function ApiResponseViewer() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<JsonValue | null>(null);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function parse() {
    setError(""); setParsed(null);
    try {
      setParsed(JSON.parse(input));
      trackTaskComplete("api-response-viewer", startTime);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Paste JSON API Response</label>
        <textarea className="textarea min-h-[160px] font-mono text-sm" placeholder='{"status":"ok","data":{"users":[{"id":1,"name":"Alice"}]}}' value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <button onClick={parse} className="btn-primary text-sm">Parse & View Tree</button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {parsed !== null && (
        <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--surface)] overflow-auto max-h-[500px]">
          <TreeNode value={parsed} />
        </div>
      )}
    </div>
  );
}
