"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

export default function ImageBgColorChanger() {
  const [src, setSrc] = useState("");
  const [out, setOut] = useState("");
  const [name, setName] = useState("image");
  const [tolerance, setTolerance] = useState(30);
  const [newColor, setNewColor] = useState("#ffffff");
  const [transparent, setTransparent] = useState(false);
  const [pickColor, setPickColor] = useState<[number, number, number] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  function applyChromaKey(targetR: number, targetG: number, targetB: number, tol: number, color: string, transp: boolean) {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imgRef.current!, 0, 0);
    const data = ctx.getImageData(0, 0, c.width, c.height);
    const nr = parseInt(color.slice(1, 3), 16);
    const ng = parseInt(color.slice(3, 5), 16);
    const nb = parseInt(color.slice(5, 7), 16);
    for (let i = 0; i < data.data.length; i += 4) {
      const dr = data.data[i] - targetR;
      const dg = data.data[i + 1] - targetG;
      const db = data.data[i + 2] - targetB;
      if (Math.sqrt(dr * dr + dg * dg + db * db) <= tol) {
        if (transp) { data.data[i + 3] = 0; }
        else { data.data[i] = nr; data.data[i + 1] = ng; data.data[i + 2] = nb; data.data[i + 3] = 255; }
      }
    }
    ctx.putImageData(data, 0, 0);
    setOut(c.toDataURL("image/png"));
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const scaleX = c.width / rect.width;
    const scaleY = c.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imgRef.current!, 0, 0);
    const px = ctx.getImageData(x, y, 1, 1).data;
    const col: [number, number, number] = [px[0], px[1], px[2]];
    setPickColor(col);
    applyChromaKey(col[0], col[1], col[2], tolerance, newColor, transparent);
  }

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const c = canvasRef.current!;
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      setOut(""); setPickColor(null);
    };
    img.src = url;
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload image</span>
        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      {src && (
        <>
          <p className="text-sm text-[var(--text-muted)]">Click on the image canvas below to pick the background color to replace.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Tolerance: {tolerance}</label>
              <input type="range" min={1} max={100} value={tolerance} className="w-full accent-brand-600"
                onChange={e => { setTolerance(+e.target.value); if (pickColor) applyChromaKey(pickColor[0], pickColor[1], pickColor[2], +e.target.value, newColor, transparent); }} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text)]">Replace with</label>
              <input type="color" value={newColor} className="w-full h-9 rounded cursor-pointer border border-[var(--border)]"
                onChange={e => { setNewColor(e.target.value); if (pickColor) applyChromaKey(pickColor[0], pickColor[1], pickColor[2], tolerance, e.target.value, transparent); }} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
                <input type="checkbox" checked={transparent} onChange={e => { setTransparent(e.target.checked); if (pickColor) applyChromaKey(pickColor[0], pickColor[1], pickColor[2], tolerance, newColor, e.target.checked); }} />
                Make transparent
              </label>
            </div>
          </div>
          <canvas ref={canvasRef} className="max-w-full rounded-lg border border-[var(--border)] cursor-crosshair"
            style={{ display: "block", maxHeight: "400px", objectFit: "contain" }}
            onClick={handleClick}
            onLoad={() => { const c = canvasRef.current!; const ctx = c.getContext("2d")!; ctx.drawImage(imgRef.current!, 0, 0); }} />
          {!pickColor && (
            <p className="text-xs text-[var(--text-muted)]">
              {/* Draw initial image on canvas */}
              {(() => { if (imgRef.current && canvasRef.current) { const c = canvasRef.current; const ctx = c.getContext("2d")!; ctx.drawImage(imgRef.current, 0, 0); } return null; })()}
              ☝️ Click anywhere on the image to select the background color
            </p>
          )}
          {out && (
            <div className="flex justify-center">
              <a href={out} download={`${name}-bg-changed.png`} className="btn-primary inline-flex items-center gap-2">
                <Download size={16} />Download PNG
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
