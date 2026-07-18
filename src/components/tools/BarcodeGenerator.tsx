"use client";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

export default function BarcodeGenerator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [text, setText] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!text) return;
    import("jsbarcode").then(({ default: JsBarcode }) => {
      try {
        JsBarcode(svgRef.current, text, { format, lineColor: "#000", background: "#fff", displayValue: true, fontSize: 14, margin: 10 });
        setError("");
      } catch (e) { setError((e as Error).message); }
    });
  }, [text, format]);

  function download() {
    const svg = svgRef.current!;
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "barcode.svg"; a.click();
  }

  const formats = ["CODE128", "EAN13", "EAN8", "UPC", "CODE39", "ITF14", "MSI", "pharmacode"];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Value</label>
          <input className="input mt-1 font-mono" placeholder="123456789012" value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Format</label>
          <select className="input mt-1" value={format} onChange={e => setFormat(e.target.value)}>
            {formats.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-col items-center gap-3 bg-white rounded-lg p-4 border border-[var(--border)]">
        <svg ref={svgRef} />
      </div>
      {text && !error && (
        <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center">
          <Download size={16} />Download SVG
        </button>
      )}
    </div>
  );
}
