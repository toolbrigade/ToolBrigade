"use client";
import { useState } from "react";

export default function DiscountCalculator() {
  const [mode, setMode] = useState<"find-price" | "find-pct">("find-price");
  const [original, setOriginal] = useState("100");
  const [discount, setDiscount] = useState("20");
  const [finalPrice, setFinalPrice] = useState("80");

  const orig = parseFloat(original) || 0;
  const disc = parseFloat(discount) || 0;
  const final = parseFloat(finalPrice) || 0;

  let salePrice = 0, savings = 0, pctOff = 0;
  if (mode === "find-price" && orig > 0 && disc >= 0) {
    savings = orig * disc / 100;
    salePrice = orig - savings;
    pctOff = disc;
  } else if (mode === "find-pct" && orig > 0 && final >= 0) {
    savings = orig - final;
    salePrice = final;
    pctOff = (savings / orig) * 100;
  }

  const fmt = (v: number) => v.toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("find-price")} className={mode === "find-price" ? "btn-primary" : "btn-secondary"}>
          Find Sale Price
        </button>
        <button onClick={() => setMode("find-pct")} className={mode === "find-pct" ? "btn-primary" : "btn-secondary"}>
          Find Discount %
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Original Price ($)</label>
          <input type="number" min={0} step="0.01" className="input mt-1" value={original} onChange={e => setOriginal(e.target.value)} />
        </div>
        {mode === "find-price" ? (
          <div>
            <label className="text-xs text-[var(--text-muted)]">Discount (%)</label>
            <input type="number" min={0} max={100} step="0.1" className="input mt-1" value={discount} onChange={e => setDiscount(e.target.value)} />
          </div>
        ) : (
          <div>
            <label className="text-xs text-[var(--text-muted)]">Final / Sale Price ($)</label>
            <input type="number" min={0} step="0.01" className="input mt-1" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} />
          </div>
        )}
      </div>

      {orig > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Sale Price", `$${fmt(salePrice)}`],
            ["You Save", `$${fmt(savings)}`],
            ["Discount", `${fmt(pctOff)}%`],
          ].map(([label, val]) => (
            <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-brand-600 dark:text-brand-400">{val}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
