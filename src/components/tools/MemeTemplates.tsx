"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { Download, Upload } from "lucide-react";

type Template = {
  id: string;
  label: string;
  description: string;
  render: (ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, img2: HTMLImageElement | null, top: string, bottom: string, mid: string) => void;
};

function drawImpactText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, size: number, align: CanvasTextAlign = "center") {
  ctx.font = `bold ${size}px Impact, Arial Black, sans-serif`;
  ctx.textAlign = align;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = size / 8;
  ctx.strokeText(text.toUpperCase(), x, y, maxW);
  ctx.fillText(text.toUpperCase(), x, y, maxW);
}

const TEMPLATES: Template[] = [
  {
    id: "classic",
    label: "Classic (Top + Bottom)",
    description: "White Impact text top and bottom",
    render: (ctx, img, _img2, top, bottom) => {
      const W = 500, H = 500;
      ctx.canvas.width = W; ctx.canvas.height = H;
      ctx.fillStyle = "#888"; ctx.fillRect(0, 0, W, H);
      if (img) ctx.drawImage(img, 0, 0, W, H);
      drawImpactText(ctx, top, W/2, 50, W-20, 40);
      drawImpactText(ctx, bottom, W/2, H-15, W-20, 40);
    },
  },
  {
    id: "drake",
    label: "Drake Format (2-panel)",
    description: "Two stacked panels with labels",
    render: (ctx, img, _img2, top, bottom) => {
      const W = 500, H = 500;
      ctx.canvas.width = W; ctx.canvas.height = H;
      ctx.fillStyle = "#f0f0f0"; ctx.fillRect(0, 0, W, H);
      // Top panel (rejected)
      ctx.fillStyle = "#ddd"; ctx.fillRect(0, 0, W, H/2);
      if (img) ctx.drawImage(img, 0, 0, W/2, H/2);
      ctx.fillStyle = "#222"; ctx.font = "bold 22px sans-serif"; ctx.textAlign = "left";
      const topWords = top.split(" ");
      let line = ""; let y = 30;
      for (const w of topWords) {
        const t = line + w + " ";
        if (ctx.measureText(t).width > W/2 - 20 && line) { ctx.fillText(line, W/2+10, y); line = w+" "; y+=28; }
        else line = t;
      }
      ctx.fillText(line, W/2+10, y);
      // Bottom panel (approved)
      ctx.fillStyle = "#fff"; ctx.fillRect(0, H/2, W, H/2);
      if (img) ctx.drawImage(img, 0, H/2, W/2, H/2);
      ctx.fillStyle = "#222"; ctx.font = "bold 22px sans-serif";
      const botWords = bottom.split(" ");
      line = ""; y = H/2+30;
      for (const w of botWords) {
        const t = line + w + " ";
        if (ctx.measureText(t).width > W/2 - 20 && line) { ctx.fillText(line, W/2+10, y); line = w+" "; y+=28; }
        else line = t;
      }
      ctx.fillText(line, W/2+10, y);
      // Divider
      ctx.strokeStyle = "#999"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    },
  },
  {
    id: "comparison",
    label: "Side-by-Side Comparison",
    description: "Left vs Right with labels",
    render: (ctx, img, img2, top, bottom, mid) => {
      const W = 600, H = 300;
      ctx.canvas.width = W; ctx.canvas.height = H;
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(0, 0, W, H);
      if (img) ctx.drawImage(img, 0, 0, W/2-2, H);
      if (img2) ctx.drawImage(img2, W/2+2, 0, W/2-2, H);
      else { ctx.fillStyle = "#333"; ctx.fillRect(W/2+2, 0, W/2-2, H); }
      // Labels
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(0, H-40, W/2-2, 40);
      ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(W/2+2, H-40, W/2-2, 40);
      ctx.fillStyle = "#fff"; ctx.font = "bold 18px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(top || "Before", W/4, H-14);
      ctx.fillText(bottom || "After", W*3/4, H-14);
      // VS divider
      ctx.fillStyle = "#fff"; ctx.font = "bold 24px sans-serif";
      ctx.fillText(mid || "VS", W/2, H/2+8);
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();
    },
  },
];

export default function MemeTemplates() {
  const [templateIdx, setTemplateIdx] = useState(0);
  const [topText, setTopText] = useState("When you finally fix the bug");
  const [bottomText, setBottomText] = useState("But introduce 3 new ones");
  const [midText, setMidText] = useState("VS");
  const [img1, setImg1] = useState<HTMLImageElement | null>(null);
  const [img2, setImg2] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadImg = useCallback((file: File, which: 1 | 2) => {
    const reader = new FileReader();
    reader.onload = e => {
      const i = new Image();
      i.onload = () => { which === 1 ? setImg1(i) : setImg2(i); };
      i.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => { render(); }, [templateIdx, topText, bottomText, midText, img1, img2]);

  function render() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    TEMPLATES[templateIdx].render(ctx, img1, img2, topText, bottomText, midText);
  }

  function download() {
    render();
    const a = document.createElement("a");
    a.href = canvasRef.current!.toDataURL("image/png");
    a.download = "meme.png";
    a.click();
  }

  const t = TEMPLATES[templateIdx];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Template</label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => setTemplateIdx(i)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${templateIdx === i ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text)]"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-1">{t.description}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">
              {templateIdx === 2 ? "Left label" : "Top text"}
            </label>
            <input className="input" value={topText} onChange={e => setTopText(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">
              {templateIdx === 2 ? "Right label" : "Bottom text"}
            </label>
            <input className="input" value={bottomText} onChange={e => setBottomText(e.target.value)} />
          </div>
          {templateIdx === 2 && (
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Center text</label>
              <input className="input" value={midText} onChange={e => setMidText(e.target.value)} />
            </div>
          )}
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">
              {templateIdx === 2 ? "Left image" : "Image"}
            </label>
            <label className="flex items-center gap-2 cursor-pointer btn-secondary text-sm w-full justify-center">
              <Upload size={14} />Upload image
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadImg(e.target.files[0], 1)} />
            </label>
          </div>
          {templateIdx === 2 && (
            <div>
              <label className="text-xs text-[var(--text-muted)] mb-1 block">Right image</label>
              <label className="flex items-center gap-2 cursor-pointer btn-secondary text-sm w-full justify-center">
                <Upload size={14} />Upload right image
                <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && loadImg(e.target.files[0], 2)} />
              </label>
            </div>
          )}
          <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Download Meme
          </button>
        </div>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="rounded-xl border border-[var(--border)] max-w-full" />
        </div>
      </div>
    </div>
  );
}
