"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

type Rule = { userAgent: string; allows: string[]; disallows: string[] };

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ userAgent: "*", allows: [], disallows: ["/admin/", "/private/"] }]);
  const [sitemaps, setSitemaps] = useState<string[]>([""]);
  const [crawlDelay, setCrawlDelay] = useState("");
  const [startTime] = useState(Date.now());

  function addRule() { setRules(r => [...r, { userAgent: "", allows: [], disallows: [""] }]); }
  function removeRule(i: number) { setRules(r => r.filter((_, idx) => idx !== i)); }
  function updateUA(i: number, v: string) { setRules(r => r.map((rule, idx) => idx === i ? { ...rule, userAgent: v } : rule)); }
  function addPath(i: number, type: "allows" | "disallows") { setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [type]: [...rule[type], ""] } : rule)); }
  function updatePath(i: number, type: "allows" | "disallows", j: number, v: string) {
    setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [type]: rule[type].map((p, pi) => pi === j ? v : p) } : rule));
  }
  function removePath(i: number, type: "allows" | "disallows", j: number) {
    setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [type]: rule[type].filter((_, pi) => pi !== j) } : rule));
  }

  const output = [
    ...rules.map(r => [
      `User-agent: ${r.userAgent || "*"}`,
      ...r.allows.filter(Boolean).map(p => `Allow: ${p}`),
      ...r.disallows.filter(Boolean).map(p => `Disallow: ${p}`),
      crawlDelay ? `Crawl-delay: ${crawlDelay}` : "",
    ].filter(Boolean).join("\n")),
    ...sitemaps.filter(Boolean).map(s => `Sitemap: ${s}`),
  ].join("\n\n");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {rules.map((rule, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl p-4 space-y-3 bg-[var(--surface)]">
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">User-agent</label>
                <input value={rule.userAgent} onChange={e => updateUA(i, e.target.value)}
                  className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                  placeholder="* (all bots)" />
              </div>
              {rules.length > 1 && <button onClick={() => removeRule(i)} className="text-red-400 hover:text-red-600 mt-5"><Trash2 size={16} /></button>}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Allow paths</label>
                {rule.allows.map((p, j) => (
                  <div key={j} className="flex gap-1 mb-1">
                    <input value={p} onChange={e => updatePath(i, "allows", j, e.target.value)}
                      className="flex-1 text-sm font-mono border border-[var(--border)] rounded-lg px-2 py-1 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                      placeholder="/public/" />
                    <button onClick={() => removePath(i, "allows", j)} className="text-red-400 text-xs px-1">✕</button>
                  </div>
                ))}
                <button onClick={() => addPath(i, "allows")} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1"><Plus size={12} />Add Allow</button>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Disallow paths</label>
                {rule.disallows.map((p, j) => (
                  <div key={j} className="flex gap-1 mb-1">
                    <input value={p} onChange={e => updatePath(i, "disallows", j, e.target.value)}
                      className="flex-1 text-sm font-mono border border-[var(--border)] rounded-lg px-2 py-1 bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                      placeholder="/admin/" />
                    <button onClick={() => removePath(i, "disallows", j)} className="text-red-400 text-xs px-1">✕</button>
                  </div>
                ))}
                <button onClick={() => addPath(i, "disallows")} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1"><Plus size={12} />Add Disallow</button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addRule} className="btn-secondary text-sm flex items-center gap-1"><Plus size={14} />Add User-agent Block</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Sitemap URLs</label>
          {sitemaps.map((s, i) => (
            <div key={i} className="flex gap-1 mb-1">
              <input value={s} onChange={e => setSitemaps(sm => sm.map((v, idx) => idx === i ? e.target.value : v))}
                className="flex-1 text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                placeholder="https://example.com/sitemap.xml" />
              {sitemaps.length > 1 && <button onClick={() => setSitemaps(sm => sm.filter((_, idx) => idx !== i))} className="text-red-400 text-xs px-1">✕</button>}
            </div>
          ))}
          <button onClick={() => setSitemaps(s => [...s, ""])} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 mt-1"><Plus size={12} />Add Sitemap</button>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Crawl-delay (seconds, optional)</label>
          <input value={crawlDelay} onChange={e => setCrawlDelay(e.target.value)} type="number"
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
            placeholder="10" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-[var(--text-muted)]">Generated robots.txt</label>
          <div onClick={() => trackTaskComplete("robots-txt-generator", startTime)}><CopyButton text={output} /></div>
        </div>
        <textarea className="textarea min-h-[180px] font-mono text-sm" value={output} readOnly />
      </div>
    </div>
  );
}
