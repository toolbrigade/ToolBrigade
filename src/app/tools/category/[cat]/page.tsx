import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { tools, categories } from "@/config/tools";
import ToolCard from "@/components/ToolCard";

type Props = { params: { cat: string } };

const categoryDescriptions: Record<string, string> = {
  Text: "Free online text tools for developers and writers — word counters, case converters, diff checkers, encoders, and more. All run in your browser with no upload required.",
  Code: "Free online code tools — JSON formatters, Base64 encoders, JWT decoders, UUID generators, regex testers, hash generators, and more. No install, no sign-up.",
  Image: "Free online image tools — resize, crop, compress, convert, and edit images entirely in your browser. No file uploads to external servers.",
  PDF: "Free online PDF tools — merge, split, compress, rotate, watermark, and extract text from PDFs. Powered by pdf-lib and PDF.js, runs locally in your browser.",
  Converter: "Free online unit converters — length, weight, temperature, currency, time zones, and more. Instant results, no sign-up required.",
  Utilities: "Free online utility tools — QR generators, password tools, calculators, and more. All browser-based with no account needed.",
};

export async function generateStaticParams() {
  return categories.map((cat) => ({ cat: cat.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categories.find((c) => c.toLowerCase() === params.cat.toLowerCase());
  if (!cat) return {};
  const catTools = tools.filter((t) => t.category === cat);
  const desc = categoryDescriptions[cat] ?? `Free online ${cat} tools — ${catTools.length} tools, no sign-up required.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/tools/category/${params.cat}`;
  return {
    title: `Free Online ${cat} Tools — ToolBrigade`,
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: `Free Online ${cat} Tools — ToolBrigade`, description: desc, url },
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = categories.find((c) => c.toLowerCase() === params.cat.toLowerCase());
  if (!cat) notFound();

  const catTools = tools.filter((t) => t.category === cat);
  const desc = categoryDescriptions[cat] ?? `${catTools.length} free ${cat} tools.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: process.env.NEXT_PUBLIC_SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${process.env.NEXT_PUBLIC_SITE_URL}/tools` },
      { "@type": "ListItem", position: 3, name: `${cat} Tools`, item: `${process.env.NEXT_PUBLIC_SITE_URL}/tools/category/${params.cat}` },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="text-sm text-[var(--text-muted)] mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--text)] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{cat}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-[var(--text)] mb-2">
          Free Online {cat} Tools
        </h1>
        <p className="text-[var(--text-muted)] max-w-2xl">{desc}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {catTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-base font-semibold text-[var(--text)] mb-4">Browse other categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.filter((c) => c !== cat).map((c) => (
            <Link
              key={c}
              href={`/tools/category/${c.toLowerCase()}`}
              className="pill pill-inactive text-sm"
            >
              {c} Tools
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
