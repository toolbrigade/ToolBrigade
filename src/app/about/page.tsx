import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools, categories } from "@/config/tools";

export const metadata: Metadata = {
  title: "About ToolBrigade — Free Browser-Based Tools",
  description:
    "ToolBrigade is a solo-built collection of free browser-based tools. No signups, no uploads, no ads. Built by one developer, adding tools regularly.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about` },
  openGraph: {
    title: "About ToolBrigade",
    description: "Free browser-based tools. No signups, no uploads, no ads.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About ToolBrigade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ToolBrigade",
    description: "Free browser-based tools. No signups, no uploads, no ads.",
    images: ["/og-image.png"],
  },
};

export default function AboutPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ToolBrigade",
    url: "https://toolbrigade.com",
    logo: "https://toolbrigade.com/logo.png",
    description: "A solo-built collection of free browser-based tools for developers, designers, and creators.",
    founder: { "@type": "Person", name: "AbdulRaheem" },
    sameAs: [],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      {/* ── Hero ── */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--text)]">About</span>
          </nav>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] tracking-tight mb-6 leading-tight">
                Built by one person.<br />Used by everyone.
              </h1>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed">
                ToolBrigade is a free collection of browser-based utilities. No accounts, no uploads, no ads. Just tools that work — built because the alternatives were genuinely bad.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
              {[
                { value: `${tools.length}+`, label: "Free tools" },
                { value: `${categories.length}`, label: "Categories" },
                { value: "100%", label: "Browser-based" },
                { value: "0", label: "Servers touched" },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--bg-card)] px-6 py-7 text-center">
                  <p className="text-3xl font-bold text-[var(--text)] mb-1">{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-6">Why this exists</h2>
              <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
                <p>
                  Most tool sites are genuinely bad. You search for something simple — convert a PNG, format some JSON, generate a QR code — and you get: a cookie banner, an ad that covers the page, a forced account signup, and then your file gets uploaded to a server you&apos;ve never heard of. For a PNG conversion.
                </p>
                <p>
                  Modern browsers can handle all of this locally. Image compression, PDF manipulation, QR generation, JSON formatting — none of it needs a server. It&apos;s just JavaScript.
                </p>
                <p>
                  So I built ToolBrigade around that: everything runs in your browser, nothing leaves your device, no account required. It&apos;s a straightforward fix to an annoying problem.
                </p>
              </div>
            </div>
            <div className="space-y-6 md:pt-2">
              {[
                {
                  title: "Privacy first",
                  body: "Your files, text, and data never touch any server — because there's no processing server. What you do here stays on your device.",
                },
                {
                  title: "No friction",
                  body: "No account, no signup, no email. Open a tool and use it. That's the whole experience.",
                },
                {
                  title: "Actually free",
                  body: "Not free-trial free. Not free-with-limits free. Just free. No paywall, no premium tier for basic features.",
                },
                {
                  title: "Built with care",
                  body: "Tools don't get added just to inflate a count. Every tool has a clean UI and real use cases in mind.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-px bg-[var(--brand)] shrink-0 mt-1 rounded-full" />
                  <div>
                    <p className="font-semibold text-[var(--text)] mb-1">{item.title}</p>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Builder note ── */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--text)] mb-5">Who built this</h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                Just me — one developer. Not a team, not a startup, not a product with a roadmap and a funding announcement. I built it because I needed it, and I keep improving it because people use it.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                I add tools when I build them or when someone suggests something worth adding. No roadmap theatre. No &ldquo;coming soon&rdquo; pages for features that never ship.
              </p>
            </div>
            <div className="card border-[var(--border)] p-8 flex flex-col gap-4">
              <p className="text-[var(--text-muted)] text-sm italic leading-relaxed">
                &ldquo;I got tired of Googling a simple tool, landing on a site that wants my email, shows me three ads, and then uploads my file to some random server in Ohio. For a Base64 decode. Come on.&rdquo;
              </p>
              <div className="h-px bg-[var(--border)]" />
              <p className="text-xs text-[var(--text-subtle)]">— The developer, probably at 2am</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex flex-wrap gap-3">
            <Link href="/tools" className="btn-primary">
              Explore all {tools.length} tools <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="btn-secondary">Get in touch</Link>
            <Link href="/suggest-tool" className="btn-secondary">Suggest a tool</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
