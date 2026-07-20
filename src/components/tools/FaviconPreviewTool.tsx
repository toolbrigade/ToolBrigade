"use client";
import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";

const SIZES = [16, 32, 48, 64];

export default function FaviconPreviewTool() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImgSrc(src);
        SIZES.forEach(size => {
          const canvas = canvasRefs.current[size];
          if (!canvas) return;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d")!;
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <div className="space-y-5">
      {!imgSrc ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-10 cursor-pointer hover:border-brand-500 transition-colors">
          <Upload size={32} className="text-[var(--text-muted)] mb-2" />
          <span className="text-sm text-[var(--text-muted)]">Upload a favicon image (PNG, SVG, ICO)</span>
          <span className="text-xs text-[var(--text-muted)] mt-1">Best results with a square image ≥ 64×64px</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <>
          {/* Browser tab mockups */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--text)]">Browser Tab Mockups</h3>

            {/* Chrome-style tab */}
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Chrome-style tab (16×16)</p>
              <div className="bg-[#dee1e6] dark:bg-[#3c4043] rounded-t-lg inline-flex items-center gap-2 px-4 py-2 min-w-[200px]">
                <canvas ref={el => { canvasRefs.current[16] = el; }} width={16} height={16} className="rounded-sm flex-shrink-0" />
                <span className="text-xs text-[#202124] dark:text-[#e8eaed] truncate max-w-[140px]">My Website — Home</span>
                <span className="ml-auto text-[#5f6368] text-xs">×</span>
              </div>
              <div className="bg-white dark:bg-[#202124] h-8 rounded-b-lg border border-[#dee1e6] dark:border-[#3c4043]" />
            </div>

            {/* Safari-style tab */}
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Safari-style tab (16×16)</p>
              <div className="bg-[#f2f2f7] dark:bg-[#2c2c2e] rounded-lg inline-flex items-center gap-2 px-3 py-1.5 min-w-[180px] border border-[#d1d1d6] dark:border-[#3a3a3c]">
                <canvas ref={el => { if (el && !canvasRefs.current[16]) canvasRefs.current[16] = el; }} width={16} height={16} className="rounded-sm flex-shrink-0" />
                <span className="text-xs text-[#1c1c1e] dark:text-white truncate max-w-[120px]">My Website</span>
              </div>
            </div>

            {/* Actual size grid */}
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Actual rendered sizes</p>
              <div className="flex items-end gap-6 flex-wrap">
                {SIZES.map(size => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <canvas
                      ref={el => { canvasRefs.current[size] = el; }}
                      width={size}
                      height={size}
                      className="border border-[var(--border)] rounded"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span className="text-xs text-[var(--text-muted)]">{size}×{size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile home screen mockup */}
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-2">Mobile home screen icon (48×48)</p>
              <div className="inline-flex flex-col items-center gap-1">
                <canvas
                  ref={el => { canvasRefs.current[48] = el; }}
                  width={48}
                  height={48}
                  className="rounded-xl border border-[var(--border)] shadow"
                />
                <span className="text-xs text-[var(--text-muted)]">My Site</span>
              </div>
            </div>
          </div>

          <button onClick={() => setImgSrc(null)} className="btn-secondary text-xs">Upload different image</button>
        </>
      )}
    </div>
  );
}
