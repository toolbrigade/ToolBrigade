import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

type Article = {
  slug: string;
  title: string;
  description: string;
  content: React.ReactNode;
};

const articles: Article[] = [
  {
    slug: "why-no-account-or-upload",
    title: "Why does ToolBrigade need no account or upload?",
    description: "A plain-English explanation of how client-side processing works and why your files never leave your device.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          The short answer: modern browsers are full programming environments. They can run complex code, manipulate files, draw graphics, and do cryptography — all without sending anything to a server. ToolBrigade is built entirely on top of these capabilities.
        </p>
        <p>
          Here&apos;s what&apos;s actually happening when you use a tool:
        </p>
        <p>
          <strong className="text-[var(--text)]">Image tools</strong> use the Canvas API. When you upload an image, the browser reads it from your disk into memory, draws it onto an invisible canvas element, and then re-exports it in the new format or size. The Canvas API has been in every major browser since 2011. No server sees the image at any point.
        </p>
        <p>
          <strong className="text-[var(--text)]">PDF tools</strong> use pdf-lib and PDF.js — open-source JavaScript libraries that run entirely in your browser tab. pdf-lib can create, merge, split, and modify PDFs in memory. PDF.js (built by Mozilla) can render PDF pages to a canvas. Both are loaded once when you first use a PDF tool and then run locally.
        </p>
        <p>
          <strong className="text-[var(--text)]">Hash Generator</strong> uses the Web Crypto API — specifically <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">crypto.subtle.digest()</code>. This is a browser-native cryptographic API that runs in a secure context. It&apos;s the same API used by password managers and secure web apps. Your input text is hashed locally and the result is displayed — nothing is transmitted.
        </p>
        <p>
          <strong className="text-[var(--text)]">Text tools</strong> are pure JavaScript string manipulation — splitting, replacing, sorting, encoding. These have zero network involvement by definition.
        </p>
        <p>
          <strong className="text-[var(--text)]">HEIC conversion</strong> uses the heic2any library, which is loaded into your browser tab and performs the full decode-and-encode cycle locally. It takes a few seconds because it&apos;s doing real work in your browser, not on a server.
        </p>
        <p>
          The practical implication: I genuinely cannot see your files even if I wanted to. There&apos;s no server receiving them. The architecture makes it structurally impossible, not just a policy choice.
        </p>
        <p>
          The one exception is the Currency Converter, which fetches live exchange rates from exchangerate-api.com. Only the source currency code is sent in the request URL — your amount and the rest of your data stay local.
        </p>
      </div>
    ),
  },
  {
    slug: "offline-vs-internet",
    title: "Which tools work offline vs need internet?",
    description: "A clear list of which tools require an internet connection and which work entirely offline once loaded.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          Once the page has loaded, almost every tool on ToolBrigade works without an internet connection. The exception is any tool that needs to fetch live data from an external API.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">Requires internet</h3>
        <div className="card">
          <p className="font-semibold text-[var(--text)] text-sm mb-1">Currency Converter</p>
          <p className="text-sm">Fetches live exchange rates from exchangerate-api.com each time you click Convert. If you&apos;re offline, you&apos;ll see an error message. There&apos;s no cached rate — the whole point is live data.</p>
        </div>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">Works offline (once the page has loaded)</h3>
        <p className="text-sm">
          Every other tool — all image tools, all PDF tools, all text tools, all code tools, all converters except Currency — runs entirely in your browser using JavaScript. Once the page and its scripts have loaded, you can disconnect from the internet and they&apos;ll keep working.
        </p>
        <p className="text-sm">
          Note: some tools load JavaScript libraries on demand the first time you use them (pdf-lib for PDF tools, heic2any for HEIC conversion, PDF.js for PDF rendering). These require an internet connection for that first load. After that, your browser may cache them.
        </p>
        <p className="text-sm">
          If you need to use ToolBrigade in a low-connectivity environment, load the tools you need while you have a connection, then use them offline.
        </p>
      </div>
    ),
  },
  {
    slug: "browser-compatibility",
    title: "Browser compatibility — what you need to know",
    description: "Which tools use newer browser APIs, what to do if a tool doesn't load, and which browsers are supported.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          ToolBrigade targets modern browsers. The vast majority of tools work in any browser released in the last 4–5 years. A few tools use APIs that are newer or have specific requirements.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">Tools with specific browser requirements</h3>
        <div className="space-y-3">
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">Hash Generator — Web Crypto API</p>
            <p className="text-sm">Uses <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">crypto.subtle.digest()</code>. Requires a secure context (HTTPS or localhost). Supported in Chrome 37+, Firefox 34+, Safari 11+, Edge 12+. Not available in HTTP contexts or very old browsers.</p>
          </div>
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">Image tools — Canvas API</p>
            <p className="text-sm">All image tools (resizer, compressor, cropper, converters, etc.) use the Canvas API. Supported in all modern browsers. May be blocked in some privacy-hardened browser configurations that disable canvas fingerprinting — if an image tool produces a blank output, check your browser&apos;s privacy settings.</p>
          </div>
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">UUID Generator — crypto.randomUUID()</p>
            <p className="text-sm">Uses <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">crypto.randomUUID()</code> when available (Chrome 92+, Firefox 95+, Safari 15.4+). Falls back to a Math.random()-based implementation on older browsers.</p>
          </div>
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">QR Scanner — camera access</p>
            <p className="text-sm">Requires camera permission and a secure context (HTTPS). Will not work if you deny camera access or if your browser doesn&apos;t support the MediaDevices API.</p>
          </div>
        </div>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">If a tool doesn&apos;t load or work</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Try refreshing the page — some tools load libraries on demand and a failed network request can leave the tool in a broken state.</li>
          <li>Check your browser version. If you&apos;re on a browser more than 3–4 years old, update it.</li>
          <li>Check browser extensions. Ad blockers and privacy extensions occasionally block scripts or canvas access. Try disabling them for toolbrigade.com.</li>
          <li>Try a different browser. Chrome and Firefox have the broadest API support.</li>
          <li>If none of that works, <Link href="/contact" className="text-[var(--brand)] hover:underline">contact me</Link> with your browser name, version, and OS.</li>
        </ol>
      </div>
    ),
  },
  {
    slug: "file-size-limits",
    title: "Understanding file size limits in your browser",
    description: "Why very large files can be slow or crash a tab, and rough safe limits per tool category.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          Because all processing happens in your browser, the limiting factor is your device&apos;s RAM — not a server. When you upload a file, it gets loaded into your browser tab&apos;s memory. Large files can slow things down or, in extreme cases, crash the tab.
        </p>
        <p>
          There are no enforced file size limits on ToolBrigade. But here are practical guidelines based on how each tool category works:
        </p>
        <div className="space-y-3">
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">Image tools</p>
            <p className="text-sm">Images up to ~20 megapixels (e.g. 5000×4000px) work fine on most devices. Very large images — 50MP+ from high-end cameras — may be slow to draw onto the Canvas. The file size in MB matters less than the pixel dimensions, since the Canvas works with uncompressed pixel data. A 20MB JPEG might be 50MP uncompressed, which is much larger in memory than the file size suggests.</p>
          </div>
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">PDF tools</p>
            <p className="text-sm">PDFs up to ~50MB work well. Very large PDFs (100MB+) may be slow to load with pdf-lib, especially if they contain many high-resolution embedded images. PDF.js (used for PDF to Image and PDF to Text) renders pages sequentially, so large multi-page PDFs take longer but are less likely to crash.</p>
          </div>
          <div className="card">
            <p className="font-semibold text-[var(--text)] text-sm mb-1">Text tools</p>
            <p className="text-sm">Text tools handle very large inputs well — hundreds of thousands of words or lines. The Text Diff tool has O(m×n) complexity, so comparing two very long texts (10,000+ lines each) may be slow.</p>
          </div>
        </div>
        <p>
          If a tool is slow or unresponsive with a large file: close other browser tabs to free up RAM, try a desktop browser instead of mobile, or split the file into smaller parts before processing.
        </p>
      </div>
    ),
  },
  {
    slug: "how-tool-suggestions-work",
    title: "How tool suggestions get picked",
    description: "An honest explanation of how I decide which tools to build next.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          There&apos;s no roadmap, no product committee, and no algorithm. Here&apos;s how it actually works:
        </p>
        <p>
          I build tools when I need them myself, or when enough people ask for the same thing that it&apos;s clearly a gap worth filling. The &ldquo;enough people&rdquo; threshold is fuzzy — sometimes one very specific, well-explained suggestion is enough if it&apos;s clearly useful and feasible to build client-side.
        </p>
        <p>
          <strong className="text-[var(--text)]">What makes a suggestion more likely to get built:</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>It can be done entirely in the browser without a server (this is a hard constraint — ToolBrigade doesn&apos;t have a processing backend)</li>
          <li>Multiple people have asked for the same thing</li>
          <li>The use case is specific and practical, not vague (&ldquo;a tool that converts X to Y for Z purpose&rdquo; beats &ldquo;more tools&rdquo;)</li>
          <li>There&apos;s no good existing free alternative that doesn&apos;t require an account or upload</li>
        </ul>
        <p>
          <strong className="text-[var(--text)]">What makes a suggestion less likely:</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>It requires server-side processing (OCR, AI, video encoding, etc.) — these can&apos;t be done client-side</li>
          <li>It&apos;s a very niche use case that only one person would ever use</li>
          <li>A good free tool already exists that doesn&apos;t require an account</li>
        </ul>
        <p>
          I don&apos;t promise to build anything. I don&apos;t have a timeline. But I do read every suggestion, and the ones that keep coming up get built eventually.
        </p>
        <p>
          If you have an idea, <Link href="/suggest-tool" className="text-[var(--brand)] hover:underline">use the suggestion form</Link>.
        </p>
      </div>
    ),
  },
  {
    slug: "data-and-privacy",
    title: "Data and privacy — a plain-English explanation",
    description: "How the client-side architecture works, what Google Analytics 4 collects, and why I can't see your files.",
    content: (
      <div className="space-y-4 text-[var(--text-muted)] leading-relaxed">
        <p>
          The privacy policy covers the legal side. This article explains the technical reality in plain English.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">Why I can&apos;t see your files</h3>
        <p>
          ToolBrigade has no file processing server. When you upload an image or PDF, it goes from your disk into your browser&apos;s memory — that&apos;s it. The JavaScript running in your browser tab processes it locally and produces the output. The file never travels over the network. There&apos;s no server to receive it, no database to store it, no logs of what you processed.
        </p>
        <p>
          This isn&apos;t just a policy — it&apos;s the architecture. Even if I wanted to see your files, the current setup makes it impossible. The only way to change that would be to rebuild the tools with a server backend, which would defeat the entire point.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">What Google Analytics 4 does collect</h3>
        <p>
          I use Google Analytics 4 to understand how the site is used — which tools are popular, where traffic comes from, what devices people use. GA4 collects:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Page views and navigation paths</li>
          <li>Session duration</li>
          <li>Device type (desktop/mobile/tablet)</li>
          <li>Browser and OS</li>
          <li>Country (not city or precise location)</li>
          <li>Referring URL (where you came from)</li>
        </ul>
        <p>
          IP anonymisation is enabled, so your full IP address is not stored. GA4 does not collect your name, email, file contents, or anything you type into tools. It sets two cookies (<code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">_ga</code> and <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">_ga_*</code>) to distinguish sessions.
        </p>
        <p>
          You can opt out of GA4 tracking by using a browser extension like uBlock Origin or by enabling &ldquo;Do Not Track&rdquo; in your browser settings. Disabling analytics has no effect on any tool&apos;s functionality.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">The suggest-a-tool form and Resend</h3>
        <p>
          If you use the suggest-a-tool form, the data you enter — tool name, description, category, and optionally your email — is sent to me via Resend (a transactional email service). That data is used only to read your suggestion and reply if you left an email. Resend retains email metadata (sender, recipient, subject, timestamp) for up to 30 days; the message body is not retained after delivery. The contact page uses direct mailto links and does not go through Resend.
        </p>
        <h3 className="font-semibold text-[var(--text)] mt-6 mb-2">The Currency Converter</h3>
        <p>
          This is the one tool that makes an external network request. When you click Convert, a request goes to <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">api.exchangerate-api.com</code> with the source currency code in the URL (e.g. <code className="text-xs bg-[var(--bg-subtle)] px-1 py-0.5 rounded">/v4/latest/USD</code>). Your amount, target currency, and everything else stays local. Only the source currency code is in the request.
        </p>
        <p>
          Full details are in the <Link href="/privacy" className="text-[var(--brand)] hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    ),
  },
];

export async function generateStaticParams() {
  return articles.map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ article: string }> }): Promise<Metadata> {
  const { article: slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `${a.title} — ToolBrigade Help`,
    description: a.description,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/help/${slug}` },
  };
}

export default async function HelpArticlePage({ params }: { params: Promise<{ article: string }> }) {
  const { article: slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <nav className="text-sm text-[var(--text-muted)] mb-10 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/help" className="hover:text-[var(--text)] transition-colors">Help Center</Link>
        <span>/</span>
        <span className="text-[var(--text)]">{article.title}</span>
      </nav>

      <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text)] mb-4 leading-tight">
        {article.title}
      </h1>
      <p className="text-[var(--text-muted)] mb-10 leading-relaxed">{article.description}</p>

      <div className="mb-14">{article.content}</div>

      <div className="border-t border-[var(--border)] pt-8 flex flex-wrap gap-3">
        <Link href="/help" className="btn-secondary inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> Back to Help Center
        </Link>
        <Link href="/contact" className="btn-ghost inline-flex items-center gap-1.5">
          Still need help? Contact <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
