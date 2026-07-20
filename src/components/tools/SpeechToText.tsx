"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Copy, Trash2 } from "lucide-react";
import { trackUsage } from "@/lib/trackUsage";

type SpeechRecognitionEvent = Event & {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SR = (typeof window !== "undefined") &&
      (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    if (!SR) { setSupported(false); return; }
  }, []);

  function start() {
    const SR = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let final = "";
      let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else inter += e.results[i][0].transcript;
      }
      if (final) setTranscript(prev => prev + final + " ");
      setInterim(inter);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => { setListening(false); setInterim(""); };
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
    trackUsage("speech-to-text", true, false, 0);
  }

  function stop() {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim("");
  }

  function copy() {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!supported) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-500">Speech recognition is not supported in your browser. Use Chrome or Edge on desktop.</p>
        <p className="text-xs text-[var(--text-muted)]">The Web Speech API (SpeechRecognition) is primarily supported in Chromium-based browsers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Privacy notice — prominent */}
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-800 dark:text-amber-200">
        <strong>⚠️ Privacy notice:</strong> This tool uses your browser&apos;s built-in speech recognition. In Chrome, your audio is sent to <strong>Google&apos;s speech-recognition service</strong> for processing — it does not stay on your device. ToolBrigade itself receives nothing, but Google processes the audio stream. Do not use this tool for sensitive or confidential speech.
      </div>

      <div className="flex gap-3">
        {!listening ? (
          <button onClick={start} className="btn-primary flex items-center gap-2">
            <Mic size={16} />Start Recording
          </button>
        ) : (
          <button onClick={stop} className="btn-secondary flex items-center gap-2 border-red-400 text-red-600 hover:bg-red-50">
            <MicOff size={16} />Stop Recording
          </button>
        )}
        {transcript && (
          <>
            <button onClick={copy} className="btn-secondary flex items-center gap-2">
              <Copy size={16} />{copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={() => { setTranscript(""); setInterim(""); }} className="btn-secondary flex items-center gap-2">
              <Trash2 size={16} />Clear
            </button>
          </>
        )}
      </div>

      {listening && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Listening… speak now
        </div>
      )}

      <div className="min-h-[120px] p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-sm text-[var(--text)] leading-relaxed">
        {transcript}
        {interim && <span className="text-[var(--text-muted)] italic">{interim}</span>}
        {!transcript && !interim && <span className="text-[var(--text-muted)]">Transcript will appear here…</span>}
      </div>
    </div>
  );
}
