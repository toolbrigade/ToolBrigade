"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const DIALECTS = ["sql", "mysql", "postgresql", "bigquery", "sqlite"] as const;
type Dialect = typeof DIALECTS[number];

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());

  async function format() {
    setError("");
    try {
      const { format: fmt } = await import("sql-formatter");
      setOutput(fmt(input, { language: dialect, tabWidth: 2 }));
      trackTaskComplete("sql-formatter", startTime);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm font-medium text-[var(--text)]">Dialect:</label>
        <select
          value={dialect}
          onChange={e => setDialect(e.target.value as Dialect)}
          className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
        >
          {DIALECTS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
        </select>
        <button onClick={format} className="btn-primary text-sm">Format SQL</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input SQL</label>
          <textarea
            className="textarea min-h-[280px] font-mono text-sm"
            placeholder="SELECT id, name FROM users WHERE active = 1 ORDER BY name;"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Formatted Output</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[280px] font-mono text-sm" value={output} readOnly placeholder="Formatted SQL appears here…" />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
