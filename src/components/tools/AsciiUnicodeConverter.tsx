"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

type Mode = "charToCode" | "codeToChar";

export default function AsciiUnicodeConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("charToCode");
  const [format, setFormat] = useState<"decimal" | "hex" | "binary">("decimal");
  const [startTime] = useState(Date.now());

  function charToCode(text: string): string {
    return Array.from(text).map(ch => {
      const cp = ch.codePointAt(0)!;
      if (format === "hex") return `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
      if (format === "binary") return cp.toString(2).padStart(8, "0");
      return String(cp);
    }).join(" ");
  }

  function codeToChar(text: string): string {
    return text.trim().split(/\s+/).map(token => {
      const clean = token.replace(/^U\+/i, "");
      let cp: number;
      if (format === "hex") cp = parseInt(clean, 16);
      else if (format === "binary") cp = parseInt(clean, 2);
      else cp = parseInt(clean, 10);
      if (isNaN(cp)) return "?";
      return String.fromCodePoint(cp);
    }).join("");
  }

  const output = input ? (mode === "charToCode" ? charToCode(input) : codeToChar(input)) : "";

  function handleConvert() {
    trackTaskComplete("ascii-unicode-converter", startTime);
  }

  // Build a reference table for the first 128 ASCII chars
  const asciiTable = Array.from({ length: 128 }, (_, i) => ({
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, "0"),
    char: i < 32 || i === 127 ? ["NUL","SOH","STX","ETX","EOT","ENQ","ACK","BEL","BS","HT","LF","VT","FF","CR","SO","SI","DLE","DC1","DC2","DC3","DC4","NAK","SYN","ETB","CAN","EM","SUB","ESC","FS","GS","RS","US"][i] ?? "DEL" : String.fromCharCode(i),
  }));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1">
          {(["charToCode", "codeToChar"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${mode === m ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
              {m === "charToCode" ? "Char → Code" : "Code → Char"}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {(["decimal", "hex", "binary"] as const).map(f => (
            <button key={f} onClick={() => setFormat(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize ${format === f ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">
            {mode === "charToCode" ? "Characters" : `Code points (${format}, space-separated)`}
          </label>
          <textarea className="textarea min-h-[140px] font-mono text-sm" value={input}
            onChange={e => { setInput(e.target.value); handleConvert(); }}
            placeholder={mode === "charToCode" ? "Hello" : format === "hex" ? "48 65 6C 6C 6F" : format === "binary" ? "01001000 01100101" : "72 101 108 108 111"} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[140px] font-mono text-sm" value={output} readOnly />
        </div>
      </div>

      <details className="border border-[var(--border)] rounded-xl overflow-hidden">
        <summary className="px-4 py-3 text-sm font-medium text-[var(--text)] cursor-pointer bg-[var(--surface)]">ASCII Reference Table (0–127)</summary>
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[var(--surface)]">
              <tr>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Dec</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Hex</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Char</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Dec</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Hex</th>
                <th className="px-3 py-2 text-left text-[var(--text-muted)]">Char</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 64 }, (_, i) => (
                <tr key={i} className="border-t border-[var(--border)]">
                  <td className="px-3 py-1 font-mono text-[var(--text)]">{asciiTable[i].dec}</td>
                  <td className="px-3 py-1 font-mono text-[var(--text-muted)]">{asciiTable[i].hex}</td>
                  <td className="px-3 py-1 font-mono text-[var(--text)]">{asciiTable[i].char}</td>
                  <td className="px-3 py-1 font-mono text-[var(--text)]">{asciiTable[i + 64].dec}</td>
                  <td className="px-3 py-1 font-mono text-[var(--text-muted)]">{asciiTable[i + 64].hex}</td>
                  <td className="px-3 py-1 font-mono text-[var(--text)]">{asciiTable[i + 64].char}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
