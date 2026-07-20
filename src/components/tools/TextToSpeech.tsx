"use client";
import { useState, useEffect } from "react";
import { Volume2, Square } from "lucide-react";
import { trackUsage } from "@/lib/trackUsage";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  function speak() {
    if (!text.trim() || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utt.voice = voice;
    utt.rate = rate;
    utt.pitch = pitch;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
    trackUsage("text-to-speech", true, true, 0);
  }

  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  if (!supported) {
    return <p className="text-sm text-red-500">Your browser does not support the Web Speech API. Try Chrome or Edge.</p>;
  }

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste text to speak…"
        rows={6}
        className="input w-full resize-y font-mono text-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Voice</label>
          <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} className="input w-full text-sm">
            {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Rate: {rate}×</label>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-brand-600" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Pitch: {pitch}</label>
          <input type="range" min={0} max={2} step={0.1} value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full accent-brand-600" />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={speak} disabled={!text.trim() || speaking} className="btn-primary flex items-center gap-2">
          <Volume2 size={16} />{speaking ? "Speaking…" : "Speak"}
        </button>
        {speaking && (
          <button onClick={stop} className="btn-secondary flex items-center gap-2">
            <Square size={16} />Stop
          </button>
        )}
      </div>

      {voices.length === 0 && (
        <p className="text-xs text-[var(--text-muted)]">No voices loaded yet. Try clicking Speak — voices may load on first interaction.</p>
      )}
    </div>
  );
}
