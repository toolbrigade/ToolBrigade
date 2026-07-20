"use client";
import { useState } from "react";
import { trackTaskComplete } from "@/lib/trackUsage";

type DiffEntry = { path: string; type: "added" | "removed" | "changed"; oldVal?: unknown; newVal?: unknown };

function diffObjects(a: unknown, b: unknown, path = ""): DiffEntry[] {
  const results: DiffEntry[] = [];

  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      results.push({ path: path || "(root)", type: "changed", oldVal: a, newVal: b });
    }
    return results;
  }

  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);

  if (aIsArray !== bIsArray) {
    results.push({ path: path || "(root)", type: "changed", oldVal: a, newVal: b });
    return results;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set(Object.keys(aObj).concat(Object.keys(bObj)));

  for (const key of allKeys) {
    const childPath = path ? `${path}.${key}` : key;
    if (!(key in aObj)) {
      results.push({ path: childPath, type: "added", newVal: bObj[key] });
    } else if (!(key in bObj)) {
      results.push({ path: childPath, type: "removed", oldVal: aObj[key] });
    } else {
      results.push(...diffObjects(aObj[key], bObj[key], childPath));
    }
  }

  return results;
}

function fmt(v: unknown) {
  return JSON.stringify(v, null, 2);
}

export default function JsonDiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diffs, setDiffs] = useState<DiffEntry[] | null>(null);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  function compare() {
    setError(""); setDiffs(null);
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      const result = diffObjects(a, b);
      setDiffs(result);
      trackTaskComplete("json-diff-checker", startTime);
    } catch (e) {
      setError(String(e));
    }
  }

  const added = diffs?.filter(d => d.type === "added").length ?? 0;
  const removed = diffs?.filter(d => d.type === "removed").length ?? 0;
  const changed = diffs?.filter(d => d.type === "changed").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">JSON A (original)</label>
          <textarea className="textarea min-h-[220px] font-mono text-sm" placeholder='{"name":"Alice","age":30}' value={left} onChange={e => setLeft(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">JSON B (modified)</label>
          <textarea className="textarea min-h-[220px] font-mono text-sm" placeholder='{"name":"Alice","age":31,"city":"London"}' value={right} onChange={e => setRight(e.target.value)} />
        </div>
      </div>
      <button onClick={compare} className="btn-primary text-sm">Compare</button>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {diffs !== null && (
        <div className="space-y-3">
          <div className="flex gap-3 text-sm">
            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">+{added} added</span>
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">−{removed} removed</span>
            <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">~{changed} changed</span>
            {diffs.length === 0 && <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">✓ Identical</span>}
          </div>
          {diffs.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {diffs.map((d, i) => (
                <div key={i} className={`rounded-xl border p-3 text-sm font-mono ${
                  d.type === "added" ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" :
                  d.type === "removed" ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20" :
                  "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
                }`}>
                  <p className="font-semibold text-[var(--text)] mb-1">
                    {d.type === "added" ? "+" : d.type === "removed" ? "−" : "~"} {d.path}
                  </p>
                  {d.type === "changed" && (
                    <>
                      <p className="text-red-600 dark:text-red-400 text-xs">− {fmt(d.oldVal)}</p>
                      <p className="text-green-600 dark:text-green-400 text-xs">+ {fmt(d.newVal)}</p>
                    </>
                  )}
                  {d.type === "added" && <p className="text-green-600 dark:text-green-400 text-xs">+ {fmt(d.newVal)}</p>}
                  {d.type === "removed" && <p className="text-red-600 dark:text-red-400 text-xs">− {fmt(d.oldVal)}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
