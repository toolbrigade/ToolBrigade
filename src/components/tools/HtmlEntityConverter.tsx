"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const NAMED_ENTITIES: [string, string][] = [
  ["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ['"', "&quot;"], ["'", "&apos;"],
  ["©", "&copy;"], ["®", "&reg;"], ["™", "&trade;"], ["€", "&euro;"], ["£", "&pound;"],
  ["¥", "&yen;"], ["°", "&deg;"], ["±", "&plusmn;"], ["×", "&times;"], ["÷", "&divide;"],
  [" ", "&nbsp;"], ["–", "&ndash;"], ["—", "&mdash;"], ["…", "&hellip;"], ["←", "&larr;"],
  ["→", "&rarr;"], ["↑", "&uarr;"], ["↓", "&darr;"], ["♠", "&spades;"], ["♥", "&hearts;"],
];

function encode(text: string): string {
  return text.replace(/[&<>"'©®™€£¥°±×÷\u00A0–—…←→↑↓♠♥]/g, c => {
    const found = NAMED_ENTITIES.find(([ch]) => ch === c);
    if (found) return found[1];
    const code = c.codePointAt(0)!;
    return code > 127 ? `&#${code};` : c;
  });
}

function decode(text: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = text;
  return el.value;
}

export default function HtmlEntityConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [startTime] = useState(Date.now());

  function convert() {
    setOutput(mode === "encode" ? encode(input) : decode(input));
    trackTaskComplete("html-entity-converter", startTime);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors capitalize ${mode === m ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{mode === "encode" ? "Plain text / HTML" : "HTML entities"}</label>
          <textarea className="textarea min-h-[200px]" value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? 'Hello <World> & "friends"' : "&lt;Hello&gt; &amp; &quot;friends&quot;"} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[200px]" value={output} readOnly placeholder="Result appears here…" />
        </div>
      </div>
      <button onClick={convert} className="btn-primary text-sm capitalize">{mode}</button>

      <div>
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Common HTML Entities Reference</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {NAMED_ENTITIES.slice(0, 15).map(([char, entity]) => (
            <div key={entity} className="text-center p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
              <p className="text-base font-semibold text-[var(--text)]">{char === " " ? "·" : char}</p>
              <p className="text-xs font-mono text-[var(--text-muted)]">{entity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
