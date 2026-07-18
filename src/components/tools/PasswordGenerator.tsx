"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

const SETS = { upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", lower: "abcdefghijklmnopqrstuvwxyz", digits: "0123456789", symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?" };

function strength(pwd: string): { label: string; color: string; width: string } {
  let score = 0;
  if (pwd.length >= 8) score++; if (pwd.length >= 12) score++; if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++; if (/[a-z]/.test(pwd)) score++; if (/\d/.test(pwd)) score++; if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score <= 4) return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
  if (score <= 5) return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [password, setPassword] = useState("");

  function generate() {
    const pool = Object.entries(opts).filter(([, v]) => v).map(([k]) => SETS[k as keyof typeof SETS]).join("");
    if (!pool) return;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr).map(n => pool[n % pool.length]).join(""));
  }

  const s = password ? strength(password) : null;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--text)]">Length: {length}</label>
        <input type="range" min={4} max={128} value={length} className="w-full accent-brand-600" onChange={e => setLength(+e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-4">
        {(Object.keys(opts) as (keyof typeof opts)[]).map(k => (
          <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={opts[k]} onChange={e => setOpts(p => ({ ...p, [k]: e.target.checked }))} className="accent-brand-600" />
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </label>
        ))}
      </div>
      <button onClick={generate} className="btn-primary flex items-center gap-2 w-full justify-center">
        <RefreshCw size={16} />Generate Password
      </button>
      {password && (
        <>
          <div className="flex items-center gap-2 bg-[var(--bg-subtle)] rounded-lg px-4 py-3">
            <code className="flex-1 text-sm font-mono text-[var(--text)] break-all">{password}</code>
            <CopyButton text={password} />
          </div>
          {s && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>Strength</span><span className="font-medium">{s.label}</span></div>
              <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${s.color} ${s.width}`} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
