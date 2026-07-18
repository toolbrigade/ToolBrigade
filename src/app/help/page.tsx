import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { tools, categories } from "@/config/tools";

export const metadata: Metadata = {
  title: "Help Center — ToolBrigade",
  description:
    "Answers to common questions about ToolBrigade. How tools work, privacy, offline use, and more.",
  alternates: { canonical: "https://toolbrigade.com/help" },
  openGraph: {
    title: "Help Center — ToolBrigade",
    description: "Answers to common questions about ToolBrigade.",
    url: "https://toolbrigade.com/help",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade Help Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center — ToolBrigade",
    description: "Answers to common questions about ToolBrigade.",
    images: ["/og-image.png"],
  },
};

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. ToolBrigade requires no account, no sign-up, and no email address. Every tool is available immediately.",
  },
  {
    q: "Are the tools really free?",
    a: "Yes, completely free. No hidden fees, no premium tiers for core tools, no credit card required.",
  },
  {
    q: "Is my data safe? Are my files uploaded anywhere?",
    a: "Your data never leaves your device. All tools run entirely in your browser using JavaScript. There are no servers processing your files or text.",
  },
  {
    q: "Do the tools work offline?",
    a: "Once the page has loaded, most tools work without an internet connection. The Currency Converter requires internet to fetch live rates.",
  },
  {
    q: "Why is my browser slow when processing large files?",
    a: "Since processing happens in your browser, very large files (50MB+ images or PDFs) may use significant memory. Try closing other tabs or using a desktop browser for large files.",
  },
  {
    q: "Can I use ToolBrigade on mobile?",
    a: "Yes. ToolBrigade is fully responsive and works on smartphones and tablets. Some tools with complex UIs work best on larger screens.",
  },
  {
    q: "A tool isn't working correctly. What should I do?",
    a: "Try refreshing the page and clearing your browser cache. If the issue persists, contact me with details about your browser, OS, and what you were trying to do.",
  },
  {
    q: "Can I suggest a new tool?",
    a: "Yes. Visit the Suggest a Tool page and describe what you need.",
  },
  {
    q: "How often are new tools added?",
    a: "Regularly. Check the Changelog page to see what's been added recently.",
  },
  {
    q: "Is ToolBrigade open source?",
    a: "ToolBrigade is a proprietary project. Some tools use open-source libraries — these are credited in the tool descriptions.",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">

      <nav className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Help Center</span>
      </nav>

      <h1 className="text-4xl font-bold text-[var(--text)] mb-4">Help Center</h1>
      <p className="text-[var(--text-muted)] leading-relaxed mb-14">
        Answers to common questions. If you can&apos;t find what you need, <Link href="/contact" className="text-[var(--brand)] hover:underline">get in touch</Link>.
      </p>

      {/* Getting started */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-[var(--text)] mb-6">Getting started</h2>
        <div className="space-y-px border border-[var(--border)] rounded-xl overflow-hidden">
          {[
            { n: "1", title: "No setup needed", desc: "Just open toolbrigade.com in any modern browser. No downloads, no extensions, no accounts." },
            { n: "2", title: "Find your tool", desc: `Browse ${categories.length} categories or use the search bar to find the right tool instantly.` },
            { n: "3", title: "Use it immediately", desc: "Click any tool and start working. Results appear instantly as you type or upload." },
            { n: "4", title: "Copy or download your result", desc: "Every tool has a copy button or download option. Your output is ready in seconds." },
          ].map((item) => (
            <div key={item.n} className="bg-[var(--bg-card)] px-6 py-5 flex gap-5">
              <span className="text-2xl font-bold text-[var(--border)] select-none shrink-0 leading-none mt-0.5">{item.n}</span>
              <div>
                <p className="font-semibold text-[var(--text)] text-sm mb-1">{item.title}</p>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Privacy & security</h2>
        <p className="text-[var(--text-muted)] leading-relaxed mb-3">
          <strong className="text-[var(--text)]">Your data never leaves your device.</strong> Every tool runs entirely in your browser using JavaScript. When you upload an image, paste text, or process a PDF — that data is handled locally, not sent to any server.
        </p>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Only anonymous analytics (page views, session data) are collected. No personal information, file contents, or tool outputs are ever collected.
        </p>
        <Link href="/privacy" className="text-sm text-[var(--brand)] hover:underline inline-flex items-center gap-1">
          Read the full Privacy Policy <ArrowRight size={13} />
        </Link>
      </section>

      {/* Browse by category */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-[var(--text)] mb-4">Browse by category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/tools?category=${cat}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--brand)] hover:text-[var(--brand)] text-[var(--text-muted)] text-xs font-medium transition-colors"
              >
                {cat}
                <span className="text-[var(--text-subtle)]">{count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-[var(--text)] mb-6">Frequently asked questions</h2>
        <div className="space-y-px border border-[var(--border)] rounded-xl overflow-hidden">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-[var(--bg-card)] px-6 py-5">
              <p className="font-semibold text-[var(--text)] text-sm mb-2">{faq.q}</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-[var(--border)] pt-8">
        <p className="text-[var(--text-muted)] text-sm mb-4">Still can&apos;t find what you&apos;re looking for?</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-primary">Contact <ArrowRight size={14} /></Link>
          <Link href="/suggest-tool" className="btn-secondary">Suggest a tool</Link>
        </div>
      </div>
    </div>
  );
}
