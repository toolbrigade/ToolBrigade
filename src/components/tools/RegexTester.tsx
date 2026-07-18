"use client";
import { useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState("");

  let matches: RegExpMatchArray[] = [];
  let highlighted = "";
  let regexError = "";
  if (pattern && input) {
    try {
      const allFlags = flags.includes("g") ? flags : flags + "g";
      const re = new RegExp(pattern, allFlags);
      let m; while ((m = re.exec(input)) !== null) { matches.push(m); if (!flags.includes("g")) break; }
      highlighted = input.replace(new RegExp(pattern, allFlags), s => `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">${s}</mark>`);
    } catch (e) { regexError = (e as Error).message; }
  }

  const flagOptions = ["g", "i", "m", "s"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Regular expression</label>
          <div className="flex items-center bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
            <span className="px-3 text-[var(--text-muted)] text-lg">/</span>
            <input className="flex-1 bg-transparent py-2 text-[var(--text)] font-mono text-sm focus:outline-none" placeholder="pattern" value={pattern} onChange={e => setPattern(e.target.value)} />
            <span className="px-3 text-[var(--text-muted)] text-lg">/</span>
            <input className="w-16 bg-transparent py-2 text-[var(--text)] font-mono text-sm focus:outline-none pr-2" placeholder="gi" value={flags} onChange={e => setFlags(e.target.value)} />
          </div>
        </div>
        <div className="pt-5 flex gap-1">
          {flagOptions.map(f => (
            <button key={f} onClick={() => setFlags(p => p.includes(f) ? p.replace(f, "") : p + f)}
              className={`w-8 h-8 rounded text-xs font-mono font-bold border transition-colors ${flags.includes(f) ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>{f}</button>
          ))}
        </div>
      </div>
      {regexError && <p className="text-sm text-red-500">{regexError}</p>}
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Test string</label>
        <textarea className="textarea min-h-[140px]" placeholder="Enter text to test against…" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {matches.length > 0 && (
        <>
          <div className="bg-[var(--bg-subtle)] rounded-lg p-3 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: highlighted }} />
          <p className="text-xs text-[var(--text-muted)]"><strong className="text-brand-600 dark:text-brand-400">{matches.length}</strong> match{matches.length !== 1 ? "es" : ""}</p>
          <ul className="space-y-1 max-h-48 overflow-auto">
            {matches.map((m, i) => (
              <li key={i} className="text-xs bg-[var(--bg-subtle)] rounded px-2 py-1 font-mono flex gap-2">
                <span className="text-[var(--text-muted)]">#{i + 1} @ {m.index}</span>
                <span className="text-[var(--text)]">{m[0]}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {pattern && input && !regexError && matches.length === 0 && <p className="text-sm text-[var(--text-muted)]">No matches found.</p>}
    </div>
  );
}
