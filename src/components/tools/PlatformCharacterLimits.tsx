"use client";
import { useState } from "react";

const PLATFORMS = [
  { label: "Twitter / X", limit: 280 },
  { label: "LinkedIn Post", limit: 3000 },
  { label: "Meta / Google Description", limit: 160 },
  { label: "Instagram Bio", limit: 150 },
  { label: "YouTube Title", limit: 100 },
  { label: "Facebook Post", limit: 63206 },
  { label: "TikTok Caption", limit: 2200 },
  { label: "Pinterest Description", limit: 500 },
];

export default function PlatformCharacterLimits() {
  const [text, setText] = useState("");
  const [platformIdx, setPlatformIdx] = useState(0);

  const platform = PLATFORMS[platformIdx];
  const count = text.length;
  const remaining = platform.limit - count;
  const pct = Math.min(count / platform.limit, 1);
  const over = remaining < 0;

  const barColor = pct < 0.75 ? "bg-green-500" : pct < 0.9 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Platform</label>
        <select
          className="input"
          value={platformIdx}
          onChange={e => setPlatformIdx(+e.target.value)}
        >
          {PLATFORMS.map((p, i) => (
            <option key={p.label} value={i}>{p.label} ({p.limit.toLocaleString()} chars)</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Your text</label>
        <textarea
          className="textarea min-h-[160px]"
          placeholder="Type or paste your content here…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(pct * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-muted)]">{count.toLocaleString()} / {platform.limit.toLocaleString()} characters used</span>
          <span className={`font-semibold ${over ? "text-red-500" : "text-[var(--text)]"}`}>
            {over ? `${Math.abs(remaining).toLocaleString()} over limit` : `${remaining.toLocaleString()} remaining`}
          </span>
        </div>
      </div>
      {over && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-700 dark:text-red-300">
          Your text exceeds the {platform.label} limit by {Math.abs(remaining).toLocaleString()} characters.
        </div>
      )}
    </div>
  );
}
