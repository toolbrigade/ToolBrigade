"use client";
import { useState } from "react";

const COMMON_PATTERNS = [
  /^(.)\1+$/, // all same char
  /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/i,
  /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
  /^(qwerty|asdf|zxcv|password|letmein|welcome|admin|login|iloveyou|monkey|dragon)/i,
];

function calcEntropy(pwd: string): number {
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
  const pool = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0);
  return pool > 0 ? pwd.length * Math.log2(pool) : 0;
}

function crackTime(entropy: number): string {
  // Assume 10 billion guesses/sec (fast offline attack)
  const seconds = Math.pow(2, entropy) / 1e10;
  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3.154e9) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 3.154e12) return `${Math.round(seconds / 3.154e9)} thousand years`;
  return "millions of years";
}

function analyze(pwd: string) {
  if (!pwd) return null;
  const entropy = calcEntropy(pwd);
  const hasCommon = COMMON_PATTERNS.some(p => p.test(pwd.toLowerCase()));
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);

  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (hasLower) score++;
  if (hasUpper) score++;
  if (hasDigit) score++;
  if (hasSymbol) score++;
  if (hasCommon) score = Math.max(0, score - 3);

  const label = score <= 2 ? "Very Weak" : score <= 3 ? "Weak" : score <= 4 ? "Fair" : score <= 5 ? "Good" : "Strong";
  const color = score <= 2 ? "bg-red-500" : score <= 3 ? "bg-orange-500" : score <= 4 ? "bg-amber-500" : score <= 5 ? "bg-blue-500" : "bg-green-500";
  const width = `${Math.min(Math.round((score / 7) * 100), 100)}%`;

  return { entropy, crackEst: crackTime(entropy), label, color, width, hasLower, hasUpper, hasDigit, hasSymbol, hasCommon, length: pwd.length };
}

export default function PasswordStrengthChecker() {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const result = analyze(pwd);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2 text-xs text-green-800 dark:text-green-200">
        🔒 Your password is <strong>never transmitted</strong> — all analysis runs locally in your browser. Nothing is sent to any server.
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Enter a password to analyse</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="input pr-20"
            placeholder="Type a password…"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            onClick={() => setShow(s => !s)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Strength</span>
              <span className="font-semibold text-[var(--text)]">{result.label}</span>
            </div>
            <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${result.color}`} style={{ width: result.width }} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card text-sm space-y-1">
              <p className="font-medium text-[var(--text)]">Entropy</p>
              <p className="text-[var(--text-muted)]">{result.entropy.toFixed(1)} bits</p>
            </div>
            <div className="card text-sm space-y-1">
              <p className="font-medium text-[var(--text)]">Estimated crack time</p>
              <p className="text-[var(--text-muted)]">{result.crackEst} <span className="text-xs">(fast offline attack)</span></p>
            </div>
          </div>

          <div className="card space-y-2">
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Checklist</p>
            {[
              { ok: result.length >= 8, label: `Length ≥ 8 (current: ${result.length})` },
              { ok: result.length >= 12, label: "Length ≥ 12 (recommended)" },
              { ok: result.hasLower, label: "Lowercase letters" },
              { ok: result.hasUpper, label: "Uppercase letters" },
              { ok: result.hasDigit, label: "Digits" },
              { ok: result.hasSymbol, label: "Symbols" },
              { ok: !result.hasCommon, label: "No common patterns detected" },
            ].map(({ ok, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className={ok ? "text-green-500" : "text-red-400"}>
                  {ok ? "✓" : "✗"}
                </span>
                <span className={ok ? "text-[var(--text)]" : "text-[var(--text-muted)]"}>{label}</span>
              </div>
            ))}
          </div>

          {result.hasCommon && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
              ⚠️ Common pattern detected — sequential characters, keyboard walks, or dictionary words significantly weaken a password.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
