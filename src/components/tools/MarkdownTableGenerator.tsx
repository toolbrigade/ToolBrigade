"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

type Align = "left" | "center" | "right";

export default function MarkdownTableGenerator() {
  const [cols, setCols] = useState(3);
  const [headers, setHeaders] = useState(["Column 1", "Column 2", "Column 3"]);
  const [aligns, setAligns] = useState<Align[]>(["left", "left", "left"]);
  const [rows, setRows] = useState([["", "", ""], ["", "", ""]]);
  const [startTime] = useState(Date.now());

  function addCol() {
    setCols(c => c + 1);
    setHeaders(h => [...h, `Column ${h.length + 1}`]);
    setAligns(a => [...a, "left"]);
    setRows(r => r.map(row => [...row, ""]));
  }

  function removeCol(ci: number) {
    if (cols <= 1) return;
    setCols(c => c - 1);
    setHeaders(h => h.filter((_, i) => i !== ci));
    setAligns(a => a.filter((_, i) => i !== ci));
    setRows(r => r.map(row => row.filter((_, i) => i !== ci)));
  }

  function addRow() { setRows(r => [...r, Array(cols).fill("")]); }
  function removeRow(ri: number) { setRows(r => r.filter((_, i) => i !== ri)); }

  function updateHeader(ci: number, v: string) { setHeaders(h => h.map((hdr, i) => i === ci ? v : hdr)); }
  function updateAlign(ci: number, v: Align) { setAligns(a => a.map((al, i) => i === ci ? v : al)); }
  function updateCell(ri: number, ci: number, v: string) { setRows(r => r.map((row, i) => i === ri ? row.map((c, j) => j === ci ? v : c) : row)); }

  function alignSep(a: Align) {
    if (a === "center") return ":---:";
    if (a === "right") return "---:";
    return ":---";
  }

  const markdown = [
    `| ${headers.join(" | ")} |`,
    `| ${aligns.map(alignSep).join(" | ")} |`,
    ...rows.map(row => `| ${row.join(" | ")} |`),
  ].join("\n");

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="p-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1">
                      <input value={h} onChange={e => updateHeader(ci, e.target.value)}
                        className="flex-1 min-w-[80px] text-sm border border-[var(--border)] rounded px-2 py-1 bg-[var(--surface)] text-[var(--text)] font-semibold focus:outline-none focus:border-brand-400" />
                      {cols > 1 && <button onClick={() => removeCol(ci)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>}
                    </div>
                    <select value={aligns[ci]} onChange={e => updateAlign(ci, e.target.value as Align)}
                      className="text-xs border border-[var(--border)] rounded px-1 py-0.5 bg-[var(--surface)] text-[var(--text-muted)] focus:outline-none">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </th>
              ))}
              <th className="p-1">
                <button onClick={addCol} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-0.5 whitespace-nowrap"><Plus size={12} />Col</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="p-1">
                    <input value={cell} onChange={e => updateCell(ri, ci, e.target.value)}
                      className="w-full min-w-[80px] text-sm border border-[var(--border)] rounded px-2 py-1 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400" />
                  </td>
                ))}
                <td className="p-1">
                  {rows.length > 1 && <button onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600"><Trash2 size={12} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} className="btn-secondary text-sm flex items-center gap-1"><Plus size={14} />Add Row</button>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-[var(--text-muted)]">Markdown Output</label>
          <div onClick={() => trackTaskComplete("markdown-table-generator", startTime)}><CopyButton text={markdown} /></div>
        </div>
        <textarea className="textarea font-mono text-sm min-h-[120px]" value={markdown} readOnly />
      </div>
    </div>
  );
}
