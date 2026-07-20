"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

// AP/Chicago style: small words stay lowercase unless first or last word
const SMALL_WORDS = new Set([
  "a","an","the","and","but","or","nor","for","so","yet",
  "at","by","in","of","on","to","up","as","is","it",
  "via","per","vs","vs.","etc",
]);

function toTitleCase(text: string): string {
  const words = text.split(/(\s+)/);
  const wordTokens = words.filter(w => !/^\s+$/.test(w));
  let wordIndex = 0;
  return words.map(token => {
    if (/^\s+$/.test(token)) return token;
    const isFirst = wordIndex === 0;
    const isLast = wordIndex === wordTokens.length - 1;
    wordIndex++;
    const lower = token.toLowerCase();
    if (!isFirst && !isLast && SMALL_WORDS.has(lower)) return lower;
    // Capitalise first letter, preserve rest
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join("");
}

export default function TitleCaseConverter() {
  const [input, setInput] = useState("");
  const output = input ? toTitleCase(input) : "";

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Uses AP / Chicago style: small words (a, the, of, and, etc.) stay lowercase unless they are the first or last word of the title.
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea
            className="textarea min-h-[140px]"
            placeholder="the lord of the rings: the return of the king"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Title Case Output</label>
            <CopyButton text={output} />
          </div>
          <textarea
            className="textarea min-h-[140px] bg-[var(--bg-subtle)]"
            readOnly
            value={output}
          />
        </div>
      </div>
    </div>
  );
}
