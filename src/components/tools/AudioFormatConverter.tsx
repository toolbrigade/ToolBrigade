"use client";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { trackTaskComplete } from "@/lib/trackUsage";

type Format = "wav" | "mp3";

export default function AudioFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFmt, setTargetFmt] = useState<Format>("mp3");
  const [status, setStatus] = useState<"idle" | "converting" | "done" | "error">("idle");
  const [outUrl, setOutUrl] = useState("");
  const [outName, setOutName] = useState("");
  const startRef = { current: Date.now() };

  async function convert() {
    if (!file) return;
    setStatus("converting");
    startRef.current = Date.now();
    try {
      const arrayBuf = await file.arrayBuffer();
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(arrayBuf);
      const baseName = file.name.replace(/\.[^.]+$/, "");

      if (targetFmt === "wav") {
        const wav = encodeWav(buffer);
        const blob = new Blob([wav], { type: "audio/wav" });
        setOutUrl(URL.createObjectURL(blob));
        setOutName(`${baseName}.wav`);
      } else {
        // MP3 via lamejs
        const { Mp3Encoder } = await import("lamejs");
        const sampleRate = buffer.sampleRate;
        const ch = buffer.numberOfChannels;
        const encoder = new Mp3Encoder(ch, sampleRate, 128);
        const left = pcmFloat32ToInt16(buffer.getChannelData(0));
        const right = ch > 1 ? pcmFloat32ToInt16(buffer.getChannelData(1)) : left;
        const blockSize = 1152;
        const mp3Data: Uint8Array[] = [];
        for (let i = 0; i < left.length; i += blockSize) {
          const l = left.subarray(i, i + blockSize);
          const r = right.subarray(i, i + blockSize);
          const encoded = ch > 1 ? encoder.encodeBuffer(l, r) : encoder.encodeBuffer(l);
          if (encoded.length > 0) mp3Data.push(new Uint8Array(encoded));
        }
        const flushed = encoder.flush();
        if (flushed.length > 0) mp3Data.push(new Uint8Array(flushed));
        const blob = new Blob(mp3Data.map(d => d.buffer as ArrayBuffer), { type: "audio/mpeg" });
        setOutUrl(URL.createObjectURL(blob));
        setOutName(`${baseName}.mp3`);
      }
      setStatus("done");
      trackTaskComplete("audio-format-converter", startRef.current);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-5">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload audio (MP3, WAV, OGG, M4A)</span>
        <input type="file" accept="audio/*" className="hidden" onChange={e => { setFile(e.target.files?.[0] ?? null); setStatus("idle"); setOutUrl(""); }} />
      </label>

      {file && (
        <>
          <p className="text-sm text-[var(--text-muted)]">File: <strong className="text-[var(--text)]">{file.name}</strong></p>
          <div className="flex gap-3">
            <span className="text-sm text-[var(--text-muted)] self-center">Convert to:</span>
            {(["mp3", "wav"] as Format[]).map(f => (
              <button key={f} onClick={() => setTargetFmt(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${targetFmt === f ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400"}`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={convert} disabled={status === "converting"} className="btn-primary">
            {status === "converting" ? "Converting…" : `Convert to ${targetFmt.toUpperCase()}`}
          </button>
        </>
      )}

      {status === "error" && <p className="text-sm text-red-500">Conversion failed. Try a different file.</p>}
      {status === "done" && outUrl && (
        <div className="space-y-3">
          <audio src={outUrl} controls className="w-full" />
          <a href={outUrl} download={outName} className="btn-primary inline-flex items-center gap-2">
            <Download size={16} />Download {targetFmt.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}

function pcmFloat32ToInt16(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
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
