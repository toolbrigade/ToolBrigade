import { test, expect } from "@playwright/test";
import path from "path";

const FIXTURES = path.join(__dirname, "fixtures");

// ─── TEXT TOOLS ───────────────────────────────────────────────────────────────

test("text: line-sorter sorts A-Z", async ({ page }) => {
  await page.goto("/tools/line-sorter");
  await page.locator("textarea").first().fill("banana\napple\ncherry");
  await page.locator(".card").getByRole("button", { name: "A → Z" }).click();
  const val = await page.locator("textarea").last().inputValue();
  expect(val.trim().split("\n")[0]).toBe("apple");
});

test("text: line-sorter sorts Z-A", async ({ page }) => {
  await page.goto("/tools/line-sorter");
  await page.locator("textarea").first().fill("banana\napple\ncherry");
  await page.locator(".card").getByRole("button", { name: "Z → A" }).click();
  const val = await page.locator("textarea").last().inputValue();
  expect(val.trim().split("\n")[0]).toBe("cherry");
});

test("text: whitespace-remover trims lines", async ({ page }) => {
  await page.goto("/tools/whitespace-remover");
  await page.locator("textarea").first().fill("  hello  \n  world  ");
  await page.locator(".card").getByRole("button", { name: "Trim lines" }).click();
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toContain("hello");
  expect(val).not.toMatch(/^\s/);
});

test("text: whitespace-remover removes blank lines", async ({ page }) => {
  await page.goto("/tools/whitespace-remover");
  await page.locator("textarea").first().fill("hello\n\nworld\n\n");
  await page.locator(".card").getByRole("button", { name: "Remove blank lines" }).click();
  const val = await page.locator("textarea").last().inputValue();
  expect(val.trim().split("\n").length).toBe(2);
});

test("text: lorem-ipsum generates paragraphs", async ({ page }) => {
  await page.goto("/tools/lorem-ipsum");
  await page.locator(".card select").selectOption("Paragraphs");
  await page.locator(".card input[type=number]").fill("2");
  await page.locator(".card").getByRole("button", { name: "Generate" }).click();
  const val = await page.locator(".card textarea").first().inputValue();
  expect(val.length).toBeGreaterThan(50);
});

test("text: text-encryptor ROT13 encodes and decodes", async ({ page }) => {
  await page.goto("/tools/text-encryptor");
  await page.locator(".card").getByRole("button", { name: "ROT13" }).click();
  await page.locator("textarea").first().fill("Hello");
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toBe("Uryyb");
});

test("text: markdown-preview renders heading", async ({ page }) => {
  await page.goto("/tools/markdown-preview");
  await page.locator("textarea").first().fill("# Hello World");
  await expect(page.locator(".card").first()).toContainText("Hello World", { timeout: 5_000 });
});

test("text: markdown-to-html converts heading", async ({ page }) => {
  await page.goto("/tools/markdown-to-html");
  await page.locator("textarea").first().fill("# Hello");
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toContain("<h1>");
});

test("text: html-to-markdown converts bold", async ({ page }) => {
  await page.goto("/tools/html-to-markdown");
  await page.locator("textarea").first().fill("<strong>hello</strong>");
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toContain("**hello**");
});

test("text: text-to-html wraps in p tags", async ({ page }) => {
  await page.goto("/tools/text-to-html");
  await page.locator("textarea").first().fill("Hello world");
  await page.locator(".card").getByRole("button", { name: "<p>" }).click();
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toContain("<p>");
});

test("text: text-repeater repeats text", async ({ page }) => {
  await page.goto("/tools/text-repeater");
  await page.locator(".card input:not([type=number])").first().fill("hi");
  await page.locator(".card input[type=number]").fill("3");
  const val = await page.locator(".card textarea").first().inputValue();
  expect(val.split("hi").length - 1).toBe(3);
});

test("text: random-string-generator generates strings", async ({ page }) => {
  await page.goto("/tools/random-string-generator");
  await page.locator(".card").getByRole("button", { name: "Generate" }).click();
  await expect(page.locator(".card").first()).toContainText(/[A-Za-z0-9]/, { timeout: 5_000 });
});

test("text: text-binary-converter encodes to binary", async ({ page }) => {
  await page.goto("/tools/text-binary-converter");
  await page.locator(".card").getByRole("button", { name: "Text → Binary" }).click();
  await page.locator("textarea").first().fill("A");
  const val = await page.locator("textarea").last().inputValue();
  expect(val.trim()).toBe("01000001");
});

test("text: morse-converter encodes SOS", async ({ page }) => {
  await page.goto("/tools/morse-converter");
  await page.locator(".card").getByRole("button", { name: "Text → Morse" }).click();
  await page.locator("textarea").first().fill("SOS");
  const val = await page.locator("textarea").last().inputValue();
  expect(val).toContain("...");
  expect(val).toContain("---");
});

test("text: palindrome-checker detects palindrome", async ({ page }) => {
  await page.goto("/tools/palindrome-checker");
  await page.locator(".card input").first().fill("racecar");
  await expect(page.locator(".card").first().getByText(/palindrome/i).first()).toBeVisible({ timeout: 5_000 });
});

test("text: palindrome-checker detects non-palindrome", async ({ page }) => {
  await page.goto("/tools/palindrome-checker");
  await page.locator(".card input").first().fill("hello");
  await expect(page.locator(".card").first().getByText(/not a palindrome/i).first()).toBeVisible({ timeout: 5_000 });
});

// ─── CODE TOOLS ───────────────────────────────────────────────────────────────

test("code: color-converter converts #ff0000 to rgb", async ({ page }) => {
  await page.goto("/tools/color-converter");
  await page.locator(".card input[type=text]").fill("#ff0000");
  await expect(page.locator(".card").first()).toContainText("rgb(255, 0, 0)", { timeout: 5_000 });
});

test("code: cron-generator explains every minute preset", async ({ page }) => {
  await page.goto("/tools/cron-generator");
  await page.locator(".card").getByRole("button", { name: /every minute/i }).click();
  await expect(page.locator(".card").first()).toContainText(/minute/i, { timeout: 5_000 });
});

test("code: jwt-decoder decodes valid JWT", async ({ page }) => {
  await page.goto("/tools/jwt-decoder");
  // A real JWT with payload {"sub":"1234567890","name":"John Doe","iat":1516239022}
  await page.locator("textarea").first().fill(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  );
  await expect(page.locator(".card").first()).toContainText("John Doe", { timeout: 5_000 });
});

test("code: regex-tester highlights matches", async ({ page }) => {
  await page.goto("/tools/regex-tester");
  await page.locator("input").first().fill("\\d+");
  await page.locator("textarea").first().fill("abc 123 def 456");
  await expect(page.locator(".card").first().getByText(/2 match/i).first()).toBeVisible({ timeout: 5_000 });
});

test("code: uuid-generator generates valid UUID", async ({ page }) => {
  await page.goto("/tools/uuid-generator");
  await page.locator(".card").getByRole("button", { name: "Generate", exact: true }).click();
  await expect(
    page.locator(".card").getByText(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i).first()
  ).toBeVisible({ timeout: 5_000 });
});

test("code: password-generator generates password", async ({ page }) => {
  await page.goto("/tools/password-generator");
  await page.locator(".card").getByRole("button", { name: /generate password/i }).click();
  await expect(page.locator(".card code").first()).toBeVisible({ timeout: 5_000 });
  const pwd = await page.locator(".card code").first().textContent();
  expect(pwd!.length).toBeGreaterThan(0);
});

test("code: qr-generator renders canvas", async ({ page }) => {
  await page.goto("/tools/qr-generator");
  await page.locator(".card input").first().fill("https://example.com");
  await expect(page.locator(".card canvas").first()).toBeVisible({ timeout: 10_000 });
});

test("code: barcode-generator renders SVG", async ({ page }) => {
  await page.goto("/tools/barcode-generator");
  await page.locator(".card input").first().fill("123456789012");
  await expect(page.locator(".card svg").first()).toBeVisible({ timeout: 10_000 });
});

test("code: random-number-generator generates numbers", async ({ page }) => {
  await page.goto("/tools/random-number-generator");
  await page.locator(".card").getByRole("button", { name: /generate/i }).click();
  await expect(page.locator(".card").first().getByText(/1 number/i).first()).toBeVisible({ timeout: 5_000 });
});

test("code: base-converter converts 255 decimal to hex FF", async ({ page }) => {
  await page.goto("/tools/base-converter");
  await page.locator(".card input").first().fill("255");
  await expect(page.locator(".card").first()).toContainText("FF", { timeout: 5_000 });
});

// ─── CONVERTER TOOLS ──────────────────────────────────────────────────────────

test("converter: weight-converter 1kg = 1000g", async ({ page }) => {
  await page.goto("/tools/weight-converter");
  await page.locator(".card input[type=number]").first().fill("1");
  const select = page.locator(".card select").first();
  await select.selectOption("kg");
  await expect(page.locator(".card").first().getByText("1000", { exact: true }).first()).toBeVisible({ timeout: 5_000 });
});

test("converter: timezone-converter shows target zones", async ({ page }) => {
  await page.goto("/tools/timezone-converter");
  await expect(page.locator(".card").first()).toContainText("America/New_York", { timeout: 5_000 });
  await expect(page.locator(".card").first()).toContainText("Europe/London");
  await expect(page.locator(".card").first()).toContainText("Asia/Tokyo");
});

test("converter: number-to-words 0 = zero", async ({ page }) => {
  await page.goto("/tools/number-to-words");
  await page.locator(".card input").first().fill("0");
  await expect(page.locator(".card").first()).toContainText(/zero/i, { timeout: 5_000 });
});

test("converter: words-to-number 'one hundred' = 100", async ({ page }) => {
  await page.goto("/tools/words-to-number");
  await page.locator(".card input").first().fill("one hundred");
  await expect(page.locator(".card").first()).toContainText("100", { timeout: 5_000 });
});

test("converter: percentage-calculator 50% of 200 = 100", async ({ page }) => {
  await page.goto("/tools/percentage-calculator");
  // First calculator: "What is A% of B?" — first two number inputs
  const inputs = page.locator(".card input[type=number]");
  await inputs.nth(0).fill("50");
  await inputs.nth(1).fill("200");
  await expect(page.locator(".card").first()).toContainText("= 100", { timeout: 5_000 });
});

test("converter: bmi-calculator shows BMI result", async ({ page }) => {
  await page.goto("/tools/bmi-calculator");
  await page.locator(".card input[type=number]").first().fill("70");  // weight kg
  await page.locator(".card input[type=number]").nth(1).fill("175"); // height cm
  await expect(page.locator(".card").first()).toContainText(/22|normal/i, { timeout: 5_000 });
});

test("converter: date-diff-calculator shows difference", async ({ page }) => {
  await page.goto("/tools/date-diff-calculator");
  const inputs = page.locator(".card input[type=date]");
  await inputs.first().fill("2024-01-01");
  await inputs.nth(1).fill("2024-12-31");
  await expect(page.locator(".card").first()).toContainText("365", { timeout: 5_000 });
});

test("converter: calculator performs addition", async ({ page }) => {
  await page.goto("/tools/calculator");
  await page.locator(".card").getByRole("button", { name: "7" }).click();
  await page.locator(".card").getByRole("button", { name: "+" }).click();
  await page.locator(".card").getByRole("button", { name: "3" }).click();
  await page.locator(".card").getByRole("button", { name: "=" }).click();
  await expect(page.locator(".card").first()).toContainText("10", { timeout: 5_000 });
});

// ─── IMAGE TOOLS ──────────────────────────────────────────────────────────────

test("image: webp-to-jpg accepts PNG and shows download", async ({ page }) => {
  await page.goto("/tools/webp-to-jpg");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card").getByRole("button", { name: /download/i })
      .or(page.locator(".card").getByRole("link", { name: /download/i }))
      .first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: webp-to-png accepts PNG and shows download", async ({ page }) => {
  await page.goto("/tools/webp-to-png");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card").getByRole("button", { name: /download/i })
      .or(page.locator(".card").getByRole("link", { name: /download/i }))
      .first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-cropper accepts image and shows crop button", async ({ page }) => {
  await page.goto("/tools/image-cropper");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card").getByRole("button", { name: /crop/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-rotator accepts image and shows download", async ({ page }) => {
  await page.goto("/tools/image-rotator");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download], .card").getByRole("link", { name: /download/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-flipper accepts image and shows download", async ({ page }) => {
  await page.goto("/tools/image-flipper");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download]").first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: grayscale-converter accepts image and shows download", async ({ page }) => {
  await page.goto("/tools/grayscale-converter");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download]").first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-to-pdf accepts images and shows generate button", async ({ page }) => {
  await page.goto("/tools/image-to-pdf");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card").getByRole("button", { name: /generate pdf/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: meme-generator accepts image and shows download", async ({ page }) => {
  await page.goto("/tools/meme-generator");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download]").first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: image-watermark accepts image and shows download", async ({ page }) => {
  await page.goto("/tools/image-watermark");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download]").first()
  ).toBeVisible({ timeout: 10_000 });
});

test("image: svg-to-png page loads correctly", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/tools/svg-to-png");
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toHaveLength(0);
});

test("image: favicon-generator accepts image and shows sizes", async ({ page }) => {
  await page.goto("/tools/favicon-generator");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(page.locator(".card").first()).toContainText(/16|32|64|128|256/i, { timeout: 10_000 });
});

test("image: image-color-picker accepts image and shows picker", async ({ page }) => {
  await page.goto("/tools/image-color-picker");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(page.locator(".card canvas, .card img").first()).toBeVisible({ timeout: 10_000 });
});

test("image: base64-to-image renders from data URL", async ({ page }) => {
  await page.goto("/tools/base64-to-image");
  // Minimal 1x1 red PNG base64
  const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";
  await page.locator("textarea").first().fill(dataUrl);
  await expect(page.locator(".card img").first()).toBeVisible({ timeout: 5_000 });
});

// ─── PDF TOOLS ────────────────────────────────────────────────────────────────

test("pdf: pdf-to-image accepts PDF and shows render progress or pages", async ({ page }) => {
  await page.goto("/tools/pdf-to-image");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByText(/rendering|page 1|download page/i).first()
  ).toBeVisible({ timeout: 15_000 });
});

test("pdf: pdf-page-remover accepts PDF and shows page buttons", async ({ page }) => {
  await page.goto("/tools/pdf-page-remover");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByRole("button", { name: "1" }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-page-reorder accepts PDF and shows page list", async ({ page }) => {
  await page.goto("/tools/pdf-page-reorder");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByText(/page 1|reorder/i).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-rotator accepts PDF and shows rotation controls", async ({ page }) => {
  await page.goto("/tools/pdf-rotator");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card select, .card").getByText(/0°|90°|rotate/i).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-compressor accepts PDF and shows compress button", async ({ page }) => {
  await page.goto("/tools/pdf-compressor");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByRole("button", { name: /compress/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-metadata accepts PDF and shows metadata fields", async ({ page }) => {
  await page.goto("/tools/pdf-metadata");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  // After loading, metadata inputs appear (Title, Author, Subject)
  await expect(
    page.locator(".card").getByText(/pages|title|author/i).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-password-remover shows upload zone", async ({ page }) => {
  await page.goto("/tools/pdf-password-remover");
  await expect(page.locator("h1")).toBeVisible();
  // Upload zone label is visible (the hidden input is inside a label)
  await expect(page.locator(".card label").first()).toBeVisible();
});

test("pdf: pdf-watermark accepts PDF and shows apply button", async ({ page }) => {
  await page.goto("/tools/pdf-watermark");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByRole("button", { name: /apply|watermark/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

test("pdf: pdf-blank-page-inserter accepts PDF and shows insert button", async ({ page }) => {
  await page.goto("/tools/pdf-blank-page-inserter");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.pdf"));
  await expect(
    page.locator(".card").getByRole("button", { name: /insert/i }).first()
  ).toBeVisible({ timeout: 10_000 });
});

// ─── MISC TOOLS ───────────────────────────────────────────────────────────────

test("misc: coin-dice shows result on flip", async ({ page }) => {
  await page.goto("/tools/coin-dice");
  await page.locator(".card").getByRole("button", { name: "Flip Coin" }).click();
  await expect(
    page.locator(".card").first().getByText(/heads|tails/i).first()
  ).toBeVisible({ timeout: 3_000 });
});

test("misc: color-palette-generator shows palette", async ({ page }) => {
  await page.goto("/tools/color-palette-generator");
  await page.locator(".card").getByRole("button", { name: "Generate" }).click();
  await expect(page.locator(".card").first()).toContainText(/#[0-9a-fA-F]{6}/, { timeout: 5_000 });
});

test("misc: gradient-generator shows CSS output", async ({ page }) => {
  await page.goto("/tools/gradient-generator");
  await expect(page.locator(".card").first()).toContainText(/linear-gradient|radial-gradient/, { timeout: 5_000 });
});

test("misc: placeholder-image generates and shows image", async ({ page }) => {
  await page.goto("/tools/placeholder-image");
  await page.locator(".card").getByRole("button", { name: "Generate Placeholder" }).click();
  await expect(page.locator(".card img").first()).toBeVisible({ timeout: 5_000 });
});

test("misc: invoice-number-generator generates invoice number", async ({ page }) => {
  await page.goto("/tools/invoice-number-generator");
  await page.locator(".card").getByRole("button", { name: "Generate" }).click();
  await expect(page.locator(".card code").first()).toBeVisible({ timeout: 5_000 });
  const text = await page.locator(".card code").first().textContent();
  expect(text).toContain("INV");
});

test("misc: qr-scanner shows upload zone", async ({ page }) => {
  await page.goto("/tools/qr-scanner");
  await expect(page.locator("input[type=file], .card").first()).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

test("misc: png-to-svg accepts PNG and shows SVG output", async ({ page }) => {
  await page.goto("/tools/png-to-svg");
  await page.locator("input[type=file]").setInputFiles(path.join(FIXTURES, "test.png"));
  await expect(
    page.locator(".card a[download]").first()
  ).toBeVisible({ timeout: 10_000 });
});

test("misc: image-color-picker page loads correctly", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/tools/image-color-picker");
  await expect(page.locator("h1")).toBeVisible();
  expect(errors).toHaveLength(0);
});

// ─── NO-CRASH SMOKE FOR REMAINING TOOLS ──────────────────────────────────────

const smokeTools = [
  "heic-to-jpg",
  "text-encryptor",
  "words-to-number",
  "base-converter",
  "percentage-calculator",
  "bmi-calculator",
  "date-diff-calculator",
  "calculator",
  "coin-dice",
  "color-palette-generator",
  "gradient-generator",
  "placeholder-image",
  "invoice-number-generator",
  "qr-scanner",
];

for (const slug of smokeTools) {
  test(`smoke: ${slug} loads without crash`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/tools/${slug}`);
    await expect(page.locator("h1")).toBeVisible();
    expect(errors, `pageerror on ${slug}`).toHaveLength(0);
  });
}
