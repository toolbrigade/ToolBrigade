"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function sentence() {
  const len = 8 + Math.floor(Math.random() * 10);
  const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
  return words[0].charAt(0).toUpperCase() + words[0].slice(1) + " " + words.slice(1).join(" ") + ".";
}

function paragraph() {
  return Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sentence).join(" ");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");

  function generate() {
    let text = "";
    if (type === "paragraphs") text = Array.from({ length: count }, paragraph).join("\n\n");
    else if (type === "sentences") text = Array.from({ length: count }, sentence).join(" ");
    else text = Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ");
    setOutput(text);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Count</label>
          <input type="number" min={1} max={50} value={count} className="input mt-1 w-24" onChange={e => setCount(+e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Type</label>
          <select className="input mt-1" value={type} onChange={e => setType(e.target.value as typeof type)}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <button onClick={generate} className="btn-primary">Generate</button>
      </div>
      {output && (
        <>
          <div className="flex justify-end">
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[240px]" readOnly value={output} />
        </>
      )}
    </div>
  );
}
