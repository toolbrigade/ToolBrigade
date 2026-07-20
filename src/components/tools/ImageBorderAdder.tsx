"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageBorderAdder() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [borderWidth, setBorderWidth] = useState(20);
  const [borderType, setBorderType] = useState<"solid" | "gradient">("solid");
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function render(bw: number, type: "solid" | "gradient", c1: string, c2: string) {
    const img = imgRef.current;
    if (!img) return;
    const c = canvasRef.current!;
    c.width = img.naturalWidth + bw * 2;
    c.height = img.naturalHeight + bw * 2;
    const ctx = c.getContext("2d")!;
    if (type === "solid") {
      ctx.fillStyle = c1;
      ctx.fillRect(0, 0, c.width, c.height);
    } else {
      const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.drawImage(img, bw, bw);
    setOut(c.toDataURL("image/png"));
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { imgRef.current = img; render(borderWidth, borderType, color1, color2); URL.revokeObjectURL(url); };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {imgRef.current && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text)]">Border width: {borderWidth}px</label>
            <input type="range" min={1} max={100} value={borderWidth} className="w-full accent-brand-600"
              onChange={e => { setBorderWidth(+e.target.value); render(+e.target.value, borderType, color1, color2); }} />
          </div>
          <div className="flex gap-2">
            {(["solid", "gradient"] as const).map(t => (
              <button key={t} onClick={() => { setBorderType(t); render(borderWidth, t, color1, color2); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${borderType === t ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-4 items-center">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">{borderType === "gradient" ? "Color 1" : "Color"}</label>
              <input type="color" value={color1} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
                onChange={e => { setColor1(e.target.value); render(borderWidth, borderType, e.target.value, color2); }} />
            </div>
            {borderType === "gradient" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text)]">Color 2</label>
                <input type="color" value={color2} className="w-16 h-9 rounded cursor-pointer border border-[var(--border)]"
                  onChange={e => { setColor2(e.target.value); render(borderWidth, borderType, color1, e.target.value); }} />
              </div>
            )}
          </div>
          {out && (
            <div className="space-y-3 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out} alt="bordered" className="max-h-64 mx-auto rounded-lg object-contain border border-[var(--border)]" />
              <a href={out} download={`${name}-bordered.png`} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download PNG
              </a>
            </div>
          )}
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
