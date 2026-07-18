import { test, expect } from "@playwright/test";
import { tools } from "../src/config/tools";

for (const tool of tools) {
  test(`smoke: ${tool.slug}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(`[console.error] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      errors.push(`[pageerror] ${err.message}`);
    });

    const response = await page.goto(`/tools/${tool.slug}`);

    // 1. HTTP status must be 200
    expect(response?.status(), `${tool.slug} returned non-200`).toBe(200);

    // 2. Tool name heading renders
    await expect(
      page.locator("h1").first(),
      `h1 missing on ${tool.slug}`
    ).toContainText(tool.name);

    // 3. Header renders
    await expect(page.locator("header")).toBeVisible();

    // 4. Footer renders
    await expect(page.locator("footer")).toBeVisible();

    // 5. Tool component card renders (the card wrapping ToolRenderer)
    await expect(page.locator(".card").first()).toBeVisible();

    // 6. "How to use" section renders
    await expect(
      page.getByText("How to use this tool"),
      `"How to use" section missing on ${tool.slug}`
    ).toBeVisible();

    // 7. FAQ section renders
    await expect(
      page.getByText("Frequently asked questions"),
      `FAQ section missing on ${tool.slug}`
    ).toBeVisible();

    // 8. No JS errors during load
    expect(errors, `JS errors on ${tool.slug}: ${errors.join(", ")}`).toHaveLength(0);
  });
}
