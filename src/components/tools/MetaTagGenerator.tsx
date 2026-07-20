"use client";
import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import { trackTaskComplete } from "@/lib/trackUsage";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [url, setUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [startTime] = useState(Date.now());

  const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />${ogImage ? `\n<meta property="og:image" content="${ogImage}" />` : ""}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />${twitterHandle ? `\n<meta property="twitter:site" content="@${twitterHandle.replace("@", "")}" />` : ""}
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />${ogImage ? `\n<meta property="twitter:image" content="${ogImage}" />` : ""}`;

  function handleCopy() {
    trackTaskComplete("meta-tag-generator", startTime);
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Page Title <span className="text-[var(--text-muted)]">({title.length}/60)</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)} maxLength={60}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
              placeholder="My Awesome Page" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Description <span className="text-[var(--text-muted)]">({description.length}/160)</span></label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={160} rows={3}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400 resize-none"
              placeholder="A brief description of this page for search engines and social media." />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Page URL</label>
            <input value={url} onChange={e => setUrl(e.target.value)}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
              placeholder="https://example.com/page" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">OG Image URL</label>
            <input value={ogImage} onChange={e => setOgImage(e.target.value)}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
              placeholder="https://example.com/og-image.png (1200×630)" />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-muted)] mb-1 block">Twitter Handle (optional)</label>
            <input value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)}
              className="w-full text-sm border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-brand-400"
              placeholder="@yourhandle" />
          </div>
        </div>

        <div className="space-y-4">
          {/* Google Search Preview */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Google Search Preview</p>
            <div className="border border-[var(--border)] rounded-xl p-4 bg-white dark:bg-gray-900 space-y-1">
              <p className="text-xs text-green-700 dark:text-green-400 truncate">{url || "https://example.com/page"}</p>
              <p className="text-base text-blue-700 dark:text-blue-400 font-medium leading-tight">{title || "Page Title"}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{description || "Page description appears here in search results."}</p>
            </div>
          </div>

          {/* Twitter/LinkedIn Card Preview */}
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">Twitter / LinkedIn Card Preview</p>
            <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImage} alt="OG" className="w-full h-32 object-cover" onError={e => (e.currentTarget.style.display = "none")} />
              ) : (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400">1200 × 630 image</div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{url ? new URL(url.startsWith("http") ? url : "https://" + url).hostname : "example.com"}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{title || "Page Title"}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description || "Description"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-[var(--text-muted)]">Generated Meta Tags</label>
          <div onClick={handleCopy}><CopyButton text={tags} /></div>
        </div>
        <textarea className="textarea min-h-[200px] font-mono text-xs" value={tags} readOnly />
      </div>
    </div>
  );
}
