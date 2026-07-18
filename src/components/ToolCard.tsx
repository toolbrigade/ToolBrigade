import Link from "next/link";
import { iconMap } from "@/lib/iconMap";
import { Wrench } from "lucide-react";
import type { Tool } from "@/config/tools";

type Props = { tool: Tool };

export default function ToolCard({ tool }: Props) {
  const Icon = iconMap[tool.icon] ?? Wrench;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card card-hover group flex flex-col gap-3 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[var(--brand-light)] dark:bg-[var(--brand-light)] text-[var(--brand)]">
        <Icon size={19} strokeWidth={2.5} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-[var(--text)] text-sm leading-snug group-hover:text-[var(--brand)] transition-colors">
          {tool.name}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full w-fit bg-[var(--brand-light)] dark:bg-[var(--brand-light)] text-[var(--brand)]">
        {tool.category}
      </span>
    </Link>
  );
}
