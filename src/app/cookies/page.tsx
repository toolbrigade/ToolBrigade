import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — ToolBrigade",
  description: "ToolBrigade's cookie policy. Minimal cookies — only analytics and theme preference.",
  alternates: { canonical: "https://toolbrigade.com/cookies" },
  openGraph: {
    title: "Cookie Policy — ToolBrigade",
    description: "Minimal cookies — only analytics and theme preference. No advertising cookies.",
    url: "https://toolbrigade.com/cookies",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade Cookie Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy — ToolBrigade",
    description: "Minimal cookies — only analytics and theme preference.",
    images: ["/og-image.png"],
  },
};

const lastUpdated = "2026";

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <nav className="text-sm text-[var(--text-muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Cookie Policy</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-3">Legal</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-3">Cookie Policy</h1>
        <p className="text-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
      </div>

      <div className="card bg-[var(--brand-light)] dark:bg-[var(--brand-light)]/60 border-brand-200 dark:border-brand-800 mb-10">
        <p className="text-sm text-brand-800 dark:text-brand-200 leading-relaxed">
          <strong>Short version:</strong> Minimal cookies. No advertising cookies, no tracking pixels, no third-party marketing. Just basic analytics and your theme preference.
        </p>
      </div>

      <div className="space-y-10 text-[var(--text-muted)] leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device by your browser when you visit a website. They help websites remember information about your visit, such as your preferences or session state.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-4">Cookies Used on ToolBrigade</h2>
          <div className="space-y-4">
            <div className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-[var(--text)] text-sm">Theme Preference</h3>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium shrink-0">Essential</span>
              </div>
              <p className="text-sm mb-2">Stores your light/dark mode preference in a <code className="text-xs bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded">theme</code> cookie.</p>
              <p className="text-xs text-[var(--text-subtle)]">Duration: Persistent · Provider: ToolBrigade</p>
            </div>

            <div className="card">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-[var(--text)] text-sm">Analytics Cookies</h3>
                <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium shrink-0">Analytics</span>
              </div>
              <p className="text-sm mb-2">Used to distinguish users and sessions for anonymous usage analytics. Helps understand which tools are most used and how to improve the site.</p>
              <p className="text-xs text-[var(--text-subtle)]">Duration: Up to 2 years · Third-party analytics provider</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">Cookies NOT Used</h2>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>Advertising or retargeting cookies</li>
            <li>Social media tracking pixels</li>
            <li>Third-party marketing cookies</li>
            <li>Session authentication cookies (no accounts)</li>
            <li>Cross-site tracking cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">Managing Cookies</h2>
          <p className="mb-3">
            You can control and delete cookies through your browser settings. Disabling analytics cookies will not affect your ability to use any tool on ToolBrigade.
          </p>
          <ul className="space-y-1 text-sm list-disc list-inside">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">Chrome cookie settings</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">Firefox cookie settings</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">Safari cookie settings</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text)] mb-3">Contact</h2>
          <p>
            Questions about cookie use? Contact{" "}
            <a href="mailto:privacy@toolbrigade.com" className="text-[var(--brand)] hover:underline">
              privacy@toolbrigade.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
