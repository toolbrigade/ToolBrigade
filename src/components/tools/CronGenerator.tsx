"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

const PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every day at noon", cron: "0 12 * * *" },
  { label: "Every Monday", cron: "0 0 * * 1" },
  { label: "Every weekday", cron: "0 0 * * 1-5" },
  { label: "Every Sunday", cron: "0 0 * * 0" },
  { label: "1st of every month", cron: "0 0 1 * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every 6 hours", cron: "0 */6 * * *" },
];

function explain(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression — must have 5 fields.";
  const [min, hour, dom, month, dow] = parts;
  const fmtField = (v: string, unit: string) => v === "*" ? `every ${unit}` : v.startsWith("*/") ? `every ${v.slice(2)} ${unit}s` : `at ${unit} ${v}`;
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["","January","February","March","April","May","June","July","August","September","October","November","December"];
  let desc = "Runs ";
  desc += min === "*" ? "every minute" : min.startsWith("*/") ? `every ${min.slice(2)} minutes` : `at minute ${min}`;
  desc += hour === "*" ? "" : hour.startsWith("*/") ? `, every ${hour.slice(2)} hours` : `, at hour ${hour}`;
  desc += dom === "*" ? "" : `, on day ${dom} of the month`;
  desc += month === "*" ? "" : `, in ${months[+month] ?? month}`;
  desc += dow === "*" ? "" : `, on ${dow.includes("-") ? dow.split("-").map(d => days[+d]).join(" to ") : days[+dow] ?? dow}`;
  return desc + ".";
}

export default function CronGenerator() {
  const [cron, setCron] = useState("* * * * *");
  const [copied, setCopied] = useState(false);
  const explanation = explain(cron);
  function copy() { navigator.clipboard.writeText(cron); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Cron expression</label>
        <div className="flex gap-2">
          <input type="text" className="input font-mono flex-1" value={cron} onChange={e => setCron(e.target.value)} placeholder="* * * * *" />
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-sm"><Copy size={14} />{copied ? "Copied!" : "Copy"}</button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">Format: minute hour day-of-month month day-of-week</p>
      </div>
      <div className={`rounded-lg px-4 py-3 text-sm border ${explanation.startsWith("Invalid") ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" : "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"}`}>
        {explanation}
      </div>
      <div>
        <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Common presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.cron} onClick={() => setCron(p.cron)} className="btn-secondary text-xs py-1 px-2 min-h-0">{p.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
