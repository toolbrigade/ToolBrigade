"use client";
import { useState, useRef } from "react";
import { Upload, Download, Crop } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

const PRESETS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "9:16", w: 9, h: 16 },
  { label: "1:1", w: 1, h: 1 },
  { label: "4:3", w: 4, h: 3 },
  { label: "4:5", w: 4, h: 5 },
  { label: "Custom", w: 0, h: 0 },
];

export default function VideoCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [preset, setPreset] = useState(PRESETS[0]);
  const [customW, setCustomW] = useState(1280);
  const [customH, setCustomH] = useState(720);
  const [status, setStatus] = useState<"idle" | "loading" | "cropping" | "done" | "error">("idle");
  const [progress, setProgress] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  async function cropVideo() {
    if (!file) return;
    setStatus("loading");
    setProgress("Loading video engine (one-time, ~25MB)…");
    startRef.current = Date.now();
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setStatus("cropping");
      setProgress("Cropping video…");
      const { fetchFile } = await import("@ffmpeg/util");
      const ext = file.name.split(".").pop() ?? "mp4";
      await ff.writeFile(`input.${ext}`, await fetchFile(file));

      let cropFilter: string;
      if (preset.w === 0) {
        // Custom: use exact pixel dimensions centered
        cropFilter = `crop=${customW}:${customH}:(iw-${customW})/2:(ih-${customH})/2`;
      } else {
        // Aspect ratio preset: crop to largest centered rectangle with that ratio
        const r = preset.w / preset.h;
        cropFilter = `crop=if(gt(iw/ih\\,${r})\\,ih*${r}\\,iw):if(gt(iw/ih\\,${r})\\,ih\\,iw/${r}):(iw-if(gt(iw/ih\\,${r})\\,ih*${r}\\,iw))/2:(ih-if(gt(iw/ih\\,${r})\\,ih\\,iw/${r}))/2`;
      }

      await ff.exec(["-i", `input.${ext}`, "-vf", cropFilter, "-c:a", "copy", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("video-cropper", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "cropped";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload video (MP4, WebM, MOV)</span>
        <input type="file" accept="video/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Aspect ratio preset:</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(p => (
                <button key={p.label} onClick={() => setPreset(p)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${preset.label === p.label ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {preset.w === 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Width (px)</label>
                <input type="number" value={customW} onChange={e => setCustomW(Number(e.target.value))} className="input w-full" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Height (px)</label>
                <input type="number" value={customH} onChange={e => setCustomH(Number(e.target.value))} className="input w-full" />
              </div>
            </div>
          )}

          <button onClick={cropVideo} disabled={status === "loading" || status === "cropping"} className="btn-primary flex items-center gap-2">
            <Crop size={16} />{status === "loading" || status === "cropping" ? progress : `Crop to ${preset.label}`}
          </button>
        </>
      )}

      {(status === "loading" || status === "cropping") && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Crop failed. The target dimensions may exceed the video size.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <video src={outUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]" />
          <a href={outUrl} download={`${baseName}-cropped.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Cropped MP4
          </a>
        </div>
      )}
    </div>
  );
}
