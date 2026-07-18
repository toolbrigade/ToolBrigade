import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Pages to audit
const pages = [
  { name: "homepage", path: "/" },
  { name: "tools listing", path: "/tools" },
  { name: "word-counter", path: "/tools/word-counter" },
  { name: "json-formatter", path: "/tools/json-formatter" },
  { name: "image-resizer", path: "/tools/image-resizer" },
  { name: "pdf-merger", path: "/tools/pdf-merger" },
  { name: "temperature-converter", path: "/tools/temperature-converter" },
];

for (const { name, path } of pages) {
  test(`a11y: ${name} has no WCAG AA violations`, async ({ page }) => {
    await page.goto(path);
    // Wait for page to fully render
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      // Exclude third-party iframes and known false positives
      .exclude("iframe")
      .analyze();

    // Group violations for readable output
    if (results.violations.length > 0) {
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
        help: v.helpUrl,
      }));
      console.log(`Violations on ${name}:`, JSON.stringify(summary, null, 2));
    }

    expect(
      results.violations,
      `WCAG AA violations on "${name}":\n${results.violations
        .map((v) => `  [${v.impact}] ${v.id}: ${v.description}`)
        .join("\n")}`
    ).toHaveLength(0);
  });
}
