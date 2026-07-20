"use client";
import { useState } from "react";
import { Upload, Download, X, Merge } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

interface AudioItem { name: string; file: File }

export default function AudioMerger() {
  const [items, setItems] = useState<AudioItem[]>([]);
  const [status, setStatus] = useState<"idle" | "merging" | "done" | "error">("idle");
  const [outUrl, setOutUrl] = useState("");
  const startRef = { current: Date.now() };

  function addFiles(files: FileList) {
    const newItems = Array.from(files).map(f => ({ name: f.name, file: f }));
    setItems(prev => [...prev, ...newItems]);
    setStatus("idle");
    setOutUrl("");
  }

  function remove(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  async function merge() {
    if (items.length < 2) return;
    setStatus("merging");
    startRef.current = Date.now();
    try {
      const ctx = new AudioContext();
      const buffers: AudioBuffer[] = [];
      for (const item of items) {
        const ab = await item.file.arrayBuffer();
        const buf = await ctx.decodeAudioData(ab);
        buffers.push(buf);
      }
      const sampleRate = buffers[0].sampleRate;
      const numChannels = Math.max(...buffers.map(b => b.numberOfChannels));
      const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
      const merged = ctx.createBuffer(numChannels, totalLength, sampleRate);
      let offset = 0;
      for (const buf of buffers) {
        for (let ch = 0; ch < numChannels; ch++) {
          const src = ch < buf.numberOfChannels ? buf.getChannelData(ch) : new Float32Array(buf.length);
          merged.getChannelData(ch).set(src, offset);
        }
        offset += buf.length;
      }
      const wav = encodeWav(merged);
      const blob = new Blob([wav], { type: "audio/wav" });
      setOutUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackTaskComplete("audio-merger", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to add audio files (MP3, WAV, OGG)</span>
        <input type="file" accept="audio/*" multiple className="hidden" onChange={e => e.target.files && addFiles(e.target.files)} />
      </label>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-sm">
              <span className="text-[var(--text)] truncate">{i + 1}. {item.name}</span>
              <button onClick={() => remove(i)} className="text-[var(--text-muted)] hover:text-red-500 ml-2 shrink-0"><X size={16} /></button>
            </li>
          ))}
        </ul>
      )}

      {items.length >= 2 && (
        <button onClick={merge} disabled={status === "merging"} className="btn-primary flex items-center gap-2">
          <Merge size={16} />{status === "merging" ? "Merging…" : `Merge ${items.length} Files`}
        </button>
      )}
      {items.length === 1 && <p className="text-xs text-[var(--text-muted)]">Add at least one more file to merge.</p>}

      {status === "error" && <p className="text-sm text-red-500">Merge failed. Ensure all files are valid audio.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download="merged-audio.wav" className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download Merged WAV
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
