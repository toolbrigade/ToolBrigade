"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const DEFAULT_STOP_WORDS = "a,an,the,and,or,but,in,on,at,to,for,of,with,by,from,is,was,are,were,be,been,being,it,its,this,that,these,those,i,you,he,she,we,they,do,does,did,have,has,had,will,would,could,should,may,might,can,not,no,nor,so,yet,as,if,then,than,when,where,who,which,what,how,also,just,very,too,via,per,vs,etc";

function toSlug(text: string, stopWords: Set<string>, sep: string): string {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w && !stopWords.has(w))
    .join(sep)
    .replace(new RegExp(`${sep === "-" ? "-" : sep === "_" ? "_" : "\\."}+`, "g"), sep)
    .replace(new RegExp(`^${sep}|${sep}$`, "g"), "");
}

export default function SlugGeneratorAdvanced() {
  const [input, setInput] = useState("");
  const [sep, setSep] = useState("-");
  const [stopWordInput, setStopWordInput] = useState(DEFAULT_STOP_WORDS);
  const [showStopWords, setShowStopWords] = useState(false);

  const stopWords = new Set(stopWordInput.split(",").map(w => w.trim().toLowerCase()).filter(Boolean));
  const slug = input ? toSlug(input, stopWords, sep) : "";

  const removedWords = input
    ? input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w && stopWords.has(w))
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Advanced slug generator — removes common stop words (a, the, and, of, etc.) for cleaner, more SEO-friendly URLs. Configurable stop-word list.
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input text</label>
        <input
          type="text"
          className="input"
          placeholder="The Best Guide to Building a Website in 2025"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        {["-", "_", "."].map(s => (
          <button key={s} onClick={() => setSep(s)} className={`px-4 py-2 rounded-lg text-sm font-mono font-medium transition-colors ${sep === s ? "bg-brand-600 text-white" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
            {s === "-" ? "Hyphen (-)" : s === "_" ? "Underscore (_)" : "Dot (.)"}
          </button>
        ))}
      </div>

      {slug && (
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-4 py-3">
            <code className="text-sm font-mono text-[var(--text)] break-all">{slug}</code>
            <CopyButton text={slug} />
          </div>
          {removedWords.length > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              Stop words removed: <span className="font-mono">{Array.from(new Set(removedWords)).join(", ")}</span>
            </p>
          )}
        </div>
      )}

      <div>
        <button
          onClick={() => setShowStopWords(s => !s)}
          className="text-xs text-[var(--brand)] hover:underline"
        >
          {showStopWords ? "Hide" : "Edit"} stop-word list ({stopWords.size} words)
        </button>
        {showStopWords && (
          <div className="mt-2 space-y-1">
            <textarea
              className="textarea min-h-[80px] text-xs font-mono"
              value={stopWordInput}
              onChange={e => setStopWordInput(e.target.value)}
            />
            <p className="text-xs text-[var(--text-muted)]">Comma-separated list. Edit to add or remove stop words.</p>
            <button onClick={() => setStopWordInput(DEFAULT_STOP_WORDS)} className="text-xs text-[var(--brand)] hover:underline">Reset to defaults</button>
          </div>
        )}
      </div>
    </div>
  );
}
