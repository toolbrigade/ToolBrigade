"use client";
import { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [crf, setCrf] = useState(28);
  const [status, setStatus] = useState<"idle" | "loading" | "compressing" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outSize, setOutSize] = useState(0);
  const startRef = { current: Date.now() };

  async function compress() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("compressing");
      setProgress("Compressing video… (this may take a while for large files)");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      await ff.exec(["-i", `input.${ext}`, "-vcodec", "libx264", "-crf", String(crf), "-preset", "fast", "-acodec", "aac", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      setOutSize(data.byteLength);
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-compressor", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "compressed";
  const saved = file && outSize ? Math.round((1 - outSize / file.size) * 100) : 0;

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); setOutSize(0); }} />
      </label>

      {file && (
        <>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">
              Quality (CRF): {crf} — lower = better quality, larger file (18–28 recommended)
            </label>
            <input type="range" min={18} max={51} step={1} value={crf} onChange={e => setCrf(Number(e.target.value))} className="w-full accent-brand-600" />
          </div>
          <button onClick={compress} disabled={status === "loading" || status === "compressing"} className="btn-primary">
            {status === "loading" || status === "compressing" ? progress : "Compress Video"}
          </button>
        </>
      )}

      {(status === "loading" || status === "compressing") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}

      {status === "done" && outUrl && file && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["Original", `${(file.size / 1024 / 1024).toFixed(1)} MB`], ["Compressed", `${(outSize / 1024 / 1024).toFixed(1)} MB`], ["Saved", `${saved}%`]].map(([label, val]) => (
              <div key={label} className="card text-center">
                <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
                <p className="text-lg font-semibold text-[var(--text)]">{val}</p>
              </div>
            ))}
          </div>
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${baseName}-compressed.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Compressed MP4
          </a>
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Compression failed. Try a different file.</p>}
    </div>
  );
}
