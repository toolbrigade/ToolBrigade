"use client";
import { useState } from "react";

// Regex-based phone validation by country — libphonenumber-js is a large bundle
// We implement a practical subset of country patterns for common use cases
// and credit the E.164 standard approach

type CountryRule = { label: string; pattern: RegExp; format: string; example: string };

const COUNTRIES: Record<string, CountryRule> = {
  "": { label: "Auto-detect (E.164)", pattern: /^\+[1-9]\d{6,14}$/, format: "+[country code][number]", example: "+447911123456" },
  GB: { label: "United Kingdom (+44)", pattern: /^(\+44|0)7\d{9}$|^(\+44|0)[1-9]\d{8,9}$/, format: "+44 XXXX XXXXXX", example: "+44 7911 123456" },
  US: { label: "United States (+1)", pattern: /^(\+1)?[2-9]\d{2}[2-9]\d{6}$/, format: "+1 (XXX) XXX-XXXX", example: "+1 (555) 123-4567" },
  CA: { label: "Canada (+1)", pattern: /^(\+1)?[2-9]\d{2}[2-9]\d{6}$/, format: "+1 (XXX) XXX-XXXX", example: "+1 (416) 123-4567" },
  AU: { label: "Australia (+61)", pattern: /^(\+61|0)[2-9]\d{8}$/, format: "+61 X XXXX XXXX", example: "+61 2 1234 5678" },
  DE: { label: "Germany (+49)", pattern: /^(\+49|0)\d{3,13}$/, format: "+49 XXX XXXXXXX", example: "+49 30 12345678" },
  FR: { label: "France (+33)", pattern: /^(\+33|0)[1-9]\d{8}$/, format: "+33 X XX XX XX XX", example: "+33 1 23 45 67 89" },
  IN: { label: "India (+91)", pattern: /^(\+91)?[6-9]\d{9}$/, format: "+91 XXXXX XXXXX", example: "+91 98765 43210" },
  JP: { label: "Japan (+81)", pattern: /^(\+81|0)\d{9,10}$/, format: "+81 XX XXXX XXXX", example: "+81 3 1234 5678" },
  CN: { label: "China (+86)", pattern: /^(\+86)?1[3-9]\d{9}$/, format: "+86 1XX XXXX XXXX", example: "+86 138 0013 8000" },
  BR: { label: "Brazil (+55)", pattern: /^(\+55)?[1-9]{2}9?\d{8}$/, format: "+55 XX XXXXX-XXXX", example: "+55 11 91234-5678" },
  ZA: { label: "South Africa (+27)", pattern: /^(\+27|0)[6-8]\d{8}$/, format: "+27 XX XXX XXXX", example: "+27 71 123 4567" },
};

function validate(phone: string, countryCode: string) {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (!cleaned) return null;
  const rule = COUNTRIES[countryCode];
  if (!rule) return null;
  const valid = rule.pattern.test(cleaned);
  return { valid, rule, cleaned };
}

export default function PhoneNumberValidator() {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const result = validate(phone, country);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-2 text-xs text-blue-700 dark:text-blue-300">
        Format validation only — this tool checks whether the phone number matches the expected format for the selected country. It does <strong>not</strong> verify whether the number is active or assigned to a carrier.
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Country</label>
          <select className="input" value={country} onChange={e => setCountry(e.target.value)}>
            {Object.entries(COUNTRIES).map(([code, r]) => (
              <option key={code} value={code}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Phone number</label>
          <input
            type="tel"
            className="input font-mono"
            placeholder={COUNTRIES[country]?.example ?? "+447911123456"}
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
      </div>

      {result && (
        <div className="space-y-2">
          <div className={`rounded-xl px-5 py-4 text-center font-semibold text-lg ${result.valid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
            {result.valid ? "✓ Valid format" : "✗ Invalid format"}
          </div>
          <div className="card text-sm space-y-1">
            <p><span className="text-[var(--text-muted)]">Expected format:</span> <span className="font-mono text-[var(--text)]">{result.rule.format}</span></p>
            <p><span className="text-[var(--text-muted)]">Example:</span> <span className="font-mono text-[var(--text)]">{result.rule.example}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
