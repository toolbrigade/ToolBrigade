"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  ChevronDown, Moon, Sun, Menu, X, Search,
  FileText, Code2, Image as ImageIcon, FileDown, Wrench, Sparkles,
} from "lucide-react";
import { categories, tools } from "@/config/tools";

const categoryIcons: Record<string, React.ElementType> = {
  Text: FileText,
  Code: Code2,
  Image: ImageIcon,
  PDF: FileDown,
  Converter: Wrench,
  Utilities: Sparkles,
};

const navLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help Center" },
];

export default function Header() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
    const stored = match ? match[1] : null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.cookie = `theme=${dark ? "dark" : "light"};path=/;max-age=31536000;SameSite=Lax`;
  }, [dark]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setCatOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { setMobileOpen(false); setCatOpen(false); }, [pathname]);

  const results = query.trim()
    ? tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg)]/95 border-b border-[var(--border)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="font-display font-semibold text-xl tracking-tight text-[var(--text)]">
            Tool<span className="text-[var(--brand)]">Brigade</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[var(--brand)] bg-[var(--brand-light)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Categories dropdown */}
          <div className="relative" ref={dropRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                catOpen
                  ? "text-[var(--brand)] bg-[var(--brand-light)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              Categories
              <ChevronDown size={14} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 py-2 z-50 animate-fade-in">
                <p className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
                  Browse by Category
                </p>
                {categories.map((cat) => {
                  const CatIcon = categoryIcons[cat] ?? Wrench;
                  const count = tools.filter((t) => t.category === cat).length;
                  return (
                    <Link
                      key={cat}
                      href={`/tools?category=${cat}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                        <CatIcon size={13} strokeWidth={1.75} />
                      </div>
                      <span className="flex-1">{cat}</span>
                      <span className="text-xs text-[var(--text-subtle)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="btn-ghost text-sm hidden sm:flex"
              aria-label="Search tools"
            >
              <Search size={16} strokeWidth={1.75} />
              <span className="hidden lg:inline text-[var(--text-subtle)]">Search tools…</span>
              <kbd className="hidden lg:inline text-xs bg-[var(--bg-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden animate-fade-in">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
                  <Search size={15} strokeWidth={1.75} className="text-[var(--text-muted)] shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search tools…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-[var(--text-subtle)] hover:text-[var(--text)]">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {query.trim() ? (
                  results.length > 0 ? (
                    <ul className="py-2 max-h-72 overflow-y-auto">
                      {results.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/tools/${t.slug}`}
                            onClick={() => { setSearchOpen(false); setQuery(""); }}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] transition-colors"
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                              {t.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text)]">{t.name}</p>
                              <p className="text-xs text-[var(--text-subtle)]">{t.category}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-6 text-sm text-[var(--text-muted)] text-center">No tools found for &ldquo;{query}&rdquo;</p>
                  )
                ) : (
                  <p className="px-4 py-4 text-xs text-[var(--text-subtle)] text-center">Type to search {tools.length}+ tools</p>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDark((v) => !v)}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-subtle)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4 flex flex-col gap-1 animate-slide-up">
          <div className="relative mb-2">
            <Search size={15} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tools…"
              className="input pl-9 text-sm"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-[var(--brand)] bg-[var(--brand-light)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-[var(--border)] mt-1">
            <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--text-subtle)]">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => {
                const CatIcon = categoryIcons[cat] ?? Wrench;
                return (
                  <Link
                    key={cat}
                    href={`/tools?category=${cat}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    <CatIcon size={13} strokeWidth={1.75} className="text-[var(--brand)]" />
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
