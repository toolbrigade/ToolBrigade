"use client";
import { useState, useRef, useEffect } from "react";
import { Download } from "lucide-react";

const TEMPLATES = [
  { id: "classic", label: "Classic Gold", bg: "#fffbf0", border: "#b8860b", accent: "#8b6914", text: "#2c1810" },
  { id: "modern", label: "Modern Blue", bg: "#f0f4ff", border: "#3b82f6", accent: "#1d4ed8", text: "#1e293b" },
  { id: "elegant", label: "Elegant Dark", bg: "#1a1a2e", border: "#c9a84c", accent: "#e8c96d", text: "#f5f0e8" },
];

export default function CertificateGenerator() {
  const [recipient, setRecipient] = useState("Jane Smith");
  const [achievement, setAchievement] = useState("Completion of Advanced Web Development");
  const [date, setDate] = useState(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  const [issuer, setIssuer] = useState("ToolBrigade Academy");
  const [templateIdx, setTemplateIdx] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { draw(); }, [recipient, achievement, date, issuer, templateIdx]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 800, H = 560;
    canvas.width = W;
    canvas.height = H;
    const t = TEMPLATES[templateIdx];

    // Background
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Inner border
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, W - 64, H - 64);

    // Corner decorations
    const corners = [[50, 50], [W - 50, 50], [50, H - 50], [W - 50, H - 50]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = t.border;
      ctx.fill();
    });

    // Title
    ctx.fillStyle = t.accent;
    ctx.font = "bold 36px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE", W / 2, 110);

    ctx.font = "18px Georgia, serif";
    ctx.fillStyle = t.text;
    ctx.fillText("OF ACHIEVEMENT", W / 2, 140);

    // Decorative line
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 150, 160);
    ctx.lineTo(W / 2 + 150, 160);
    ctx.stroke();

    // "This is to certify that"
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.7;
    ctx.fillText("This is to certify that", W / 2, 200);
    ctx.globalAlpha = 1;

    // Recipient name
    ctx.font = "bold 48px Georgia, serif";
    ctx.fillStyle = t.accent;
    ctx.fillText(recipient || "Recipient Name", W / 2, 265);

    // Underline
    const nameWidth = ctx.measureText(recipient || "Recipient Name").width;
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameWidth / 2, 275);
    ctx.lineTo(W / 2 + nameWidth / 2, 275);
    ctx.stroke();

    // "has successfully completed"
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.7;
    ctx.fillText("has successfully completed", W / 2, 310);
    ctx.globalAlpha = 1;

    // Achievement
    ctx.font = "bold 22px Georgia, serif";
    ctx.fillStyle = t.text;
    // Wrap text
    const words = achievement.split(" ");
    let line = "";
    let y = 345;
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > 600 && line) {
        ctx.fillText(line.trim(), W / 2, y);
        line = word + " ";
        y += 30;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), W / 2, y);

    // Bottom section
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 150, H - 120);
    ctx.lineTo(W / 2 + 150, H - 120);
    ctx.stroke();

    ctx.font = "14px Georgia, serif";
    ctx.fillStyle = t.text;
    ctx.globalAlpha = 0.8;
    ctx.fillText(date, W / 2 - 150, H - 100);
    ctx.fillText(issuer, W / 2 + 150, H - 100);
    ctx.font = "11px Georgia, serif";
    ctx.globalAlpha = 0.5;
    ctx.fillText("Date", W / 2 - 150, H - 82);
    ctx.fillText("Issued by", W / 2 + 150, H - 82);
    ctx.globalAlpha = 1;
  }

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "certificate.png";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Recipient Name</label>
            <input className="input" value={recipient} onChange={e => setRecipient(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Achievement / Course</label>
            <input className="input" value={achievement} onChange={e => setAchievement(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Date</label>
            <input className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-1 block">Issued by</label>
            <input className="input" value={issuer} onChange={e => setIssuer(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-muted)] mb-2 block">Template</label>
            <div className="flex gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setTemplateIdx(i)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${templateIdx === i ? "border-brand-500 ring-2 ring-brand-500/30" : "border-[var(--border)]"}`}
                  style={{ background: t.bg, color: t.text }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={download} className="btn-primary flex items-center gap-2 w-full justify-center">
            <Download size={16} />Download Certificate (PNG)
          </button>
        </div>
        <div className="overflow-auto">
          <canvas ref={canvasRef} className="rounded-xl border border-[var(--border)] max-w-full" />
        </div>
      </div>
    </div>
  );
}
