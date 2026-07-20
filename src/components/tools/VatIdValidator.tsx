"use client";
import { useState } from "react";

type VatRule = { label: string; pattern: RegExp; example: string };

const VAT_RULES: Record<string, VatRule> = {
  GB: { label: "United Kingdom", pattern: /^GB(\d{9}|\d{12}|(GD|HA)\d{3})$/, example: "GB123456789" },
  AT: { label: "Austria", pattern: /^ATU\d{8}$/, example: "ATU12345678" },
  BE: { label: "Belgium", pattern: /^BE0\d{9}$/, example: "BE0123456789" },
  BG: { label: "Bulgaria", pattern: /^BG\d{9,10}$/, example: "BG123456789" },
  CY: { label: "Cyprus", pattern: /^CY\d{8}[A-Z]$/, example: "CY12345678A" },
  CZ: { label: "Czech Republic", pattern: /^CZ\d{8,10}$/, example: "CZ12345678" },
  DE: { label: "Germany", pattern: /^DE\d{9}$/, example: "DE123456789" },
  DK: { label: "Denmark", pattern: /^DK\d{8}$/, example: "DK12345678" },
  EE: { label: "Estonia", pattern: /^EE\d{9}$/, example: "EE123456789" },
  ES: { label: "Spain", pattern: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/, example: "ESA12345678" },
  FI: { label: "Finland", pattern: /^FI\d{8}$/, example: "FI12345678" },
  FR: { label: "France", pattern: /^FR[A-Z0-9]{2}\d{9}$/, example: "FRXX123456789" },
  GR: { label: "Greece", pattern: /^EL\d{9}$/, example: "EL123456789" },
  HR: { label: "Croatia", pattern: /^HR\d{11}$/, example: "HR12345678901" },
  HU: { label: "Hungary", pattern: /^HU\d{8}$/, example: "HU12345678" },
  IE: { label: "Ireland", pattern: /^IE\d[A-Z0-9+*]\d{5}[A-Z]{1,2}$/, example: "IE1A12345B" },
  IT: { label: "Italy", pattern: /^IT\d{11}$/, example: "IT12345678901" },
  LT: { label: "Lithuania", pattern: /^LT(\d{9}|\d{12})$/, example: "LT123456789" },
  LU: { label: "Luxembourg", pattern: /^LU\d{8}$/, example: "LU12345678" },
  LV: { label: "Latvia", pattern: /^LV\d{11}$/, example: "LV12345678901" },
  MT: { label: "Malta", pattern: /^MT\d{8}$/, example: "MT12345678" },
  NL: { label: "Netherlands", pattern: /^NL\d{9}B\d{2}$/, example: "NL123456789B01" },
  PL: { label: "Poland", pattern: /^PL\d{10}$/, example: "PL1234567890" },
  PT: { label: "Portugal", pattern: /^PT\d{9}$/, example: "PT123456789" },
  RO: { label: "Romania", pattern: /^RO\d{2,10}$/, example: "RO12345678" },
  SE: { label: "Sweden", pattern: /^SE\d{12}$/, example: "SE123456789012" },
  SI: { label: "Slovenia", pattern: /^SI\d{8}$/, example: "SI12345678" },
  SK: { label: "Slovakia", pattern: /^SK\d{10}$/, example: "SK1234567890" },
};

function validate(raw: string) {
  const vat = raw.replace(/\s/g, "").toUpperCase();
  if (vat.length < 2) return null;
  const code = vat.slice(0, 2);
  const rule = VAT_RULES[code];
  if (!rule) return { valid: false, message: `Country code "${code}" not in supported list`, rule: null, vat };
  const valid = rule.pattern.test(vat);
  return { valid, message: valid ? `Valid ${rule.label} VAT format` : `Invalid format for ${rule.label} (example: ${rule.example})`, rule, vat };
}

export default function VatIdValidator() {
  const [input, setInput] = useState("");
  const result = validate(input);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Format validation only — this tool checks whether the VAT number matches the expected format for the given country. It does <strong>not</strong> verify whether the number is actually registered or active with any tax authority.
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">VAT / Tax ID number</label>
        <input
          type="text"
          className="input font-mono"
          placeholder="GB123456789 or DE123456789"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs text-[var(--text-muted)] mt-1">Start with the 2-letter country code (e.g. GB, DE, FR)</p>
      </div>

      {result && (
        <div className={`rounded-xl px-5 py-4 font-medium text-sm ${result.valid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
          {result.valid ? "✓" : "✗"} {result.message}
        </div>
      )}

      <details className="card text-sm">
        <summary className="cursor-pointer font-medium text-[var(--text)]">Supported countries ({Object.keys(VAT_RULES).length})</summary>
        <div className="mt-3 grid sm:grid-cols-2 gap-1 text-xs text-[var(--text-muted)]">
          {Object.entries(VAT_RULES).map(([code, r]) => (
            <div key={code}><span className="font-mono font-medium text-[var(--text)]">{code}</span> — {r.label}</div>
          ))}
        </div>
      </details>
    </div>
  );
}
