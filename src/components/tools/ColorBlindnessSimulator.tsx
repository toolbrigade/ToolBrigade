"use client";
import { useState, useRef, useCallback } from "react";
import { Upload } from "lucide-react";

// Color blindness transformation matrices
const MATRICES: Record<string, number[]> = {
  normal: [1,0,0,0, 0,1,0,0, 0,0,1,0],
  protanopia: [0.567,0.433,0,0, 0.558,0.442,0,0, 0,0.242,0.758,0],
  deuteranopia: [0.625,0.375,0,0, 0.7,0.3,0,0, 0,0.3,0.7,0],
  tritanopia: [0.95,0.05,0,0, 0,0.433,0.567,0, 0,0.475,0.525,0],
  achromatopsia: [0.299,0.587,0.114,0, 0.299,0.587,0.114,0, 0.299,0.587,0.114,0],
};

const TYPES = [
  { key: "normal", label: "Normal Vision" },
  { key: "protanopia", label: "Protanopia (Red-blind)" },
  { key: "deuteranopia", label: "Deuteranopia (Green-blind)" },
  { key: "tritanopia", label: "Tritanopia (Blue-blind)" },
  { key: "achromatopsia", label: "Achromatopsia (No color)" },
];

function applyMatrix(imageData: ImageData, matrix: number[]): ImageData {
  const data = new Uint8ClampedArray(imageData.data);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    data[i]     = matrix[0] * r + matrix[1] * g + matrix[2] * b;
    data[i + 1] = matrix[4] * r + matrix[5] * g + matrix[6] * b;
    data[i + 2] = matrix[8] * r + matrix[9] * g + matrix[10] * b;
  }
  return new ImageData(data, imageData.width, imageData.height);
}

export default function ColorBlindnessSimulator() {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [selected, setSelected] = useState("protanopia");
  const origCanvasRef = useRef<HTMLCanvasElement>(null);
  const simCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgSrc(src);
        drawOriginal(img);
        simulate(img, selected);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [selected]);

  function drawOriginal(img: HTMLImageElement) {
    const canvas = origCanvasRef.current;
    if (!canvas) return;
    const maxW = 400;
    const scale = Math.min(1, maxW / img.width);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  function simulate(img: HTMLImageElement, type: string) {
    const origCanvas = origCanvasRef.current;
    const simCanvas = simCanvasRef.current;
    if (!origCanvas || !simCanvas) return;
    simCanvas.width = origCanvas.width;
    simCanvas.height = origCanvas.height;
    const ctx = simCanvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, simCanvas.width, simCanvas.height);
    if (type === "normal") return;
    const imageData = ctx.getImageData(0, 0, simCanvas.width, simCanvas.height);
    const transformed = applyMatrix(imageData, MATRICES[type]);
    ctx.putImageData(transformed, 0, 0);
  }

  function handleTypeChange(type: string) {
    setSelected(type);
    if (imgRef.current) simulate(imgRef.current, type);
  }

  return (
    <div className="space-y-4">
      {!imgSrc ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-10 cursor-pointer hover:border-brand-500 transition-colors">
          <Upload size={32} className="text-[var(--text-muted)] mb-2" />
          <span className="text-sm text-[var(--text-muted)]">Upload an image to simulate color blindness</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-2 block">Simulation type</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => handleTypeChange(t.key)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected === t.key ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text)]"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">Original</p>
              <canvas ref={origCanvasRef} className="rounded-xl border border-[var(--border)] max-w-full" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">{TYPES.find(t => t.key === selected)?.label}</p>
              <canvas ref={simCanvasRef} className="rounded-xl border border-[var(--border)] max-w-full" />
            </div>
          </div>
          <button onClick={() => setImgSrc(null)} className="btn-secondary text-xs">Upload different image</button>
        </>
      )}
    </div>
  );
}
