"use client";
import { useState, useRef } from "react";
import { Upload, Download, Camera } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function VideoFrameExtractor() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const [frameUrl, setFrameUrl] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = { current: Date.now() };

  function handleFile(file: File) {
    setVideoUrl(URL.createObjectURL(file));
    setFrameUrl("");
    setTimestamp(0);
  }

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    startRef.current = Date.now();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);
    setFrameUrl(canvas.toDataURL("image/png"));
    trackTaskComplete("video-frame-extractor", startRef.current);
  }

  function seekAndCapture(t: number) {
    const video = videoRef.current;
    if (!video) return;
    setTimestamp(t);
    video.currentTime = t;
    video.onseeked = () => captureFrame();
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
          <video ref={videoRef} src={videoUrl} controls className="w-full max-h-64 rounded-lg border border-[var(--border)]"
            onLoadedMetadata={e => { const d = (e.target as HTMLVideoElement).duration; setDuration(d); }} />
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Seek to: {timestamp.toFixed(2)}s</label>
            <input type="range" min={0} max={duration} step={0.04} value={timestamp}
              onChange={e => seekAndCapture(Number(e.target.value))}
              className="w-full accent-brand-600" />
          </div>
          <button onClick={captureFrame} className="btn-primary flex items-center gap-2">
            <Camera size={16} />Capture Frame at {timestamp.toFixed(2)}s
          </button>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {frameUrl && (
        <div className="space-y-3">
          <img src={frameUrl} alt="Extracted frame" className="w-full rounded-lg border border-[var(--border)]" />
          <a href={frameUrl} download={`frame-${timestamp.toFixed(2)}s.png`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Frame PNG
          </a>
        </div>
      )}
    </div>
  );
}
