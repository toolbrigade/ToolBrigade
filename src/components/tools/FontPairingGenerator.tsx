"use client";
import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

type Pairing = { heading: string; body: string; headingUrl: string; bodyUrl: string; tag: string };

const PAIRINGS: Pairing[] = [
  { heading: "Playfair Display", body: "Source Sans 3", headingUrl: "Playfair+Display:wght@700", bodyUrl: "Source+Sans+3:wght@400;600", tag: "Editorial" },
  { heading: "Montserrat", body: "Merriweather", headingUrl: "Montserrat:wght@700;800", bodyUrl: "Merriweather:wght@400;700", tag: "Classic" },
  { heading: "Raleway", body: "Lato", headingUrl: "Raleway:wght@700;800", bodyUrl: "Lato:wght@400;700", tag: "Modern" },
  { heading: "Oswald", body: "Open Sans", headingUrl: "Oswald:wght@600;700", bodyUrl: "Open+Sans:wght@400;600", tag: "Bold" },
  { heading: "Nunito", body: "Nunito Sans", headingUrl: "Nunito:wght@700;800", bodyUrl: "Nunito+Sans:wght@400;600", tag: "Friendly" },
  { heading: "Poppins", body: "Inter", headingUrl: "Poppins:wght@600;700", bodyUrl: "Inter:wght@400;500", tag: "Tech" },
  { heading: "Libre Baskerville", body: "Libre Franklin", headingUrl: "Libre+Baskerville:wght@700", bodyUrl: "Libre+Franklin:wght@400;500", tag: "Newspaper" },
  { heading: "Josefin Sans", body: "Josefin Slab", headingUrl: "Josefin+Sans:wght@600;700", bodyUrl: "Josefin+Slab:wght@400", tag: "Geometric" },
  { heading: "Cormorant Garamond", body: "Proza Libre", headingUrl: "Cormorant+Garamond:wght@600;700", bodyUrl: "Proza+Libre:wght@400;500", tag: "Luxury" },
  { heading: "Space Grotesk", body: "Space Mono", headingUrl: "Space+Grotesk:wght@600;700", bodyUrl: "Space+Mono:wght@400", tag: "Developer" },
];

const SAMPLE_HEADING = "The quick brown fox";
const SAMPLE_BODY = "Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. Good font pairing creates visual hierarchy and improves readability.";

export default function FontPairingGenerator() {
  const [selected, setSelected] = useState(0);
  const [customHeading, setCustomHeading] = useState(SAMPLE_HEADING);
  const [customBody, setCustomBody] = useState(SAMPLE_BODY);
  const [copied, setCopied] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const p = PAIRINGS[selected];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${p.headingUrl}&family=${p.bodyUrl}&display=swap`;
    document.head.appendChild(link);
    document.fonts.ready.then(() => setFontsLoaded(s => new Set(Array.from(s).concat(selected))));
    return () => link.remove();
  }, [selected]);

  const p = PAIRINGS[selected];
  const embedCode = `<!-- Google Fonts: ${p.heading} + ${p.body} -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${p.headingUrl}&family=${p.bodyUrl}&display=swap" rel="stylesheet">`;

  function copy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl text-xs text-blue-800 dark:text-blue-300">
        Fonts provided by <a href="https://fonts.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Fonts</a> (SIL Open Font License). Embed code uses the Google Fonts API.
      </div>

      <div>
        <label className="text-xs text-[var(--text-muted)] mb-2 block">Choose a pairing</label>
        <div className="flex flex-wrap gap-2">
          {PAIRINGS.map((pair, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected === i ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300" : "border-[var(--border)] text-[var(--text)]"}`}
            >
              {pair.heading} + {pair.body}
              <span className="ml-1 opacity-60">({pair.tag})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Heading text</label>
          <input className="input" value={customHeading} onChange={e => setCustomHeading(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-[var(--text-muted)] mb-1 block">Body text</label>
          <input className="input" value={customBody} onChange={e => setCustomBody(e.target.value)} />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-[var(--bg-subtle)] rounded-xl p-6 border border-[var(--border)] space-y-3">
        <div className="text-xs text-[var(--text-muted)] mb-2">
          <strong>{p.heading}</strong> (heading) + <strong>{p.body}</strong> (body) — {p.tag}
        </div>
        <h2 style={{ fontFamily: `'${p.heading}', serif`, fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: "var(--text)" }}>
          {customHeading}
        </h2>
        <p style={{ fontFamily: `'${p.body}', sans-serif`, fontSize: 16, lineHeight: 1.7, color: "var(--text-muted)" }}>
          {customBody}
        </p>
      </div>

      {/* Embed code */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs text-[var(--text-muted)]">Google Fonts embed code</label>
          <button onClick={copy} className="btn-secondary flex items-center gap-1 text-xs py-1 px-2">
            <Copy size={12} />{copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="bg-[var(--bg-subtle)] rounded-xl p-4 text-xs font-mono text-[var(--text)] overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
      </div>
    </div>
  );
}
