import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — ToolBrigade",
  description: "Get in touch. Report bugs, suggest tools, or ask questions about ToolBrigade.",
  alternates: { canonical: "https://toolbrigade.com/contact" },
  openGraph: {
    title: "Contact — ToolBrigade",
    description: "Get in touch. Report bugs, suggest tools, or ask questions.",
    url: "https://toolbrigade.com/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact ToolBrigade" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — ToolBrigade",
    description: "Get in touch. Report bugs, suggest tools, or ask questions.",
    images: ["/og-image.png"],
  },
};

export default function ContactPage() {
  return (
    <div>
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <nav className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-2">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[var(--text)]">Contact</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left — info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] tracking-tight mb-6 leading-tight">
                Get in touch
              </h1>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-10">
                Pick the right channel on the right. I check these regularly and reply as fast as I can — usually within a day or two.
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-[var(--text)] mb-1">Response time</p>
                  <p className="text-sm text-[var(--text-muted)]">Usually within 1–2 days. Bugs get priority.</p>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text)] mb-1">Before you write</p>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    Many questions are already answered in the Help Center. Check there first — you might get an instant answer.
                  </p>
                  <Link href="/help" className="text-sm text-[var(--brand)] hover:underline inline-flex items-center gap-1">
                    Visit Help Center <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text)] mb-1">Have a tool idea?</p>
                  <p className="text-sm text-[var(--text-muted)] mb-3">
                    Use the suggestion form — it&apos;s faster and easier than email.
                  </p>
                  <Link href="/suggest-tool" className="text-sm text-[var(--brand)] hover:underline inline-flex items-center gap-1">
                    Suggest a tool <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right — contact options */}
            <div className="space-y-px border border-[var(--border)] rounded-xl overflow-hidden">
              {[
                {
                  title: "General support",
                  desc: "Questions about using a tool or the site.",
                  href: "mailto:support@toolbrigade.com",
                  label: "support@toolbrigade.com",
                },
                {
                  title: "Bug reports",
                  desc: "Found something broken? Tell me what happened, what browser you're on, and what you were trying to do.",
                  href: "mailto:bugs@toolbrigade.com",
                  label: "bugs@toolbrigade.com",
                },
                {
                  title: "Suggest a tool",
                  desc: "Have an idea for something that should exist here?",
                  href: "/suggest-tool",
                  label: "Use the suggestion form →",
                },
                {
                  title: "Business enquiries",
                  desc: "Partnerships, press, or anything else.",
                  href: "mailto:hello@toolbrigade.com",
                  label: "hello@toolbrigade.com",
                },
              ].map((opt) => (
                <div key={opt.title} className="bg-[var(--bg-card)] px-6 py-6 group">
                  <p className="font-semibold text-[var(--text)] text-sm mb-1">{opt.title}</p>
                  <p className="text-sm text-[var(--text-muted)] mb-3 leading-relaxed">{opt.desc}</p>
                  <a href={opt.href} className="text-sm text-[var(--brand)] hover:underline font-medium">
                    {opt.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
