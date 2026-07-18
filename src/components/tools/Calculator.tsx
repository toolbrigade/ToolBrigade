"use client";
import { useState } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [newNum, setNewNum] = useState(true);

  function press(val: string) {
    if (val === "C") { setDisplay("0"); setExpr(""); setNewNum(true); return; }
    if (val === "⌫") { setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0"); return; }
    if (val === "=") {
      try {
        const raw = Function(`"use strict"; return (${expr + display})`)();
        if (!isFinite(raw)) { setDisplay(raw === Infinity ? "∞" : raw === -Infinity ? "-∞" : "Error"); }
        else setDisplay(String(parseFloat(raw.toFixed(10))));
        setExpr(""); setNewNum(true);
      } catch { setDisplay("Error"); setNewNum(true); }
      return;
    }
    if (["+", "-", "×", "÷", "%"].includes(val)) {
      setExpr(e => e + display + val.replace("×", "*").replace("÷", "/"));
      setNewNum(true); return;
    }
    if (val === "±") { setDisplay(d => d.startsWith("-") ? d.slice(1) : "-" + d); return; }
    if (val === "√") { setDisplay(d => String(Math.sqrt(parseFloat(d)))); return; }
    if (val === "x²") { setDisplay(d => String(Math.pow(parseFloat(d), 2))); return; }
    if (val === "1/x") { setDisplay(d => String(1 / parseFloat(d))); return; }
    if (newNum) { setDisplay(val === "." ? "0." : val); setNewNum(false); }
    else { setDisplay(d => val === "." && d.includes(".") ? d : d === "0" && val !== "." ? val : d + val); }
  }

  const rows = [
    ["C", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["√", "0", ".", "="],
  ];

  return (
    <div className="max-w-xs mx-auto space-y-3">
      <div className="bg-[var(--bg-subtle)] rounded-xl p-4 text-right">
        <p className="text-xs text-[var(--text-muted)] h-4 font-mono">{expr}</p>
        <p className="text-3xl font-bold text-[var(--text)] font-mono truncate">{display}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {rows.flat().map((btn, i) => (
          <button key={i} onClick={() => press(btn)}
            className={`h-14 rounded-xl text-lg font-semibold transition-colors ${btn === "=" ? "bg-brand-600 hover:bg-brand-700 text-white" : ["C","±","%","÷","×","-","+","√"].includes(btn) ? "bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-brand-600 dark:text-brand-400 border border-[var(--border)]" : "bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] text-[var(--text)] border border-[var(--border)]"}`}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
