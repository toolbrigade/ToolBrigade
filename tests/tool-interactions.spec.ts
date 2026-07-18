import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES = path.join(__dirname, "fixtures");

// Helper: click a button scoped inside .card only (avoids FAQ accordion buttons)
async function clickInCard(page: any, name: RegExp | string) {
  await page.locator(".card").getByRole("button", { name, exact: true }).first().click();
}

// ─── TEXT TOOLS ───────────────────────────────────────────────────────────────

test("text: word-counter counts correctly", async ({ page }) => {
  await page.goto("/tools/word-counter");
  await page.locator("textarea").first().fill("hello world foo");
  await expect(page.locator(".card").first().getByText("3", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test("text: case-converter uppercases text", async ({ page }) => {
  await page.goto("/tools/case-converter");
  await page.locator("textarea").first().fill("hello world");
  await page.locator(".card").first().getByRole("button", { name: "UPPERCASE" }).click();
  await expect(page.locator(".card").first()).toContainText("HELLO WORLD");
});

test("text: text-reverser reverses characters", async ({ page }) => {
  await page.goto("/tools/text-reverser");
  await page.locator(".card").first().getByRole("button", { name: "Characters" }).click();
  await page.locator("textarea").first().fill("hello");
  await expect(page.locator(".card").first()).toContainText("olleh");
});

test("text: duplicate-line-remover removes duplicates", async ({ page }) => {
  await page.goto("/tools/duplicate-line-remover");
  await page.locator("textarea").first().fill("apple\nbanana\napple");
  await expect(page.locator("textarea").last()).toContainText("apple", { timeout: 5_000 });
  await expect(page.locator("textarea").last()).toContainText("banana");
  const val = await page.locator("textarea").last().inputValue();
  expect(val.trim().split("\n").length).toBe(2);
});

test("text: text-to-slug converts to slug", async ({ page }) => {
  await page.goto("/tools/text-to-slug");
  await page.locator(".card").first().locator("input").first().fill("Hello World Test");
  await expect(page.locator(".card").first()).toContainText("hello-world-test");
});

test("text: character-counter counts characters", async ({ page }) => {
  await page.goto("/tools/character-counter");
  await page.locator("textarea").first().fill("hello");
  await expect(page.locator(".card").first().getByText("5", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test("text: find-replace replaces text", async ({ page }) => {
  await page.goto("/tools/find-replace");
  await page.locator("textarea").first().fill("hello world");
  await page.locator(".card").first().locator("input").nth(0).fill("hello");
  await page.locator(".card").first().locator("input").nth(1).fill("hi");
  await expect(page.locator("textarea").last()).toContainText("hi world", { timeout: 5_000 });
});

// ─── IMAGE TOOLS ──────────────────────────────────────────────────────────────

test("image: image-resizer accepts PNG and shows download", async ({ page }) => {
  await page.goto("/tools/image-resizer");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card").getByRole("button", { name: /download/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-compressor accepts JPG and shows stats", async ({ page }) => {
  await page.goto("/tools/image-compressor");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.jpg"));
  await expect(page.locator(".card").getByText(/original/i).first()).toBeVisible({ timeout: 10_000 });
});

test("image: png-to-jpg accepts PNG and shows download", async ({ page }) => {
  await page.goto("/tools/png-to-jpg");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  // The download link/button may be an <a> tag
  await expect(
    page.locator(".card").getByRole("button", { name: /download/i })
      .or(page.locator(".card").getByRole("link", { name: /download/i }))
      .first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: jpg-to-png accepts JPG and shows download", async ({ page }) => {
  await page.goto("/tools/jpg-to-png");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.jpg"));
  await expect(
    page.locator(".card").getByRole("button", { name: /download/i })
      .or(page.locator(".card").getByRole("link", { name: /download/i }))
      .first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-to-base64 produces data URL output", async ({ page }) => {
  await page.goto("/tools/image-to-base64");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(page.locator(".card").first()).toContainText("data:", { timeout: 10_000 });
});

// ─── PDF TOOLS ────────────────────────────────────────────────────────────────

test("pdf: pdf-merger accepts 2 PDFs and enables merge button", async ({ page }) => {
  await page.goto("/tools/pdf-merger");
  await page.locator("input[type=file]").setInputFiles([
    path.join(FIXTURES, "test.pdf"),
    path.join(FIXTURES, "test.pdf"),
  ]);
  await expect(
    page.locator(".card").getByRole("button", { name: /merge/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-splitter accepts PDF and shows extract button", async ({ page }) => {
  await page.goto("/tools/pdf-splitter");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  // After upload, an extract button or page count input should appear
  await expect(
    page.locator(".card").getByRole("button", { name: /extract/i }).first()
      .or(page.locator(".card input[type=number]").first())
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-to-text accepts PDF and shows output", async ({ page }) => {
  await page.goto("/tools/pdf-to-text");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  // Output textarea appears after extraction
  await expect(page.locator(".card textarea").first()).toBeVisible({ timeout: 15_000 });
});

// ─── CONVERTER / CALCULATOR TOOLS ─────────────────────────────────────────────

test("converter: temperature-converter 100C = 212F", async ({ page }) => {
  await page.goto("/tools/temperature-converter");
  await page.locator(".card").first().locator("input[type=number]").first().fill("100");
  const select = page.locator(".card").first().locator("select").first();
  if (await select.isVisible()) {
    const options = await select.locator("option").allTextContents();
    const celsiusOpt = options.find((o) => /celsius/i.test(o));
    if (celsiusOpt) await select.selectOption({ label: celsiusOpt });
  }
  await expect(page.locator(".card").first().getByText("212", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test("converter: length-converter 1km = 1000m", async ({ page }) => {
  await page.goto("/tools/length-converter");
  await page.locator(".card").first().locator("input[type=number]").first().fill("1");
  const select = page.locator(".card").first().locator("select").first();
  if (await select.isVisible()) {
    const options = await select.locator("option").allTextContents();
    const kmOpt = options.find((o) => /kilometer/i.test(o));
    if (kmOpt) await select.selectOption({ label: kmOpt });
  }
  await expect(page.locator(".card").first().getByText("1000", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test("converter: px-to-rem 16px = 1rem", async ({ page }) => {
  await page.goto("/tools/px-to-rem");
  await page.locator(".card").first().locator("input[type=number]").first().fill("16");
  await expect(
    page.locator(".card").first().locator("input[type=number]").nth(1)
  ).toHaveValue("1", { timeout: 5_000 });
});

test("converter: number-to-words 42 = forty-two", async ({ page }) => {
  await page.goto("/tools/number-to-words");
  await page.locator(".card").first().locator("input").first().fill("42");
  await expect(page.locator(".card").first()).toContainText(/forty.two/i, { timeout: 5_000 });
});

test("converter: age-calculator shows age output", async ({ page }) => {
  await page.goto("/tools/age-calculator");
  const thirtyYearsAgo = new Date();
  thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
  const dateStr = thirtyYearsAgo.toISOString().split("T")[0];
  await page.locator(".card").first().locator("input[type=date]").first().fill(dateStr);
  await expect(page.locator(".card").first().getByText("30", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

// ─── CODE TOOLS ───────────────────────────────────────────────────────────────

test("code: base64-encoder encodes 'test' to 'dGVzdA=='", async ({ page }) => {
  await page.goto("/tools/base64-encoder");
  await page.locator("textarea").first().fill("test");
  await page.locator(".card").first().getByRole("button", { name: "Encode", exact: true }).click();
  await expect(page.locator("textarea").last()).toHaveValue("dGVzdA==", { timeout: 5_000 });
});

test("code: base64-encoder decodes 'dGVzdA==' to 'test'", async ({ page }) => {
  await page.goto("/tools/base64-encoder");
  await page.locator("textarea").first().fill("dGVzdA==");
  await page.locator(".card").first().getByRole("button", { name: "Decode", exact: true }).click();
  await expect(page.locator("textarea").last()).toHaveValue("test", { timeout: 5_000 });
});

test("code: json-formatter formats valid JSON", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  await page.locator("textarea").first().fill('{"a":1,"b":2}');
  await page.locator(".card").first().getByRole("button", { name: "Format", exact: true }).click();
  const output = await page.locator("textarea").last().inputValue();
  expect(output).toContain('"a": 1');
});

test("code: json-formatter shows error on invalid JSON", async ({ page }) => {
  await page.goto("/tools/json-formatter");
  await page.locator("textarea").first().fill("{invalid json}");
  await page.locator(".card").getByRole("button", { name: "Format", exact: true }).click();
  await expect(page.locator(".card").getByText(/invalid|error|unexpected/i).first()).toBeVisible();
});

test("code: hash-generator produces SHA-256 for 'hello'", async ({ page }) => {
  await page.goto("/tools/hash-generator");
  await page.locator("textarea").first().fill("hello");
  await expect(
    page.locator(".card").first().getByRole("button", { name: /generate/i }).first()
  ).toBeEnabled({ timeout: 3_000 });
  await page.locator(".card").first().getByRole("button", { name: /generate/i }).first().click();
  await expect(page.locator(".card").first().getByText(/2cf24d/i)).toBeVisible({ timeout: 5_000 });
});

test("code: url-encoder encodes special characters", async ({ page }) => {
  await page.goto("/tools/url-encoder");
  await page.locator("textarea").first().fill("hello world&test=1");
  await page.locator(".card").first().getByRole("button", { name: "Encode", exact: true }).click();
  await expect(page.locator("textarea").last()).toContainText("%20", { timeout: 5_000 });
});

test("code: uuid-generator generates valid UUID format", async ({ page }) => {
  await page.goto("/tools/uuid-generator");
  await page.locator(".card").getByRole("button", { name: "Generate", exact: true }).click();
  await expect(
    page.locator(".card").getByText(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i).first()
  ).toBeVisible();
});
