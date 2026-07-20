"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

const BACKGROUNDS = [
  { label: "Deep Blue", value: "linear", colors: ["#1e3a8a", "#3b82f6"] },
  { label: "Sunset", value: "linear", colors: ["#7c3aed", "#ec4899", "#f97316"] },
  { label: "Forest", value: "linear", colors: ["#064e3b", "#10b981"] },
  { label: "Crimson", value: "linear", colors: ["#7f1d1d", "#ef4444"] },
  { label: "Midnight", value: "solid", colors: ["#0f172a", "#0f172a"] },
  { label: "Gold", value: "linear", colors: ["#78350f", "#f59e0b"] },
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

export default function EventPosterGenerator() {
  const [eventName, setEventName] = useState("Annual Tech Summit 2025");
  const [eventDate, setEventDate] = useState("Saturday, June 14, 2025");
  const [eventTime, setEventTime] = useState("9:00 AM – 5:00 PM");
  const [eventLocation, setEventLocation] = useState("Convention Center, Main Hall");
  const [tagline, setTagline] = useState("Where Innovation Meets Opportunity");
  const [bgIdx, setBgIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { draw(); }, [eventName, eventDate, eventTime, eventLocation, tagline, bgIdx]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 600, H = 800;
    canvas.width = W;
    canvas.height = H;

    const bg = BACKGROUNDS[bgIdx];
    if (bg.value === "linear") {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      bg.colors.forEach((c, i) => grad.addColorStop(i / (bg.colors.length - 1), c));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bg.colors[0];
    }
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(W - 80, 80, 120, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(80, H - 80, 100, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;

    // Top accent line
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(60, 60, W - 120, 3);

    // Event name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    ctx.textAlign = "center";
    const nameY = wrapText(ctx, eventName, W / 2, 130, W - 120, 52);

    // Tagline
    if (tagline) {
      ctx.font = "italic 20px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      wrapText(ctx, tagline, W / 2, nameY + 40, W - 120, 28);
    }

    // Divider
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillRect(W / 2 - 60, H / 2 - 20, 120, 2);

    // Date
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(eventDate, W / 2, H / 2 + 30);

    // Time
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(eventTime, W / 2, H / 2 + 70);

    // Location
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    wrapText(ctx, "📍 " + eventLocation, W / 2, H / 2 + 120, W - 120, 26);

    // Bottom accent line
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(60, H - 60, W - 120, 3);
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "event-poster.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Event Name</label>
            <input className="input" value={eventName} onChange={e => setEventName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Tagline (optional)</label>
            <input className="input" value={tagline} onChange={e => setTagline(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Date</label>
            <input className="input" value={eventDate} onChange={e => setEventDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Time</label>
            <input className="input" value={eventTime} onChange={e => setEventTime(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Location</label>
            <input className="input" value={eventLocation} onChange={e => setEventLocation(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Background</label>
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setBgIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${bgIdx === i ? "border-brand-500 ring-2 ring-brand-500/30" : "border-[var(--border)]"}`}
                  style={{ background: bg.colors.length > 1 ? `linear-gradient(135deg, ${bg.colors.join(",")})` : bg.colors[0], color: "#fff" }}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Download Poster (PNG)
          </button>
        </div>
        <div className="flex justify-center">
          <canvas ref={canvasRef} className="rounded-xl shadow-lg max-w-full" style={{ maxHeight: 500 }} />
        </div>
      </div>
    </div>
  );
}
