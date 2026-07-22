import Link from "next/link";
import { iconMap } from "@/lib/iconMap";
import { Wrench } from "lucide-react";
import type { Tool } from "@/config/tools";

type Props = { tool: Tool; featured?: boolean };

export default function ToolCard({ tool, featured }: Props) {
  const Icon = iconMap[tool.icon] ?? Wrench;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card card-hover group flex flex-col gap-3 cursor-pointer min-w-0"
    >
      <div className={`icon-container shrink-0${featured ? " w-12 h-12" : ""}`}>
        <Icon size={featured ? 22 : 18} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-display font-semibold text-[var(--text)] leading-snug group-hover:text-[var(--brand)] transition-colors break-words hyphens-auto${featured ? " text-base" : " text-sm"}`}>
          {tool.name}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full w-fit border border-[var(--border)] text-[var(--text-subtle)] shrink-0">
        {tool.category}
      </span>
    </Link>
  );
}
