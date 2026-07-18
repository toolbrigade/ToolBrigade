"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { tools, categories } from "@/config/tools";
import ToolCard from "@/components/ToolCard";

export default function AllToolsClient() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat)) setActive(cat);
    else setActive("All");
  }, [searchParams]);

  const filtered = tools.filter((t) => {
    const matchCat = active === "All" || t.category === active;
    const matchQuery =
      !query.trim() ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <>
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            placeholder="Search tools…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`pill ${active === cat ? "pill-active" : "pill-inactive"}`}
          >
            {cat}
            {cat !== "All" && (
              <span className={`ml-1.5 text-xs ${active === cat ? "opacity-70" : "text-[var(--text-subtle)]"}`}>
                {tools.filter((t) => t.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--text-muted)] mb-5">
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""}
        {active !== "All" && ` in ${active}`}
        {query && ` matching "${query}"`}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)] mb-2">No tools found.</p>
          <button onClick={() => { setQuery(""); setActive("All"); }} className="text-sm text-[var(--brand)] hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
