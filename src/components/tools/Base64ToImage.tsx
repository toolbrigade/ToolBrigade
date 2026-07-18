"use client";
import { useState } from "react";
import { Download } from "lucide-react";

export default function Base64ToImage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const dataUrl = input.trim().startsWith("data:") ? input.trim() : input.trim() ? `data:image/png;base64,${input.trim()}` : "";

  function validate() {
    if (!dataUrl) return;
    const img = new Image();
    img.onerror = () => setError("Invalid Base64 or unsupported format.");
    img.onload = () => setError("");
    img.src = dataUrl;
  }

  const ext = dataUrl.match(/data:image\/(\w+)/)?.[1] ?? "png";

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Paste Base64 string or data URL</label>
        <textarea className="textarea min-h-[140px]" placeholder="data:image/png;base64,iVBORw0KGgo… or raw base64" value={input} onChange={e => { setInput(e.target.value); setError(""); }} onBlur={validate} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {dataUrl && !error && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dataUrl} alt="decoded" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" onError={() => setError("Invalid Base64 or unsupported format.")} />
          <a href={dataUrl} download={`image.${ext}`} className="btn-primary inline-flex items-center gap-2"><Download size={16} />Download Image</a>
        </div>
      )}
    </div>
  );
}
