"use client";
import { useState } from "react";

export default function LoanEmiCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8.5");
  const [term, setTerm] = useState("60");

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100 / 12;
  const n = parseInt(term) || 0;

  let emi = 0;
  if (P > 0 && r > 0 && n > 0) {
    emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (P > 0 && r === 0 && n > 0) {
    emi = P / n;
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  if (emi > 0 && n > 0 && n <= 600) {
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ month: i, payment: emi, principal: principalPart, interest: interestPart, balance });
    }
  }

  const fmt = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Loan Amount ($)</label>
          <input type="number" min={0} className="input mt-1" value={principal} onChange={e => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Annual Interest Rate (%)</label>
          <input type="number" min={0} step="0.1" className="input mt-1" value={rate} onChange={e => setRate(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Term (months)</label>
          <input type="number" min={1} max={600} className="input mt-1" value={term} onChange={e => setTerm(e.target.value)} />
        </div>
      </div>

      {emi > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[["Monthly Payment", fmt(emi)], ["Total Payment", fmt(totalPayment)], ["Total Interest", fmt(totalInterest)]].map(([label, val]) => (
              <div key={label} className="bg-[var(--bg-subtle)] rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-brand-600 dark:text-brand-400">${val}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
              </div>
            ))}
          </div>

          {schedule.length > 0 && (
            <div className="overflow-auto max-h-72 rounded-xl border border-[var(--border)]">
              <table className="w-full text-xs">
                <thead className="bg-[var(--bg-subtle)] sticky top-0">
                  <tr>
                    {["Month", "Payment", "Principal", "Interest", "Balance"].map(h => (
                      <th key={h} className="px-3 py-2 text-left font-medium text-[var(--text-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.month} className="border-t border-[var(--border)]">
                      <td className="px-3 py-1.5 text-[var(--text-muted)]">{row.month}</td>
                      <td className="px-3 py-1.5">${fmt(row.payment)}</td>
                      <td className="px-3 py-1.5 text-green-600 dark:text-green-400">${fmt(row.principal)}</td>
                      <td className="px-3 py-1.5 text-amber-600 dark:text-amber-400">${fmt(row.interest)}</td>
                      <td className="px-3 py-1.5">${fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
