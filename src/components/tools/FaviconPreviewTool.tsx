"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

const SIZES = [16, 32, 48, 64, 128];

function resizeTo(img: HTMLImageElement, size: number): string {
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  c.getContext("2d")!.drawImage(img, 0, 0, size, size);
  return c.toDataURL();
}

// eslint-disable-next-line @next/next/no-img-element
const Fav = ({ src, size }: { src: string; size: number }) => (
  <img src={src} alt="favicon" width={size} height={size} style={{ imageRendering: "pixelated", flexShrink: 0 }} />
);

export default function FaviconPreviewTool() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [sized, setSized] = useState<Record<number, string>>({});

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImgSrc(src);
        const urls: Record<number, string> = {};
        SIZES.forEach(s => { urls[s] = resizeTo(img, s); });
        setSized(urls);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  if (!imgSrc) return (
    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-10 cursor-pointer hover:border-brand-500 transition-colors">
      <Upload size={32} className="text-[var(--text-muted)] mb-2" />
      <span className="text-sm text-[var(--text-muted)]">Upload a favicon image (PNG, SVG, ICO)</span>
      <span className="text-xs text-[var(--text-muted)] mt-1">Best results with a square image ≥ 64×64px</span>
      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </label>
  );

  return (
    <div className="space-y-6">
      <button onClick={() => { setImgSrc(null); setSized({}); }} className="btn-secondary text-xs">↑ Upload different image</button>

      {/* ── Browser Tabs ── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Browser Tabs</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Chrome Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Chrome — Light</p>
            <div style={{ background: "#dee1e6", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "'Google Sans',Arial,sans-serif" }}>
              {/* Window controls */}
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              {/* Tab strip */}
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                {/* Inactive tab */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "8px 8px 0 0", background: "#c9cdd2", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#5f6368" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#aaa", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                {/* Active tab */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "8px 8px 0 0", background: "#fff", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#202124", boxShadow: "0 1px 3px rgba(0,0,0,0.12)", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#5f6368", fontSize: 14, lineHeight: 1, cursor: "default", flexShrink: 0 }}>×</span>
                </div>
              </div>
              {/* Toolbar */}
              <div style={{ background: "#fff", padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #e0e0e0" }}>
                <span style={{ fontSize: 16, color: "#5f6368", cursor: "default" }}>←</span>
                <span style={{ fontSize: 16, color: "#5f6368", cursor: "default" }}>→</span>
                <span style={{ fontSize: 14, color: "#5f6368", cursor: "default" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#f1f3f4", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#202124" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 0 1 0 14A7 7 0 0 1 12 2zm0 1.5A5.5 5.5 0 1 0 12 14 5.5 5.5 0 0 0 12 3.5zM11 8h2v5h-2zm0 6h2v2h-2z" fill="#5f6368"/><circle cx="12" cy="12" r="10" stroke="#5f6368" strokeWidth="1.5" fill="none"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chrome Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Chrome — Dark</p>
            <div style={{ background: "#35363a", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "'Google Sans',Arial,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "8px 8px 0 0", background: "#2d2e30", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#9aa0a6" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#555", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "8px 8px 0 0", background: "#202124", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#e8eaed", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#9aa0a6", fontSize: 14, lineHeight: 1, cursor: "default", flexShrink: 0 }}>×</span>
                </div>
              </div>
              <div style={{ background: "#202124", padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #3c4043" }}>
                <span style={{ fontSize: 16, color: "#9aa0a6", cursor: "default" }}>←</span>
                <span style={{ fontSize: 16, color: "#9aa0a6", cursor: "default" }}>→</span>
                <span style={{ fontSize: 14, color: "#9aa0a6", cursor: "default" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#303134", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#e8eaed" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9aa0a6" strokeWidth="1.5" fill="none"/><path d="M12 7v5l3 3" stroke="#9aa0a6" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Firefox Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Firefox — Light</p>
            <div style={{ background: "#f0f0f4", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "system-ui,Arial,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              {/* Tab strip */}
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#e0e0e6", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#8f8f9d" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#bbb", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#fff", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#15141a", borderTop: "2px solid #0060df", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#8f8f9d", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              {/* Toolbar */}
              <div style={{ background: "#fff", padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #cfcfd8" }}>
                <span style={{ fontSize: 16, color: "#8f8f9d" }}>←</span>
                <span style={{ fontSize: 16, color: "#8f8f9d" }}>→</span>
                <span style={{ fontSize: 14, color: "#8f8f9d" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#f0f0f4", border: "1px solid #cfcfd8", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#15141a" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="#5e5e72"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM7 5h2v5H7zm0 6h2v2H7z"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Firefox Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Firefox — Dark</p>
            <div style={{ background: "#1c1b22", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "system-ui,Arial,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#2b2a33", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#8f8f9d" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#444", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#42414d", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#fbfbfe", borderTop: "2px solid #0df", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#8f8f9d", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              <div style={{ background: "#2b2a33", padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #52525e" }}>
                <span style={{ fontSize: 16, color: "#8f8f9d" }}>←</span>
                <span style={{ fontSize: 16, color: "#8f8f9d" }}>→</span>
                <span style={{ fontSize: 14, color: "#8f8f9d" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#1c1b22", border: "1px solid #52525e", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#fbfbfe" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="#8f8f9d"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM7 5h2v5H7zm0 6h2v2H7z"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edge Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Edge — Light</p>
            <div style={{ background: "#f3f3f3", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "'Segoe UI',Arial,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#e5e5e5", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#767676" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#bbb", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#fff", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#1a1a1a", borderTop: "3px solid #0078d4", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#767676", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              <div style={{ background: "#fff", padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #d1d1d1" }}>
                <span style={{ fontSize: 16, color: "#767676" }}>←</span>
                <span style={{ fontSize: 16, color: "#767676" }}>→</span>
                <span style={{ fontSize: 14, color: "#767676" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#f3f3f3", border: "1px solid #d1d1d1", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#1a1a1a" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" stroke="#767676" strokeWidth="1.2" fill="none"/><path d="M5.5 8.5l2 2 3-3" stroke="#767676" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Edge Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Edge — Dark</p>
            <div style={{ background: "#2b2b2b", borderRadius: "8px 8px 0 0", overflow: "hidden", fontFamily: "'Segoe UI',Arial,sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "4px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#222", minWidth: 100, maxWidth: 140, fontSize: 11, color: "#aaa" }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: "#555", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "6px 6px 0 0", background: "#1f1f1f", minWidth: 160, maxWidth: 220, fontSize: 11, color: "#e3e3e3", borderTop: "3px solid #0078d4", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website — Home</span>
                  <span style={{ color: "#aaa", fontSize: 14, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              <div style={{ background: "#1f1f1f", padding: "5px 10px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #444" }}>
                <span style={{ fontSize: 16, color: "#aaa" }}>←</span>
                <span style={{ fontSize: 16, color: "#aaa" }}>→</span>
                <span style={{ fontSize: 14, color: "#aaa" }}>↻</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#2b2b2b", border: "1px solid #444", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#e3e3e3" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" stroke="#aaa" strokeWidth="1.2" fill="none"/><path d="M5.5 8.5l2 2 3-3" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span>mywebsite.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safari Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Safari — Light</p>
            <div style={{ background: "#ececec", borderRadius: "10px 10px 0 0", overflow: "hidden", fontFamily: "-apple-system,'SF Pro Text',sans-serif" }}>
              {/* Title bar */}
              <div style={{ display: "flex", alignItems: "center", padding: "8px 12px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15)" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15)" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.15)" }} />
              </div>
              {/* Tab strip */}
              <div style={{ display: "flex", alignItems: "flex-end", padding: "6px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "6px 6px 0 0", background: "#d8d8d8", minWidth: 90, maxWidth: 130, fontSize: 11, color: "#888" }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, background: "#bbb", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "6px 6px 0 0", background: "#fff", minWidth: 150, maxWidth: 210, fontSize: 11, color: "#1c1c1e", position: "relative", zIndex: 1, boxShadow: "0 -1px 3px rgba(0,0,0,0.08)" }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website</span>
                  <span style={{ color: "#aaa", fontSize: 13, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              {/* Toolbar */}
              <div style={{ background: "#fff", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #d0d0d0" }}>
                <span style={{ fontSize: 15, color: "#aaa" }}>←</span>
                <span style={{ fontSize: 15, color: "#aaa" }}>→</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#f6f6f6", border: "1px solid #ddd", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#1c1c1e" }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="1" y="4" width="8" height="7" rx="1.5" stroke="#34c759" strokeWidth="1.2"/><path d="M3 4V3a2 2 0 1 1 4 0v1" stroke="#34c759" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span style={{ fontWeight: 500 }}>mywebsite.com</span>
                </div>
                <span style={{ fontSize: 18, color: "#aaa" }}>&#8942;</span>
              </div>
            </div>
          </div>

          {/* Safari Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Safari — Dark</p>
            <div style={{ background: "#2a2a2a", borderRadius: "10px 10px 0 0", overflow: "hidden", fontFamily: "-apple-system,'SF Pro Text',sans-serif" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "8px 12px 0", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.3)" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.3)" }} />
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.3)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "6px 8px 0", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "6px 6px 0 0", background: "#1e1e1e", minWidth: 90, maxWidth: 130, fontSize: 11, color: "#666" }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, background: "#444", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>New Tab</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "6px 6px 0 0", background: "#3a3a3a", minWidth: 150, maxWidth: 210, fontSize: 11, color: "#f5f5f7", position: "relative", zIndex: 1 }}>
                  <Fav src={sized[16]} size={16} />
                  <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>My Website</span>
                  <span style={{ color: "#666", fontSize: 13, lineHeight: 1, flexShrink: 0 }}>×</span>
                </div>
              </div>
              <div style={{ background: "#1e1e1e", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #3a3a3a" }}>
                <span style={{ fontSize: 15, color: "#555" }}>←</span>
                <span style={{ fontSize: 15, color: "#555" }}>→</span>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#2c2c2e", border: "1px solid #3a3a3c", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#f5f5f7" }}>
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="1" y="4" width="8" height="7" rx="1.5" stroke="#34c759" strokeWidth="1.2"/><path d="M3 4V3a2 2 0 1 1 4 0v1" stroke="#34c759" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  <Fav src={sized[16]} size={14} />
                  <span style={{ fontWeight: 500 }}>mywebsite.com</span>
                </div>
                <span style={{ fontSize: 18, color: "#555" }}>&#8942;</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── OS Taskbar / Dock ── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">OS Taskbar &amp; Dock</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Windows Taskbar Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Windows Taskbar — Light</p>
            <div style={{ background: "#f3f3f3", border: "1px solid #e0e0e0", borderRadius: 6, padding: "4px 6px", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Segoe UI',sans-serif" }}>
              {/* Start */}
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><rect x="0" y="0" width="6" height="6" fill="#f25022"/><rect x="8" y="0" width="6" height="6" fill="#7fba00"/><rect x="0" y="8" width="6" height="6" fill="#00a4ef"/><rect x="8" y="8" width="6" height="6" fill="#ffb900"/></svg>
              </div>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#fff", border: "1px solid #d1d1d1", borderRadius: 16, padding: "3px 10px", fontSize: 11, color: "#767676", width: 120 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#767676" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="#767676" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>Search</span>
              </div>
              {/* Active app */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#e5e5e5", borderRadius: 4, padding: "4px 8px", fontSize: 11, color: "#1a1a1a", borderBottom: "2px solid #0078d4" }}>
                <Fav src={sized[32]} size={16} />
                <span>My Website</span>
              </div>
              {/* Inactive app */}
              <div style={{ display: "flex", alignItems: "center", gap: 5, borderRadius: 4, padding: "4px 8px", fontSize: 11, color: "#555" }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, background: "#ccc", display: "inline-block" }} />
                <span>App</span>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#555" }}>
                <span>10:30</span>
              </div>
            </div>
          </div>

          {/* Windows Taskbar Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Windows Taskbar — Dark</p>
            <div style={{ background: "#202020", border: "1px solid #333", borderRadius: 6, padding: "4px 6px", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Segoe UI',sans-serif" }}>
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><rect x="0" y="0" width="6" height="6" fill="#f25022"/><rect x="8" y="0" width="6" height="6" fill="#7fba00"/><rect x="0" y="8" width="6" height="6" fill="#00a4ef"/><rect x="8" y="8" width="6" height="6" fill="#ffb900"/></svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#2d2d2d", border: "1px solid #444", borderRadius: 16, padding: "3px 10px", fontSize: 11, color: "#aaa", width: 120 }}>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="#aaa" strokeWidth="1.5"/><path d="M10 10l3 3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>Search</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#2d2d2d", borderRadius: 4, padding: "4px 8px", fontSize: 11, color: "#e3e3e3", borderBottom: "2px solid #0078d4" }}>
                <Fav src={sized[32]} size={16} />
                <span>My Website</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, borderRadius: 4, padding: "4px 8px", fontSize: 11, color: "#777" }}>
                <span style={{ width: 16, height: 16, borderRadius: 3, background: "#444", display: "inline-block" }} />
                <span>App</span>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#aaa" }}>
                <span>10:30</span>
              </div>
            </div>
          </div>

          {/* macOS Dock Light */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">macOS Dock — Light</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, padding: "8px 16px 6px", background: "rgba(228,228,228,0.75)", backdropFilter: "blur(20px)", borderRadius: 16, border: "1px solid rgba(0,0,0,0.12)", boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}>
              {[{ size: 44, label: "Finder", placeholder: true }, { size: 44, label: "My Site", placeholder: false }, { size: 44, label: "Mail", placeholder: true }].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: item.size, height: item.size, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.18)", background: item.placeholder ? "#e0e0e0" : undefined, border: !item.placeholder ? "none" : "none" }}>
                    {item.placeholder
                      ? <div style={{ width: "100%", height: "100%", background: i === 0 ? "linear-gradient(135deg,#6ec6f5,#1a73e8)" : "linear-gradient(135deg,#f5a623,#e8431a)", borderRadius: 10 }} />
                      : <Fav src={sized[64]} size={item.size} />}
                  </div>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: !item.placeholder ? "#333" : "transparent", display: "inline-block" }} />
                </div>
              ))}
            </div>
          </div>

          {/* macOS Dock Dark */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">macOS Dock — Dark</p>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 6, padding: "8px 16px 6px", background: "rgba(40,40,40,0.8)", backdropFilter: "blur(20px)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
              {[{ size: 44, label: "Finder", placeholder: true }, { size: 44, label: "My Site", placeholder: false }, { size: 44, label: "Mail", placeholder: true }].map((item, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: item.size, height: item.size, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                    {item.placeholder
                      ? <div style={{ width: "100%", height: "100%", background: i === 0 ? "linear-gradient(135deg,#6ec6f5,#1a73e8)" : "linear-gradient(135deg,#f5a623,#e8431a)", borderRadius: 10 }} />
                      : <Fav src={sized[64]} size={item.size} />}
                  </div>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: !item.placeholder ? "#fff" : "transparent", display: "inline-block" }} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Mobile Home Screen</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Android */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Android</p>
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "12px 16px", display: "inline-flex", flexDirection: "column", gap: 8, minWidth: 180 }}>
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.7)", padding: "0 2px" }}>
                <span>9:41</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <svg width="10" height="8" viewBox="0 0 10 8"><rect x="0" y="3" width="2" height="5" fill="white" opacity="0.5"/><rect x="3" y="2" width="2" height="6" fill="white" opacity="0.7"/><rect x="6" y="1" width="2" height="7" fill="white" opacity="0.9"/><rect x="9" y="0" width="1" height="8" fill="white"/></svg>
                  <svg width="10" height="8" viewBox="0 0 12 8" fill="white"><rect x="1" y="2" width="8" height="5" rx="1" stroke="white" strokeWidth="1" fill="none"/><rect x="9" y="3.5" width="2" height="2" rx="0.5" fill="white"/><rect x="2" y="3" width="5" height="3" rx="0.5" fill="white"/></svg>
                </div>
              </div>
              {/* App grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[false, false, true, false, false, false, false, false].map((isOurs, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", background: isOurs ? undefined : `hsl(${i * 47},60%,45%)` }}>
                      {isOurs ? <Fav src={sized[64]} size={44} /> : <div style={{ width: "100%", height: "100%" }} />}
                    </div>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>{isOurs ? "My Site" : "App"}</span>
                  </div>
                ))}
              </div>
              {/* Nav bar */}
              <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 4 }}>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>&#9665;</span>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.6)", display: "inline-block" }} />
                <span style={{ width: 14, height: 14, border: "1.5px solid rgba(255,255,255,0.6)", borderRadius: 3, display: "inline-block" }} />
              </div>
            </div>
          </div>

          {/* iOS */}
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">iOS (Add to Home Screen)</p>
            <div style={{ background: "linear-gradient(160deg,#1a1a2e,#16213e)", borderRadius: 12, padding: "12px 16px", display: "inline-flex", flexDirection: "column", gap: 8, minWidth: 180, fontFamily: "-apple-system,sans-serif" }}>
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "white", fontWeight: 600, padding: "0 2px" }}>
                <span>9:41</span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <svg width="12" height="8" viewBox="0 0 12 8"><rect x="0" y="3" width="2" height="5" fill="white" opacity="0.4"/><rect x="3" y="2" width="2" height="6" fill="white" opacity="0.6"/><rect x="6" y="1" width="2" height="7" fill="white" opacity="0.8"/><rect x="9" y="0" width="2" height="8" fill="white"/></svg>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="white"><rect x="1" y="2" width="10" height="5" rx="1.5" stroke="white" strokeWidth="1" fill="none"/><rect x="11" y="3.5" width="2" height="2" rx="0.5" fill="white"/><rect x="2" y="3" width="7" height="3" rx="0.5" fill="white"/></svg>
                </div>
              </div>
              {/* App grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {[false, true, false, false, false, false, false, false].map((isOurs, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "22%", overflow: "hidden", background: isOurs ? undefined : `hsl(${i * 53 + 20},65%,50%)`, boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                      {isOurs ? <Fav src={sized[64]} size={44} /> : <div style={{ width: "100%", height: "100%" }} />}
                    </div>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", textAlign: "center" }}>{isOurs ? "My Site" : "App"}</span>
                  </div>
                ))}
              </div>
              {/* Home indicator */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Actual Sizes ── */}
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Actual Pixel Sizes</p>
        <div className="flex items-end gap-6 flex-wrap p-4 rounded-xl border border-[var(--border)]">
          {SIZES.map(size => (
            <div key={size} className="flex flex-col items-center gap-1">
              <Fav src={sized[size]} size={size} />
              <span className="text-xs text-[var(--text-muted)]">{size}×{size}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
