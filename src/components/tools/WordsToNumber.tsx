"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

const ONES: Record<string, number> = { zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19 };
const TENS: Record<string, number> = { twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90 };
const MULTS: Record<string, number> = { hundred:100,thousand:1000,million:1_000_000,billion:1_000_000_000 };

function wordsToNum(input: string): number | null {
  const words = input.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/[\s-]+/);
  let total = 0, current = 0;
  let negative = false;
  if (words[0] === "negative" || words[0] === "minus") { negative = true; words.shift(); }
  for (const w of words) {
    if (w === "and") continue;
    if (w in ONES) current += ONES[w];
    else if (w in TENS) current += TENS[w];
    else if (w === "hundred") current *= 100;
    else if (w in MULTS) { total += current * MULTS[w]; current = 0; }
    else return null;
  }
  total += current;
  return negative ? -total : total;
}

export default function WordsToNumber() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = input.trim() ? wordsToNum(input) : null;
  const error = input.trim() && result === null ? "Could not parse. Try: 'one hundred twenty three'" : "";

  function copy() { if (result !== null) { navigator.clipboard.writeText(String(result)); setCopied(true); setTimeout(() => setCopied(false), 1500); } }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Number in words</label>
        <input className="input" placeholder="e.g. two million five hundred thousand" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result !== null && (
        <div className="bg-[var(--bg-subtle)] rounded-lg p-4 flex items-center justify-between gap-3">
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{result.toLocaleString()}</p>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
        </div>
      )}
    </div>
  );
}
