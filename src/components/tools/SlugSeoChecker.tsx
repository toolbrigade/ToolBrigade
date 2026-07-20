"use client";
import { useState } from "react";

const STOP_WORDS = new Set(["a","an","the","and","or","but","in","on","at","to","for","of","with","by","from","is","was","are","were","be","been","being","it","its","this","that","these","those","i","you","he","she","we","they","do","does","did","have","has","had","will","would","could","should","may","might","can","not","no","nor","so","yet","both","either","neither","each","few","more","most","other","some","such","than","too","very","just","also","as","if","then","than","when","where","who","which","what","how"]);

function analyzeSlug(slug: string) {
  if (!slug.trim()) return null;
  const issues: { label: string; ok: boolean; note?: string }[] = [];

  const len = slug.length;
  issues.push({ label: `Length: ${len} characters`, ok: len >= 3 && len <= 75, note: len < 3 ? "Too short" : len > 75 ? "Too long (aim for under 75)" : "Good length" });

  const hasUppercase = /[A-Z]/.test(slug);
  issues.push({ label: "All lowercase", ok: !hasUppercase, note: hasUppercase ? "Contains uppercase — slugs should be lowercase" : "✓" });

  const hasSpaces = /\s/.test(slug);
  issues.push({ label: "No spaces", ok: !hasSpaces, note: hasSpaces ? "Contains spaces — use hyphens instead" : "✓" });

  const hasUnderscores = /_/.test(slug);
  issues.push({ label: "Uses hyphens not underscores", ok: !hasUnderscores, note: hasUnderscores ? "Underscores are not recommended — use hyphens" : "✓" });

  const hasSpecial = /[^a-z0-9-]/.test(slug.toLowerCase());
  issues.push({ label: "No special characters", ok: !hasSpecial, note: hasSpecial ? "Contains special characters" : "✓" });

  const doubleHyphen = /--/.test(slug);
  issues.push({ label: "No consecutive hyphens", ok: !doubleHyphen, note: doubleHyphen ? "Consecutive hyphens found" : "✓" });

  const startsOrEndsHyphen = /^-|-$/.test(slug);
  issues.push({ label: "Doesn't start or end with hyphen", ok: !startsOrEndsHyphen });

  const words = slug.toLowerCase().split("-").filter(Boolean);
  const stopWordCount = words.filter(w => STOP_WORDS.has(w)).length;
  issues.push({ label: `Stop words: ${stopWordCount} of ${words.length} words`, ok: stopWordCount === 0 || stopWordCount / words.length < 0.5, note: stopWordCount > 0 ? `Stop words found: ${words.filter(w => STOP_WORDS.has(w)).join(", ")}` : "No stop words" });

  const score = Math.round((issues.filter(i => i.ok).length / issues.length) * 100);
  return { issues, score, words };
}

export default function SlugSeoChecker() {
  const [input, setInput] = useState("");
  const result = analyzeSlug(input);

  const scoreColor = !result ? "" : result.score >= 80 ? "text-green-600 dark:text-green-400" : result.score >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">URL slug to analyse</label>
        <input
          type="text"
          className="input font-mono"
          placeholder="my-blog-post-title"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {result && (
        <div className="space-y-3">
          <div className="card text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">SEO Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>{result.score}<span className="text-lg">/100</span></p>
          </div>

          <div className="card space-y-2">
            {result.issues.map(({ label, ok, note }) => (
              <div key={label} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className={ok ? "text-green-500" : "text-red-400"}>{ok ? "✓" : "✗"}</span>
                  <span className={ok ? "text-[var(--text)]" : "text-[var(--text-muted)] font-medium"}>{label}</span>
                </div>
                {note && !ok && <p className="text-xs text-[var(--text-muted)] ml-5">{note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
