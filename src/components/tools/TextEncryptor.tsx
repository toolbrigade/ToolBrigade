"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

function caesar(text: string, shift: number) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c >= "a" ? 97 : 65;
    return String.fromCharCode(((c.charCodeAt(0) - base + shift + 26) % 26) + base);
  });
}

export default function TextEncryptor() {
  const [input, setInput] = useState("");
  const [method, setMethod] = useState<"caesar" | "base64" | "rot13">("caesar");
  const [shift, setShift] = useState(13);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [copied, setCopied] = useState(false);

  let output = "";
  try {
    if (method === "caesar") output = caesar(input, mode === "encrypt" ? shift : -shift);
    else if (method === "rot13") output = caesar(input, 13);
    else if (method === "base64") output = mode === "encrypt" ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
  } catch { output = "Invalid input for decoding."; }

  function copy() { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["caesar", "rot13", "base64"] as const).map(m => (
          <button key={m} onClick={() => setMethod(m)} className={method === m ? "btn-primary text-sm" : "btn-secondary text-sm"}>
            {m === "caesar" ? "Caesar Cipher" : m === "rot13" ? "ROT13" : "Base64"}
          </button>
        ))}
      </div>
      {method === "caesar" && (
        <div className="space-y-1">
          <label className="text-sm text-[var(--text)]">Shift: {shift}</label>
          <input type="range" min={1} max={25} value={shift} className="w-full accent-brand-600" onChange={e => setShift(+e.target.value)} />
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => setMode("encrypt")} className={mode === "encrypt" ? "btn-primary text-sm" : "btn-secondary text-sm"}>Encrypt</button>
        <button onClick={() => setMode("decrypt")} className={mode === "decrypt" ? "btn-primary text-sm" : "btn-secondary text-sm"}>Decrypt</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input</label>
          <textarea className="textarea min-h-[160px]" placeholder="Enter text…" value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Output</label>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2 min-h-0"><Copy size={12} />{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea className="textarea min-h-[160px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
