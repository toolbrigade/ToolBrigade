"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const ITEMS = ["1", "2", "3", "4", "5"];

export default function CssFlexboxGenerator() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [align, setAlign] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(8);
  const [itemCount, setItemCount] = useState(4);

  const css = `display: flex;
flex-direction: ${direction};
justify-content: ${justify};
align-items: ${align};
flex-wrap: ${wrap};
gap: ${gap}px;`;

  const style: React.CSSProperties = {
    display: "flex",
    flexDirection: direction as React.CSSProperties["flexDirection"],
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap as React.CSSProperties["flexWrap"],
    gap: `${gap}px`,
  };

  const options = {
    "flex-direction": ["row", "row-reverse", "column", "column-reverse"],
    "justify-content": ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"],
    "align-items": ["stretch", "flex-start", "flex-end", "center", "baseline"],
    "flex-wrap": ["nowrap", "wrap", "wrap-reverse"],
  };

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(options).map(([prop, vals]) => (
          <div key={prop}>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{prop}</label>
            <select
              value={prop === "flex-direction" ? direction : prop === "justify-content" ? justify : prop === "align-items" ? align : wrap}
              onChange={e => {
                if (prop === "flex-direction") setDirection(e.target.value);
                else if (prop === "justify-content") setJustify(e.target.value);
                else if (prop === "align-items") setAlign(e.target.value);
                else setWrap(e.target.value);
              }}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400">
              {vals.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Gap</label>
            <span className="text-xs font-mono text-[var(--text)]">{gap}px</span>
          </div>
          <input type="range" min={0} max={40} value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">Item count</label>
            <span className="text-xs font-mono text-[var(--text)]">{itemCount}</span>
          </div>
          <input type="range" min={1} max={8} value={itemCount} onChange={e => setItemCount(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
        </div>
      </div>

      <div className="border border-[var(--border)] rounded-xl bg-[var(--bg-subtle)] p-4 min-h-[160px]">
        <div style={style} className="min-h-[120px]">
          {ITEMS.slice(0, itemCount).map((n, i) => (
            <div key={i} className="flex items-center justify-center rounded-lg bg-[var(--brand)] text-white font-bold text-sm"
              style={{ width: 48, height: 48, minWidth: 48, minHeight: 48 }}>
              {n}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-medium text-[var(--text-muted)]">CSS</label>
          <CopyButton text={css} />
        </div>
        <pre className="textarea font-mono text-sm">{css}</pre>
      </div>
    </div>
  );
}
