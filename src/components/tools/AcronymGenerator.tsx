"use client";
import { useState } from "react";
import { Copy } from "lucide-react";

// Word bank for reverse mode: letter -> word suggestions
const wordBank: Record<string, string[]> = {
  A: ["Advanced","Agile","Automated","Adaptive","Accelerated","Analytical","Authentic","Aligned","Amplified","Actionable"],
  B: ["Bold","Balanced","Breakthrough","Brilliant","Broad","Beneficial","Boundless","Bridging","Building","Boosted"],
  C: ["Creative","Connected","Collaborative","Comprehensive","Cutting-edge","Capable","Centralized","Clear","Consistent","Continuous"],
  D: ["Dynamic","Driven","Dedicated","Distributed","Data-driven","Decisive","Dependable","Diverse","Digital","Disruptive"],
  E: ["Efficient","Empowered","Effective","Evolving","Engaged","Elastic","Elevated","Enabling","Exceptional","Extensible"],
  F: ["Fast","Flexible","Forward","Focused","Functional","Foundational","Fluid","Futuristic","Facilitated","Federated"],
  G: ["Global","Growth","Guided","Grounded","Generative","Goal-oriented","Governed","Genuine","Groundbreaking","Granular"],
  H: ["High-performance","Holistic","Hybrid","Harmonized","Human-centered","Helpful","Horizontal","Hardened","Hosted","Heuristic"],
  I: ["Intelligent","Integrated","Innovative","Inclusive","Impactful","Iterative","Intuitive","Interconnected","Informed","Immersive"],
  J: ["Just-in-time","Joint","Justified","Judicious","Journeyed","Joyful","Juxtaposed","Jurisdictional","Journalistic","Joined"],
  K: ["Knowledge-based","Key","Kinetic","Knowledgeable","Keen","Kernel","Kinematic","Kindred","Knit","Known"],
  L: ["Lean","Layered","Leveraged","Linked","Logical","Lightweight","Localized","Long-term","Latent","Lifecycle"],
  M: ["Modular","Modern","Managed","Measurable","Meaningful","Multi-cloud","Microservices","Mature","Mapped","Maximized"],
  N: ["Next-generation","Networked","Normalized","Native","Nimble","Nuanced","Node-based","Neutral","Navigated","Nested"],
  O: ["Optimized","Open","Orchestrated","Outcome-driven","Operational","Omnichannel","Observable","Organized","Objective","On-demand"],
  P: ["Proactive","Platform","Predictive","Proven","Performant","Portable","Prioritized","Parallel","Persistent","Pluggable"],
  Q: ["Quality","Quantified","Quick","Queued","Qualified","Queryable","Quota-aware","Quantum","Queried","Quotient"],
  R: ["Resilient","Reliable","Responsive","Robust","Real-time","Reusable","Repeatable","Regulated","Refined","Reactive"],
  S: ["Scalable","Secure","Smart","Streamlined","Sustainable","Serverless","Self-healing","Standardized","Structured","Synchronized"],
  T: ["Transparent","Trusted","Transformative","Targeted","Tested","Traceable","Tiered","Tokenized","Tuned","Tactical"],
  U: ["Unified","Universal","User-centric","Upgradeable","Ubiquitous","Utility-based","Unstructured","Uptime","Usable","Unique"],
  V: ["Validated","Versatile","Virtualized","Visible","Value-driven","Versioned","Vetted","Viable","Vigilant","Volumetric"],
  W: ["Well-architected","Workflow","Web-scale","Workload","Wired","Wrapped","Wide","Witnessed","Weighted","Workable"],
  X: ["eXtensible","eXponential","eXpert","eXact","eXclusive","eXpanded","eXecuted","eXplored","eXchanged","eXposed"],
  Y: ["Yield-optimized","Year-round","Yielding","Yoked","Yearned","Yielded","Youthful","Yearlong","Yardstick","Yielded"],
  Z: ["Zero-downtime","Zero-trust","Zoned","Zeal-driven","Zenith","Zero-latency","Zoned","Zeroed","Zealous","Zipped"],
};

export default function AcronymGenerator() {
  const [mode, setMode] = useState<"forward" | "reverse">("forward");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  // Forward: phrase -> acronym
  const acronym = input.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? "").join("");

  // Reverse: letters -> word suggestions
  const letters = input.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const suggestions = letters.map(l => ({
    letter: l,
    words: wordBank[l] || [`(${l}...)`],
  }));

  function copyForward() {
    navigator.clipboard.writeText(acronym);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setMode("forward")} className={mode === "forward" ? "btn-primary" : "btn-secondary"}>Phrase → Acronym</button>
        <button onClick={() => setMode("reverse")} className={mode === "reverse" ? "btn-primary" : "btn-secondary"}>Letters → Words</button>
      </div>

      <div>
        <label className="text-xs text-[var(--text-muted)] mb-1 block">
          {mode === "forward" ? "Enter a phrase (e.g. Artificial Intelligence)" : "Enter letters (e.g. NASA)"}
        </label>
        <input
          className="input"
          placeholder={mode === "forward" ? "Artificial Intelligence" : "NASA"}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>

      {mode === "forward" && acronym && (
        <div className="bg-[var(--bg-subtle)] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Acronym</p>
            <p className="text-3xl font-bold font-mono text-brand-600 dark:text-brand-400">{acronym}</p>
          </div>
          <button onClick={copyForward} className="btn-secondary flex items-center gap-1 text-xs">
            <Copy size={12} />{copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {mode === "reverse" && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)]">Word suggestions per letter:</p>
          {suggestions.map((s, i) => (
            <div key={i} className="bg-[var(--bg-subtle)] rounded-lg p-3">
              <span className="text-lg font-bold font-mono text-brand-600 dark:text-brand-400 mr-3">{s.letter}</span>
              <span className="text-sm text-[var(--text-muted)]">{s.words.slice(0, 5).join(" · ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
