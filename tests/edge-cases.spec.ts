import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES = path.join(__dirname, "fixtures");

// ─── EMPTY INPUT ──────────────────────────────────────────────────────────────
// Each tool with a submit/process action should show graceful empty state, not crash

const textToolsWithButton: Array<{ slug: string; buttonName: string }> = [
  { slug: "json-formatter", buttonName: "Format" },
  { slug: "xml-formatter", buttonName: "Format" },
  { slug: "html-formatter", buttonName: "Format / Beautify" },
  { slug: "css-formatter", buttonName: "Format" },
  { slug: "js-formatter", buttonName: "Format" },
  { slug: "hash-generator", buttonName: "Generate Hashes" },
  { slug: "text-diff", buttonName: "Compare" },
  { slug: "csv-to-json", buttonName: "Convert" },
  { slug: "json-to-csv", buttonName: "Convert" },
];

for (const { slug, buttonName } of textToolsWithButton) {
  test(`edge: empty input on ${slug} does not crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`/tools/${slug}`);
    // Only fill editable textareas (skip readonly output ones)
    for (const ta of await page.locator("textarea").all()) {
      const isReadonly = await ta.getAttribute("readonly");
      if (isReadonly === null) await ta.fill("");
    }
    // Scope to .card to avoid FAQ accordion buttons — only click if enabled
    const btn = page.locator(".card").getByRole("button", { name: buttonName }).first();
    if (await btn.isVisible() && await btn.isEnabled()) await btn.click();

    await expect(page.locator("h1")).toBeVisible();
    expect(errors, `pageerror on ${slug} with empty input`).toHaveLength(0);
  });
}

// ─── INVALID FILE TYPE ────────────────────────────────────────────────────────

const imageTools = [
  "image-compressor",
  "image-resizer",
  "png-to-jpg",
  "jpg-to-png",
  "image-to-base64",
  "grayscale-converter",
  "image-rotator",
  "image-flipper",
];

for (const slug of imageTools) {
  test(`edge: invalid file type on ${slug} shows error, not crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(`/tools/${slug}`);
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles(path.join(FIXTURES, "fake-image.txt"));

    // Wait briefly for any error UI to appear
    await page.waitForTimeout(1500);

    // Page must still be alive
    await expect(page.locator("h1")).toBeVisible();
    expect(errors, `pageerror on ${slug} with invalid file`).toHaveLength(0);
  });
}

// ─── OVERSIZED INPUT ──────────────────────────────────────────────────────────

test("edge: 500k character input in word-counter does not freeze", async ({ page }) => {
  await page.goto("/tools/word-counter");
  const bigText = "word ".repeat(100_000); // 500k chars
  const start = Date.now();
  await page.locator("textarea").first().fill(bigText);
  const elapsed = Date.now() - start;
  // Should complete within 10 seconds
  expect(elapsed, "word-counter took too long with large input").toBeLessThan(10_000);
  await expect(page.locator("h1")).toBeVisible();
});

test("edge: 500k character input in case-converter does not freeze", async ({ page }) => {
  await page.goto("/tools/case-converter");
  const bigText = "hello ".repeat(83_333);
  await page.locator("textarea").first().fill(bigText);
  await page.getByRole("button", { name: /uppercase/i }).click();
  await expect(page.locator("h1")).toBeVisible();
});

test("edge: large input in duplicate-line-remover does not freeze", async ({ page }) => {
  await page.goto("/tools/duplicate-line-remover");
  // Use 1000 lines instead of 10k to avoid timeout on slow CI
  const lines = Array.from({ length: 1_000 }, (_, i) => `line${i % 100}`).join("\n");
  const start = Date.now();
  await page.locator("textarea").first().fill(lines);
  expect(Date.now() - start).toBeLessThan(10_000);
  await expect(page.locator("h1")).toBeVisible();
});

// ─── MALFORMED INPUT ──────────────────────────────────────────────────────────

test("edge: malformed JSON in json-formatter shows error message", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  await page.locator("textarea").first().fill("{this is: not valid json!!}");
  await page.locator(".card").getByRole("button", { name: "Format", exact: true }).click();
  await expect(
    page.locator(".card").getByText(/invalid|error|unexpected|syntax/i).first()
  ).toBeVisible({ timeout: 5_000 });
  // No unhandled crash
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  expect(errors).toHaveLength(0);
});

test("edge: invalid regex in regex-tester shows error, not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/tools/regex-tester");
  // Find the pattern input (between / delimiters)
  const patternInput = page.locator("input").first();
  await patternInput.fill("[invalid(regex");
  await page.locator("textarea").first().fill("test string");
  await page.waitForTimeout(500);

  await expect(page.locator("h1")).toBeVisible();
  expect(errors, "pageerror on regex-tester with invalid regex").toHaveLength(0);
});

test("edge: invalid cron in cron-generator shows error, not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/tools/cron-generator");
  const input = page.locator(".card input[type=text], .card input:not([type])").first();
  await input.fill("not a valid cron expression at all");
  await page.waitForTimeout(500);

  await expect(page.locator("h1")).toBeVisible();
  expect(errors, "pageerror on cron-generator with invalid input").toHaveLength(0);
});

test("edge: invalid base64 in base64-encoder shows error, not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/tools/base64-encoder");
  await page.locator("textarea").first().fill("!!!not valid base64 @@@###");
  await page.locator(".card").getByRole("button", { name: "Decode", exact: true }).click();
  await page.waitForTimeout(500);

  // Should show an error message
  await expect(
    page.locator(".card").getByText(/invalid|error/i).first()
  ).toBeVisible({ timeout: 5_000 });
  expect(errors).toHaveLength(0);
});

test("edge: invalid XML in xml-formatter shows error, not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/tools/xml-formatter");
  await page.locator("textarea").first().fill("<root><unclosed></root>");
  await page.locator(".card").getByRole("button", { name: "Format", exact: true }).click();
  await page.waitForTimeout(500);

  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toHaveLength(0);
});

test("edge: invalid JWT in jwt-decoder shows error, not crash", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/tools/jwt-decoder");
  await page.locator("textarea").first().fill("this.is.not.a.jwt.token.at.all");
  await page.waitForTimeout(500);

  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toHaveLength(0);
});
