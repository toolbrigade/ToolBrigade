"use client";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

const COINS = ["bitcoin","ethereum","tether","binancecoin","solana","ripple","usd-coin","dogecoin","cardano","avalanche-2","polkadot","chainlink","litecoin","bitcoin-cash","stellar","monero","cosmos","algorand","vechain","filecoin"];
const FIATS = ["USD","EUR","GBP","JPY","CAD","AUD","CHF","INR","KRW","BRL","MXN","SGD","HKD","NOK","SEK"];

export default function CryptoPriceConverter() {
  const [coin, setCoin] = useState("bitcoin");
  const [fiat, setFiat] = useState("USD");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function convert() {
    setLoading(true); setError(""); setResult(null); setPrice(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let res: Response;
      try {
        res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${fiat.toLowerCase()}`,
          { signal: controller.signal }
        );
      } finally { clearTimeout(timeout); }
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const p = data[coin]?.[fiat.toLowerCase()];
      if (p == null) throw new Error("Price not found");
      setPrice(p);
      setResult((parseFloat(amount) || 0) * p);
    } catch {
      setError("Price data temporarily unavailable — CoinGecko free tier allows ~30 requests/min. Please try again shortly.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200">
        ⚠️ Requires internet connection. Prices fetched live from CoinGecko&apos;s free public API (no API key required; ~30 requests/min rate limit).
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Amount</label>
          <input type="number" min={0} step="any" className="input mt-1" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Cryptocurrency</label>
          <select className="input mt-1" value={coin} onChange={e => setCoin(e.target.value)}>
            {COINS.map(c => <option key={c} value={c}>{c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Fiat Currency</label>
          <select className="input mt-1" value={fiat} onChange={e => setFiat(e.target.value)}>
            {FIATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <button onClick={convert} disabled={loading || !amount} className="btn-primary flex items-center gap-2">
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        {loading ? "Fetching price…" : "Convert"}
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result !== null && price !== null && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
            {result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fiat}
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            1 {coin.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())} = {price.toLocaleString()} {fiat}
          </p>
        </div>
      )}
    </div>
  );
}
