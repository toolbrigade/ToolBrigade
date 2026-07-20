import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — ToolBrigade",
  description: "ToolBrigade terms of service. Free to use, no account required. Fair use policy and acceptable use guidelines.",
  alternates: { canonical: "https://toolbrigade.com/terms" },
  openGraph: {
    title: "Terms of Service — ToolBrigade",
    description: "Free to use, no account required. Fair use policy and acceptable use guidelines.",
    url: "https://toolbrigade.com/terms",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade Terms of Service" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — ToolBrigade",
    description: "Free to use, no account required.",
    images: ["/og-image.png"],
  },
};

const lastUpdated = "2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <nav className="text-sm text-[var(--text-muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Terms of Service</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-3">Legal</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text)] mb-3">Terms of Service</h1>
        <p className="text-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
      </div>

      <div className="card bg-[var(--brand-light)] dark:bg-[var(--brand-light)]/60 border-brand-200 dark:border-brand-800 mb-10">
        <p className="text-sm text-brand-800 dark:text-brand-200 leading-relaxed">
          By using ToolBrigade, you agree to these terms. They&apos;re straightforward — use the tools fairly, don&apos;t abuse the service, and respect intellectual property.
        </p>
      </div>

      <div className="space-y-10 text-[var(--text-muted)] leading-relaxed">

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ToolBrigade (&ldquo;the Service&rdquo;) at toolbrigade.com, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all visitors and users.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">2. Description of Service</h2>
          <p>
            ToolBrigade provides a collection of free, browser-based utility tools for text processing, image editing, PDF manipulation, code formatting, unit conversion, and more. All tools run entirely in your browser.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">3. Free to Use</h2>
          <p>
            ToolBrigade is free to use for personal and commercial purposes. No account, subscription, or payment is required. Core tools will remain free.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">4. No Warranty on Tool Output</h2>
          <p className="mb-3">
            ToolBrigade is built and maintained by a solo developer, not a company with an SLA or support team. Tools are provided as-is with no guarantee of accuracy for critical decisions. Specifically:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>Do not rely solely on the <strong className="text-[var(--text)]">Age Calculator</strong> or <strong className="text-[var(--text)]">Date Difference Calculator</strong> for legal, contractual, or official age/date determinations.</li>
            <li>Do not rely solely on the <strong className="text-[var(--text)]">Currency Converter</strong> for financial transactions — rates are indicative and may differ from those offered by banks or payment processors.</li>
            <li>Do not use the <strong className="text-[var(--text)]">BMI Calculator</strong> as a substitute for professional medical advice.</li>
            <li>Do not use the <strong className="text-[var(--text)]">Text Encryptor</strong> (Caesar cipher, ROT13) for sensitive data — these are not cryptographically secure.</li>
            <li>Do not use generated numbers from the <strong className="text-[var(--text)]">Credit Card Validator / Generator</strong> for any real transaction. Generated numbers are for testing and development only.</li>
          </ul>
          <p className="mt-3 text-sm">See the <Link href="/disclaimer" className="text-[var(--brand)] hover:underline">Disclaimer</Link> for the full list of tool-specific caveats.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">5. Acceptable Use</h2>
          <p className="mb-3">You agree not to use ToolBrigade to:</p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>Violate any applicable laws or regulations</li>
            <li>Process illegal, harmful, or infringing content</li>
            <li>Attempt to reverse-engineer, scrape, or automate the Service in ways that harm performance for other users</li>
            <li>Use automated scripts or bots to make bulk requests to the site</li>
            <li>Circumvent any security measures or access controls</li>
            <li>Distribute malware, spam, or harmful code</li>
            <li>Impersonate ToolBrigade</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">6. Solo Developer — No SLA</h2>
          <p>
            ToolBrigade is built and maintained by one person. There is no company, no support team, and no service level agreement. I do my best to keep things running and fix bugs promptly, but I cannot guarantee uptime, response times, or that any specific tool will remain available indefinitely.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">7. Intellectual Property</h2>
          <p>
            The ToolBrigade name, logo, design, and original content are proprietary. You may not reproduce, distribute, or create derivative works from the branding without written permission. Tools use open-source libraries — see individual tool pages for attribution.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">8. Your Content</h2>
          <p>
            Since all processing happens in your browser, no content you process is received, stored, or accessible. You retain full ownership of your content. No claim is made over anything you create or process using ToolBrigade.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">9. Disclaimer of Warranties</h2>
          <p>
            ToolBrigade is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. There is no warranty that the Service will be uninterrupted, error-free, or free of viruses. Use the Service at your own risk.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ToolBrigade shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of ToolBrigade, including but not limited to loss of data, loss of profits, or business interruption.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">11. Third-Party Links and Services</h2>
          <p>
            ToolBrigade may link to third-party websites or use third-party libraries. No responsibility is accepted for the content, privacy practices, or availability of third-party services. Links do not constitute endorsement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">12. Changes to Terms</h2>
          <p>
            These Terms may be modified at any time. Changes will be posted on this page with an updated date. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">13. Governing Law</h2>
          <p>
            These Terms are governed by applicable law. Any disputes shall be resolved through appropriate legal channels.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">14. Contact</h2>
          <p>
            Questions about these Terms? Contact{" "}
            <a href="mailto:legal@toolbrigade.com" className="text-[var(--brand)] hover:underline">
              legal@toolbrigade.com
            </a>{" "}
            or visit the <Link href="/contact" className="text-[var(--brand)] hover:underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
