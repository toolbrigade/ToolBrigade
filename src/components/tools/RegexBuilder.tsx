"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

type PatternPart = { id: string; label: string; pattern: string; enabled: boolean };

const PRESETS: PatternPart[] = [
  { id: "start", label: "Start of string (^)", pattern: "^", enabled: false },
  { id: "end", label: "End of string ($)", pattern: "$", enabled: false },
  { id: "email", label: "Email address", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", enabled: false },
  { id: "url", label: "URL (http/https)", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", enabled: false },
  { id: "digits", label: "Digits only (0-9)", pattern: "\\d+", enabled: false },
  { id: "alpha", label: "Letters only (a-z A-Z)", pattern: "[a-zA-Z]+", enabled: false },
  { id: "alphanumeric", label: "Alphanumeric", pattern: "[a-zA-Z0-9]+", enabled: false },
  { id: "whitespace", label: "Whitespace", pattern: "\\s+", enabled: false },
  { id: "word", label: "Word boundary (\\b)", pattern: "\\b", enabled: false },
  { id: "ipv4", label: "IPv4 address", pattern: "(?:\\d{1,3}\\.){3}\\d{1,3}", enabled: false },
  { id: "date_iso", label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", enabled: false },
  { id: "hex_color", label: "Hex color (#rrggbb)", pattern: "#[0-9a-fA-F]{6}", enabled: false },
  { id: "phone_us", label: "US phone number", pattern: "\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}", enabled: false },
  { id: "zip_us", label: "US ZIP code", pattern: "\\d{5}(?:-\\d{4})?", enabled: false },
];

export default function RegexBuilder() {
  const [parts, setParts] = useState<PatternPart[]>(PRESETS.map(p => ({ ...p })));
  const [custom, setCustom] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testInput, setTestInput] = useState("");

  function toggle(id: string) {
    setParts(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  }

  const enabledParts = parts.filter(p => p.enabled).map(p => p.pattern);
  if (custom) enabledParts.push(custom);
  const pattern = enabledParts.join("");
  const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
  const fullRegex = pattern ? `/${pattern}/${flagStr}` : "";

  let matches: RegExpMatchArray[] = [];
  let regexError = "";
  if (pattern && testInput) {
    try {
      const re = new RegExp(pattern, flagStr || "g");
      matches = Array.from(testInput.matchAll(new RegExp(pattern, flags.g ? flagStr : flagStr + "g")));
    } catch (e) {
      regexError = String(e);
    }
  }

  function highlight() {
    if (!pattern || !testInput) return testInput;
    try {
      const re = new RegExp(pattern, "g" + (flags.i ? "i" : "") + (flags.m ? "m" : ""));
      return testInput.replace(re, m => `\x00${m}\x01`);
    } catch { return testInput; }
  }

  const highlighted = highlight();

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-3">
        {parts.map(p => (
          <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${p.enabled ? "border-brand-400 bg-[var(--brand-light)] dark:bg-brand-900/20" : "border-[var(--border)] hover:border-brand-300"}`}>
            <input type="checkbox" checked={p.enabled} onChange={() => toggle(p.id)} className="accent-[var(--brand)]" />
            <div>
              <p className="text-sm font-medium text-[var(--text)]">{p.label}</p>
              <p className="text-xs font-mono text-[var(--text-muted)]">{p.pattern}</p>
            </div>
          </label>
        ))}
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Custom pattern (appended)</label>
        <input value={custom} onChange={e => setCustom(e.target.value)}
          className="w-full text-sm font-mono border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
          placeholder="e.g. [A-Z]{2,}" />
      </div>

      <div className="flex gap-3 items-center">
        <span className="text-xs font-medium text-[var(--text-muted)]">Flags:</span>
        {(["g", "i", "m"] as const).map(f => (
          <button key={f} onClick={() => setFlags(prev => ({ ...prev, [f]: !prev[f] }))}
            className={`text-xs px-3 py-1 rounded-lg border font-mono transition-colors ${flags[f] ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
        <span className="text-sm font-mono text-[var(--text)] break-all">{fullRegex || <span className="text-[var(--text-muted)]">Select patterns above to build regex</span>}</span>
        {fullRegex && <CopyButton text={fullRegex} />}
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Test input</label>
        <textarea value={testInput} onChange={e => setTestInput(e.target.value)} rows={4}
          className="textarea font-mono text-sm"
          placeholder="Paste text here to test your regex…" />
      </div>

      {regexError && <p className="text-sm text-red-500">{regexError}</p>}

      {testInput && pattern && !regexError && (
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2">{matches.length} match{matches.length !== 1 ? "es" : ""}</p>
          <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-mono whitespace-pre-wrap break-all">
            {highlighted.split("\x00").map((seg, i) => {
              if (i === 0) return <span key={i}>{seg}</span>;
              const [match, rest] = seg.split("\x01");
              return <span key={i}><mark className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">{match}</mark>{rest}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
