"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

export default function TextRepeater() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState("\n");
  const [copied, setCopied] = useState(false);

  const output = Array(count).fill(input).join(separator);
  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  const sepOptions = [{ label: "New line", value: "\n" }, { label: "Space", value: " " }, { label: "Comma", value: ", " }, { label: "None", value: "" }];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Repeat count</label>
          <input type="number" min={1} max={1000} value={count} className="input mt-1" onChange={e => setCount(Math.min(1000, +e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Separator</label>
          <select className="input mt-1" value={separator} onChange={e => setSeparator(e.target.value)}>
            {sepOptions.map(o => <option key={o.label} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Text to repeat</label>
        <input className="input" placeholder="Hello World" value={input} onChange={e => setInput(e.target.value)} />
      </div>
      {input && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-xs text-[var(--text-muted)]">{output.length} characters</p>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[160px]" readOnly value={output} />
        </>
      )}
    </div>
  );
}
