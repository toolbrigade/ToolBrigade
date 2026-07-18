"use client";

import { useState } from "react";

function computeStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return [
    { label: "Words", value: words },
    { label: "Characters", value: chars },
    { label: "No Spaces", value: charsNoSpace },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    { label: "Read Time", value: `${readingTime} min` },
  ];
}

export default function WordCounter() {
  const [stats, setStats] = useState(() => computeStats(""));

  return (
    <div className="space-y-4">
      <textarea
        aria-label="Text input"
        className="textarea min-h-[220px]"
        placeholder="Paste or type your text here…"
        onChange={(e) => setStats(computeStats(e.target.value))}
        onInput={(e) => setStats(computeStats((e.target as HTMLTextAreaElement).value))}
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">{s.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
