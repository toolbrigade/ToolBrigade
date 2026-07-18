"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

const ones = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

function toWords(n: number): string {
  if (n === 0) return "zero";
  if (n < 0) return "negative " + toWords(-n);
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + toWords(n % 100) : "");
  if (n < 1_000_000) return toWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + toWords(n % 1000) : "");
  if (n < 1_000_000_000) return toWords(Math.floor(n / 1_000_000)) + " million" + (n % 1_000_000 ? " " + toWords(n % 1_000_000) : "");
  return toWords(Math.floor(n / 1_000_000_000)) + " billion" + (n % 1_000_000_000 ? " " + toWords(n % 1_000_000_000) : "");
}

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const num = parseInt(input.replace(/,/g, ""), 10);
  const result = input && !isNaN(num) && Math.abs(num) < 1e12 ? toWords(num) : "";
  const error = input && (isNaN(num) || Math.abs(num) >= 1e12) ? "Enter a whole number up to 999 billion." : "";

  function copy() { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  function handleInput(val: string) { setInput(val); }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Number</label>
        <input className="input" placeholder="e.g. 1234567" value={input}
          onChange={e => handleInput(e.target.value)}
          onInput={e => handleInput((e.target as HTMLInputElement).value)} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <div className="bg-[var(--bg-subtle)] rounded-lg p-4 flex items-start justify-between gap-3">
          <p className="text-sm text-[var(--text)] capitalize leading-relaxed">{result}</p>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0 shrink-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
        </div>
      )}
    </div>
  );
}
