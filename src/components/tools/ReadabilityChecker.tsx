"use client";
import { useState } from "react";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function analyze(text: string) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.trim().split(/\s+/).filter(w => w.replace(/[^a-zA-Z]/g, "").length > 0);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const numSentences = sentences.length || 1;
  const numWords = words.length || 1;

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const fre = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (syllables / numWords);
  // Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const fkgl = 0.39 * (numWords / numSentences) + 11.8 * (syllables / numWords) - 15.59;

  const freLabel =
    fre >= 90 ? "Very Easy (5th grade)" :
    fre >= 80 ? "Easy (6th grade)" :
    fre >= 70 ? "Fairly Easy (7th grade)" :
    fre >= 60 ? "Standard (8th–9th grade)" :
    fre >= 50 ? "Fairly Difficult (10th–12th grade)" :
    fre >= 30 ? "Difficult (College level)" :
    "Very Difficult (Professional)";

  const freColor =
    fre >= 70 ? "text-green-600 dark:text-green-400" :
    fre >= 50 ? "text-amber-600 dark:text-amber-400" :
    "text-red-600 dark:text-red-400";

  return { fre: Math.max(0, Math.min(100, fre)), fkgl: Math.max(0, fkgl), freLabel, freColor, numWords, numSentences, syllables };
}

export default function ReadabilityChecker() {
  const [text, setText] = useState("");
  const result = text.trim().split(/\s+/).filter(Boolean).length >= 5 ? analyze(text) : null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Paste your text</label>
        <textarea
          className="textarea min-h-[180px]"
          placeholder="Paste at least a few sentences to analyse readability…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>

      {result && (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="card">
              <p className="text-xs text-[var(--text-muted)] mb-1">Words</p>
              <p className="text-2xl font-bold text-[var(--text)]">{result.numWords}</p>
            </div>
            <div className="card">
              <p className="text-xs text-[var(--text-muted)] mb-1">Sentences</p>
              <p className="text-2xl font-bold text-[var(--text)]">{result.numSentences}</p>
            </div>
            <div className="card">
              <p className="text-xs text-[var(--text-muted)] mb-1">Syllables</p>
              <p className="text-2xl font-bold text-[var(--text)]">{result.syllables}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">Flesch Reading Ease</p>
              <p className={`text-3xl font-bold ${result.freColor}`}>{result.fre.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{result.freLabel}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Higher = easier to read (0–100)</p>
            </div>
            <div className="card text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">Flesch-Kincaid Grade Level</p>
              <p className="text-3xl font-bold text-[var(--text)]">{result.fkgl.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">US school grade equivalent</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Grade {Math.round(result.fkgl)} ≈ {result.fkgl <= 6 ? "Elementary" : result.fkgl <= 9 ? "Middle school" : result.fkgl <= 12 ? "High school" : "College+"}</p>
            </div>
          </div>
        </div>
      )}
      {!result && text.trim() && <p className="text-xs text-[var(--text-muted)]">Enter at least 5 words for analysis.</p>}
    </div>
  );
}
