"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

function optimizeSvg(svg: string): string {
  return svg
    // Remove XML declaration
    .replace(/<\?xml[^?]*\?>/g, "")
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove doctype
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    // Remove metadata elements
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
    // Remove title/desc (optional, improves size)
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<desc[\s\S]*?<\/desc>/gi, "")
    // Remove editor-specific namespaces and attributes
    .replace(/\s+inkscape:[a-z-]+="[^"]*"/g, "")
    .replace(/\s+sodipodi:[a-z-]+="[^"]*"/g, "")
    .replace(/\s+xmlns:inkscape="[^"]*"/g, "")
    .replace(/\s+xmlns:sodipodi="[^"]*"/g, "")
    .replace(/\s+xmlns:dc="[^"]*"/g, "")
    .replace(/\s+xmlns:cc="[^"]*"/g, "")
    .replace(/\s+xmlns:rdf="[^"]*"/g, "")
    // Collapse whitespace between tags
    .replace(/>\s+</g, "><")
    // Collapse multiple spaces within tags
    .replace(/\s{2,}/g, " ")
    // Remove spaces around = in attributes
    .replace(/\s*=\s*/g, "=")
    .trim();
}

export default function SvgOptimizer() {
  const [original, setOriginal] = useState("");
  const [optimized, setOptimized] = useState("");
  const [startTime] = useState(Date.now());

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setOriginal(text);
      const result = optimizeSvg(text);
      setOptimized(result);
      trackTaskComplete("svg-optimizer", startTime);
    };
    reader.readAsText(file);
  }

  function handlePaste(text: string) {
    setOriginal(text);
    setOptimized(optimizeSvg(text));
  }

  const origSize = new Blob([original]).size;
  const optSize = new Blob([optimized]).size;
  const saved = origSize > 0 ? Math.round((1 - optSize / origSize) * 100) : 0;

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([optimized], { type: "image/svg+xml" }));
    a.download = "optimized.svg";
    a.click();
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)] transition-colors">
        <Upload size={24} />
        <span className="text-sm font-medium">Upload SVG file</span>
        <input type="file" accept=".svg,image/svg+xml" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Input SVG (paste or upload)</label>
          <textarea className="textarea min-h-[220px] font-mono text-xs" value={original}
            onChange={e => handlePaste(e.target.value)}
            placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; ...>...</svg>" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Optimized SVG</label>
            <CopyButton text={optimized} />
          </div>
          <textarea className="textarea min-h-[220px] font-mono text-xs" value={optimized} readOnly />
        </div>
      </div>

      {origSize > 0 && (
        <div className="flex gap-4 flex-wrap">
          <div className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm">
            <span className="text-[var(--text-muted)]">Original: </span>
            <span className="font-semibold text-[var(--text)]">{(origSize / 1024).toFixed(2)} KB</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-sm">
            <span className="text-[var(--text-muted)]">Optimized: </span>
            <span className="font-semibold text-[var(--text)]">{(optSize / 1024).toFixed(2)} KB</span>
          </div>
          <div className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm">
            <span className="text-green-700 dark:text-green-300 font-semibold">Saved {saved}%</span>
          </div>
          {optimized && (
            <button onClick={download} className="btn-secondary text-sm">Download .svg</button>
          )}
        </div>
      )}
    </div>
  );
}
