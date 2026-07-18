"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Faq = { question: string; answer: string };

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-expanded={open === i}
          >
            {faq.question}
            <ChevronDown
              size={16}
              className={`shrink-0 ml-4 text-[var(--text-muted)] transition-transform ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="px-5 pb-4 text-sm text-[var(--text-muted)] leading-relaxed">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
