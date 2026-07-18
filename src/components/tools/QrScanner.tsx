"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";

export default function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const rafRef = useRef<number>(0);
  const jsqrRef = useRef<((data: Uint8ClampedArray, w: number, h: number) => { data: string } | null) | null>(null);

  async function startCamera() {
    setError(""); setResult("");
    try {
      if (!jsqrRef.current) {
        const mod = await import("jsqr");
        jsqrRef.current = mod.default;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current!.srcObject = stream;
      await videoRef.current!.play();
      setScanning(true);
      scan();
    } catch { setError("Camera access denied or not available."); }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setScanning(false);
    cancelAnimationFrame(rafRef.current);
  }

  function scan() {
    const video = videoRef.current!; const canvas = canvasRef.current!;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsqrRef.current?.(imageData.data, imageData.width, imageData.height);
      if (code) { setResult(code.data); stopCamera(); return; }
    }
    rafRef.current = requestAnimationFrame(scan);
  }

  async function handleFile(file: File) {
    setError(""); setResult("");
    if (!jsqrRef.current) {
      const mod = await import("jsqr");
      jsqrRef.current = mod.default;
    }
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const code = jsqrRef.current?.(imageData.data, imageData.width, imageData.height);
      if (code) setResult(code.data);
      else setError("No QR code found in this image.");
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }

  useEffect(() => () => { stopCamera(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {!scanning
          ? <button onClick={startCamera} className="btn-primary flex items-center gap-2"><Camera size={16} />Start Camera</button>
          : <button onClick={stopCamera} className="btn-secondary">Stop Camera</button>}
        <label className="btn-secondary flex items-center gap-2 cursor-pointer">
          <Upload size={16} />Scan from Image
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      </div>
      {scanning && <video ref={videoRef} className="w-full max-w-sm mx-auto rounded-lg border border-[var(--border)]" muted playsInline />}
      <canvas ref={canvasRef} className="hidden" />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
          <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-1">QR Code detected:</p>
          <p className="text-sm text-[var(--text)] break-all">{result}</p>
          {result.startsWith("http") && (
            <a href={result} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 dark:text-brand-400 hover:underline mt-1 block">Open link →</a>
          )}
        </div>
      )}
    </div>
  );
}
