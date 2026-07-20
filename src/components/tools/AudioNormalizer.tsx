"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function AudioNormalizer() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [outUrl, setOutUrl] = useState("");
  const [stats, setStats] = useState<{ peak: number; rms: number; gain: number } | null>(null);
  const startRef = { current: Date.now() };

  async function normalize() {
    if (!file) return;
    setStatus("analyzing");
    startRef.current = Date.now();
    try {
      const arrayBuf = await file.arrayBuffer();
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(arrayBuf);

      // Analyze peak and RMS across all channels
      let peak = 0;
      let sumSq = 0;
      let totalSamples = 0;
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) {
          const abs = Math.abs(data[i]);
          if (abs > peak) peak = abs;
          sumSq += data[i] * data[i];
          totalSamples++;
        }
      }
      const rms = Math.sqrt(sumSq / totalSamples);
      // Target peak = 0.95 (just below 0 dBFS)
      const gain = peak > 0 ? 0.95 / peak : 1;
      setStats({ peak: Math.round(peak * 1000) / 1000, rms: Math.round(rms * 1000) / 1000, gain: Math.round(gain * 100) / 100 });

      // Apply gain and encode WAV
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const numSamples = buffer.length;
      const bytesPerSample = 2;
      const blockAlign = numChannels * bytesPerSample;
      const dataSize = numSamples * blockAlign;
      const ab = new ArrayBuffer(44 + dataSize);
      const view = new DataView(ab);
      const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeStr(0, "RIFF"); view.setUint32(4, 36 + dataSize, true); writeStr(8, "WAVE");
      writeStr(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true); view.setUint16(32, blockAlign, true);
      view.setUint16(34, 16, true); writeStr(36, "data"); view.setUint32(40, dataSize, true);
      let offset = 44;
      for (let i = 0; i < numSamples; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i] * gain));
          view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
          offset += 2;
        }
      }
      const blob = new Blob([ab], { type: "audio/wav" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("audio-normalizer", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "normalized";

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload audio (MP3, WAV, OGG, M4A)</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); setStats(null); }} />
      </label>

      {file && (
        <button onClick={normalize} disabled={status === "analyzing"} className="btn-primary">
          {status === "analyzing" ? "Analyzing & Normalizing…" : "Normalize Volume"}
        </button>
      )}

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          {[["Peak Level", stats.peak], ["RMS Level", stats.rms], ["Gain Applied", `×${stats.gain}`]].map(([label, val]) => (
            <div key={label as string} className="card text-center">
              <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
              <p className="text-lg font-semibold text-[var(--text)]">{val}</p>
            </div>
          ))}
        </div>
      )}

      {status === "error" && <p className="text-sm text-red-500">Normalization failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download={`${baseName}-normalized.wav`} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Normalized WAV
          </a>
        </div>
      )}
    </div>
  );
}
