"use client";
import { useState, useRef } from "react";
import { Upload, Download, Music } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function VideoToAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "extracting" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  async function extract() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("extracting");
      setProgress("Extracting audio…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      await ff.exec(["-i", `input.${ext}`, "-vn", "-acodec", "libmp3lame", "-q:a", "2", "output.mp3"]);
      const data = await ff.readFile("output.mp3") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "audio/mpeg" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-to-audio", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "audio";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV, AVI)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-sm">
          <span className="text-[var(--text)] truncate">{file.name}</span>
          <span className="text-[var(--text-muted)] ml-2 shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
        </div>
      )}

      {file && (
        <button onClick={extract} disabled={status === "loading" || status === "extracting"} className="btn-primary flex items-center gap-2">
          <Music size={16} />{status === "loading" || status === "extracting" ? progress : "Extract Audio as MP3"}
        </button>
      )}

      {(status === "loading" || status === "extracting") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Extraction failed. Ensure the video has an audio track.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download={`${baseName}.mp3`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download MP3
          </a>
        </div>
      )}
    </div>
  );
}
