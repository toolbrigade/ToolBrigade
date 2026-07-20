"use client";
import { useState } from "react";
import { Copy, Download, Plus, Trash2 } from "lucide-react";

type FieldType = "name" | "email" | "id" | "date" | "boolean" | "phone" | "number" | "word" | "sentence";

interface Field { key: string; type: FieldType; }

const firstNames = ["Alice","Bob","Carol","David","Emma","Frank","Grace","Henry","Iris","Jack","Kate","Liam","Mia","Noah","Olivia","Paul","Quinn","Rose","Sam","Tara","Uma","Victor","Wendy","Xander","Yara","Zoe"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Young","Walker"];
const domains = ["gmail.com","yahoo.com","outlook.com","hotmail.com","example.com","test.com","mail.com","proton.me","icloud.com","fastmail.com"];
const words = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function genValue(type: FieldType): string | number | boolean {
  switch (type) {
    case "name": return `${pick(firstNames)} ${pick(lastNames)}`;
    case "email": {
      const fn = pick(firstNames).toLowerCase();
      const ln = pick(lastNames).toLowerCase();
      return `${fn}.${ln}${randInt(1, 99)}@${pick(domains)}`;
    }
    case "id": return `${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    case "date": {
      const d = new Date(Date.now() - randInt(0, 365 * 5) * 86400000);
      return d.toISOString().split("T")[0];
    }
    case "boolean": return Math.random() > 0.5;
    case "phone": return `+1-${randInt(200,999)}-${randInt(100,999)}-${randInt(1000,9999)}`;
    case "number": return randInt(1, 10000);
    case "word": return pick(words);
    case "sentence": return Array.from({ length: randInt(5, 12) }, () => pick(words)).join(" ") + ".";
    default: return "";
  }
}

const fieldTypes: FieldType[] = ["name","email","id","date","boolean","phone","number","word","sentence"];

export default function FakeDataGenerator() {
  const [fields, setFields] = useState<Field[]>([
    { key: "id", type: "id" },
    { key: "name", type: "name" },
    { key: "email", type: "email" },
    { key: "date", type: "date" },
    { key: "active", type: "boolean" },
  ]);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function addField() {
    setFields(f => [...f, { key: `field${f.length + 1}`, type: "name" }]);
  }
  function removeField(i: number) {
    setFields(f => f.filter((_, idx) => idx !== i));
  }
  function updateField(i: number, patch: Partial<Field>) {
    setFields(f => f.map((field, idx) => idx === i ? { ...field, ...patch } : field));
  }

  function generate() {
    const n = Math.min(100, Math.max(1, count));
    const data = Array.from({ length: n }, () => {
      const obj: Record<string, unknown> = {};
      fields.forEach(f => { obj[f.key || "field"] = genValue(f.type); });
      return obj;
    });
    setOutput(JSON.stringify(data, null, 2));
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([output], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fake-data.json";
    a.click();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--text-muted)]">Fields</span>
          <button onClick={addField} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2"><Plus size={12} />Add field</button>
        </div>
        {fields.map((f, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              className="input flex-1 text-sm"
              placeholder="field name"
              value={f.key}
              onChange={e => updateField(i, { key: e.target.value })}
            />
            <select className="input w-32 text-sm" value={f.type} onChange={e => updateField(i, { type: e.target.value as FieldType })}>
              {fieldTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => removeField(i)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--text-muted)] whitespace-nowrap">Records (1–100)</label>
        <input type="number" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)} className="input w-24" />
        <button onClick={generate} className="btn-primary">Generate JSON</button>
      </div>
      {output && (
        <div className="space-y-2">
          <div className="flex gap-2 justify-end">
            <button onClick={copyOutput} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Copy size={12} />{copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={download} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Download size={12} />Download JSON
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="input font-mono text-xs h-64 resize-none"
          />
        </div>
      )}
    </div>
  );
}
