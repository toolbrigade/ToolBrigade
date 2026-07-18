"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

const CURRENCY_GROUPS: { label: string; currencies: string[] }[] = [
  { label: "Major", currencies: ["USD","EUR","GBP","JPY","CHF","CAD","AUD","NZD"] },
  { label: "Asia & Pacific", currencies: ["CNY","HKD","SGD","INR","KRW","TWD","THB","MYR","IDR","PHP","VND","BDT","PKR","LKR","NPR","MMK","KHR","LAK","MNT","KZT","UZS","AZN","GEL","AMD","BYN"] },
  { label: "Europe", currencies: ["NOK","SEK","DKK","PLN","CZK","HUF","RON","BGN","HRK","RSD","ISK","UAH","MDL","ALL","BAM","MKD"] },
  { label: "Middle East & Africa", currencies: ["AED","SAR","QAR","KWD","BHD","OMR","JOD","ILS","EGP","MAD","TND","DZD","LYD","NGN","GHS","KES","UGX","TZS","ETB","ZAR","ZMW","MZN","BWP","MUR","SCR","XOF","XAF"] },
  { label: "Americas", currencies: ["MXN","BRL","ARS","CLP","COP","PEN","UYU","BOB","PYG","VES","DOP","GTQ","HNL","NIO","CRC","PAB","CUP","JMD","TTD","BBD","BSD","BZD","GYD","SRD"] },
  { label: "Other", currencies: ["TRY","RUB","IRR","IQD","AFN","FJD","PGK","WST","TOP","SBD","VUV","XPF"] },
];
const CURRENCIES = CURRENCY_GROUPS.flatMap(g => g.currencies);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    setLoading(true); setError(""); setResult(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      let res: Response;
      try {
        res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`, { signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const r = data.rates[to];
      if (r == null) throw new Error("Rate not found");
      setRate(r); setResult(parseFloat(amount) * r);
    } catch {
      setError("Live rates are temporarily unavailable — please try again shortly.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Amount</label>
          <input type="number" min={0} className="input mt-1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">From</label>
          <select className="input mt-1" value={from} onChange={e => setFrom(e.target.value)}>
            {CURRENCY_GROUPS.map(g => (
              <optgroup key={g.label} label={g.label}>
                {g.currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">To</label>
          <select className="input mt-1" value={to} onChange={e => setTo(e.target.value)}>
            {CURRENCY_GROUPS.map(g => (
              <optgroup key={g.label} label={g.label}>
                {g.currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
      <button onClick={convert} disabled={loading || !amount} className="btn-primary flex items-center gap-2">
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{loading ? "Fetching rates…" : "Convert"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result !== null && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{result.toFixed(2)} {to}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{amount} {from} = {result.toFixed(4)} {to}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Rate: 1 {from} = {rate?.toFixed(6)} {to}</p>
        </div>
      )}
    </div>
  );
}
