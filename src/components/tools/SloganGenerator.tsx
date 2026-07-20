"use client";
import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

const adjectives = ["Bold","Bright","Clear","Clean","Crisp","Dynamic","Effortless","Elegant","Fast","Fresh","Genuine","Global","Honest","Innovative","Inspired","Intelligent","Limitless","Modern","Powerful","Pure","Reliable","Sharp","Simple","Smart","Strong","Swift","True","Trusted","Unique","Vibrant","Visionary","Vital","Wise","World-class","Agile","Authentic","Brilliant","Capable","Confident","Creative","Dedicated","Dependable","Driven","Effective","Efficient","Empowered","Energetic","Exceptional","Expert","Fearless","Flexible","Focused","Forward","Groundbreaking","Impactful","Inclusive","Inspired","Intuitive","Lean","Meaningful","Mindful","Next-level","Nimble","Open","Optimized","Passionate","Pioneering","Precise","Progressive","Proven","Purposeful","Quality","Resilient","Responsive","Revolutionary","Robust","Scalable","Seamless","Secure","Sleek","Sophisticated","Streamlined","Sustainable","Transparent","Transformative","Unmatched","Unstoppable","Versatile","Winning"];

const actions = ["Build","Connect","Create","Deliver","Design","Drive","Elevate","Empower","Enable","Evolve","Forge","Fuel","Grow","Guide","Ignite","Inspire","Launch","Lead","Leverage","Make","Move","Power","Reach","Reimagine","Reinvent","Rise","Scale","Shape","Simplify","Solve","Spark","Succeed","Think","Transform","Unlock","Unleash","Accelerate","Achieve","Activate","Advance","Amplify","Boost","Catalyze","Champion","Change","Craft","Define","Develop","Discover","Disrupt","Engage","Enhance","Establish","Excel","Execute","Expand","Explore","Facilitate","Focus","Harness","Help","Improve","Innovate","Integrate","Invest","Maximize","Mobilize","Motivate","Navigate","Optimize","Organize","Perform","Pioneer","Plan","Prioritize","Produce","Progress","Promote","Protect","Provide","Push","Realize","Redefine","Refresh","Reinforce","Renew","Reshape","Restore","Rethink","Revitalize","Reward","Serve","Strengthen","Support","Sustain","Unite","Uplift","Validate","Venture","Win"];

const benefits = ["the future","your potential","your vision","your goals","your business","your brand","your team","your customers","your world","your success","your growth","your impact","your journey","your story","your legacy","your dreams","your ideas","your strategy","your advantage","your edge","what matters","what's possible","what's next","the difference","the way forward","the path ahead","the standard","the experience","the outcome","the result","the change","the moment","the opportunity","the challenge","the solution","the answer","the question","the conversation","the connection","the community","the culture","the movement","the mission","the vision","the purpose","the promise","the potential","the power","the performance","the process","the product","the platform","the partnership","the people","the planet","the progress","the future you deserve","a better tomorrow","a smarter way","a new standard","a lasting impact","a world of possibilities","a competitive edge","a stronger foundation","a clearer path","a brighter future","a simpler solution","a bolder approach","a fresher perspective","a deeper connection","a higher standard","a greater purpose","a wider reach","a faster pace","a smarter choice","a better experience","a stronger brand","a clearer vision","a bolder future","a simpler world","a smarter tomorrow","a better way to work","a new way forward","a fresh start","a bold new chapter","a smarter approach","a better outcome","a stronger result","a clearer direction","a bolder strategy","a simpler process","a smarter system","a better platform","a stronger network","a clearer message","a bolder brand","a simpler interface","a smarter workflow","a better product","a stronger team","a clearer goal","a bolder mission","a simpler path","a smarter solution","a better future","a stronger vision","a clearer purpose","a bolder impact","a simpler journey","a smarter strategy","a better world","a stronger community","a clearer story","a bolder legacy","a simpler experience","a smarter platform","a better connection","a stronger foundation","a clearer advantage","a bolder edge","a simpler way","a smarter future","a better tomorrow","a stronger today","a clearer now","a bolder here","a simpler there","a smarter everywhere"];

const templates = [
  (a: string, v: string, b: string) => `${a}. ${v} ${b}.`,
  (a: string, v: string, b: string) => `${v} ${b} — ${a.toLowerCase()}.`,
  (a: string, v: string, b: string) => `${a} solutions. ${v} ${b}.`,
  (a: string, v: string, b: string) => `We ${v.toLowerCase()} ${b}.`,
  (a: string, v: string, b: string) => `${v} ${b} with ${a.toLowerCase()} precision.`,
  (a: string, v: string, b: string) => `${a}. Proven. ${v} ${b}.`,
  (a: string, v: string, b: string) => `${v} ${b}. Stay ${a.toLowerCase()}.`,
  (a: string, v: string, b: string) => `${a} thinking. ${v} ${b}.`,
  (a: string, v: string, b: string) => `${v} ${b} — the ${a.toLowerCase()} way.`,
  (a: string, v: string, b: string) => `${a} by design. ${v} ${b}.`,
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function genSlogans(n: number): string[] {
  return Array.from({ length: n }, () => {
    const a = pick(adjectives);
    const v = pick(actions);
    const b = pick(benefits);
    return pick(templates)(a, v, b);
  });
}

export default function SloganGenerator() {
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    setResults(genSlogans(Math.min(30, Math.max(1, count))));
  }

  function copyAll() {
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Template-based wordplay combining adjective, action, and benefit word banks. Use as creative brainstorming starting points — not AI-generated copy.
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs text-[var(--text-muted)] whitespace-nowrap">Count (1–30)</label>
        <input type="number" min={1} max={30} value={count} onChange={e => setCount(+e.target.value)} className="input w-24" />
        <button onClick={generate} className="btn-primary flex items-center gap-2"><RefreshCw size={14} />Generate</button>
      </div>
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-muted)]">{results.length} tagline ideas</span>
            <button onClick={copyAll} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Copy size={12} />{copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <div className="space-y-1.5">
            {results.map((r, i) => (
              <div key={i} className="bg-[var(--bg-subtle)] rounded-lg px-3 py-2 flex justify-between items-center gap-2">
                <span className="text-sm text-[var(--text)] italic">&quot;{r}&quot;</span>
                <button onClick={() => navigator.clipboard.writeText(r)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline shrink-0">Copy</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
