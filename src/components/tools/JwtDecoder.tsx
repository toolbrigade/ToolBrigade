"use client";
import { useState } from "react";

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + (4 - str.length % 4) % 4, "=");
  try { return decodeURIComponent(escape(atob(padded))); } catch { return atob(padded); }
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");

  let header: unknown = null, payload: unknown = null, error = "";
  if (input.trim()) {
    const parts = input.trim().split(".");
    if (parts.length !== 3) { error = "Invalid JWT — must have 3 parts separated by dots."; }
    else {
      try { header = JSON.parse(decodeBase64Url(parts[0])); } catch { error = "Could not decode header."; }
      try { payload = JSON.parse(decodeBase64Url(parts[1])); } catch { error = "Could not decode payload."; }
    }
  }

  const p = payload as Record<string, unknown> | null;
  const exp = p?.exp ? new Date((p.exp as number) * 1000) : null;
  const iat = p?.iat ? new Date((p.iat as number) * 1000) : null;
  const isExpired = exp ? exp < new Date() : false;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Paste JWT token</label>
        <textarea className="textarea min-h-[100px]" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {header !== null && (
        <div className="space-y-3">
          {exp && (
            <div className={`rounded-lg px-4 py-2 text-xs border ${isExpired ? "bg-red-50 dark:bg-red-900/20 border-red-300 text-red-700 dark:text-red-300" : "bg-green-50 dark:bg-green-900/20 border-green-300 text-green-700 dark:text-green-300"}`}>
              <span>{isExpired ? "⚠ Token expired" : "✓ Token not expired"}</span>{" — Expires: "}{exp.toLocaleString()}
            </div>
          )}
          {iat && <p className="text-xs text-[var(--text-muted)]">Issued at: {iat.toLocaleString()}</p>}
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Header</label>
            <pre className="textarea text-xs overflow-auto">{JSON.stringify(header, null, 2)}</pre>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Payload</label>
            <pre className="textarea text-xs overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
          </div>
          <p className="text-xs text-[var(--text-muted)]">⚠ Signature is not verified — this tool only decodes the token.</p>
        </div>
      )}
    </div>
  );
}
