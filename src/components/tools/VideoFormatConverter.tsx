"use client";
import { useState, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type OutFmt = "mp4" | "webm";

export default function VideoFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFmt, setTargetFmt] = useState<OutFmt>("webm");
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  async function convert() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("converting");
      setProgress(`Converting to ${targetFmt.toUpperCase()}…`);
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      const args = targetFmt === "webm"
        ? ["-i", `input.${ext}`, "-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-c:a", "libopus", "output.webm"]
        : ["-i", `input.${ext}`, "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", "output.mp4"];
      await ff.exec(args);
      const data = await ff.readFile(`output.${targetFmt}`) as Uint8Array;
      const mimeType = targetFmt === "webm" ? "video/webm" : "video/mp4";
      const blob = new Blob([data.buffer as ArrayBuffer], { type: mimeType });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-format-converter", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "converted";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4 or WebM)</span>
        <input type="file" accept="video/mp4,video/webm,video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-[var(--text-muted)]">Convert to:</span>
            {(["mp4", "webm"] as OutFmt[]).map(f => (
              <button key={f} onClick={() => setTargetFmt(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${targetFmt === f ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={convert} disabled={status === "loading" || status === "converting"} className="btn-primary">
            {status === "loading" || status === "converting" ? progress : `Convert to ${targetFmt.toUpperCase()}`}
          </button>
        </>
      )}

      {(status === "loading" || status === "converting") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Conversion failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${baseName}.${targetFmt}`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download {targetFmt.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}
