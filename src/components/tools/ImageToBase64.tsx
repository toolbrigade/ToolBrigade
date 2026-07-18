"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function ImageToBase64() {
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => setResult(reader.result as string);
    reader.readAsDataURL(file);
  }

  function copy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => document.getElementById("b64-upload")?.click()}
        className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-brand-400 transition-colors"
      >
        <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
          <Upload size={28} />
          <p className="text-sm">Click to upload an image</p>
        </div>
        <input id="b64-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[var(--text-muted)]">Base64 Data URL</label>
            <button onClick={copy} className="btn-secondary text-xs px-3 py-1 min-h-[32px]">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea className="textarea min-h-[120px] text-xs" readOnly value={result} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result} alt="preview" className="max-h-40 rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
