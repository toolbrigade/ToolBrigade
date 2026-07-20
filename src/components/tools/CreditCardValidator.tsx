"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function detectNetwork(digits: string): string {
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6(?:011|5)/.test(digits)) return "Discover";
  return "Unknown";
}

function generateLuhn(prefix: string, length: number): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let digits = prefix;
  while (digits.length < length - 1) {
    digits += arr[digits.length] % 10;
  }
  // Calculate check digit
  let sum = 0;
  let alt = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  const check = (10 - (sum % 10)) % 10;
  return digits + check;
}

const PREFIXES = [
  { label: "Visa (16)", prefix: "4", length: 16 },
  { label: "Mastercard (16)", prefix: "51", length: 16 },
  { label: "Amex (15)", prefix: "37", length: 15 },
  { label: "Discover (16)", prefix: "6011", length: 16 },
];

export default function CreditCardValidator() {
  const [tab, setTab] = useState<"validate" | "generate">("validate");
  const [input, setInput] = useState("");
  const [prefixIdx, setPrefixIdx] = useState(0);
  const [generated, setGenerated] = useState<string[]>([]);

  const digits = input.replace(/\D/g, "");
  const isValid = digits.length >= 13 ? luhnCheck(digits) : null;
  const network = digits.length >= 13 ? detectNetwork(digits) : null;

  function generate() {
    const { prefix, length } = PREFIXES[prefixIdx];
    const nums = Array.from({ length: 5 }, () => generateLuhn(prefix, length));
    setGenerated(nums);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-800 dark:text-red-200 space-y-1">
        <p className="font-bold">⚠️ FOR TESTING AND DEVELOPMENT PURPOSES ONLY</p>
        <p>Generated numbers pass the Luhn algorithm check but are <strong>NOT real credit card numbers</strong>. They cannot be used for any real transaction, purchase, or financial activity. Use only for software testing, form validation, and development environments.</p>
      </div>

      <div className="flex gap-2">
        {(["validate", "generate"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-brand-600 text-white" : "bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]"}`}>
            {t === "validate" ? "Validate" : "Generate Test Numbers"}
          </button>
        ))}
      </div>

      {tab === "validate" && (
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Card number</label>
            <input
              type="text"
              className="input font-mono"
              placeholder="4111 1111 1111 1111"
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={23}
            />
          </div>
          {isValid !== null && (
            <div className="space-y-2">
              <div className={`rounded-xl px-5 py-4 text-center font-semibold text-lg ${isValid ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"}`}>
                {isValid ? "✓ Luhn check passed" : "✗ Luhn check failed"}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="card text-sm"><p className="text-[var(--text-muted)] text-xs mb-1">Network (by prefix)</p><p className="font-medium text-[var(--text)]">{network}</p></div>
                <div className="card text-sm"><p className="text-[var(--text-muted)] text-xs mb-1">Digits</p><p className="font-medium text-[var(--text)]">{digits.length}</p></div>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Luhn validation checks the number format only — it does not verify the card exists or is active.</p>
            </div>
          )}
        </div>
      )}

      {tab === "generate" && (
        <div className="space-y-3">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2 text-xs text-amber-800 dark:text-amber-200">
            These are <strong>fake test numbers only</strong>. They will fail real payment processing. Use only in sandboxed test environments.
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Card type</label>
            <select className="input" value={prefixIdx} onChange={e => setPrefixIdx(+e.target.value)}>
              {PREFIXES.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate 5 Test Numbers</button>
          {generated.length > 0 && (
            <div className="space-y-2">
              {generated.map(n => (
                <div key={n} className="flex items-center justify-between bg-[var(--bg-subtle)] rounded-lg px-4 py-2">
                  <code className="font-mono text-sm text-[var(--text)]">{n}</code>
                  <CopyButton text={n} />
                </div>
              ))}
              <p className="text-xs text-[var(--text-muted)] text-center">⚠️ NOT real card numbers — for testing only</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
