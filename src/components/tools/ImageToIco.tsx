"use client";
import { useRef, useState } from "react";
import { Upload, Download } from "lucide-react";

// Build a multi-resolution ICO file from canvas data
function buildIco(canvases: HTMLCanvasElement[]): Blob {
  const images = canvases.map(c => {
    const ctx = c.getContext("2d")!;
    const data = ctx.getImageData(0, 0, c.width, c.height);
    return { width: c.width, height: c.height, data: data.data };
  });

  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  const BMP_HEADER_SIZE = 40;
  const numImages = images.length;

  // Calculate sizes
  const imageSizes = images.map(img => {
    const rowSize = img.width * 4;
    const xorSize = rowSize * img.height;
    const andRowSize = Math.ceil(img.width / 32) * 4;
    const andSize = andRowSize * img.height;
    return BMP_HEADER_SIZE + xorSize + andSize;
  });

  const totalSize = HEADER_SIZE + DIR_ENTRY_SIZE * numImages + imageSizes.reduce((a, b) => a + b, 0);
  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);

  // ICO header
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: ICO
  view.setUint16(4, numImages, true);

  let offset = HEADER_SIZE + DIR_ENTRY_SIZE * numImages;

  images.forEach((img, i) => {
    const dirOffset = HEADER_SIZE + i * DIR_ENTRY_SIZE;
    view.setUint8(dirOffset, img.width === 256 ? 0 : img.width);
    view.setUint8(dirOffset + 1, img.height === 256 ? 0 : img.height);
    view.setUint8(dirOffset + 2, 0); // color count
    view.setUint8(dirOffset + 3, 0); // reserved
    view.setUint16(dirOffset + 4, 1, true); // planes
    view.setUint16(dirOffset + 6, 32, true); // bit count
    view.setUint32(dirOffset + 8, imageSizes[i], true);
    view.setUint32(dirOffset + 12, offset, true);

    // BMP info header
    view.setUint32(offset, BMP_HEADER_SIZE, true);
    view.setInt32(offset + 4, img.width, true);
    view.setInt32(offset + 8, img.height * 2, true); // height * 2 for ICO
    view.setUint16(offset + 12, 1, true); // planes
    view.setUint16(offset + 14, 32, true); // bit count
    view.setUint32(offset + 16, 0, true); // compression
    offset += BMP_HEADER_SIZE;

    // XOR data (BGRA, bottom-up)
    for (let y = img.height - 1; y >= 0; y--) {
      for (let x = 0; x < img.width; x++) {
        const srcIdx = (y * img.width + x) * 4;
        view.setUint8(offset++, img.data[srcIdx + 2]); // B
        view.setUint8(offset++, img.data[srcIdx + 1]); // G
        view.setUint8(offset++, img.data[srcIdx]);     // R
        view.setUint8(offset++, img.data[srcIdx + 3]); // A
      }
    }

    // AND mask (all zeros = fully opaque)
    const andRowSize = Math.ceil(img.width / 32) * 4;
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < andRowSize; x++) {
        view.setUint8(offset++, 0);
      }
    }
  });

  return new Blob([buf], { type: "image/x-icon" });
}

const SIZES = [16, 32, 48, 64, 128, 256];

export default function ImageToIco() {
  const [out, setOut] = useState("");
  const [name, setName] = useState("favicon");
  const [selectedSizes, setSelectedSizes] = useState([16, 32, 48]);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});

  function handleFile(file: File) {
    setName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      SIZES.forEach(size => {
        const c = canvasRefs.current[size];
        if (!c) return;
        c.width = size; c.height = size;
        const ctx = c.getContext("2d")!;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
      });
      buildAndSetIco(img);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function buildAndSetIco(img?: HTMLImageElement) {
    const canvases = selectedSizes.map(s => canvasRefs.current[s]).filter(Boolean) as HTMLCanvasElement[];
    if (canvases.length === 0 || !canvases[0].width) return;
    const blob = buildIco(canvases);
    setOut(URL.createObjectURL(blob));
    void img; // suppress unused warning
  }

  function toggleSize(size: number) {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size].sort((a, b) => a - b));
  }

  return (
    <div className="space-y-4">
      <label className="border-2 border-dashed border-[var(--border)] hover:border-brand-400 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer text-[var(--text-muted)]">
        <Upload size={28} />
        <span className="text-sm font-medium">Click to upload PNG or JPG</span>
        <input type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </label>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text)]">Include sizes in ICO:</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button key={s} onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${selectedSizes.includes(s) ? "bg-brand-600 text-white border-brand-600" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
              {s}×{s}
            </button>
          ))}
        </div>
      </div>
      {out && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-muted)]">ICO file with {selectedSizes.length} size{selectedSizes.length !== 1 ? "s" : ""}: {selectedSizes.join(", ")}px</p>
          <button onClick={() => buildAndSetIco()} className="btn-secondary text-sm">Regenerate with selected sizes</button>
          <div>
            <a href={out} download={`${name}.ico`} className="btn-primary inline-flex items-center gap-2">
              <Download size={16} />Download ICO
            </a>
          </div>
        </div>
      )}
      {SIZES.map(s => (
        <canvas key={s} ref={el => { canvasRefs.current[s] = el; }} className="hidden" />
      ))}
    </div>
  );
}
