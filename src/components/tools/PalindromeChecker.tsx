"use client";
import { useState } from "react";

export default function PalindromeChecker() {
  const [input, setInput] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);
  const [ignorePunct, setIgnorePunct] = useState(true);

  let cleaned = input;
  if (ignoreCase) cleaned = cleaned.toLowerCase();
  if (ignoreSpaces) cleaned = cleaned.replace(/\s/g, "");
  if (ignorePunct) cleaned = cleaned.replace(/[^a-z0-9]/gi, "");

  const reversed = cleaned.split("").reverse().join("");
  const isPalindrome = cleaned.length > 0 && cleaned === reversed;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Enter text</label>
        <input className="input" placeholder="racecar, A man a plan a canal Panama…" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {[["ignoreCase", "Ignore case", ignoreCase, setIgnoreCase], ["ignoreSpaces", "Ignore spaces", ignoreSpaces, setIgnoreSpaces], ["ignorePunct", "Ignore punctuation", ignorePunct, setIgnorePunct]].map(([key, label, val, set]) => (
          <label key={key as string} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={val as boolean} onChange={e => (set as (v: boolean) => void)(e.target.checked)} className="accent-brand-600" />
            {label as string}
          </label>
        ))}
      </div>
      {input && (
        <div className={`rounded-xl p-6 text-center border-2 ${isPalindrome ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-red-300 bg-red-50 dark:bg-red-900/20"}`}>
          <p className={`text-3xl font-bold mb-1 ${isPalindrome ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
            {isPalindrome ? "✓ Palindrome!" : "✗ Not a palindrome"}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Cleaned: <code className="font-mono">{cleaned}</code></p>
        </div>
      )}
    </div>
  );
}
