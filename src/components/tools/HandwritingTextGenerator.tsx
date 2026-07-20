"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

const FONTS = [
  { name: "Caveat", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap", family: "'Caveat', cursive" },
  { name: "Indie Flower", url: "https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap", family: "'Indie Flower', cursive" },
  { name: "Kalam", url: "https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap", family: "'Kalam', cursive" },
  { name: "Patrick Hand", url: "https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap", family: "'Patrick Hand', cursive" },
  { name: "Shadows Into Light", url: "https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap", family: "'Shadows Into Light', cursive" },
  { name: "Permanent Marker", url: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap", family: "'Permanent Marker', cursive" },
];

export default function HandwritingTextGenerator() {
  const [text, setText] = useState("The quick brown fox\njumps over the lazy dog.\n\nThis is handwriting-style text.");
  const [selectedFont, setSelectedFont] = useState(0);
  const [color, setColor] = useState("#1e293b");
  const [bgColor, setBgColor] = useState("#fffef0");
  const [fontSize, setFontSize] = useState(32);
  const [lineHeight, setLineHeight] = useState(1.6);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const links = FONTS.map(f => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = f.url;
      document.head.appendChild(link);
      return link;
    });
    document.fonts.ready.then(() => setFontsLoaded(true));
    return () => links.forEach(l => l.remove());
  }, []);

  useEffect(() => { if (fontsLoaded) draw(); }, [text, selectedFont, color, bgColor, fontSize, lineHeight, fontsLoaded]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 600;
    const padding = 40;
    const lh = fontSize * lineHeight;
    const lines = text.split("\n");
    const H = Math.max(200, padding * 2 + lines.length * lh + 20);
    canvas.width = W;
    canvas.height = H;

    // Background
    if (bgColor === "transparent") {
      ctx.clearRect(0, 0, W, H);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
    }

    // Ruled lines (optional paper effect)
    if (bgColor === "#fffef0" || bgColor === "#ffffff") {
      ctx.strokeStyle = "rgba(100,149,237,0.2)";
      ctx.lineWidth = 1;
      for (let y = padding + lh; y < H - padding; y += lh) {
        ctx.beginPath();
        ctx.moveTo(padding, y + 8);
        ctx.lineTo(W - padding, y + 8);
        ctx.stroke();
      }
    }

    ctx.font = `${fontSize}px ${FONTS[selectedFont].family}`;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    lines.forEach((line, i) => {
      ctx.fillText(line, padding, padding + i * lh);
    });
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "handwriting-text.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Fonts: Caveat, Indie Flower, Kalam, Patrick Hand, Shadows Into Light, Permanent Marker — from{" "}
        <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Fonts</a> (SIL Open Font License).
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">Text (use new lines for line breaks)</label>
        <textarea className="input h-32 resize-none font-mono text-sm" value={text} onChange={e => setText(e.target.value)} />
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Font</label>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f, i) => (
            <button
              key={i}
              onClick={() => setSelectedFont(i)}
              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${selectedFont === i ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text)]"}`}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Text color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-16 rounded cursor-pointer border border-[var(--border)]" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Background</label>
          <select className="input text-sm" value={bgColor} onChange={e => setBgColor(e.target.value)}>
            <option value="#fffef0">Cream paper</option>
            <option value="#ffffff">White</option>
            <option value="#f0f4ff">Light blue</option>
            <option value="transparent">Transparent</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Size: {fontSize}px</label>
          <input type="range" min={16} max={72} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-28" />
        </div>
      </div>
      <div className="overflow-auto rounded-xl border border-[var(--border)]">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <button onClick={download} className="btn-primary flex items-center gap-2">
        <Download size={16} />Download PNG
      </button>
    </div>
  );
}
