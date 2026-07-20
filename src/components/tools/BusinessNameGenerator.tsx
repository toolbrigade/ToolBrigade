"use client";
import { useState } from "react";
import { RefreshCw, Copy } from "lucide-react";

const industries: Record<string, { prefixes: string[]; suffixes: string[] }> = {
  Tech: {
    prefixes: ["Algo","Apex","Arc","Axon","Bit","Byte","Cloud","Code","Core","Cyber","Data","Dev","Digital","Edge","Flux","Grid","Hack","Hub","Hyper","Infra","Intel","Ion","Kilo","Layer","Logic","Loop","Mesh","Meta","Micro","Nano","Net","Node","Nova","Omni","Open","Orbit","Pixel","Proto","Pulse","Quantum","Rapid","Relay","Root","Scale","Signal","Smart","Soft","Stack","Stream","Sync","Sys","Tech","Tensor","Turbo","Ultra","Vector","Vertex","Vibe","Volt","Wave","Web","Wire","Xero","Zap","Zero"],
    suffixes: ["AI","Analytics","Apps","Automation","Base","Bit","Bot","Bridge","Cast","Chain","Cloud","Code","Core","Data","Dev","Digital","Dynamics","Edge","Engine","Flow","Force","Forge","Grid","Hub","Infra","Intel","IO","IQ","Labs","Layer","Link","Logic","Loop","Matrix","Mesh","Mind","Net","Node","Ops","OS","Path","Platform","Point","Portal","Pro","Protocol","Pulse","Route","Scale","Sense","Signal","Smart","Soft","Solutions","Source","Space","Stack","Stream","Studio","Suite","Sync","Systems","Tech","Tools","Track","Vault","Vision","Wave","Works","X"],
  },
  Finance: {
    prefixes: ["Accel","Apex","Asset","Atlas","Aura","Avant","Beacon","Bold","Bridge","Capital","Crest","Crown","Delta","Eagle","Elite","Empire","Equi","Equity","Excel","First","Forte","Fortune","Frontier","Global","Gold","Grand","Growth","Harbor","Haven","Heritage","High","Horizon","Impact","Insight","Integral","Keystone","Legacy","Liberty","Lighthouse","Lion","Lux","Magnolia","Meridian","Metro","Milestone","Momentum","Nexus","Noble","North","Onyx","Optimal","Orion","Paramount","Peak","Pinnacle","Pioneer","Platinum","Premier","Prime","Principal","Prism","Prosper","Provident","Prudent","Quantum","Regal","Reliable","Resolute","Ridge","Rise","Rock","Royal","Sage","Secure","Shield","Silver","Solid","Sovereign","Sterling","Summit","Superior","Titan","Triumph","True","Trust","United","Valor","Venture","Vesta","Victory","Vigilant","Vision","Vital","Wealth","Wise","Zenith"],
    suffixes: ["Advisors","Alliance","Asset","Associates","Capital","Consulting","Equity","Finance","Financial","Fund","Group","Holdings","Invest","Investments","Management","Markets","Partners","Portfolio","Solutions","Trust","Ventures","Wealth"],
  },
  Health: {
    prefixes: ["Aero","Align","Apex","Balance","Bio","Bloom","Body","Bright","Care","Clear","Core","Cure","Derm","Endo","Equi","Fit","Flex","Flow","Fresh","Glow","Green","Heal","Health","Heart","Hemo","Herbal","Holistic","Hydro","Immuno","Integra","Kine","Life","Light","Lively","Lumina","Medic","Mend","Mind","Nano","Neuro","Nourish","Nutra","Nutri","Onco","Optima","Ortho","Osteo","Physio","Pulse","Pure","Radiant","Regen","Renew","Restore","Revive","Rheum","Sano","Serenity","Slim","Soma","Soothe","Thrive","Tonic","Total","Tranquil","Trim","Veda","Vibe","Vital","Vitality","Vivid","Well","Wellness","Whole","Zen","Zest"],
    suffixes: ["Care","Center","Clinic","Diagnostics","Health","Healthcare","Institute","Labs","Life","Medical","Medicine","Pharma","Pharmacy","Plus","Practice","Sciences","Solutions","Therapeutics","Therapy","Wellness"],
  },
  Creative: {
    prefixes: ["Artisan","Atelier","Avant","Bold","Bright","Canvas","Craft","Create","Creative","Design","Dream","Dwell","Ember","Flair","Flash","Form","Frame","Fresh","Fusion","Glow","Hue","Idea","Imagine","Indie","Inspire","Iris","Jade","Kaleid","Lumen","Luxe","Make","Muse","Neo","Novel","Palette","Pixel","Prism","Pure","Radiant","Raw","Render","Rise","Sage","Shape","Shift","Sketch","Spark","Splash","Studio","Style","Sublime","Surge","Tint","Tone","Trend","True","Unique","Vibe","Vivid","Wave","Wild","Zen","Zest"],
    suffixes: ["Agency","Art","Arts","Atelier","Brand","Branding","Co","Collective","Creative","Design","Digital","Films","Gallery","Group","House","Lab","Labs","Media","Productions","Projects","Publishing","Studio","Studios","Works"],
  },
  Food: {
    prefixes: ["Artisan","Bake","Barrel","Batch","Bay","Bean","Bistro","Bite","Blend","Bloom","Bold","Brew","Bright","Broth","Butter","Cafe","Cask","Cedar","Chef","Cider","Citrus","Clay","Clean","Craft","Crisp","Crop","Crust","Deli","Dew","Dish","Dough","Ember","Farm","Feast","Field","Fire","Flavor","Fresh","Garden","Grain","Graze","Green","Grill","Grove","Harvest","Hearth","Herb","Hive","Honey","Hops","Kettle","Kitchen","Knead","Leaf","Lemon","Local","Loft","Maple","Market","Meadow","Mill","Mint","Miso","Mortar","Nourish","Oak","Olive","Orchard","Organic","Oven","Pantry","Pasture","Peel","Pepper","Pickle","Pine","Plum","Press","Pure","Ripe","Root","Rustic","Sage","Salt","Seed","Silo","Smoke","Soil","Spice","Spring","Stone","Sun","Sweet","Table","Thyme","Toast","Vine","Wild","Wood","Yeast","Zest"],
    suffixes: ["Bakery","Bar","Bistro","Bites","Blend","Brew","Brewing","Cafe","Catering","Co","Collective","Creamery","Deli","Eats","Farm","Farms","Foods","Garden","Grill","Grove","House","Kitchen","Market","Mill","Pantry","Provisions","Roasters","Table","Tavern","Works"],
  },
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function genNames(industry: string, n: number): string[] {
  const data = industries[industry] || industries.Tech;
  return Array.from({ length: n }, () => `${pick(data.prefixes)}${pick(data.suffixes)}`);
}

export default function BusinessNameGenerator() {
  const [industry, setIndustry] = useState("Tech");
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    setResults(genNames(industry, Math.min(30, Math.max(1, count))));
  }

  function copyAll() {
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--text-muted)]">Industry</label>
          <select className="input mt-1" value={industry} onChange={e => setIndustry(e.target.value)}>
            {Object.keys(industries).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)]">Count (1–30)</label>
          <input type="number" min={1} max={30} value={count} onChange={e => setCount(+e.target.value)} className="input mt-1" />
        </div>
        <div className="flex items-end">
          <button onClick={generate} className="btn-primary w-full flex items-center justify-center gap-2"><RefreshCw size={14} />Generate</button>
        </div>
      </div>
      {results.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[var(--text-muted)]">{results.length} name ideas</span>
            <button onClick={copyAll} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
              <Copy size={12} />{copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {results.map((r, i) => (
              <div key={i} className="bg-[var(--bg-subtle)] rounded-lg px-3 py-2 flex justify-between items-center">
                <span className="text-sm font-medium text-[var(--text)]">{r}</span>
                <button onClick={() => navigator.clipboard.writeText(r)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline ml-2">Copy</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
