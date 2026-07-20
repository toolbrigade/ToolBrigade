"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function Mp4ToGif() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [gifUrl, setGifUrl] = useState("");
  const [name, setName] = useState("output");
  const [fps, setFps] = useState(10);
  const [scale, setScale] = useState(480);
  const [progress, setProgress] = useState("");

  async function handleFile(file: File) {
    setStatus("loading"); setGifUrl(""); setProgress("Loading converter engine… (first load may take 20–40 seconds due to the ffmpeg.wasm binary)");
    setName(file.name.replace(/\.[^.]+$/, ""));
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setProgress("Converting MP4 to GIF…");
      const { fetchFile } = await import("@ffmpeg/util");
      await ff.writeFile("input.mp4", await fetchFile(file));
      await ff.exec([
        "-i", "input.mp4",
        "-vf", `fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
        "-loop", "0",
        "output.gif"
      ]);
      const data = await ff.readFile("output.gif") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "image/gif" });
      setGifUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">FPS: {fps}</label>
          <input type="range" min={5} max={30} value={fps} className="w-full accent-brand-600" onChange={e => setFps(+e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text)]">Width: {scale}px</label>
          <input type="range" min={160} max={960} step={16} value={scale} className="w-full accent-brand-600" onChange={e => setScale(+e.target.value)} />
        </div>
      </div>
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload MP4</span>
        <input type="file" accept="video/mp4,.mp4" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {status === "loading" && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Conversion failed. Make sure the file is a valid MP4.</p>}
      {status === "done" && gifUrl && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gifUrl} alt="output gif" className="max-h-64 mx-auto rounded-lg border border-[var(--border)]" />
          <a href={gifUrl} download={`${name}.gif`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download GIF
          </a>
        </div>
      )}
    </div>
  );
}
