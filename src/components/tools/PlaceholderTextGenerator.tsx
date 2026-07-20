"use client";
import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

const LOREM_WORDS = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","eu","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];

const PIRATE_WORDS = ["ahoy","matey","shiver","timbers","plunder","treasure","scallywag","landlubber","buccaneer","jolly","roger","starboard","port","crow","nest","anchor","barnacle","bilge","booty","cannon","cutlass","davey","jones","fathom","galleon","gunpowder","harbor","helm","hull","keel","knot","loot","mast","nautical","ocean","parrot","plank","powder","rigging","rum","sail","sea","shanty","ship","skull","crossbones","swab","deck","voyage","waves","wind","yo","ho","ho"];

const HIPSTER_WORDS = ["artisan","craft","organic","sustainable","curated","bespoke","authentic","handcrafted","locally","sourced","small","batch","single","origin","cold","brew","pour","over","kombucha","avocado","toast","vinyl","fixie","bicycle","lumberjack","flannel","beard","wax","mason","jar","reclaimed","wood","exposed","brick","Edison","bulb","rooftop","garden","farm","table","gluten","free","vegan","kale","quinoa","turmeric","matcha","oat","milk","mindful","intentional","narrative","aesthetic","vibe","energy","space","journey","process","hustle","grind","pivot","disrupt","synergy","bandwidth","leverage","ecosystem","paradigm","holistic","wellness","journey"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function genSentence(words: string[]): string {
  const len = 8 + Math.floor(Math.random() * 10);
  const sentence = Array.from({ length: len }, () => pick(words)).join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function genParagraph(words: string[]): string {
  const count = 3 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => genSentence(words)).join(" ");
}

const STYLES = [
  { id: "lorem", label: "Lorem Ipsum", words: LOREM_WORDS },
  { id: "pirate", label: "Pirate Speak", words: PIRATE_WORDS },
  { id: "hipster", label: "Hipster Ipsum", words: HIPSTER_WORDS },
];

const TYPES = ["Paragraphs", "Sentences", "Words"] as const;

export default function PlaceholderTextGenerator() {
  const [styleIdx, setStyleIdx] = useState(0);
  const [type, setType] = useState<typeof TYPES[number]>("Paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const { words } = STYLES[styleIdx];
    const n = Math.min(50, Math.max(1, count));
    let result = "";
    if (type === "Paragraphs") {
      result = Array.from({ length: n }, () => genParagraph(words)).join("\n\n");
    } else if (type === "Sentences") {
      result = Array.from({ length: n }, () => genSentence(words)).join(" ");
    } else {
      result = Array.from({ length: n }, () => pick(words)).join(" ");
    }
    setOutput(result);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Style</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s, i) => (
            <button key={i} onClick={() => setStyleIdx(i)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${styleIdx === i ? "btn-primary" : "btn-secondary"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Type</label>
          <select className="input text-sm" value={type} onChange={e => setType(e.target.value as typeof TYPES[number])}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Count (1–50)</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)} className="input w-24" />
        </div>
        <button onClick={generate} className="btn-primary flex items-center gap-2">
          <RefreshCw size={14} />Generate
        </button>
      </div>
      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-muted)]">{output.split(/\s+/).length} words</span>
            <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Copy size={12} />{copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea className="input h-48 resize-none text-sm" value={output} readOnly />
        </div>
      )}
    </div>
  );
}
