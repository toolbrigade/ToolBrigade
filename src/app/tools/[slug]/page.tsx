import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import { getToolBySlug, getRelatedTools, tools } from "@/config/tools";
import { codeExamples } from "@/config/codeExamples";
import ToolCard from "@/components/ToolCard";
import ToolRenderer from "@/components/ToolRenderer";
import FaqAccordion from "@/components/FaqAccordion";
import ShareToolButton from "@/components/ShareToolButton";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) return {};
  const title = `${tool.name} — Free Online Tool`;
  const description =
    tool.metaDescription ??
    (tool.description.length <= 160
      ? tool.description
      : tool.description.slice(0, 157).trimEnd() + "…");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.slug}`;
  return {
    title,
    description,
    keywords: tool.keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: "ToolBrigade",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@toolbrigade",
    },
    alternates: { canonical: url },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const related = getRelatedTools(params.slug);
  const Icon = iconMap[tool.icon] ?? Wrench;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    step: tool.howToUse.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${process.env.NEXT_PUBLIC_SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: tool.name, item: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.slug}` },
    ],
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />

      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--text)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-lg bg-[var(--brand-light)] dark:bg-brand-900/30 flex items-center justify-center text-[var(--brand)] shrink-0">
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-semibold text-[var(--text)]">{tool.name}</h1>
            <ShareToolButton slug={tool.slug} />
          </div>
          <p className="text-[var(--text-muted)] mt-1">{tool.description}</p>
        </div>
      </div>

      {/* Tool UI */}
      <div className="card mb-10">
        <ToolRenderer component={tool.component} slug={tool.slug} />
      </div>

      {/* How to use */}
      <section className="mb-10">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">How to use this tool</h2>
        <ol className="space-y-2">
          {tool.howToUse.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-[var(--text-muted)]">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--brand-light)] dark:bg-brand-900/30 text-[var(--brand)] flex items-center justify-center text-xs font-semibold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Long description */}
      <section className="mb-10">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-3">About {tool.name}</h2>
        <div className="space-y-3">
          {tool.longDescription
            .split(/\n\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i} className="text-sm text-[var(--text-muted)] leading-relaxed">
                {paragraph}
              </p>
            ))}
        </div>
      </section>

      {/* Code examples */}
      {codeExamples[tool.slug] && (
        <section className="mb-10">
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Code examples</h2>
          <div className="space-y-4">
            {codeExamples[tool.slug].map((ex) => (
              <div key={ex.label}>
                <p className="text-xs text-[var(--text-muted)] mb-1 font-mono">{ex.label}</p>
                <pre className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-xs leading-relaxed">
                  <code>{ex.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Frequently asked questions</h2>
        <FaqAccordion faqs={tool.faqs} />
      </section>

      {/* Related tools */}
      {related.length > 0 && (
        <section>
          <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Related Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
