"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export default function CssBorderRadiusGenerator() {
  const [tl, setTl] = useState(8);
  const [tr, setTr] = useState(8);
  const [br, setBr] = useState(8);
  const [bl, setBl] = useState(8);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState<"px" | "%">("px");

  function setAll(v: number) { setTl(v); setTr(v); setBr(v); setBl(v); }

  const u = unit;
  const isUniform = tl === tr && tr === br && br === bl;
  const value = isUniform ? `${tl}${u}` : `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`;
  const css = `border-radius: ${value};`;

  const corners = [
    { label: "Top-left", value: tl, set: (v: number) => { linked ? setAll(v) : setTl(v); } },
    { label: "Top-right", value: tr, set: (v: number) => { linked ? setAll(v) : setTr(v); } },
    { label: "Bottom-right", value: br, set: (v: number) => { linked ? setAll(v) : setBr(v); } },
    { label: "Bottom-left", value: bl, set: (v: number) => { linked ? setAll(v) : setBl(v); } },
  ];

  const max = unit === "%" ? 50 : 100;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={linked} onChange={e => setLinked(e.target.checked)} className="accent-[var(--brand)]" />
              <span className="text-sm text-[var(--text)]">Link all corners</span>
            </label>
            <div className="flex gap-1 ml-auto">
              {(["px", "%"] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)}
                  className={`text-xs px-3 py-1 rounded-lg border transition-colors ${unit === u ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "border-[var(--border)] text-[var(--text-muted)]"}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          {corners.map(c => (
            <div key={c.label}>
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-[var(--text-muted)]">{c.label}</label>
                <span className="text-xs font-mono text-[var(--text)]">{c.value}{u}</span>
              </div>
              <input type="range" min={0} max={max} value={c.value} onChange={e => c.set(Number(e.target.value))}
                className="w-full accent-[var(--brand)]" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 flex items-center justify-center bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)] min-h-[200px]">
            <div className="w-40 h-40 bg-[var(--brand)] opacity-80"
              style={{ borderRadius: `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}` }} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-[var(--text-muted)]">CSS</label>
              <CopyButton text={css} />
            </div>
            <pre className="textarea font-mono text-sm">{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
