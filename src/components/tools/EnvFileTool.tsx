"use client";
import { useState } from "react";
import { Eye, EyeOff, Download } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

type EnvRow = { key: string; value: string; comment: string };

function parseEnv(text: string): EnvRow[] {
  return text.split("\n").map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) return { key: "", value: "", comment: trimmed };
    const eq = trimmed.indexOf("=");
    if (eq === -1) return { key: trimmed, value: "", comment: "" };
    return { key: trimmed.slice(0, eq).trim(), value: trimmed.slice(eq + 1).trim(), comment: "" };
  });
}

function toEnvText(rows: EnvRow[]): string {
  return rows.map(r => r.comment ? r.comment : r.key ? `${r.key}=${r.value}` : "").join("\n");
}

export default function EnvFileTool() {
  const [raw, setRaw] = useState("");
  const [rows, setRows] = useState<EnvRow[]>([]);
  const [masked, setMasked] = useState(false);
  const [startTime] = useState(Date.now());

  function parse() {
    setRows(parseEnv(raw));
    trackTaskComplete("env-file-tool", startTime);
  }

  function updateRow(i: number, field: "key" | "value", val: string) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  function addRow() {
    setRows(prev => [...prev, { key: "", value: "", comment: "" }]);
  }

  function removeRow(i: number) {
    setRows(prev => prev.filter((_, idx) => idx !== i));
  }

  const output = toEnvText(rows);

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/plain" }));
    a.download = ".env";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Paste .env content</label>
          <textarea
            className="textarea min-h-[200px] font-mono text-sm"
            placeholder={"DATABASE_URL=postgres://localhost/mydb\nAPI_KEY=secret123\n# Comment line"}
            value={raw}
            onChange={e => setRaw(e.target.value)}
          />
          <button onClick={parse} className="btn-primary text-sm mt-2">Parse</button>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Export Preview</label>
            <div className="flex gap-2">
              <button onClick={() => setMasked(m => !m)} className="btn-secondary text-xs flex items-center gap-1">
                {masked ? <Eye size={12} /> : <EyeOff size={12} />}
                {masked ? "Show values" : "Mask values"}
              </button>
              <CopyButton text={output} />
            </div>
          </div>
          <textarea
            className="textarea min-h-[200px] font-mono text-sm"
            value={masked ? output.replace(/=.+/g, "=***") : output}
            readOnly
          />
        </div>
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-[var(--text-muted)]">Edit Variables</label>
            <button onClick={addRow} className="btn-secondary text-xs">+ Add Row</button>
          </div>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {rows.map((row, i) => row.comment ? (
              <div key={i} className="text-xs text-[var(--text-muted)] font-mono px-2 py-1">{row.comment}</div>
            ) : (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className="flex-1 text-sm font-mono border border-[var(--border)] rounded-lg px-2 py-1 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                  value={row.key}
                  onChange={e => updateRow(i, "key", e.target.value)}
                  placeholder="KEY"
                />
                <span className="text-[var(--text-muted)]">=</span>
                <input
                  className="flex-1 text-sm font-mono border border-[var(--border)] rounded-lg px-2 py-1 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
                  value={masked ? "***" : row.value}
                  onChange={e => !masked && updateRow(i, "value", e.target.value)}
                  placeholder="value"
                  readOnly={masked}
                />
                <button onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
              </div>
            ))}
          </div>
          <button onClick={download} className="btn-secondary text-sm flex items-center gap-1">
            <Download size={14} /> Download .env
          </button>
        </div>
      )}
    </div>
  );
}
