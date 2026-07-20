"use client";
import { useState, useRef } from "react";
import { Upload, Download, Scissors } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function VideoTrimmer() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "trimming" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [fileName, setFileName] = useState("trimmed");
  const fileRef = useRef<File | null>(null);
  const startRef = { current: Date.now() };

  function handleFile(file: File) {
    fileRef.current = file;
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setVideoUrl(URL.createObjectURL(file));
    setStatus("idle");
    setOutUrl("");
  }

  async function trim() {
    const file = fileRef.current;
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("trimming");
      setProgress("Trimming video…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      const ss = formatTime(start);
      const t = (end - start).toFixed(2);
      await ff.exec(["-ss", ss, "-i", `input.${ext}`, "-t", t, "-c", "copy", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-trimmer", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      {videoUrl && (
        <>
          <video src={videoUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]"
            onLoadedMetadata={e => { const d = (e.target as HTMLVideoElement).duration; setDuration(d); setEnd(d); }} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Start: {start.toFixed(1)}s</label>
              <input type="range" min={0} max={duration} step={0.1} value={start}
                onChange={e => setStart(Math.min(Number(e.target.value), end - 0.5))}
                className="w-full accent-brand-600" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">End: {end.toFixed(1)}s</label>
              <input type="range" min={0} max={duration} step={0.1} value={end}
                onChange={e => setEnd(Math.max(Number(e.target.value), start + 0.5))}
                className="w-full accent-brand-600" />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Trim: {(end - start).toFixed(1)}s of {duration.toFixed(1)}s total</p>
          <button onClick={trim} disabled={status === "loading" || status === "trimming"} className="btn-primary flex items-center gap-2">
            <Scissors size={16} />{status === "loading" || status === "trimming" ? progress : "Trim Video"}
          </button>
        </>
      )}

      {(status === "loading" || status === "trimming") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Trim failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${fileName}-trimmed.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Trimmed MP4
          </a>
        </div>
      )}
    </div>
  );
}

function formatTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(2);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${sec.padStart(5, "0")}`;
}
