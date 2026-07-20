"use client";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";

const suffixes = ["ster","inator","meister","zilla","bot","man","woman","master","lord","king","queen","ace","pro","guru","ninja","wizard","hero","legend","champ","boss","chief","star","fox","hawk","wolf","bear","lion","tiger","eagle","shark","viper","cobra","panther","jaguar","falcon","raven","phoenix","dragon","knight","ranger","hunter","scout","pilot","captain","commander","general","admiral","senator","president","emperor","sultan","pharaoh","caesar","khan","czar","tsar","kaiser","rex","duke","baron","count","earl","lord","sir","dame","lady","princess","prince","queen","king","emperor","empress","sultan","sultana","pharaoh","pharaoha","caesar","caesara","khan","khana","czar","czarina","tsar","tsarina","kaiser","kaiserin","rex","regina","duke","duchess","baron","baroness","count","countess","earl","countess","lord","lady","sir","dame","princess","prince","queen","king"];

const prefixes = ["super","mega","ultra","hyper","turbo","power","thunder","lightning","shadow","dark","light","bright","fire","ice","storm","wind","earth","water","air","space","cyber","techno","robo","mecha","nano","micro","macro","meta","proto","neo","retro","vintage","classic","modern","future","ancient","eternal","immortal","legendary","mythic","epic","heroic","mighty","strong","swift","quick","fast","slow","big","small","tall","short","fat","thin","old","young","wise","foolish","brave","coward","kind","cruel","gentle","fierce","calm","wild","tame","free","bound","lost","found","hidden","visible","silent","loud","quiet","noisy","clean","dirty","pure","corrupt","holy","evil","good","bad","true","false","real","fake","live","dead","awake","asleep","happy","sad","angry","calm","excited","bored","curious","confused","confident","shy","bold","timid","brave","fearless","reckless","careful","careless","smart","dumb","clever","stupid","wise","foolish","sane","crazy","normal","weird","ordinary","extraordinary","common","rare","simple","complex","easy","hard","soft","rough","smooth","sharp","dull","bright","dark","light","heavy","thin","thick","wide","narrow","long","short","tall","small","big","huge","tiny","giant","dwarf","elf","orc","troll","goblin","gnome","fairy","sprite","pixie","imp","demon","angel","ghost","zombie","vampire","werewolf","witch","wizard","sorcerer","mage","druid","shaman","paladin","ranger","rogue","thief","assassin","warrior","knight","soldier","guard","scout","spy","agent","detective","inspector","officer","captain","commander","general","admiral","senator","president","emperor","sultan","pharaoh","caesar","khan","czar","tsar","kaiser","rex","duke","baron","count","earl","lord","sir","dame","lady","princess","prince","queen","king"];

function genNicknames(name: string): string[] {
  if (!name.trim()) return [];
  const n = name.trim();
  const first = n.split(" ")[0];
  const results: string[] = [];

  // Shortening patterns
  if (first.length > 3) {
    results.push(first.slice(0, 3));
    results.push(first.slice(0, 4));
    results.push(first.slice(0, Math.ceil(first.length / 2)));
  }

  // Suffix addition
  const shortBase = first.slice(0, Math.min(4, first.length));
  const randomSuffixes = suffixes.sort(() => Math.random() - 0.5).slice(0, 4);
  randomSuffixes.forEach(s => results.push(shortBase + s));

  // Prefix addition
  const randomPrefixes = prefixes.sort(() => Math.random() - 0.5).slice(0, 3);
  randomPrefixes.forEach(p => results.push(p + first.toLowerCase()));

  // Letter substitution (e -> 3, a -> 4, o -> 0, i -> 1, s -> 5)
  const leet = first.toLowerCase()
    .replace(/e/g, "3").replace(/a/g, "4").replace(/o/g, "0")
    .replace(/i/g, "1").replace(/s/g, "5");
  if (leet !== first.toLowerCase()) results.push(leet);

  // Doubling last letter
  results.push(first + first[first.length - 1]);

  // Adding "y" or "ie" suffix
  const base = first.replace(/[aeiou]$/i, "");
  results.push(base + "y");
  results.push(base + "ie");
  results.push(base + "ey");

  // Reverse
  results.push(first.split("").reverse().join("").toLowerCase());

  return [...new Set(results)].filter((r: string) => r.length >= 2 && r.length <= 20).slice(0, 16);
}

export default function NicknameGenerator() {
  const [name, setName] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  function generate() {
    setResults(genNicknames(name));
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">Enter a name</label>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="e.g. Alexander"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && generate()}
          />
          <button onClick={generate} className="btn-primary flex items-center gap-2"><RefreshCw size={14} />Generate</button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {results.map((r, i) => (
            <div
              key={i}
              className="bg-[var(--bg-subtle)] rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-[var(--border)] transition-colors"
              onClick={() => { navigator.clipboard.writeText(r); setCopied(r); setTimeout(() => setCopied(""), 1500); }}
            >
              <span className="text-sm font-medium text-[var(--text)]">{r}</span>
              <Copy size={12} className={`ml-1 shrink-0 ${copied === r ? "text-green-500" : "text-[var(--text-muted)]"}`} />
            </div>
          ))}
        </div>
      )}
      {results.length > 0 && <p className="text-xs text-[var(--text-muted)]">Click any nickname to copy it.</p>}
    </div>
  );
}
