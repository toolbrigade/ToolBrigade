"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];
const APPLE_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180];

function drawToCanvas(img: HTMLImageElement, size: number): string {
  const c = document.createElement("canvas");
  c.width = size; c.height = size;
  c.getContext("2d")!.drawImage(img, 0, 0, size, size);
  return c.toDataURL("image/png");
}

export default function FaviconPackageGenerator() {
  const [outputs, setOutputs] = useState<{ size: number; url: string; label: string }[]>([]);
  const [appName, setAppName] = useState("My App");
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [startTime] = useState(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const results = [
        ...FAVICON_SIZES.map(s => ({ size: s, url: drawToCanvas(img, s), label: `favicon-${s}x${s}.png` })),
        ...APPLE_SIZES.map(s => ({ size: s, url: drawToCanvas(img, s), label: `apple-touch-icon-${s}x${s}.png` })),
      ];
      setOutputs(results);
      URL.revokeObjectURL(url);
      trackTaskComplete("favicon-package-generator", startTime);
    };
    img.src = url;
  }

  const manifest = JSON.stringify({
    name: appName,
    short_name: appName,
    theme_color: themeColor,
    background_color: "#ffffff",
    display: "standalone",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  }, null, 2);

  const htmlTags = `<!-- Favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />

<!-- Apple Touch Icons -->
${APPLE_SIZES.map(s => `<link rel="apple-touch-icon" sizes="${s}x${s}" href="/apple-touch-icon-${s}x${s}.png" />`).join("\n")}

<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="${themeColor}" />`;

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">App Name (for manifest.json)</label>
          <input value={appName} onChange={e => setAppName(e.target.value)}
            className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Theme Color</label>
          <div className="flex gap-2">
            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="h-9 w-12 rounded border border-[var(--border)] cursor-pointer" />
            <input value={themeColor} onChange={e => setThemeColor(e.target.value)}
              className="flex-1 text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
          </div>
        </div>
      </div>

      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)] transition-colors">
        <Upload size={28} />
        <span className="text-sm font-medium">Upload source image (square, 512×512+ recommended)</span>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      {outputs.length > 0 && (
        <>
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Favicon Sizes</p>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {outputs.filter(o => o.label.startsWith("favicon")).map(({ size, url, label }) => (
                <div key={size} className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={label} className="mx-auto rounded border border-[var(--border)]" style={{ width: Math.min(size, 48), height: Math.min(size, 48) }} />
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{size}px</p>
                  <a href={url} download={label} className="text-xs text-brand-600 dark:text-brand-400 flex items-center justify-center gap-0.5 hover:underline"><Download size={10} />Save</a>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Apple Touch Icons</p>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
              {outputs.filter(o => o.label.startsWith("apple")).map(({ size, url, label }) => (
                <div key={size} className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={label} className="mx-auto rounded border border-[var(--border)]" style={{ width: 40, height: 40 }} />
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{size}px</p>
                  <a href={url} download={label} className="text-xs text-brand-600 dark:text-brand-400 flex items-center justify-center gap-0.5 hover:underline"><Download size={10} />Save</a>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[var(--text-muted)]">manifest.json</label>
                <CopyButton text={manifest} />
              </div>
              <textarea className="textarea min-h-[160px] font-mono text-xs" value={manifest} readOnly />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[var(--text-muted)]">HTML &lt;link&gt; tags</label>
                <CopyButton text={htmlTags} />
              </div>
              <textarea className="textarea min-h-[160px] font-mono text-xs" value={htmlTags} readOnly />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
