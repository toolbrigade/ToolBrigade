"use client";
import { useState } from "react";

type PostalRule = { label: string; pattern: RegExp; example: string; note?: string };

const POSTAL_RULES: Record<string, PostalRule> = {
  US: { label: "United States (ZIP)", pattern: /^\d{5}(-\d{4})?$/, example: "90210 or 90210-1234" },
  GB: { label: "United Kingdom (Postcode)", pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, example: "SW1A 1AA or EC1A 1BB" },
  CA: { label: "Canada (Postal Code)", pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d$/i, example: "K1A 0B1 or M5V3L9" },
  AU: { label: "Australia (Postcode)", pattern: /^(0[289][0-9]{2}|[1-9][0-9]{3})$/, example: "2000 or 3000" },
  DE: { label: "Germany (PLZ)", pattern: /^\d{5}$/, example: "10115" },
  FR: { label: "France (Code Postal)", pattern: /^\d{5}$/, example: "75001" },
  NL: { label: "Netherlands (Postcode)", pattern: /^\d{4}\s?[A-Z]{2}$/i, example: "1234 AB" },
  SE: { label: "Sweden (Postnummer)", pattern: /^\d{3}\s?\d{2}$/, example: "113 51" },
  NO: { label: "Norway (Postnummer)", pattern: /^\d{4}$/, example: "0150" },
  DK: { label: "Denmark (Postnummer)", pattern: /^\d{4}$/, example: "1050" },
  CH: { label: "Switzerland (PLZ)", pattern: /^\d{4}$/, example: "8001" },
  AT: { label: "Austria (PLZ)", pattern: /^\d{4}$/, example: "1010" },
  IT: { label: "Italy (CAP)", pattern: /^\d{5}$/, example: "00100" },
  ES: { label: "Spain (Código Postal)", pattern: /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/, example: "28001" },
  PT: { label: "Portugal (Código Postal)", pattern: /^\d{4}-\d{3}$/, example: "1000-001" },
  IN: { label: "India (PIN Code)", pattern: /^[1-9]\d{5}$/, example: "110001" },
  JP: { label: "Japan (郵便番号)", pattern: /^\d{3}-?\d{4}$/, example: "100-0001" },
  BR: { label: "Brazil (CEP)", pattern: /^\d{5}-?\d{3}$/, example: "01310-100" },
  ZA: { label: "South Africa (Postal Code)", pattern: /^\d{4}$/, example: "2000" },
  NZ: { label: "New Zealand (Postcode)", pattern: /^\d{4}$/, example: "6011" },
  SG: { label: "Singapore (Postal Code)", pattern: /^\d{6}$/, example: "018956" },
  IE: { label: "Ireland (Eircode)", pattern: /^[A-Z]\d{2}\s?[A-Z0-9]{4}$/i, example: "D02 XY45" },
};

export default function PostalCodeValidator() {
  const [country, setCountry] = useState("GB");
  const [code, setCode] = useState("");

  const rule = POSTAL_RULES[country];
  const trimmed = code.trim();
  const valid = trimmed ? rule.pattern.test(trimmed) : null;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Country</label>
          <select className="input" value={country} onChange={e => { setCountry(e.target.value); setCode(""); }}>
            {Object.entries(POSTAL_RULES).map(([code, r]) => (
              <option key={code} value={code}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Postal / ZIP code</label>
          <input
            type="text"
            className="input font-mono"
            placeholder={rule.example}
            value={code}
            onChange={e => setCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {valid !== null && (
        <div className={`rounded-xl px-5 py-4 text-center font-semibold text-lg ${valid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
          {valid ? "✓ Valid format" : "✗ Invalid format"}
        </div>
      )}

      <div className="card text-sm space-y-1">
        <p><span className="text-[var(--text-muted)]">Country:</span> <span className="text-[var(--text)]">{rule.label}</span></p>
        <p><span className="text-[var(--text-muted)]">Example:</span> <span className="font-mono text-[var(--text)]">{rule.example}</span></p>
        {rule.note && <p className="text-xs text-[var(--text-muted)]">{rule.note}</p>}
      </div>
    </div>
  );
}
