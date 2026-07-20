"use client";
import { useState } from "react";

// IBAN country lengths (ISO 13616)
const IBAN_LENGTHS: Record<string, number> = {
  AD:24,AE:23,AL:28,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,BY:28,
  CH:21,CR:22,CY:28,CZ:24,DE:22,DK:18,DO:28,EE:20,EG:29,ES:24,FI:18,
  FO:18,FR:27,GB:22,GE:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,
  IL:23,IQ:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LC:32,LI:21,LT:20,
  LU:20,LV:21,LY:25,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,NL:18,
  NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SC:31,SE:24,
  SI:19,SK:24,SM:27,ST:25,SV:28,TL:23,TN:24,TR:26,UA:29,VA:22,VG:24,
  XK:20,
};

function mod97(str: string): number {
  let remainder = 0;
  for (const ch of str) {
    const d = parseInt(ch, 10);
    remainder = (remainder * (d < 10 ? 10 : 100) + d) % 97;
  }
  return remainder;
}

function validateIBAN(raw: string) {
  const iban = raw.replace(/\s/g, "").toUpperCase();
  if (iban.length < 4) return null;
  const country = iban.slice(0, 2);
  const expectedLen = IBAN_LENGTHS[country];
  const checks = [
    { label: `Country code recognised (${country})`, ok: !!expectedLen },
    { label: `Correct length for ${country} (${expectedLen ?? "?"} chars, got ${iban.length})`, ok: !!expectedLen && iban.length === expectedLen },
    { label: "Only alphanumeric characters", ok: /^[A-Z0-9]+$/.test(iban) },
  ];
  // MOD-97 check
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.split("").map(c => c >= "A" ? (c.charCodeAt(0) - 55).toString() : c).join("");
  const modOk = checks[0].ok && checks[1].ok && checks[2].ok && mod97(numeric) === 1;
  checks.push({ label: "MOD-97 checksum valid", ok: modOk });
  const valid = checks.every(c => c.ok);
  return { valid, checks, country, iban };
}

export default function IbanValidator() {
  const [input, setInput] = useState("");
  const result = validateIBAN(input);

  // Format with spaces every 4 chars for display
  const formatted = input.replace(/\s/g, "").toUpperCase().replace(/(.{4})/g, "$1 ").trim();

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">IBAN</label>
        <input
          type="text"
          className="input font-mono"
          placeholder="GB29 NWBK 6016 1331 9268 19"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {input && <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">{formatted}</p>}
      </div>

      {result && (
        <div className="space-y-3">
          <div className={`rounded-xl px-5 py-4 text-center font-semibold text-lg ${result.valid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
            {result.valid ? "✓ Valid IBAN" : "✗ Invalid IBAN"}
          </div>
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
