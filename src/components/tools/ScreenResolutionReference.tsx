"use client";
import { useState, useMemo } from "react";

type Entry = { device: string; category: string; width: number; height: number; ratio: string; notes: string };

const DATA: Entry[] = [
  // Phones
  { device: "iPhone 16 Pro Max", category: "Phone", width: 430, height: 932, ratio: "19.5:9", notes: "Super Retina XDR" },
  { device: "iPhone 16 / 15", category: "Phone", width: 393, height: 852, ratio: "19.5:9", notes: "Super Retina XDR" },
  { device: "iPhone SE (3rd gen)", category: "Phone", width: 375, height: 667, ratio: "16:9", notes: "Retina HD" },
  { device: "Samsung Galaxy S24 Ultra", category: "Phone", width: 412, height: 915, ratio: "19.3:9", notes: "Dynamic AMOLED" },
  { device: "Samsung Galaxy S24", category: "Phone", width: 360, height: 780, ratio: "19.5:9", notes: "Dynamic AMOLED" },
  { device: "Google Pixel 9 Pro", category: "Phone", width: 412, height: 892, ratio: "20:9", notes: "LTPO OLED" },
  { device: "OnePlus 12", category: "Phone", width: 412, height: 919, ratio: "20:9", notes: "LTPO AMOLED" },
  // Tablets
  { device: "iPad Pro 13\" (M4)", category: "Tablet", width: 1024, height: 1366, ratio: "4:3", notes: "Ultra Retina XDR" },
  { device: "iPad Pro 11\" (M4)", category: "Tablet", width: 834, height: 1194, ratio: "7:5", notes: "Ultra Retina XDR" },
  { device: "iPad Air 11\" (M2)", category: "Tablet", width: 820, height: 1180, ratio: "7:5", notes: "Liquid Retina" },
  { device: "iPad mini (6th gen)", category: "Tablet", width: 744, height: 1133, ratio: "744:1133", notes: "Liquid Retina" },
  { device: "Samsung Galaxy Tab S9 Ultra", category: "Tablet", width: 1848, height: 2960, ratio: "37:59", notes: "Dynamic AMOLED" },
  // Monitors
  { device: "HD (720p)", category: "Monitor", width: 1280, height: 720, ratio: "16:9", notes: "Standard HD" },
  { device: "Full HD (1080p)", category: "Monitor", width: 1920, height: 1080, ratio: "16:9", notes: "Most common desktop" },
  { device: "QHD / 2K (1440p)", category: "Monitor", width: 2560, height: 1440, ratio: "16:9", notes: "Gaming / pro monitors" },
  { device: "4K UHD", category: "Monitor", width: 3840, height: 2160, ratio: "16:9", notes: "Ultra HD" },
  { device: "5K", category: "Monitor", width: 5120, height: 2880, ratio: "16:9", notes: "Apple Studio Display" },
  { device: "Ultrawide (2560×1080)", category: "Monitor", width: 2560, height: 1080, ratio: "21:9", notes: "Ultrawide" },
  { device: "Ultrawide (3440×1440)", category: "Monitor", width: 3440, height: 1440, ratio: "21:9", notes: "Ultrawide QHD" },
  { device: "Super Ultrawide (5120×1440)", category: "Monitor", width: 5120, height: 1440, ratio: "32:9", notes: "Super ultrawide" },
  // Laptops
  { device: "MacBook Air 13\" (M3)", category: "Laptop", width: 2560, height: 1664, ratio: "1.54:1", notes: "Liquid Retina" },
  { device: "MacBook Pro 14\" (M4)", category: "Laptop", width: 3024, height: 1964, ratio: "1.54:1", notes: "Liquid Retina XDR" },
  { device: "MacBook Pro 16\" (M4)", category: "Laptop", width: 3456, height: 2234, ratio: "1.55:1", notes: "Liquid Retina XDR" },
  { device: "Dell XPS 15", category: "Laptop", width: 3456, height: 2160, ratio: "16:10", notes: "OLED option" },
  { device: "Surface Laptop 5 (13.5\")", category: "Laptop", width: 2256, height: 1504, ratio: "3:2", notes: "PixelSense" },
  // Video formats
  { device: "SD (480p)", category: "Video", width: 854, height: 480, ratio: "16:9", notes: "Standard definition" },
  { device: "HD (720p)", category: "Video", width: 1280, height: 720, ratio: "16:9", notes: "HD video" },
  { device: "Full HD (1080p)", category: "Video", width: 1920, height: 1080, ratio: "16:9", notes: "Blu-ray / streaming" },
  { device: "4K DCI", category: "Video", width: 4096, height: 2160, ratio: "17:9", notes: "Cinema 4K" },
  { device: "4K UHD", category: "Video", width: 3840, height: 2160, ratio: "16:9", notes: "Consumer 4K" },
  { device: "8K UHD", category: "Video", width: 7680, height: 4320, ratio: "16:9", notes: "8K streaming" },
  { device: "Instagram Square", category: "Social", width: 1080, height: 1080, ratio: "1:1", notes: "Feed post" },
  { device: "Instagram Portrait", category: "Social", width: 1080, height: 1350, ratio: "4:5", notes: "Feed portrait" },
  { device: "Instagram Story / Reel", category: "Social", width: 1080, height: 1920, ratio: "9:16", notes: "Vertical video" },
  { device: "YouTube Thumbnail", category: "Social", width: 1280, height: 720, ratio: "16:9", notes: "Recommended" },
  { device: "Twitter / X Header", category: "Social", width: 1500, height: 500, ratio: "3:1", notes: "Profile header" },
  { device: "Facebook Cover", category: "Social", width: 820, height: 312, ratio: "2.63:1", notes: "Desktop cover" },
  { device: "LinkedIn Banner", category: "Social", width: 1584, height: 396, ratio: "4:1", notes: "Profile banner" },
  { device: "Open Graph Image", category: "Web", width: 1200, height: 630, ratio: "1.91:1", notes: "Social share preview" },
  { device: "Twitter Card", category: "Web", width: 1200, height: 628, ratio: "1.91:1", notes: "Summary large image" },
  { device: "Favicon", category: "Web", width: 32, height: 32, ratio: "1:1", notes: "Browser tab icon" },
];

const CATEGORIES = ["All", ...Array.from(new Set(DATA.map(d => d.category)))];

export default function ScreenResolutionReference() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortKey, setSortKey] = useState<"device"|"width"|"height">("device");
  const [sortDir, setSortDir] = useState<1|-1>(1);

  const filtered = useMemo(() => {
    let rows = DATA;
    if (category !== "All") rows = rows.filter(r => r.category === category);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(r => r.device.toLowerCase().includes(q) || r.ratio.includes(q) || r.notes.toLowerCase().includes(q));
    }
    return [...rows].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return typeof av === "string" ? av.localeCompare(bv as string) * sortDir : ((av as number) - (bv as number)) * sortDir;
    });
  }, [search, category, sortKey, sortDir]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir(d => d === 1 ? -1 : 1);
    else { setSortKey(key); setSortDir(1); }
  }

  const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
      {label}{sortKey === k ? (sortDir === 1 ? " ↑" : " ↓") : ""}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          className="input flex-1 min-w-[180px]"
          placeholder="Search device, ratio, notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input w-40" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{filtered.length} of {DATA.length} entries</p>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-subtle)] text-xs text-[var(--text-muted)] font-semibold">
            <tr>
              <th className="text-left px-3 py-2"><SortBtn k="device" label="Device" /></th>
              <th className="text-left px-3 py-2">Category</th>
              <th className="text-right px-3 py-2"><SortBtn k="width" label="Width" /></th>
              <th className="text-right px-3 py-2"><SortBtn k="height" label="Height" /></th>
              <th className="text-center px-3 py-2">Ratio</th>
              <th className="text-left px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-[var(--border)] hover:bg-[var(--bg-subtle)] transition-colors">
                <td className="px-3 py-2 font-medium text-[var(--text)]">{r.device}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">{r.category}</span>
                </td>
                <td className="px-3 py-2 text-right font-mono text-[var(--text)]">{r.width}</td>
                <td className="px-3 py-2 text-right font-mono text-[var(--text)]">{r.height}</td>
                <td className="px-3 py-2 text-center font-mono text-[var(--text-muted)]">{r.ratio}</td>
                <td className="px-3 py-2 text-[var(--text-muted)] text-xs">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
