"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { tools } from "@/config/tools";
import ToolCard from "@/components/ToolCard";

export default function HomeSearch() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? tools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : null;

  return (
    <>
      <div className="relative max-w-lg mx-auto mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="search"
          placeholder='Search tools — try "compress" or "JSON"…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input pl-11 pr-4 h-14 text-base rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]"
        />
      </div>

      {filtered && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-sm text-[var(--text-muted)] mb-6">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] mb-2">No tools found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-[var(--text-subtle)]">Try a different keyword or browse all tools.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
