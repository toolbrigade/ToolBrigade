import type { Metadata } from "next";
import { Suspense } from "react";
import AllToolsClient from "./AllToolsClient";
import { tools } from "@/config/tools";

export const metadata: Metadata = {
  title: "All Tools — Free Online Utilities",
  description: `Browse all ${tools.length}+ free browser-based tools on ToolBrigade. Filter by category: Text, Image, PDF, Code, Converter, and more.`,
  alternates: { canonical: "https://toolbrigade.com/tools" },
  openGraph: {
    title: "All Tools — ToolBrigade",
    description: `${tools.length}+ free browser-based tools. No sign-up required.`,
    url: "https://toolbrigade.com/tools",
  },
};

export default function AllToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] mb-2">All Tools</h1>
        <p className="text-[var(--text-muted)]">
          {tools.length} free tools — filter by category or search to find what you need.
        </p>
      </div>
      <Suspense fallback={<div className="text-[var(--text-muted)] py-8">Loading…</div>}>
        <AllToolsClient />
      </Suspense>
    </div>
  );
}

