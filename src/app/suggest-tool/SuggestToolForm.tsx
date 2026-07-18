"use client";
import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SuggestToolForm() {
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/suggest-tool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolName, description, category, email }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <nav className="text-sm text-[var(--text-muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--text)] transition-colors">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Suggest a Tool</span>
      </nav>

      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-lg bg-[var(--brand-light)] dark:bg-[var(--brand-light)] flex items-center justify-center text-[var(--brand)] mx-auto mb-5">
          <Lightbulb size={28} strokeWidth={2.5} />
        </div>
        <p className="section-label mb-3">Suggest a Tool</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)] mb-4">What should I build next?</h1>
        <p className="text-[var(--text-muted)] leading-relaxed">
          If there&apos;s a tool you keep wishing existed here, tell me what it is. I build based on what&apos;s actually useful.
        </p>
      </div>

      <div className="card mb-8">
        {status === "success" ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-[var(--text)] mb-2">Suggestion sent!</p>
            <p className="text-sm text-[var(--text-muted)]">Thanks — I&apos;ll take a look.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Tool Name / Idea <span className="text-brand-500">*</span>
              </label>
              <input
                type="text"
                value={toolName}
                onChange={e => setToolName(e.target.value)}
                placeholder="e.g. CSV to Excel Converter"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                What should it do? <span className="text-brand-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe what the tool should do, what problem it solves, and how you'd use it…"
                className="textarea"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Category</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Select a category…</option>
                <option>Text</option>
                <option>Code</option>
                <option>Image</option>
                <option>PDF</option>
                <option>Converter</option>
                <option>Misc</option>
                <option>New Category</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Your email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="I'll let you know when it's built"
                className="input"
              />
              <p className="text-xs text-[var(--text-subtle)] mt-1.5">Optional. Won&apos;t be used for anything else.</p>
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500">Something went wrong. Try emailing directly instead.</p>
            )}

            <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
              {status === "loading" ? "Sending…" : <><span>Send Suggestion</span> <ArrowRight size={15} /></>}
            </button>
          </form>
        )}
      </div>

      <div className="card bg-[var(--bg-subtle)] text-center">
        <p className="text-sm text-[var(--text-muted)] mb-1">
          Prefer email? Send your idea directly to{" "}
          <a href="mailto:ideas@toolbrigade.com" className="text-[var(--brand)] hover:underline">
            ideas@toolbrigade.com
          </a>
        </p>
        <p className="text-xs text-[var(--text-subtle)]">I read every suggestion.</p>
      </div>
    </div>
  );
}
