"use client";
import { useState } from "react";

const VALS = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"],  [90, "XC"],  [50, "L"],  [40, "XL"],
  [10, "X"],   [9, "IX"],   [5, "V"],   [4, "IV"],  [1, "I"],
] as [number, string][];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "Out of range (1–3999)";
  let result = "";
  for (const [val, sym] of VALS) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s: string): number | null {
  const map: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  s = s.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(s)) return null;
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]], next = map[s[i + 1]];
    if (next && cur < next) { total -= cur; } else { total += cur; }
  }
  return total;
}

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<"to-roman" | "from-roman">("to-roman");
  const [input, setInput] = useState("2024");

  let output = "";
  if (mode === "to-roman") {
    const n = parseInt(input);
    output = isNaN(n) ? "" : toRoman(n);
  } else {
    const n = fromRoman(input);
    output = input.trim() === "" ? "" : n === null ? "Invalid Roman numeral" : n.toString();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => { setMode("to-roman"); setInput("2024"); }} className={mode === "to-roman" ? "btn-primary" : "btn-secondary"}>Number → Roman</button>
        <button onClick={() => { setMode("from-roman"); setInput("MMXXIV"); }} className={mode === "from-roman" ? "btn-primary" : "btn-secondary"}>Roman → Number</button>
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)]">{mode === "to-roman" ? "Integer (1–3999)" : "Roman Numeral"}</label>
        <input
          type={mode === "to-roman" ? "number" : "text"}
          min={1} max={3999}
          className="input mt-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mode === "to-roman" ? "e.g. 2024" : "e.g. MMXXIV"}
        />
      </div>
      {output && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-brand-600 dark:text-brand-400 tracking-wide">{output}</p>
        </div>
      )}
    </div>
  );
}
