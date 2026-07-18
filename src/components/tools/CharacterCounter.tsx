"use client";
import { useState } from "react";

function computeStats(text: string) {
  return [
    { label: "Characters", value: text.length },
    { label: "No Spaces", value: text.replace(/\s/g, "").length },
    { label: "Letters", value: (text.match(/[a-zA-Z]/g) ?? []).length },
    { label: "Digits", value: (text.match(/\d/g) ?? []).length },
    { label: "Spaces", value: (text.match(/ /g) ?? []).length },
    { label: "Lines", value: text ? text.split("\n").length : 0 },
  ];
}

export default function CharacterCounter() {
  const [stats, setStats] = useState(() => computeStats(""));

  return (
    <div className="space-y-4">
      <textarea
        className="textarea min-h-[200px]"
        placeholder="Paste or type your text here…"
        onChange={(e) => setStats(computeStats(e.target.value))}
        onInput={(e) => setStats(computeStats((e.target as HTMLTextAreaElement).value))}
      />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--bg-subtle)] rounded-lg p-3 text-center">
            <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">{s.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
