"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) { result.push(cur); cur = ""; }
    else cur += ch;
  }
  result.push(cur);
  return result;
}

function csvToJson(csv: string): unknown[] {
  const lines = csv.trim().split("\n");
  const headers = parseCsvLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] ?? "").trim()]));
  });
}

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function convert() {
    try {
      const data = csvToJson(input);
      setOutput(JSON.stringify(data, null, 2)); setError("");
    } catch (e) { setError((e as Error).message); setOutput(""); }
  }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">CSV input</label>
          <textarea className="textarea min-h-[240px]" placeholder={"name,age\nAlice,30\nBob,25"} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">JSON output</label>
            {output && <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>}
          </div>
          <textarea className="textarea min-h-[240px]" value={output} placeholder="JSON appears here…" onChange={() => {}} />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button onClick={convert} className="btn-primary">Convert</button>
    </div>
  );
}
