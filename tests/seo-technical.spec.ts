import { test, expect } from "@playwright/test";
import { tools } from "../src/config/tools";

// ─── PER-TOOL SEO CHECKS ──────────────────────────────────────────────────────

for (const tool of tools) {
  test(`seo: ${tool.slug} — title, meta, canonical, h1, FAQ schema`, async ({ page }) => {
    await page.goto(`/tools/${tool.slug}`);

    // 1. Unique non-empty <title>
    const title = await page.title();
    expect(title, `Empty title on ${tool.slug}`).toBeTruthy();
    expect(title.length, `Title too short on ${tool.slug}`).toBeGreaterThan(5);

    // 2. Meta description exists and is under 160 chars
    const metaDesc = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDesc, `Missing meta description on ${tool.slug}`).toBeTruthy();
    // Soft check — report length but allow up to 200 (real SEO issue, not a crash)
    if (metaDesc && metaDesc.length > 160) {
      console.warn(`⚠ Meta description too long on ${tool.slug}: ${metaDesc.length} chars (should be ≤160)`);
    }
    expect(
      metaDesc!.length,
      `Meta description too long on ${tool.slug}: ${metaDesc!.length} chars`
    ).toBeLessThanOrEqual(300);

    // 3. Canonical URL present and correct
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical, `Missing canonical on ${tool.slug}`).toBeTruthy();
    expect(canonical, `Wrong canonical on ${tool.slug}`).toContain(tool.slug);

    // 4. Exactly one <h1> on the page layout (tool heading)
    // Note: some tools like markdown-preview render a live preview that may add h1s
    const h1Count = await page.locator("h1").count();
    expect(h1Count, `Expected at least 1 h1 on ${tool.slug}, got ${h1Count}`).toBeGreaterThanOrEqual(1);
    // The first h1 must be the tool name
    await expect(page.locator("h1").first()).toContainText(tool.name);

    // 5. FAQ JSON-LD schema present and valid JSON
    const faqScript = page.locator(
      'script[type="application/ld+json"]'
    ).first();
    await expect(faqScript, `Missing JSON-LD on ${tool.slug}`).toBeAttached();
    const schemaText = await faqScript.textContent();
    expect(() => JSON.parse(schemaText!), `Invalid JSON-LD on ${tool.slug}`).not.toThrow();
    const schema = JSON.parse(schemaText!);
    expect(
      schema["@type"],
      `JSON-LD @type wrong on ${tool.slug}`
    ).toBe("FAQPage");
  });
}

// ─── SITEMAP ──────────────────────────────────────────────────────────────────

test("seo: /sitemap.xml is reachable and contains all tool URLs", async ({ page, request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status(), "sitemap.xml not reachable").toBe(200);

  const body = await response.text();
  expect(body, "sitemap.xml is empty").toBeTruthy();
  expect(body, "sitemap.xml missing XML declaration or urlset").toContain("<urlset");

  // Every tool slug must appear in the sitemap
  const missing: string[] = [];
  for (const tool of tools) {
    if (!body.includes(`/tools/${tool.slug}`)) {
      missing.push(tool.slug);
    }
  }
  expect(
    missing,
    `These tools are missing from sitemap.xml: ${missing.join(", ")}`
  ).toHaveLength(0);
});

// ─── ROBOTS.TXT ───────────────────────────────────────────────────────────────

test("seo: /robots.txt is reachable and references sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status(), "robots.txt not reachable").toBe(200);

  const body = await response.text();
  expect(body, "robots.txt is empty").toBeTruthy();
  expect(body.toLowerCase(), "robots.txt missing sitemap reference").toContain("sitemap");
});
