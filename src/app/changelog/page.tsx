import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Zap, Bug, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — ToolBrigade",
  description: "See what's new on ToolBrigade. New tools, improvements, and bug fixes.",
  alternates: { canonical: "https://toolbrigade.com/changelog" },
  openGraph: {
    title: "Changelog — ToolBrigade",
    description: "See what's new on ToolBrigade. New tools, improvements, and bug fixes.",
    url: "https://toolbrigade.com/changelog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade Changelog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog — ToolBrigade",
    description: "See what's new on ToolBrigade. New tools, improvements, and bug fixes.",
    images: ["/og-image.png"],
  },
};

type ChangeType = "new" | "improved" | "fixed" | "performance";

const changelog: {
  version: string;
  date: string;
  changes: { type: ChangeType; text: string }[];
}[] = [
  {
    version: "2.0",
    date: "2026",
    changes: [
      { type: "new", text: "ToolBrigade launched — built by one developer, running entirely in-browser" },
      { type: "new", text: "Complete UI with dark mode, brand design system, global search (Cmd+K)" },
      { type: "new", text: "Full SEO setup — structured data, canonical URLs, OG tags on all pages" },
      { type: "new", text: "Help Center, Changelog, Suggest a Tool, Cookie Policy, and Disclaimer pages" },
      { type: "new", text: "Category icons and color-coded tool cards" },
      { type: "improved", text: "Header with categories dropdown and active page indicators" },
      { type: "improved", text: "Homepage with hero, category pills, and why section" },
      { type: "performance", text: "Dark mode persists across sessions using a cookie (no flash on load)" },
    ],
  },
];

const typeConfig: Record<ChangeType, { icon: React.ElementType; label: string; color: string }> = {
  new: { icon: Sparkles, label: "New", color: "bg-[var(--brand-light)] text-[var(--brand)]" },
  improved: { icon: Zap, label: "Improved", color: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400" },
  fixed: { icon: Bug, label: "Fixed", color: "bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400" },
  performance: { icon: Wrench, label: "Performance", color: "bg-[var(--bg-subtle)] text-[var(--text-muted)]" },
};

export default function ChangelogPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">

      <nav className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Changelog</span>
      </nav>

      <h1 className="font-display text-4xl font-semibold text-[var(--text)] mb-4">Changelog</h1>
      <p className="text-[var(--text-muted)] mb-14">
        Every update, new tool, and fix — in one place.
      </p>

      <div className="space-y-12">
        {changelog.map((release) => (
          <div key={release.version}>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-display text-lg font-semibold text-[var(--text)]">v{release.version}</span>
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                {release.date}
              </span>
            </div>
            <div className="space-y-px border border-[var(--border)] rounded-xl overflow-hidden">
              {release.changes.map((change, i) => {
                const cfg = typeConfig[change.type];
                return (
                  <div key={i} className="bg-[var(--bg-card)] px-5 py-4 flex items-start gap-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${cfg.color}`}>
                      <cfg.icon size={10} />
                      {cfg.label}
                    </span>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{change.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-8">
        <p className="text-sm text-[var(--text-muted)] mb-4">Have an idea for a new tool or feature?</p>
        <Link href="/suggest-tool" className="btn-primary">
          Suggest a tool
        </Link>
      </div>
    </div>
  );
}
