import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found — ToolBrigade",
  description: "The page you're looking for doesn't exist. Browse our free tools instead.",
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-8xl font-bold text-[var(--border)] mb-6">404</p>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-3">This page doesn&apos;t exist</h1>
      <p className="text-[var(--text-muted)] mb-10">
        It may have been moved or the URL might be wrong.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn-primary">
          Go Home <ArrowRight size={15} />
        </Link>
        <Link href="/tools" className="btn-secondary">
          <Search size={15} /> Browse Tools
        </Link>
      </div>
    </div>
  );
}
