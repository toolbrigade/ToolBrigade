"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function FindReplace() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  let output = input;
  let count = 0;
  let renderError = "";
  if (find) {
    try {
      const flags = "g" + (caseSensitive ? "" : "i");
      const pattern = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = input.match(pattern);
      count = matches?.length ?? 0;
      output = input.replace(pattern, replace);
    } catch (e) { renderError = (e as Error).message; output = input; }
  }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Find</label>
          <input className="input mt-1" placeholder="Search text…" value={find}
            onChange={e => setFind(e.target.value)}
            onInput={e => setFind((e.target as HTMLInputElement).value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Replace with</label>
          <input className="input mt-1" placeholder="Replacement…" value={replace}
            onChange={e => setReplace(e.target.value)}
            onInput={e => setReplace((e.target as HTMLInputElement).value)} />
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} className="accent-brand-600" />Regex</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-brand-600" />Case-sensitive</label>
      </div>
      {renderError && <p className="text-sm text-red-500">{renderError}</p>}
      {find && !renderError && <p className="text-xs text-[var(--text-muted)]">{count} match{count !== 1 ? "es" : ""} found</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea className="textarea min-h-[200px]" placeholder="Paste text here…" value={input}
            onChange={e => setInput(e.target.value)}
            onInput={e => setInput((e.target as HTMLTextAreaElement).value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[200px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
