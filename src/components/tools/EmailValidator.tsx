"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

// RFC 5322-inspired regex — validates format, not deliverability
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

function validate(email: string) {
  const trimmed = email.trim();
  if (!trimmed) return null;
  const atIdx = trimmed.lastIndexOf("@");
  const checks = [
    { label: "Contains exactly one @", ok: (trimmed.match(/@/g) || []).length === 1 },
    { label: "Local part present (before @)", ok: atIdx > 0 },
    { label: "Domain present (after @)", ok: atIdx !== -1 && atIdx < trimmed.length - 1 },
    { label: "Domain has a TLD (e.g. .com)", ok: atIdx !== -1 && trimmed.slice(atIdx + 1).includes(".") },
    { label: "No spaces", ok: !/\s/.test(trimmed) },
    { label: "Overall format valid", ok: EMAIL_RE.test(trimmed) },
  ];
  const valid = checks.every(c => c.ok);
  const local = atIdx > 0 ? trimmed.slice(0, atIdx) : "";
  const domain = atIdx !== -1 ? trimmed.slice(atIdx + 1) : "";
  return { valid, checks, local, domain, trimmed };
}

export default function EmailValidator() {
  const [input, setInput] = useState("");
  const result = validate(input);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Format validation only — this tool checks whether the email address is correctly formatted. It does <strong>not</strong> verify whether the address actually exists or can receive mail (no SMTP/DNS check).
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Email address</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="user@example.com"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <CopyButton text={input} />
        </div>
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`rounded-xl px-5 py-4 text-center font-semibold text-lg ${result.valid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
            {result.valid ? "✓ Valid format" : "✗ Invalid format"}
          </div>

          {result.valid && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="card text-sm"><p className="text-[var(--text-muted)] text-xs mb-1">Local part</p><p className="font-mono text-[var(--text)]">{result.local}</p></div>
              <div className="card text-sm"><p className="text-[var(--text-muted)] text-xs mb-1">Domain</p><p className="font-mono text-[var(--text)]">{result.domain}</p></div>
            </div>
          )}

          <div className="card space-y-2">
            {result.checks.map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className={ok ? "text-green-500" : "text-red-400"}>{ok ? "✓" : "✗"}</span>
                <span className={ok ? "text-[var(--text)]" : "text-[var(--text-muted)]"}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
