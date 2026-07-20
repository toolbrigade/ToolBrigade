"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

export default function CurlGenerator() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState<"json" | "form" | "raw">("json");
  const [followRedirects, setFollowRedirects] = useState(true);
  const [verbose, setVerbose] = useState(false);
  const [startTime] = useState(Date.now());

  function addHeader() { setHeaders(h => [...h, { key: "", value: "" }]); }
  function removeHeader(i: number) { setHeaders(h => h.filter((_, idx) => idx !== i)); }
  function updateHeader(i: number, field: "key" | "value", val: string) {
    setHeaders(h => h.map((hdr, idx) => idx === i ? { ...hdr, [field]: val } : hdr));
  }

  const validHeaders = headers.filter(h => h.key.trim());

  const parts = ["curl"];
  if (verbose) parts.push("-v");
  if (followRedirects) parts.push("-L");
  parts.push(`-X ${method}`);
  for (const h of validHeaders) {
    parts.push(`-H "${h.key}: ${h.value}"`);
  }
  if (body && method !== "GET" && method !== "HEAD") {
    if (bodyType === "json") {
      if (!validHeaders.some(h => h.key.toLowerCase() === "content-type")) {
        parts.push(`-H "Content-Type: application/json"`);
      }
      parts.push(`-d '${body.replace(/'/g, "'\\''")}'`);
    } else if (bodyType === "form") {
      parts.push(`--data-urlencode '${body.replace(/'/g, "'\\''")}'`);
    } else {
      parts.push(`--data-raw '${body.replace(/'/g, "'\\''")}'`);
    }
  }
  parts.push(`"${url || "https://api.example.com/endpoint"}"`);

  const curl = parts.join(" \\\n  ");

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select value={method} onChange={e => setMethod(e.target.value)}
          className="text-sm font-semibold border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400">
          {METHODS.map(m => <option key={m}>{m}</option>)}
        </select>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint"
          className="flex-1 text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-[var(--text-muted)]">Headers</label>
          <button onClick={addHeader} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1"><Plus size={12} />Add Header</button>
        </div>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input value={h.key} onChange={e => updateHeader(i, "key", e.target.value)} placeholder="Header-Name"
              className="flex-1 text-sm border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
            <input value={h.value} onChange={e => updateHeader(i, "value", e.target.value)} placeholder="value"
              className="flex-1 text-sm border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
            {headers.length > 1 && <button onClick={() => removeHeader(i)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
          </div>
        ))}
      </div>

      {method !== "GET" && method !== "HEAD" && (
        <div>
          <div className="flex gap-2 items-center mb-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">Request Body</label>
            <select value={bodyType} onChange={e => setBodyType(e.target.value as "json" | "form" | "raw")}
              className="text-xs border border-[var(--border)] rounded px-2 py-1 bg-[var(--surface)] text-[var(--text)] focus:outline-none">
              <option value="json">JSON</option>
              <option value="form">Form URL-encoded</option>
              <option value="raw">Raw</option>
            </select>
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={4}
            className="textarea font-mono text-sm"
            placeholder={bodyType === "json" ? '{"key": "value"}' : "key=value&other=data"} />
        </div>
      )}

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={followRedirects} onChange={e => setFollowRedirects(e.target.checked)} className="accent-[var(--brand)]" />
          <span className="text-[var(--text-muted)]">Follow redirects (-L)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={verbose} onChange={e => setVerbose(e.target.checked)} className="accent-[var(--brand)]" />
          <span className="text-[var(--text-muted)]">Verbose (-v)</span>
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-[var(--text-muted)]">Generated cURL Command</label>
          <div onClick={() => trackTaskComplete("curl-generator", startTime)}><CopyButton text={curl} /></div>
        </div>
        <pre className="textarea font-mono text-sm whitespace-pre-wrap break-all min-h-[100px]">{curl}</pre>
      </div>
    </div>
  );
}
