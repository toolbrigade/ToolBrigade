import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer — ToolBrigade",
  description: "ToolBrigade disclaimer. Tools are provided for utility purposes only. Read the full disclaimer.",
  alternates: { canonical: "https://toolbrigade.com/disclaimer" },
  openGraph: {
    title: "Disclaimer — ToolBrigade",
    description: "Tools are provided for utility purposes only.",
    url: "https://toolbrigade.com/disclaimer",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ToolBrigade Disclaimer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer — ToolBrigade",
    description: "Tools are provided for utility purposes only.",
    images: ["/og-image.png"],
  },
};

const lastUpdated = "2026";

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <nav className="text-sm text-[var(--text-muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Disclaimer</span>
      </nav>

      <div className="mb-10">
        <p className="section-label mb-3">Legal</p>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-[var(--text)] mb-3">Disclaimer</h1>
        <p className="text-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
      </div>

      <div className="space-y-10 text-[var(--text-muted)] leading-relaxed">

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">General Disclaimer</h2>
          <p>
            The tools provided on ToolBrigade (toolbrigade.com) are for general utility purposes only. No representations or warranties of any kind are made about the completeness, accuracy, reliability, suitability, or availability of the tools or information on this website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Tool Accuracy</h2>
          <p className="mb-3">
            Tools are designed to be accurate and useful, but should not be relied upon as the sole source of truth for critical decisions. Specifically:
          </p>
          <ul className="space-y-2 text-sm list-disc list-inside">
            <li>The <strong className="text-[var(--text)]">BMI Calculator</strong> provides a general health screening metric only. It is not a substitute for professional medical advice. BMI does not account for muscle mass, bone density, age, or other health factors.</li>
            <li>The <strong className="text-[var(--text)]">Age Calculator</strong> and <strong className="text-[var(--text)]">Date Difference Calculator</strong> are informational utilities. Do not rely on them as the sole basis for legal, contractual, or official age/date determinations — verify with authoritative records.</li>
            <li>The <strong className="text-[var(--text)]">Currency Converter</strong> uses live rates from exchangerate-api.com, updated daily. Rates are indicative only and may differ from those offered by banks, payment processors, or financial institutions. Do not use for financial transactions without verifying current rates.</li>
            <li>The <strong className="text-[var(--text)]">Text Encryptor</strong> uses simple ciphers (Caesar, ROT13) that are not cryptographically secure. Do not use for sensitive data.</li>
            <li>The <strong className="text-[var(--text)]">PDF Password Remover</strong> can only remove owner-level restrictions. It cannot bypass strong user-level encryption.</li>
            <li>The <strong className="text-[var(--text)]">PNG to SVG Converter</strong> produces pixel-level tracing, not professional vector art.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">No Professional Advice</h2>
          <p>
            Nothing on ToolBrigade constitutes legal, financial, medical, or professional advice. Tools like the BMI Calculator, Age Calculator, Date Difference Calculator, and Currency Converter are utilities only — they produce informational results, not professional determinations. Always consult a qualified professional for decisions that matter.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Third-Party Libraries</h2>
          <p>
            Some tools use open-source third-party JavaScript libraries (e.g., pdf-lib, PDF.js, heic2any, qrcode, JsBarcode). These are used under their respective open-source licenses. ToolBrigade is not responsible for bugs, limitations, or behavior introduced by these libraries.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">External Links</h2>
          <p>
            ToolBrigade may contain links to external websites. These links are provided for convenience only. There is no control over the content of those sites and no responsibility is accepted for them or for any loss or damage that may arise from your use of them.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Limitation of Liability</h2>
          <p>
            In no event shall ToolBrigade be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website or its tools.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-3">Contact</h2>
          <p>
            Questions about this disclaimer? Contact{" "}
            <a href="mailto:legal@toolbrigade.com" className="text-[var(--brand)] hover:underline">
              legal@toolbrigade.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
