"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Code2, Image, FileDown, Wrench, Sparkles } from "lucide-react";
import { tools, categories } from "@/config/tools";
import ToolCard from "@/components/ToolCard";

const categoryMeta: Record<string, { icon: React.ElementType }> = {
  Text: { icon: FileText },
  Code: { icon: Code2 },
  Image: { icon: Image },
  PDF: { icon: FileDown },
  Converter: { icon: Wrench },
  Misc: { icon: Sparkles },
};

export default function AllToolsSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestIdleCallback
      ? requestIdleCallback(() => setVisible(true))
      : setTimeout(() => setVisible(true), 200);
    return () => (requestIdleCallback ? cancelIdleCallback(id as number) : clearTimeout(id as ReturnType<typeof setTimeout>));
  }, []);

  if (!visible) return (
    <section className="py-16 border-t border-[var(--border)]">
      <div className="h-8 w-48 bg-[var(--bg-subtle)] rounded animate-pulse mb-10" />
    </section>
  );

  return (
    <section className="py-16 border-t border-[var(--border)]">
      <h2 className="font-display text-lg font-semibold text-[var(--text)] mb-10">All {tools.length} tools</h2>
      <div className="space-y-14">
        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          const CatIcon = categoryMeta[cat]?.icon ?? Wrench;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-5">
                <CatIcon size={14} strokeWidth={2} className="text-[var(--text-muted)]" />
                <h3 className="font-display text-sm font-semibold text-[var(--text)]">{cat}</h3>
                <span className="text-xs text-[var(--text-subtle)]">— {catTools.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {catTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
