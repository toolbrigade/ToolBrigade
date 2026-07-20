"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";

export default function GifToMp4() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [mp4Url, setMp4Url] = useState("");
  const [name, setName] = useState("output");
  const [progress, setProgress] = useState("");

  async function handleFile(file: File) {
    setStatus("loading"); setMp4Url(""); setProgress("Loading converter engine… (first load may take 20–40 seconds due to the ffmpeg.wasm binary)");
    setName(file.name.replace(/\.[^.]+$/, ""));
    try {
      const { getFFmpeg } = await import("@/lib/ffmpegSingleton");
      const ff = await getFFmpeg();
      setProgress("Converting GIF to MP4…");
      const { fetchFile } = await import("@ffmpeg/util");
      await ff.writeFile("input.gif", await fetchFile(file));
      await ff.exec(["-i", "input.gif", "-movflags", "faststart", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "output.mp4"]);
      const data = await ff.readFile("output.mp4") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
      setMp4Url(URL.createObjectURL(blob));
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload GIF</span>
        <input type="file" accept="image/gif,.gif" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {status === "loading" && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
          ⏳ {progress}
        </div>
      )}
      {status === "error" && <p className="text-sm text-red-500">Conversion failed. Make sure the file is a valid GIF.</p>}
      {status === "done" && mp4Url && (
        <div className="space-y-3 text-center">
          <video src={mp4Url} controls className="max-h-64 mx-auto rounded-lg border border-[var(--border)]" />
          <a href={mp4Url} download={`${name}.mp4`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download MP4
          </a>
        </div>
      )}
    </div>
  );
}
