"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Upload, Download, Scissors } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function AudioTrimmer() {
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [status, setStatus] = useState<"idle" | "trimming" | "done" | "error">("idle");
  const [outUrl, setOutUrl] = useState("");
  const [fileName, setFileName] = useState("trimmed");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const startRef = useRef(Date.now());

  const drawWaveform = useCallback((buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#A84A2E22";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#A84A2E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const mid = canvas.height / 2;
    for (let i = 0; i < canvas.width; i++) {
      let max = 0;
      for (let j = 0; j < step; j++) {
        const val = Math.abs(data[i * step + j] || 0);
        if (val > max) max = val;
      }
      ctx.moveTo(i, mid - max * mid);
      ctx.lineTo(i, mid + max * mid);
    }
    ctx.stroke();
  }, []);

  async function handleFile(file: File) {
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const arrayBuf = await file.arrayBuffer();
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    const buffer = await ctx.decodeAudioData(arrayBuf);
    bufferRef.current = buffer;
    setDuration(buffer.duration);
    setStart(0);
    setEnd(buffer.duration);
    setAudioUrl(URL.createObjectURL(file));
    setStatus("idle");
    setOutUrl("");
    setTimeout(() => drawWaveform(buffer), 50);
  }

  function trim() {
    const buffer = bufferRef.current;
    const ctx = audioCtxRef.current;
    if (!buffer || !ctx) return;
    setStatus("trimming");
    startRef.current = Date.now();
    try {
      const sampleRate = buffer.sampleRate;
      const startSample = Math.floor(start * sampleRate);
      const endSample = Math.floor(end * sampleRate);
      const length = endSample - startSample;
      const offCtx = new OfflineAudioContext(buffer.numberOfChannels, length, sampleRate);
      const trimmed = offCtx.createBuffer(buffer.numberOfChannels, length, sampleRate);
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        trimmed.copyToChannel(buffer.getChannelData(ch).slice(startSample, endSample), ch);
      }
      // Encode to WAV
      const wav = encodeWav(trimmed);
      const blob = new Blob([wav], { type: "audio/wav" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("audio-trimmer", startRef.current);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload audio (MP3, WAV, OGG, M4A)</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>

      {audioUrl && (
        <>
          <audio src={audioUrl} controls className="w-full" />
          <canvas ref={canvasRef} width={600} height={80} className="w-full rounded-lg border border-[var(--border)]" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Start: {start.toFixed(2)}s</label>
              <input type="range" min={0} max={duration} step={0.01} value={start}
                onChange={e => setStart(Math.min(Number(e.target.value), end - 0.1))}
                className="w-full accent-brand-600" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">End: {end.toFixed(2)}s</label>
              <input type="range" min={0} max={duration} step={0.01} value={end}
                onChange={e => setEnd(Math.max(Number(e.target.value), start + 0.1))}
                className="w-full accent-brand-600" />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Trim length: {(end - start).toFixed(2)}s of {duration.toFixed(2)}s total</p>
          <button onClick={trim} disabled={status === "trimming"} className="btn-primary flex items-center gap-2">
            <Scissors size={16} />{status === "trimming" ? "Trimming…" : "Trim Audio"}
          </button>
        </>
      )}

      {status === "error" && <p className="text-sm text-red-500">Trim failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download={`${fileName}-trimmed.wav`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Trimmed WAV
          </a>
        </div>
      )}
    </div>
  );
}

function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const ab = new ArrayBuffer(44 + dataSize);
  const view = new DataView(ab);
  function writeStr(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return ab;
}
