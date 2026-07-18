import Link from "next/link";
import Image from "next/image";
import { categories, tools } from "@/config/tools";

const footerLinks = {
  Product: [
    { href: "/tools", label: "All Tools" },
    { href: "/tools?category=Text", label: "Text Tools" },
    { href: "/tools?category=Image", label: "Image Tools" },
    { href: "/tools?category=PDF", label: "PDF Tools" },
    { href: "/tools?category=Code", label: "Code Tools" },
    { href: "/changelog", label: "Changelog" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/help", label: "Help Center" },
    { href: "/suggest-tool", label: "Suggest a Tool" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-subtle)] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <Image src="/logo.png" alt="ToolBrigade" width={32} height={32} className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-[var(--text)]">
                Tool<span className="text-[var(--brand)]">Brigade</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mb-5">
              A growing collection of {tools.length}+ free, fast, browser-based tools for developers, designers, and creators. No account needed.
            </p>

            <ul className="space-y-1.5 mb-6">
              {[
                "No account. No upload. No paywall.",
                `${tools.length}+ tools across ${categories.length} categories.`,
                "Built by one person. Free forever.",
              ].map((line) => (
                <li key={line} className="text-xs text-[var(--text-muted)] flex items-start gap-2">
                  <span className="text-[var(--brand)] mt-0.5 shrink-0">—</span>
                  {line}
                </li>
              ))}
            </ul>

          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)] mb-4">
                {section}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-subtle)] text-center sm:text-left">
            © {new Date().getFullYear()} ToolBrigade. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-subtle)]">
            Free tools, built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
