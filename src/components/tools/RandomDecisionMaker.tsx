"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";

const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316","#eab308","#22c55e","#14b8a6","#06b6d4","#3b82f6","#a855f7","#d946ef"];

function drawWheel(canvas: HTMLCanvasElement, options: string[], angle: number) {
  const ctx = canvas.getContext("2d")!;
  const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 10;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const n = options.length;
  if (n === 0) return;
  const slice = (2 * Math.PI) / n;
  options.forEach((opt, i) => {
    const start = angle + i * slice;
    const end = start + slice;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.min(14, 120 / n)}px sans-serif`;
    ctx.fillText(opt.length > 12 ? opt.slice(0, 12) + "…" : opt, r - 10, 5);
    ctx.restore();
  });
  // Center circle
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  // Pointer
  ctx.beginPath();
  ctx.moveTo(cx + r - 5, cy);
  ctx.lineTo(cx + r + 15, cy - 10);
  ctx.lineTo(cx + r + 15, cy + 10);
  ctx.closePath();
  ctx.fillStyle = "#1e293b";
  ctx.fill();
}

export default function RandomDecisionMaker() {
  const [mode, setMode] = useState<"yesno" | "wheel">("yesno");
  const [yesNoResult, setYesNoResult] = useState<string | null>(null);
  const [options, setOptions] = useState(["Option A", "Option B", "Option C", "Option D"]);
  const [newOption, setNewOption] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);

  const redraw = useCallback(() => {
    if (canvasRef.current) drawWheel(canvasRef.current, options, angleRef.current);
  }, [options]);

  useEffect(() => { redraw(); }, [redraw]);

  function flipYesNo() {
    setYesNoResult(null);
    let count = 0;
    const interval = setInterval(() => {
      setYesNoResult(Math.random() > 0.5 ? "Yes" : "No");
      count++;
      if (count > 10) {
        clearInterval(interval);
        setYesNoResult(Math.random() > 0.5 ? "Yes ✓" : "No ✗");
      }
    }, 80);
  }

  function spin() {
    if (spinning || options.length < 2) return;
    setSpinning(true);
    setWinner(null);
    const totalRotation = 2 * Math.PI * (5 + Math.random() * 5);
    const duration = 3000 + Math.random() * 1000;
    const start = performance.now();
    const startAngle = angleRef.current;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      angleRef.current = startAngle + totalRotation * ease;
      redraw();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        // Determine winner: pointer is at angle 0 (right side), find which slice is there
        const n = options.length;
        const slice = (2 * Math.PI) / n;
        const normalised = ((angleRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(((2 * Math.PI - normalised) % (2 * Math.PI)) / slice) % n;
        setWinner(options[idx]);
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  function addOption() {
    if (newOption.trim() && options.length < 12) {
      setOptions(o => [...o, newOption.trim()]);
      setNewOption("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("yesno")} className={mode === "yesno" ? "btn-primary" : "btn-secondary"}>Yes / No Flip</button>
        <button onClick={() => setMode("wheel")} className={mode === "wheel" ? "btn-primary" : "btn-secondary"}>Spinner Wheel</button>
      </div>

      {mode === "yesno" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className={`text-6xl font-bold font-mono transition-colors ${yesNoResult?.startsWith("Yes") ? "text-green-500" : yesNoResult?.startsWith("No") ? "text-red-500" : "text-[var(--text-muted)]"}`}>
            {yesNoResult ?? "?"}
          </div>
          <button onClick={flipYesNo} className="btn-primary text-lg px-8 py-3">Flip!</button>
        </div>
      )}

      {mode === "wheel" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              className="input flex-1 text-sm"
              placeholder="Add option (max 12)"
              value={newOption}
              onChange={e => setNewOption(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addOption()}
            />
            <button onClick={addOption} disabled={options.length >= 12} className="btn-secondary"><Plus size={16} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((o, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white" style={{ background: COLORS[i % COLORS.length] }}>
                {o}
                <button onClick={() => setOptions(opts => opts.filter((_, idx) => idx !== i))} className="hover:opacity-70"><Trash2 size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} width={300} height={300} className="rounded-full border-4 border-[var(--border)]" />
            <button onClick={spin} disabled={spinning || options.length < 2} className="btn-primary text-lg px-8 py-3">
              {spinning ? "Spinning…" : "Spin!"}
            </button>
            {winner && (
              <div className="text-center">
                <p className="text-xs text-[var(--text-muted)]">Winner:</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{winner}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
