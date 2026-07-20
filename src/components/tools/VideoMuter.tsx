"use client";
import { useState, useRef } from "react";
import { Upload, Download, VolumeX } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function VideoMuter() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "muting" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  async function mute() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("muting");
      setProgress("Removing audio track…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      await ff.exec(["-i", `input.${ext}`, "-an", "-c:v", "copy", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-muter", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "muted";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <button onClick={mute} disabled={status === "loading" || status === "muting"} className="btn-primary flex items-center gap-2">
          <VolumeX size={16} />{status === "loading" || status === "muting" ? progress : "Remove Audio Track"}
        </button>
      )}

      {(status === "loading" || status === "muting") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${baseName}-muted.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Muted MP4
          </a>
        </div>
      )}
    </div>
  );
}
