"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function SilenceRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.01);
  const [minSilence, setMinSilence] = useState(0.3);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [outUrl, setOutUrl] = useState("");
  const [stats, setStats] = useState<{ original: number; output: number } | null>(null);
  const startRef = { current: Date.now() };

  async function process() {
    if (!file) return;
    setStatus("processing");
    startRef.current = Date.now();
    try {
      const arrayBuf = await file.arrayBuffer();
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(arrayBuf);
      const sampleRate = buffer.sampleRate;
      const numChannels = buffer.numberOfChannels;
      const data = buffer.getChannelData(0);
      const minSilenceSamples = Math.floor(minSilence * sampleRate);

      // Find non-silent segments
      const segments: [number, number][] = [];
      let inSilence = true;
      let segStart = 0;

      for (let i = 0; i < data.length; i++) {
        const loud = Math.abs(data[i]) > threshold;
        if (inSilence && loud) {
          segStart = Math.max(0, i - Math.floor(0.05 * sampleRate)); // 50ms pre-roll
          inSilence = false;
        } else if (!inSilence && !loud) {
          // Check if silence is long enough
          let silenceLen = 0;
          for (let j = i; j < Math.min(i + minSilenceSamples, data.length); j++) {
            if (Math.abs(data[j]) <= threshold) silenceLen++;
            else break;
          }
          if (silenceLen >= minSilenceSamples) {
            segments.push([segStart, i]);
            inSilence = true;
          }
        }
      }
      if (!inSilence) segments.push([segStart, data.length]);

      if (segments.length === 0) {
        setStatus("error");
        return;
      }

      const totalLength = segments.reduce((sum, [s, e]) => sum + (e - s), 0);
      const outBuffer = ctx.createBuffer(numChannels, totalLength, sampleRate);
      let outOffset = 0;
      for (const [s, e] of segments) {
        for (let ch = 0; ch < numChannels; ch++) {
          outBuffer.getChannelData(ch).set(buffer.getChannelData(ch).slice(s, e), outOffset);
        }
        outOffset += e - s;
      }

      setStats({ original: buffer.duration, output: outBuffer.duration });
      const wav = encodeWav(outBuffer);
      const blob = new Blob([wav], { type: "audio/wav" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("silence-remover", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "no-silence";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload audio (MP3, WAV, OGG)</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); setStats(null); }} />
      </label>

      {file && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Silence threshold: {threshold}</label>
              <input type="range" min={0.001} max={0.1} step={0.001} value={threshold}
                onChange={e => setThreshold(Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Min silence: {minSilence}s</label>
              <input type="range" min={0.1} max={2} step={0.1} value={minSilence}
                onChange={e => setMinSilence(Number(e.target.value))} className="w-full accent-brand-600" />
            </div>
          </div>
          <button onClick={process} disabled={status === "processing"} className="btn-primary">
            {status === "processing" ? "Processing…" : "Remove Silence"}
          </button>
        </>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-3">
          {[["Original Duration", `${stats.original.toFixed(1)}s`], ["Output Duration", `${stats.output.toFixed(1)}s`]].map(([label, val]) => (
            <div key={label} className="card text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
              <p className="text-lg font-semibold text-[var(--text)]">{val}</p>
            </div>
          ))}
        </div>
      )}

      {status === "error" && <p className="text-sm text-red-500">Processing failed or no non-silent segments found. Try adjusting the threshold.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download={`${baseName}-no-silence.wav`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download WAV
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
  const dataSize = numSamples * blockAlign;
  const ab = new ArrayBuffer(44 + dataSize);
  const view = new DataView(ab);
  function writeStr(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }
  writeStr(0, "RIFF"); view.setUint32(4, 36 + dataSize, true); writeStr(8, "WAVE");
  writeStr(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); writeStr(36, "data"); view.setUint32(40, dataSize, true);
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
