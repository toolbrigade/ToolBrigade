"use client";
import { useState } from "react";

type Diff = { type: "same" | "add" | "remove"; text: string };

function diffLines(a: string, b: string): Diff[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const m = aLines.length, n = bLines.length;
  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = aLines[i - 1] === bLines[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  // Backtrack
  const result: Diff[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.push({ type: "same", text: aLines[i - 1] }); i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: "add", text: bLines[j - 1] }); j--;
    } else {
      result.push({ type: "remove", text: aLines[i - 1] }); i--;
    }
  }
  return result.reverse();
}

export default function TextDiff() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [show, setShow] = useState(false);

  const diffs = diffLines(a, b);
  const adds = diffs.filter(d => d.type === "add").length;
  const removes = diffs.filter(d => d.type === "remove").length;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Original text</label>
          <textarea className="textarea min-h-[200px]" placeholder="Paste original text…" value={a} onChange={e => { setA(e.target.value); setShow(false); }} />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Modified text</label>
          <textarea className="textarea min-h-[200px]" placeholder="Paste modified text…" value={b} onChange={e => { setB(e.target.value); setShow(false); }} />
        </div>
      </div>
      <button onClick={() => setShow(true)} className="btn-primary">Compare</button>
      {show && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)]">
            <span className="text-green-600 font-medium">+{adds} added</span> · <span className="text-red-500 font-medium">-{removes} removed</span>
          </p>
          <div className="font-mono text-sm rounded-lg border border-[var(--border)] overflow-auto max-h-96">
            {diffs.map((d, i) => (
              <div key={i} className={`px-3 py-0.5 whitespace-pre-wrap ${d.type === "add" ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : d.type === "remove" ? "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300" : "text-[var(--text-muted)]"}`}>
                {d.type === "add" ? "+ " : d.type === "remove" ? "- " : "  "}{d.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
