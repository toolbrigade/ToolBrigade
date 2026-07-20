"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type TextItem = {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
  pageIndex: number;
};

type PageInfo = {
  width: number;
  height: number;
  scale: number;
};

type PdfPageRef = {
  page: any;
  viewport: any;
};

const SCALE = 1.5;

export default function PdfTextEditor() {
  const [pageInfos, setPageInfos] = useState<PageInfo[]>([]);
  const [items, setItems] = useState<TextItem[]>([]);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [originalBytes, setOriginalBytes] = useState<Uint8Array | null>(null);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const pendingRenders = useRef<PdfPageRef[]>([]);
  const [startTime] = useState(Date.now());

  // After canvases mount, render PDF pages into them
  useEffect(() => {
    if (pendingRenders.current.length === 0) return;
    const renders = pendingRenders.current;
    pendingRenders.current = [];
    renders.forEach(({ page, viewport }, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: canvas.getContext("2d")!, viewport });
    });
  }, [pageInfos]);

  async function handleFile(file: File) {
    setLoading(true); setError(""); setItems([]); setEdits({}); setPageInfos([]);
    try {
      const ab = await file.arrayBuffer();
      const bytes = new Uint8Array(ab);
      setOriginalBytes(bytes);

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const pdf = await pdfjsLib.getDocument({ data: bytes.slice() }).promise;
      const allItems: TextItem[] = [];
      const infos: PageInfo[] = [];
      const pageRefs: PdfPageRef[] = [];

      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: SCALE });
        infos.push({ width: viewport.width, height: viewport.height, scale: SCALE });
        pageRefs.push({ page, viewport });

        const content = await page.getTextContent();
        for (const item of content.items) {
          if (!("str" in item) || !item.str.trim()) continue;
          const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
          const x = tx[4];
          const y = tx[5];
          const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);
          const w = (item.width ?? 0) * SCALE;
          const h = fontSize * 1.4;
          allItems.push({ str: item.str, x, y: y - fontSize, w: Math.max(w, 30), h, fontSize, pageIndex: p - 1 });
        }
      }

      pendingRenders.current = pageRefs;
      setItems(allItems);
      setPageInfos(infos); // triggers useEffect to render canvases
    } catch (e) {
      console.error(e);
      setError("Could not read PDF. It may be encrypted or corrupted.");
    }
    setLoading(false);
  }

  async function exportPdf() {
    if (!originalBytes) return;
    const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
    const doc = await PDFDocument.load(originalBytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();

    for (const [key, newText] of Object.entries(edits)) {
      const idx = parseInt(key);
      const item = items[idx];
      if (!item || newText === item.str) continue;
      const page = pages[item.pageIndex];
      const { height } = page.getSize();
      const scale = pageInfos[item.pageIndex]?.scale ?? SCALE;

      const pdfX = item.x / scale;
      const pdfY = height - (item.y + item.h) / scale;
      const pdfFontSize = Math.max(item.fontSize / scale, 6);
      const pdfW = item.w / scale + 6;
      const pdfH = item.h / scale + 4;

      page.drawRectangle({ x: pdfX - 1, y: pdfY - 1, width: pdfW, height: pdfH, color: rgb(1, 1, 1) });
      page.drawText(newText, { x: pdfX, y: pdfY + 1, size: pdfFontSize, font, color: rgb(0, 0, 0) });
    }

    const bytes = await doc.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" }));
    a.download = "edited.pdf";
    a.click();
    trackTaskComplete("pdf-text-editor", startTime);
  }

  const itemsByPage = pageInfos.map((_, pi) => items.filter(it => it.pageIndex === pi));

  return (
    <div className="space-y-4">
      {pageInfos.length === 0 && (
        <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
          <Upload size={28} />
          <span className="text-sm font-medium">Click to upload PDF</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      )}
      {loading && <p className="text-sm text-center text-[var(--text-muted)]">Rendering PDF…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {pageInfos.length > 0 && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-[var(--text-muted)]">Click any text to edit it. Blue = changed.</p>
            <div className="flex gap-2">
              <button
                onClick={() => { setPageInfos([]); setItems([]); setEdits({}); setOriginalBytes(null); }}
                className="btn-secondary text-xs"
              >
                Upload new
              </button>
              <button onClick={exportPdf} className="btn-primary flex items-center gap-2 text-sm">
                <Download size={14} />Export PDF
              </button>
            </div>
          </div>

          <div className="space-y-6 overflow-x-auto">
            {pageInfos.map((info, pi) => (
              <div key={pi}>
                <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">Page {pi + 1}</p>
                <div
                  className="relative border border-[var(--border)] rounded shadow-sm inline-block"
                  style={{ width: info.width, height: info.height }}
                >
                  <canvas
                    ref={el => { canvasRefs.current[pi] = el; }}
                    style={{ display: "block" }}
                  />
                  <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
                    {itemsByPage[pi]?.map((item) => {
                      const globalIdx = items.indexOf(item);
                      const current = edits[globalIdx] ?? item.str;
                      const changed = current !== item.str;
                      return (
                        <textarea
                          key={globalIdx}
                          value={current}
                          onChange={e => setEdits(prev => ({ ...prev, [globalIdx]: e.target.value }))}
                          style={{
                            position: "absolute",
                            left: item.x,
                            top: item.y,
                            width: item.w + 8,
                            height: item.h + 4,
                            fontSize: item.fontSize,
                            lineHeight: 1.2,
                            padding: "0 2px",
                            background: changed ? "rgba(59,130,246,0.18)" : "transparent",
                            border: changed ? "1px solid rgba(59,130,246,0.6)" : "1px solid transparent",
                            borderRadius: 2,
                            resize: "none",
                            overflow: "hidden",
                            fontFamily: "Helvetica, Arial, sans-serif",
                            color: changed ? "#1d4ed8" : "transparent",
                            caretColor: "#1d4ed8",
                            pointerEvents: "all",
                            cursor: "text",
                            outline: "none",
                            zIndex: 10,
                            whiteSpace: "nowrap",
                          }}
                          onFocus={e => {
                            e.currentTarget.style.color = "#1d4ed8";
                            e.currentTarget.style.background = "rgba(59,130,246,0.18)";
                            e.currentTarget.style.border = "1px solid rgba(59,130,246,0.6)";
                          }}
                          onBlur={e => {
                            if (edits[globalIdx] === undefined || edits[globalIdx] === item.str) {
                              e.currentTarget.style.color = "transparent";
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.border = "1px solid transparent";
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
