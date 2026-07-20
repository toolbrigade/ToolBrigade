"use client";
import { useState } from "react";

type LinkResult = { url: string; status: "ok" | "error" | "cors" | "checking"; code?: number; message?: string };

async function checkUrl(url: string): Promise<LinkResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(url, { method: "HEAD", signal: controller.signal, mode: "no-cors" });
      clearTimeout(timeout);
      if (res.type === "opaque") {
        return { url, status: "cors", message: "Unable to verify due to browser security restrictions (CORS)" };
      }
      return { url, status: res.ok ? "ok" : "error", code: res.status };
    } finally {
      clearTimeout(timeout);
    }
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return { url, status: "error", message: "Timed out after 10 seconds" };
    }
    return { url, status: "cors", message: "Unable to verify due to browser security restrictions (CORS)" };
  }
}

export default function BrokenLinkChecker() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<LinkResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  async function check() {
    const urls = input.split("\n").map(u => u.trim()).filter(u => u.startsWith("http"));
    if (!urls.length) return;
    setRunning(true);
    setProgress(0);
    const out: LinkResult[] = urls.map(url => ({ url, status: "checking" as const }));
    setResults([...out]);
    for (let i = 0; i < urls.length; i++) {
      const r = await checkUrl(urls[i]);
      out[i] = r;
      setResults([...out]);
      setProgress(Math.round(((i + 1) / urls.length) * 100));
    }
    setRunning(false);
  }

  const corsCount = results.filter(r => r.status === "cors").length;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 space-y-2">
        <p className="font-semibold">⚠️ Important limitation — browser security (CORS)</p>
        <p>Most websites block cross-origin requests from browsers. This means the majority of links will show <strong>&quot;unable to verify due to browser security restrictions&quot;</strong> rather than a real HTTP status. This is a fundamental browser limitation, not a bug in this tool. A result of &quot;CORS restriction&quot; does <strong>not</strong> mean the link is broken — only that the browser could not check it. For reliable link checking, use a server-side tool like <code className="text-xs bg-amber-100 dark:bg-amber-800 px-1 rounded">curl</code> or a dedicated crawling service.</p>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">URLs to check (one per line, must start with http)</label>
        <textarea
          className="textarea min-h-[120px] font-mono text-sm"
          placeholder={"https://example.com\nhttps://another-site.com/page"}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      <button onClick={check} disabled={running || !input.trim()} className="btn-primary">
        {running ? `Checking… ${progress}%` : "Check Links"}
      </button>

      {running && (
        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {corsCount > 0 && (
            <p className="text-xs text-[var(--text-muted)]">
              {corsCount} of {results.length} URL{results.length !== 1 ? "s" : ""} could not be verified due to CORS restrictions — this is expected for most public websites.
            </p>
          )}
          {results.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm border ${
              r.status === "ok" ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" :
              r.status === "error" ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" :
              r.status === "checking" ? "bg-[var(--bg-subtle)] border-[var(--border)]" :
              "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
            }`}>
              <span className="shrink-0 mt-0.5">
                {r.status === "ok" ? "✓" : r.status === "error" ? "✗" : r.status === "checking" ? "⋯" : "⚠"}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs truncate text-[var(--text)]">{r.url}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {r.status === "ok" ? `HTTP ${r.code} — Reachable` :
                   r.status === "error" ? (r.message || `HTTP ${r.code} — Error`) :
                   r.status === "checking" ? "Checking…" :
                   r.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
