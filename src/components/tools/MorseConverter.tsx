"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

const MORSE: Record<string, string> = {
  A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..",
  "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----.",
  ".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--","/":"-..-.","@":".--.-.","&":".-...","=":"-...-","+":".-.-.",
};
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export default function MorseConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  let output = "";
  if (mode === "encode") {
    output = input.toUpperCase().split("").map(c => c === " " ? "/" : (MORSE[c] ?? "?")).join(" ");
  } else {
    output = input.trim().split(" / ").map(word =>
      word.split(" ").map(code => REVERSE[code] ?? "?").join("")
    ).join(" ");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("encode")} className={mode === "encode" ? "btn-primary" : "btn-secondary"}>Text → Morse</button>
        <button onClick={() => setMode("decode")} className={mode === "decode" ? "btn-primary" : "btn-secondary"}>Morse → Text</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">{mode === "encode" ? "Text" : "Morse code (use / for word breaks)"}</label>
          <textarea className="textarea min-h-[180px]" placeholder={mode === "encode" ? "Hello World" : ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."} value={input} onChange={e => setInput(e.target.value)} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[var(--text-muted)]">{mode === "encode" ? "Morse code" : "Text"}</label>
            <CopyButton text={output} />
          </div>
          <textarea className="textarea min-h-[180px]" readOnly value={output} />
        </div>
      </div>
    </div>
  );
}
