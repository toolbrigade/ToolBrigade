import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  FileText, Code2, Image, FileDown, Wrench, Sparkles,
} from "lucide-react";
import { tools, categories } from "@/config/tools";
import ToolCard from "@/components/ToolCard";
import HomeSearch from "./HomeSearch";

const AllToolsSection = dynamic(() => import("./AllToolsSection"), { ssr: false });

export const metadata: Metadata = {
  title: "ToolBrigade — Free Online Tools for Developers & Creators",
  description: `${tools.length}+ free browser-based tools for text, images, PDFs, code, and conversions. No sign-up, no uploads, instant results.`,
  keywords: [
    "free online tools", "developer tools", "image tools", "pdf tools",
    "text tools", "code tools", "converter tools", "browser tools", "toolbrigade",
  ],
  alternates: { canonical: "https://toolbrigade.com" },
  openGraph: {
    title: "ToolBrigade — Free Online Tools for Developers & Creators",
    description: `${tools.length}+ free browser-based tools. No sign-up required.`,
    url: "https://toolbrigade.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade — Free Online Tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolBrigade — Free Online Tools for Developers & Creators",
    description: `${tools.length}+ free browser-based tools. No sign-up required.`,
    images: ["/og-image.png"],
  },
};

const categoryMeta: Record<string, { icon: React.ElementType; count: number }> = {
  Text:      { icon: FileText, count: 21 },
  Code:      { icon: Code2,    count: 14 },
  Converter: { icon: Wrench,   count: 15 },
  Image:     { icon: Image,    count: 20 },
  PDF:       { icon: FileDown, count: 12 },
  Utilities: { icon: Sparkles, count: 10 },
};

const featuredSlugs = [
  "word-counter",
  "case-converter",
  "json-formatter",
  "base64-encoder",
  "url-encoder",
  "px-to-rem",
  "color-converter",
  "image-resizer",
];
const featuredTools = featuredSlugs
  .map((slug) => tools.find((t) => t.slug === slug))
  .filter(Boolean) as typeof tools;

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ToolBrigade",
  url: "https://toolbrigade.com",
  description: "Free browser-based tools for text, images, PDFs, code, and conversions.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://toolbrigade.com/tools?category={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(var(--text) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-20 md:pt-28 pb-10 text-center">
          <p className="section-label mb-5">{tools.length}+ free browser tools</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-[var(--text)] mb-6 leading-[1.05]">
            Browser tools that<br className="hidden sm:block" />{" "}
            just <span className="text-[var(--brand)]">work.</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
            {tools.length}+ free utilities for text, images, PDFs, code, and conversions. No signup, no uploads to random servers, no &ldquo;start your free trial.&rdquo; Runs in your browser. Free forever.
          </p>
          <HomeSearch />
          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link href="/tools" className="btn-primary">
              Browse All Tools <ArrowRight size={16} strokeWidth={1.75} />
            </Link>
            <Link href="/about" className="btn-secondary">
              Learn more about ToolBrigade
            </Link>
          </div>

          {/* Category quick-nav strip */}
          <div className="flex flex-wrap justify-center gap-2 pb-10">
            {categories.map((cat) => {
              const meta = categoryMeta[cat];
              const CatIcon = meta?.icon ?? Wrench;
              const count = tools.filter((t) => t.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/tools/category/${cat.toLowerCase()}`}
                  className="pill pill-inactive inline-flex items-center gap-1.5 text-xs"
                >
                  <CatIcon size={12} strokeWidth={1.75} />
                  {cat}
                  <span className="text-[var(--text-subtle)]">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">

        {/* ── Popular right now ── */}
        <section className="py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Popular right now</h2>
            <Link href="/tools" className="btn-ghost text-sm">
              All tools <ArrowRight size={14} strokeWidth={1.75} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredTools.map((tool) => <ToolCard key={tool.slug} tool={tool} featured />)}
          </div>
        </section>

      </div>

      {/* ── Why this exists ── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div>
              <p className="section-label mb-4">Why this exists</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text)] leading-tight mb-6">
                Most tool sites are a tax on your time.
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                You search for something simple. You get a cookie banner, three ads, a signup wall, and a file upload to a server you&apos;ve never heard of. For a Base64 decode.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed mb-8">
                ToolBrigade runs everything in your browser. Nothing leaves your device. No account, no paywall, no &ldquo;upgrade to pro.&rdquo;
              </p>
              <Link href="/tools" className="btn-primary inline-flex items-center gap-2">
                Browse all {tools.length} tools <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
              {[
                { title: "No account", body: "Open a tool and use it. That's it. No email, no password, no profile." },
                { title: "No uploads", body: "Your files never leave your device. Everything runs locally in the browser." },
                { title: "No paywall", body: "Every tool is free. Not free-trial free. Actually free, forever." },
                { title: "No nonsense", body: "No cookie banners chasing you around. No ads. No dark patterns." },
              ].map((item) => (
                <div key={item.title} className="bg-[var(--bg-card)] px-6 py-6">
                  <p className="font-display font-semibold text-[var(--text)] mb-1.5">{item.title}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4">
        {/* ── All tools by category ── */}
        <AllToolsSection />
      </div>
    </div>
  );
}
