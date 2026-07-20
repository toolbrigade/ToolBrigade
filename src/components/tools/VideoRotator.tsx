"use client";
import { useState, useRef } from "react";
import { Upload, Download, RotateCw } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

const ROTATIONS = [
  { label: "90° CW", value: "transpose=1" },
  { label: "180°", value: "transpose=2,transpose=2" },
  { label: "90° CCW", value: "transpose=2" },
  { label: "Flip H", value: "hflip" },
  { label: "Flip V", value: "vflip" },
];

export default function VideoRotator() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(ROTATIONS[0].value);
  const [status, setStatus] = useState<"idle" | "loading" | "rotating" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  async function rotate() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("rotating");
      setProgress("Rotating video…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));
      await ff.exec(["-i", `input.${ext}`, "-vf", rotation, "-c:a", "copy", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-rotator", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "rotated";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <>
          <div className="flex flex-wrap gap-2">
            {ROTATIONS.map(r => (
              <button key={r.value} onClick={() => setRotation(r.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${rotation === r.value ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={rotate} disabled={status === "loading" || status === "rotating"} className="btn-primary flex items-center gap-2">
            <RotateCw size={16} />{status === "loading" || status === "rotating" ? progress : "Apply Rotation"}
          </button>
        </>
      )}

      {(status === "loading" || status === "rotating") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Rotation failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${baseName}-rotated.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Rotated MP4
          </a>
        </div>
      )}
    </div>
  );
}
