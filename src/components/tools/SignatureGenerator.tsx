"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

const FONTS = [
  { name: "Dancing Script", url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap", family: "'Dancing Script', cursive" },
  { name: "Pacifico", url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap", family: "'Pacifico', cursive" },
  { name: "Great Vibes", url: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap", family: "'Great Vibes', cursive" },
  { name: "Satisfy", url: "https://fonts.googleapis.com/css2?family=Satisfy&display=swap", family: "'Satisfy', cursive" },
  { name: "Allura", url: "https://fonts.googleapis.com/css2?family=Allura&display=swap", family: "'Allura', cursive" },
  { name: "Sacramento", url: "https://fonts.googleapis.com/css2?family=Sacramento&display=swap", family: "'Sacramento', cursive" },
];

export default function SignatureGenerator() {
  const [name, setName] = useState("Your Name");
  const [selectedFont, setSelectedFont] = useState(0);
  const [color, setColor] = useState("#1e293b");
  const [fontSize, setFontSize] = useState(72);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load all Google Fonts
  useEffect(() => {
    const links = FONTS.map(f => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = f.url;
      document.head.appendChild(link);
      return link;
    });
    // Wait for fonts to load
    document.fonts.ready.then(() => setFontsLoaded(true));
    return () => links.forEach(l => l.remove());
  }, []);

  useEffect(() => {
    if (fontsLoaded) draw();
  }, [name, selectedFont, color, fontSize, fontsLoaded]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 600, H = 200;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.font = `${fontSize}px ${FONTS[selectedFont].family}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name || "Your Name", W / 2, H / 2);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "signature.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Fonts used: Dancing Script, Pacifico, Great Vibes, Satisfy, Allura, Sacramento — all from{" "}
        <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Fonts</a> (SIL Open Font License).
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">Name to sign</label>
        <input className="input text-lg" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" />
      </div>
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Font style</label>
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f, i) => (
            <button
              key={i}
              onClick={() => setSelectedFont(i)}
              className={`px-3 py-2 rounded-lg border text-sm transition-all ${selectedFont === i ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text)]"}`}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-16 rounded cursor-pointer border border-[var(--border)]" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Size ({fontSize}px)</label>
          <input type="range" min={32} max={120} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-32" />
        </div>
      </div>
      <div className="bg-[var(--bg-subtle)] rounded-xl p-4 flex justify-center" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' fill='%23f8fafc'/%3E%3Crect width='10' height='10' fill='%23e2e8f0'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23e2e8f0'/%3E%3C/svg%3E\")" }}>
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
      <button onClick={download} className="btn-primary flex items-center gap-2">
        <Download size={16} />Download PNG (transparent background)
      </button>
    </div>
  );
}
