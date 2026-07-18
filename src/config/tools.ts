export type Faq = { question: string; answer: string };

export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  component: string;
  longDescription: string;
  howToUse: string[];
  faqs: Faq[];
  keywords: string[];
};

export const tools: Tool[] = [
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in any text.",
    category: "Text",
    icon: "FileText",
    component: "WordCounter",
    longDescription:
      "Hitting a word limit — or trying to reach one — is frustrating when your editor doesn't show a live count. This Word Counter tracks six metrics simultaneously as you type or paste: word count, total characters, characters excluding spaces, sentence count, paragraph count, and estimated reading time at 200 words per minute. Words are split on any whitespace sequence, so multiple spaces and blank lines don't inflate the count. Sentences are detected by .  !  ? delimiters, and paragraphs by double line breaks — matching the logic most academic style guides use. Reading time is always rounded up to the nearest minute. Practical uses include checking that a LinkedIn post stays under 3,000 characters, verifying an essay meets a 500-word minimum, keeping an SEO meta description under 160 characters, or confirming a tweet fits within 280 characters. Everything runs locally in your browser — no paste limit, no sign-up, no data sent anywhere.",
    howToUse: [
      "Paste or type your text into the large textarea.",
      "The six stat cards below (Words, Characters, No Spaces, Sentences, Paragraphs, Read Time) update instantly with every keystroke.",
      "Delete or clear the textarea to reset all counts back to zero.",
    ],
    keywords: [
      "word counter online free",
      "count words and characters online",
      "word count checker for essays",
      "character counter with spaces",
      "reading time estimator",
      "word counter no sign up",
      "sentence and paragraph counter",
      "word count tool for SEO",
    ],
    faqs: [
      {
        question: "How exactly are words counted?",
        answer:
          "The text is trimmed and split on any whitespace sequence (spaces, tabs, newlines) using a regex. Empty segments are filtered out, so multiple consecutive spaces count as one separator — matching the behaviour of Microsoft Word and Google Docs.",
      },
      {
        question: "What is the difference between 'Characters' and 'No Spaces'?",
        answer:
          "'Characters' is the raw length of the string including every space and newline. 'No Spaces' strips all whitespace characters first, giving you the count of printable characters only — useful for SMS or Twitter character limits.",
      },
      {
        question: "How is reading time calculated?",
        answer:
          "Reading time uses 200 words per minute, a widely cited average for adult silent reading. The result is always rounded up to the nearest whole minute, so a 210-word text shows 2 min, not 1 min.",
      },
      {
        question: "Is there a maximum text length?",
        answer:
          "There is no enforced limit. The tool handles large pastes — entire book chapters or long reports — without issue, though very large inputs (100,000+ words) may cause a brief lag on older devices.",
      },
      {
        question: "Is my text stored or sent to a server?",
        answer:
          "No. All counting happens in your browser using JavaScript. Your text never leaves your device and is not logged anywhere.",
      },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case, camelCase, snake_case, or kebab-case instantly.",
    category: "Text",
    icon: "Type",
    component: "CaseConverter",
    longDescription:
      "Accidentally typed a paragraph with Caps Lock on? Need to rename a batch of variables from camelCase to snake_case? This Case Converter handles six distinct casing formats in one click: UPPERCASE, lowercase, Title Case (every word capitalised), camelCase (first word lowercase, subsequent words capitalised, no spaces), snake_case (all lowercase joined by underscores), and kebab-case (all lowercase joined by hyphens). The conversion is applied to the entire input at once — paste a full function name, a heading, or a block of copy and switch formats instantly. Non-alphabetic characters like numbers, punctuation, and symbols are preserved exactly as entered. Developers use it most for normalising variable names and API keys; writers use it to fix accidental caps lock or format article titles consistently. The result appears in a second textarea so you can compare before copying.",
    howToUse: [
      "Type or paste your text into the top textarea.",
      "Click one of the six format buttons: UPPERCASE, lowercase, Title Case, camelCase, snake_case, or kebab-case.",
      "The converted result appears in the output textarea below.",
      "Click the Copy button in the top-right corner of the output to copy to clipboard.",
    ],
    keywords: [
      "text case converter online",
      "convert text to camelCase online",
      "snake_case converter",
      "kebab-case generator",
      "title case converter free",
      "uppercase to lowercase converter",
      "fix caps lock text online",
      "camelcase to snake_case converter",
    ],
    faqs: [
      {
        question: "What is the difference between camelCase and snake_case?",
        answer:
          "camelCase joins words by capitalising each word after the first, with no separator (e.g. myVariableName). snake_case joins words with underscores in all lowercase (e.g. my_variable_name). camelCase is common in JavaScript; snake_case is standard in Python.",
      },
      {
        question: "Does Title Case capitalise every word including 'and', 'the', 'of'?",
        answer:
          "Yes. The current implementation capitalises every word. It does not apply AP or Chicago style rules that leave short prepositions and articles in lowercase.",
      },
      {
        question: "Are numbers and punctuation affected?",
        answer:
          "No. Only alphabetic characters are changed. Numbers, punctuation, and symbols pass through unchanged.",
      },
      {
        question: "Is there a character limit?",
        answer:
          "No hard limit. The tool handles large blocks of text — entire code files or long articles — without issue.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly.",
    category: "Code",
    icon: "Braces",
    component: "JsonFormatter",
    longDescription:
      "Minified API responses are nearly impossible to read, and a single misplaced comma can silently break a config file. This JSON Formatter uses the browser's native JSON.parse() to validate your input first — if there's a syntax error, the exact error message from the JavaScript engine is shown in red below the editor so you know precisely what went wrong. On valid JSON, clicking Format produces a 2-space-indented pretty-print in the output panel; clicking Minify strips all whitespace to produce the most compact representation for reducing HTTP payload size. Both panels are editable textareas, so you can paste into either side. Common use cases include debugging REST API responses from tools like Postman or curl, formatting package.json or tsconfig.json before committing, and compressing JSON config before embedding it in an environment variable. Nothing is sent to any server — the entire parse-and-stringify cycle runs in your browser tab.",
    howToUse: [
      "Paste your raw or minified JSON into the left 'Input JSON' textarea.",
      "Click Format to pretty-print with 2-space indentation, or Minify to compact it into a single line.",
      "If the JSON is invalid, a red error message appears below the buttons describing the syntax problem.",
      "Copy the result from the right 'Output' textarea.",
    ],
    keywords: [
      "json formatter online",
      "json beautifier free",
      "pretty print json online",
      "json validator and formatter",
      "minify json online",
      "format json without installing software",
      "json syntax error checker",
      "json indentation tool",
    ],
    faqs: [
      {
        question: "How does it detect JSON errors?",
        answer:
          "It calls the browser's built-in JSON.parse() on your input. If parsing fails, the native JavaScript error message is displayed — for example 'Unexpected token } at position 42' — which tells you exactly where the problem is.",
      },
      {
        question: "What indentation style does Format use?",
        answer:
          "Format uses 2-space indentation via JSON.stringify(parsed, null, 2), which is the most common convention in JavaScript and TypeScript projects.",
      },
      {
        question: "Can I format JSON with comments (JSONC)?",
        answer:
          "No. Standard JSON does not allow comments. If your input contains // or /* */ comments, JSON.parse will throw a syntax error. Strip comments before pasting.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "No hard limit, but JSON inputs above ~5 MB may cause a brief freeze while the browser parses and stringifies the data. For very large files, a desktop tool like jq is more appropriate.",
      },
      {
        question: "Is my JSON data sent to a server?",
        answer:
          "No. The formatter runs entirely in your browser using JavaScript. Your data never leaves your device, making it safe for API keys, tokens, and private config files.",
      },
    ],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder / Decoder",
    description: "Encode plain text to Base64 or decode Base64 strings back to readable text instantly.",
    category: "Code",
    icon: "Binary",
    component: "Base64EncoderDecoder",
    longDescription:
      "Base64 encoding turns arbitrary text or binary data into a string of 64 printable ASCII characters, making it safe to embed in JSON payloads, HTTP headers, data URLs, and email bodies that can't handle raw binary. This encoder uses btoa() with a UTF-8 pre-encoding step (encodeURIComponent + unescape) so it correctly handles non-ASCII characters like accented letters, emoji, and CJK text — a common failure point in naive implementations. The decoder reverses the process using atob() with the same UTF-8 unwrapping. Paste your plain text on the left, click Encode, and the Base64 string appears on the right. To decode, paste a Base64 string and click Decode. If the input is not valid Base64, an error message is shown immediately. Typical uses include encoding Basic Auth credentials (username:password) before adding them to an Authorization header, inspecting JWT payloads, and embedding small text blobs in HTML data attributes.",
    howToUse: [
      "Paste your plain text or Base64 string into the left 'Input' textarea.",
      "Click Encode to convert plain text to Base64, or Decode to convert Base64 back to plain text.",
      "The result appears in the right 'Output' textarea — select all and copy it from there.",
      "If decoding fails (invalid Base64), a red error message appears below the buttons.",
    ],
    keywords: [
      "base64 encoder decoder online",
      "encode text to base64 free",
      "decode base64 string online",
      "base64 converter no install",
      "base64 encode utf-8 text",
      "base64 decode to plain text",
      "online base64 tool",
      "base64 for http headers",
    ],
    faqs: [
      {
        question: "Does it handle Unicode and emoji correctly?",
        answer:
          "Yes. The encoder uses encodeURIComponent() before btoa() to handle multi-byte UTF-8 characters. Many simpler tools fail on characters outside the Latin-1 range — this one does not.",
      },
      {
        question: "What happens if I try to decode an invalid Base64 string?",
        answer:
          "The tool catches the error from atob() and displays 'Invalid Base64 string.' in red. Common causes are missing padding (= characters) or characters outside the Base64 alphabet.",
      },
      {
        question: "Can I encode images with this tool?",
        answer:
          "This tool encodes text strings only. For converting an image file to a Base64 data URL, use the dedicated Image to Base64 tool on ToolBrigade.",
      },
      {
        question: "Does it support URL-safe Base64?",
        answer:
          "No. Standard Base64 uses + and / which are not URL-safe. URL-safe Base64 replaces those with - and _. This tool outputs standard Base64 only.",
      },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    description: "Percent-encode URL components or decode %xx sequences back to readable text instantly.",
    category: "Code",
    icon: "Link",
    component: "UrlEncoderDecoder",
    longDescription:
      "Spaces, ampersands, equals signs, and non-ASCII characters inside a URL query string must be percent-encoded or the server will misparse the request. This tool applies encodeURIComponent() to encode and decodeURIComponent() to decode — the same functions browsers use internally. Encoding converts every character except A–Z, a–z, 0–9, and - _ . ! ~ * ' ( ) into its %XX hex form: a space becomes %20, an ampersand becomes %26, and a Chinese character like 中 becomes its three-byte UTF-8 sequence %E4%B8%AD. Decoding reverses this exactly. Paste the full encoded query string to decode it all at once, or paste a raw parameter value to encode it before appending to a URL. Backend developers use this when constructing redirect_uri parameters for OAuth flows; frontend developers use it when debugging fetch() calls where query params contain special characters.",
    howToUse: [
      "Paste your raw text or percent-encoded string into the left 'Input' textarea.",
      "Click Encode to convert special characters to %XX sequences, or Decode to convert %XX sequences back to readable text.",
      "The result appears in the right 'Output' textarea ready to copy.",
      "If decoding fails due to a malformed sequence, a red error message is shown.",
    ],
    keywords: [
      "url encoder decoder online",
      "percent encode url online free",
      "decode url encoded string",
      "encodeURIComponent online tool",
      "url encode special characters",
      "decode %20 url online",
      "query string encoder",
      "url encoding tool no install",
    ],
    faqs: [
      {
        question: "Should I encode the full URL or just the query parameter value?",
        answer:
          "Encode individual query parameter values only, not the full URL. Encoding the full URL will turn the : after https into %3A and the / path separators into %2F, breaking the URL entirely.",
      },
      {
        question: "What is the difference between %20 and + for spaces?",
        answer:
          "encodeURIComponent encodes spaces as %20. Some older form-submission encodings use + for spaces (application/x-www-form-urlencoded). This tool uses %20, which is correct for modern URLs.",
      },
      {
        question: "Does it handle non-ASCII characters like Chinese or Arabic?",
        answer:
          "Yes. Non-ASCII characters are first converted to their UTF-8 byte sequences, then each byte is percent-encoded. For example, the Chinese character 中 encodes to %E4%B8%AD.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. Encoding and decoding use the browser's built-in encodeURIComponent and decodeURIComponent functions. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "px-to-rem",
    name: "PX to REM Converter",
    description: "Convert pixel values to REM units (and back) with a configurable root font size.",
    category: "Converter",
    icon: "Ruler",
    component: "PxToRem",
    longDescription:
      "Hardcoding pixel values in CSS locks your layout to a fixed scale and breaks accessibility for users who increase their browser's base font size. REM units solve this: 1rem equals the root font size (html element), so if a user sets their browser to 20px, a 1.5rem element scales to 30px automatically. The formula is simple — rem = px ÷ rootFontSize — but doing it mentally for every value in a design file is tedious. This converter lets you enter any pixel value, set the root font size (default 16px, but Tailwind projects often use 10px for easier math), and get the REM equivalent instantly. It also converts in reverse: enter a REM value to get the pixel equivalent. Front-end developers use it when translating Figma designs to CSS, setting font-size and spacing tokens in a design system, or auditing existing stylesheets for accessibility compliance with WCAG 1.4.4.",
    howToUse: [
      "Enter a pixel value in the PX field, or a REM value in the REM field.",
      "Adjust the root font size if your project uses a non-standard base (e.g. 10px for Tailwind's rem scale).",
      "The converted value updates instantly in the opposite field.",
      "Copy the REM value directly into your CSS or design token.",
    ],
    keywords: [
      "px to rem converter online",
      "pixels to rem calculator",
      "rem to px converter",
      "css px rem conversion tool",
      "px to rem with custom root font size",
      "tailwind px to rem",
      "accessible css unit converter",
      "convert px to rem free",
    ],
    faqs: [
      {
        question: "Why do most projects use 16px as the root font size?",
        answer:
          "16px is the default font size in every major browser. Unless your CSS explicitly sets a different font-size on the html element, 1rem = 16px for your users.",
      },
      {
        question: "Why use REM instead of PX for accessibility?",
        answer:
          "Users can increase their browser's default font size in settings. PX values ignore this preference; REM values scale with it. WCAG Success Criterion 1.4.4 requires text to be resizable up to 200% without loss of content.",
      },
      {
        question: "What root font size should I use for Tailwind CSS?",
        answer:
          "Tailwind's default config uses 16px. Some developers set html { font-size: 62.5% } (= 10px) so that 1rem = 10px for easier mental math, but this requires adjusting all rem values accordingly.",
      },
      {
        question: "Can I convert REM back to PX?",
        answer:
          "Yes. Enter a value in the REM field and the PX equivalent is calculated instantly using the formula px = rem × rootFontSize.",
      },
    ],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    description: "Enter a HEX color and instantly get the RGB, HSL, and component values side by side.",
    category: "Converter",
    icon: "Palette",
    component: "ColorConverter",
    longDescription:
      "Design tools output HEX codes, CSS expects rgb() or hsl(), and Tailwind config wants object notation — switching between them manually is error-prone. This Color Converter takes a 6-digit HEX value (typed or picked with the native color picker) and simultaneously outputs four representations: the CSS rgb() function string, the CSS hsl() function string, the RGB object notation (r: 59, g: 130, b: 246), and the HSL object notation (h: 217°, s: 91%, l: 60%). The HEX-to-RGB conversion reads each pair of hex digits as a base-16 integer. The RGB-to-HSL conversion uses the standard luminance formula, rounding H to the nearest degree and S/L to the nearest percent. A live colour swatch below the inputs shows the actual colour so you can visually confirm the value. Useful for web developers translating Figma colour tokens into CSS variables, designers checking contrast ratios, and anyone who needs to move a colour between different tools or codebases.",
    howToUse: [
      "Click the colour swatch on the left to open the native browser colour picker, or type a 6-digit HEX code (e.g. #3b82f6) directly into the HEX input.",
      "The RGB, HSL, RGB object, and HSL object values update instantly below.",
      "Click any value to select it, then copy it to your clipboard.",
      "A colour preview swatch at the bottom confirms the selected colour visually.",
    ],
    keywords: [
      "hex to rgb converter online",
      "hex to hsl converter",
      "rgb to hsl online free",
      "color format converter css",
      "convert hex color to rgb",
      "hsl color converter",
      "css color converter tool",
      "hex color to tailwind rgb",
    ],
    faqs: [
      {
        question: "Does it accept shorthand HEX like #fff?",
        answer:
          "No. The tool requires the full 6-digit format (#ffffff). Shorthand 3-digit HEX is not currently expanded automatically.",
      },
      {
        question: "How accurate is the HSL conversion?",
        answer:
          "Hue is rounded to the nearest degree (0–360), saturation and lightness to the nearest percent. This matches the precision used by CSS and most design tools.",
      },
      {
        question: "Does it support alpha / transparency?",
        answer:
          "No. Only fully opaque colours (no alpha channel) are supported. RGBA and HSLA are not currently handled.",
      },
      {
        question: "Can I enter an RGB or HSL value and convert to HEX?",
        answer:
          "Currently the tool only accepts HEX as input. RGB-to-HEX and HSL-to-HEX conversion may be added in a future update.",
      },
    ],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact pixel dimensions in your browser — no upload, no server.",
    category: "Image",
    icon: "ImageIcon",
    component: "ImageResizer",
    longDescription:
      "Uploading an oversized image to a CMS, email template, or social platform wastes bandwidth and slows page loads. This Image Resizer draws your image onto an HTML Canvas at the dimensions you specify, then triggers a PNG download — all without sending the file anywhere. Drop or click-to-upload any browser-supported image format (JPG, PNG, WebP, GIF, AVIF), and the tool pre-fills the width and height fields with the original pixel dimensions so you can see exactly what you're starting from. Change either dimension to your target size and click Download Resized. The tool does not enforce aspect ratio automatically — you control both axes independently, which is useful when you need to hit an exact canvas size like 1200×630 for Open Graph images or 800×800 for product thumbnails. The output is always PNG to preserve quality through the Canvas re-encoding step.",
    howToUse: [
      "Drop an image onto the upload zone or click it to browse for a file.",
      "The original pixel dimensions are shown below the preview and pre-filled into the Width and Height fields.",
      "Edit the Width and/or Height values to your target dimensions.",
      "Click 'Download Resized' — the resized PNG is saved directly to your device.",
    ],
    keywords: [
      "image resizer online free",
      "resize image to exact pixels",
      "resize photo without uploading",
      "change image dimensions online",
      "resize image for open graph",
      "resize jpg png online",
      "image resize tool no watermark",
      "resize image for website",
    ],
    faqs: [
      {
        question: "Does it maintain aspect ratio automatically?",
        answer:
          "No. Width and height are set independently. If you want to maintain the aspect ratio, calculate the proportional dimension manually before entering it (e.g. if original is 1600×900 and you set width to 800, set height to 450).",
      },
      {
        question: "What format is the output?",
        answer:
          "The output is always PNG, generated via the Canvas toDataURL API. If you need a JPG output, use the Image Compressor tool which outputs JPEG.",
      },
      {
        question: "Is there a maximum input image size?",
        answer:
          "No hard limit, but images above ~20 megapixels may be slow to draw onto the Canvas depending on your device. Most web and social media images are well within this range.",
      },
      {
        question: "Will resizing reduce the file size?",
        answer:
          "Reducing dimensions generally reduces file size, but PNG is lossless so the output may still be larger than a compressed JPG at the same dimensions. For smaller files, compress after resizing.",
      },
    ],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    description: "Convert any image file to a Base64 data URL for embedding in HTML, CSS, or JSON.",
    category: "Image",
    icon: "Image",
    component: "ImageToBase64",
    longDescription:
      "Embedding an image as a Base64 data URL eliminates an HTTP request, which matters for small critical assets like inline icons, email template images, and loading spinners. This tool uses the browser's FileReader API to read your image file and produce the full data URL string in the format data:image/png;base64,iVBORw0K... — ready to paste directly into an HTML src attribute, a CSS background-image property, or a JSON payload. The output textarea shows the complete data URL and a live image preview confirms the encoding is correct. Click Copy to grab the full string. Any image format your browser supports works as input: JPG, PNG, WebP, GIF, SVG, AVIF. The conversion is entirely local — the FileReader API reads the file from disk without any network request. Note that Base64 encoding increases file size by approximately 33%, so this technique is best suited for images under ~10 KB.",
    howToUse: [
      "Click the upload zone to browse for an image file (JPG, PNG, WebP, GIF, SVG, or AVIF).",
      "The Base64 data URL is generated instantly and shown in the output textarea.",
      "A live image preview below the textarea confirms the encoding is correct.",
      "Click the Copy button to copy the full data URL to your clipboard.",
    ],
    keywords: [
      "image to base64 converter online",
      "convert image to base64 data url",
      "encode image as base64 free",
      "jpg to base64 online",
      "png to base64 encoder",
      "base64 image for html css",
      "inline image base64 generator",
      "svg to base64 online",
    ],
    faqs: [
      {
        question: "What is a Base64 data URL?",
        answer:
          "A data URL embeds the file content directly in the URL string using Base64 encoding. It starts with data:image/png;base64, followed by the encoded bytes. Browsers can render it as an image without fetching a separate file.",
      },
      {
        question: "Why does Base64 make the file larger?",
        answer:
          "Base64 represents every 3 bytes of binary data as 4 ASCII characters, increasing size by roughly 33%. For large images this overhead is significant; for small icons under 10 KB it's usually acceptable.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "No hard limit, but very large images produce extremely long strings that may be slow to copy or paste. For images above 1 MB, consider compressing first.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The FileReader API reads the file directly from your local disk. No data is transmitted over the network.",
      },
    ],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, and WebP images client-side using the Canvas API — no uploads, no server.",
    category: "Image",
    icon: "FileImage",
    component: "ImageCompressor",
    longDescription:
      "Large image files are one of the most common causes of slow page loads and poor Core Web Vitals scores. This compressor draws your image onto an HTML Canvas element and re-exports it using the browser's toBlob() API at a quality level you control with a slider (1–100). For JPG and WebP, this is lossy re-encoding — lowering the quality value discards fine detail to achieve smaller file sizes. For PNG, the Canvas re-encodes losslessly, so the quality slider has minimal effect; converting a PNG to WebP or JPG is more effective for size reduction. Three stat cards show the original size, compressed size, and percentage saved so you can judge the trade-off before downloading. The compressed image preview updates automatically as you drag the slider. A quality of 75–85 is the sweet spot for most web photos; thumbnails and background images can often go as low as 60 without visible degradation. No file ever leaves your device.",
    howToUse: [
      "Drop a JPG, PNG, or WebP image onto the upload zone, or click it to browse.",
      "Drag the Quality slider (1–100) left for a smaller file or right for higher quality — the compressed preview and size stats update automatically.",
      "Check the Original, Compressed, and Saved stat cards to evaluate the trade-off.",
      "Click 'Download Compressed' to save the output image to your device.",
    ],
    keywords: [
      "image compressor online free",
      "compress jpg online without losing quality",
      "reduce image file size online",
      "compress png online",
      "webp compressor online",
      "compress image for website",
      "image size reducer no upload",
      "compress photo for email",
    ],
    faqs: [
      {
        question: "How does the compression actually work?",
        answer:
          "The image is drawn onto an HTML Canvas element at its original dimensions. The Canvas toBlob() method then re-encodes it as JPEG (for JPG/WebP input) or PNG at the quality value you set. Lower quality means the JPEG encoder discards more high-frequency detail, producing a smaller file.",
      },
      {
        question: "Why doesn't the quality slider shrink my PNG much?",
        answer:
          "PNG uses lossless compression, so the Canvas re-encoding doesn't discard pixel data regardless of the quality setting. For significant PNG size reduction, convert to WebP or JPG using the dedicated converter tools.",
      },
      {
        question: "What quality setting should I use?",
        answer:
          "75–85% gives a good balance for most web photos. Hero images and product photos: 80–85%. Thumbnails and background images: 60–75%. Below 60% you'll typically see visible JPEG artefacts.",
      },
      {
        question: "Can I compress multiple images at once?",
        answer:
          "Currently the tool processes one image at a time. Upload a new file to replace the current one.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The entire process uses the Canvas API in your browser. Your image never leaves your device.",
      },
    ],
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG Converter",
    description: "Convert PNG images to JPG in your browser — transparency filled white, quality adjustable.",
    category: "Image",
    icon: "ImageIcon",
    component: "PngToJpg",
    longDescription:
      "PNG files are often 3–5× larger than an equivalent JPG because PNG is lossless. When you don't need transparency — for photographs, banners, or social media images — converting to JPG dramatically reduces file size. This converter draws your PNG onto a Canvas with a white background fill (applied before the image is drawn, so transparent pixels become white rather than black), then exports it as a JPEG at the quality level you choose with a slider (1–100, default 92). A side-by-side preview shows the original PNG and the output JPG so you can compare before downloading. The conversion uses the Canvas toDataURL('image/jpeg', quality) method entirely in your browser — no file is sent anywhere. Photographers converting screenshots, web developers optimising CMS uploads, and designers preparing assets for platforms that don't serve PNG efficiently are the primary users.",
    howToUse: [
      "Click the upload area and select a PNG file from your device.",
      "Drag the Quality slider to set the JPEG compression level (1–100, default 92).",
      "Compare the Original PNG and Output JPG previews side by side.",
      "Click 'Download JPG' to save the converted file.",
    ],
    keywords: [
      "png to jpg converter online free",
      "convert png to jpg without losing quality",
      "png to jpeg online no watermark",
      "png to jpg with white background",
      "reduce png file size by converting to jpg",
      "png jpg converter no upload",
      "batch png to jpg",
      "transparent png to white jpg",
    ],
    faqs: [
      {
        question: "What happens to transparent areas in the PNG?",
        answer:
          "Before drawing the image, the Canvas is filled with solid white (#ffffff). Transparent pixels in the PNG therefore become white in the JPG output. JPG does not support transparency, so this fill is necessary.",
      },
      {
        question: "What quality setting gives the best file size reduction?",
        answer:
          "The default of 92 preserves near-lossless quality. For web use, 75–85 gives a good balance. Below 70 you may see JPEG blocking artefacts on sharp edges and text.",
      },
      {
        question: "Will the image dimensions change?",
        answer:
          "No. The output JPG has exactly the same pixel dimensions as the input PNG. Only the format and file size change.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The Canvas API runs entirely in your browser. Your PNG file never leaves your device.",
      },
    ],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG Converter",
    description: "Convert JPG images to lossless PNG format in your browser — no upload required.",
    category: "Image",
    icon: "ImageIcon",
    component: "JpgToPng",
    longDescription:
      "PNG's lossless compression makes it the right format when you need crisp edges, transparent backgrounds, or pixel-perfect fidelity — logos, icons, UI screenshots, and graphics with text all benefit from PNG over JPG. This converter loads your JPG onto a Canvas element and exports it as PNG using toDataURL('image/png'), which applies lossless encoding. A side-by-side preview shows the original JPG and the output PNG before you download. One important caveat: converting from JPG to PNG does not recover quality lost during the original JPEG compression. JPEG artefacts — the blocky distortions around edges and in smooth gradients — are baked into the pixel data and will appear in the PNG output too. What PNG does guarantee is that no further quality loss occurs from this point forward. The conversion runs entirely in your browser; no file is uploaded.",
    howToUse: [
      "Click the upload area and select a JPG or JPEG file.",
      "The PNG is generated instantly and shown in the Output PNG preview on the right.",
      "Click 'Download PNG' to save the converted file to your device.",
    ],
    keywords: [
      "jpg to png converter online free",
      "convert jpeg to png online",
      "jpg to png no watermark",
      "jpeg to lossless png",
      "convert jpg to png without quality loss",
      "jpg png converter no upload",
      "photo to png online",
      "jpg to transparent png",
    ],
    faqs: [
      {
        question: "Will converting JPG to PNG improve the image quality?",
        answer:
          "No. JPEG compression is lossy and irreversible. The artefacts already in the JPG are preserved in the PNG output. PNG prevents any further quality loss, but it cannot restore what JPEG already discarded.",
      },
      {
        question: "Why is the PNG output larger than the original JPG?",
        answer:
          "PNG is lossless and does not discard pixel data, so it typically produces larger files than JPEG for photographic content. This is expected and correct behaviour.",
      },
      {
        question: "Does the output PNG support transparency?",
        answer:
          "JPG has no transparency channel, so the output PNG will have no transparent areas. If you need a transparent PNG, you'll need to remove the background separately after conversion.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "No hard limit. Large JPGs may take a moment to draw onto the Canvas, but there is no enforced maximum.",
      },
    ],
  },
  {
    slug: "webp-to-jpg",
    name: "WebP to JPG Converter",
    description: "Convert WebP images to universally compatible JPG format — quality adjustable, no upload required.",
    category: "Image",
    icon: "ImageIcon",
    component: "WebpToJpg",
    longDescription:
      "WebP is Google's modern image format — smaller than JPG at equivalent quality — but it still isn't supported by every app, email client, or platform. Older versions of Outlook, some CMS upload fields, and certain social media schedulers reject WebP files outright. This converter draws your WebP onto a Canvas element, fills the background white (so any transparent areas become white rather than black), then re-encodes it as JPEG at the quality level you choose with a slider (1–100, default 92). A side-by-side preview shows the original WebP and the output JPG before you download. The conversion runs entirely in your browser using the Canvas toDataURL API — no file is sent to any server. Graphic designers exporting assets from Figma, developers debugging image pipelines, and anyone who received a WebP from a colleague and needs a JPG for a client deliverable are the typical users.",
    howToUse: [
      "Click the upload zone and select a WebP file from your device.",
      "Drag the Quality slider (1–100) to set the JPEG compression level — default is 92.",
      "Compare the Original WebP and Output JPG previews side by side.",
      "Click 'Download JPG' to save the converted file.",
    ],
    keywords: [
      "webp to jpg converter online free",
      "convert webp to jpeg online",
      "webp jpg converter no upload",
      "webp to jpg no watermark",
      "webp not supported convert to jpg",
      "webp to jpeg quality slider",
      "download webp as jpg",
      "webp to jpg for email",
    ],
    faqs: [
      {
        question: "Why does the converter fill transparent areas with white?",
        answer:
          "JPEG does not support an alpha (transparency) channel. Before encoding, the Canvas is filled with solid white so transparent WebP pixels become white rather than rendering as black or corrupted in the output.",
      },
      {
        question: "What quality setting should I use?",
        answer:
          "92 (the default) gives near-lossless quality. For web use where file size matters, 75–85 is a good balance. Below 70 you may see JPEG blocking artefacts on sharp edges.",
      },
      {
        question: "Will the output JPG be larger than the WebP?",
        answer:
          "Usually yes. WebP achieves better compression than JPEG at the same visual quality. Converting to JPG trades file size for compatibility.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The Canvas API runs entirely in your browser. Your WebP file never leaves your device.",
      },
    ],
  },
  {
    slug: "webp-to-png",
    name: "WebP to PNG Converter",
    description: "Convert WebP images to lossless PNG with transparency preserved — instant, no upload.",
    category: "Image",
    icon: "ImageIcon",
    component: "WebpToPng",
    longDescription:
      "When you need a WebP converted to PNG — to preserve transparency, to use in a tool that doesn't accept WebP, or to get a lossless copy for further editing — this converter handles it in one click. It loads your WebP onto a Canvas element and exports it using toDataURL('image/png'), which applies lossless PNG encoding. Unlike the WebP-to-JPG converter, no white background fill is applied here: transparent areas in the WebP are preserved as transparent areas in the PNG output, because PNG fully supports the alpha channel. A side-by-side preview shows the original and output before you download. The conversion is entirely local — no file is transmitted. UI designers exporting icon assets, developers who need a PNG version of a WebP logo for a platform that rejects WebP, and anyone archiving images in a universally editable format are the primary users.",
    howToUse: [
      "Click the upload zone and select a WebP file.",
      "The PNG is generated instantly and shown in the Output PNG preview on the right.",
      "Click 'Download PNG' to save the converted file to your device.",
    ],
    keywords: [
      "webp to png converter online free",
      "convert webp to png with transparency",
      "webp png converter no upload",
      "webp to png no watermark",
      "webp to lossless png",
      "transparent webp to png",
      "download webp as png",
      "webp to png for photoshop",
    ],
    faqs: [
      {
        question: "Is transparency preserved in the PNG output?",
        answer:
          "Yes. The Canvas draws the WebP without any background fill, so transparent pixels remain transparent in the PNG. This is the key difference from the WebP-to-JPG converter, which fills transparency with white.",
      },
      {
        question: "Will there be any quality loss?",
        answer:
          "No. PNG is lossless. The pixel data from the WebP is encoded into PNG without any additional compression artefacts.",
      },
      {
        question: "Why is the PNG larger than the original WebP?",
        answer:
          "WebP achieves better compression than PNG for most images. A larger PNG file is expected and correct — you're trading file size for lossless encoding and universal compatibility.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The Canvas API runs entirely in your browser. Your file never leaves your device.",
      },
    ],
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    description: "Write Markdown and see a live rendered HTML preview side by side.",
    category: "Text",
    icon: "BookOpen",
    component: "MarkdownPreview",
    longDescription:
      "Switching between a text editor and a browser to check how your Markdown renders is a constant interruption. This tool shows a live rendered preview in a split panel that updates with every keystroke. The parser handles the most common Markdown elements: # headings (h1–h3), **bold**, *italic*, `inline code`, [links](url), and - unordered lists. It runs a custom lightweight parser with no external dependencies, so there's no library to load and no network request. Paste a README draft, a blog post outline, or documentation content on the left and see exactly how it will render on the right. Technical writers drafting GitHub READMEs, developers writing API documentation, and bloggers working in Markdown-based CMSs like Jekyll or Hugo are the primary users. Everything runs locally — your content is never sent anywhere.",
    howToUse: [
      "Type or paste Markdown text into the left 'Markdown' panel.",
      "The rendered HTML preview updates in real time on the right as you type.",
      "Use standard syntax: # for h1, ## for h2, **text** for bold, *text* for italic, - for list items, [label](url) for links.",
    ],
    keywords: [
      "markdown preview online",
      "live markdown editor",
      "markdown renderer online free",
      "markdown to html preview",
      "github readme preview",
      "markdown viewer online",
      "real time markdown preview",
      "markdown editor no install",
    ],
    faqs: [
      {
        question: "What Markdown elements are supported?",
        answer:
          "Headings (h1–h3 via #, ##, ###), bold (**text**), italic (*text*), inline code (`text`), hyperlinks ([label](url)), and unordered lists (- item). Tables, task lists, and fenced code blocks are not currently supported.",
      },
      {
        question: "Does it support GitHub Flavored Markdown (GFM)?",
        answer:
          "Partially. Basic GFM elements like headings and bold/italic work. GFM-specific features like tables, strikethrough (~~text~~), and task list checkboxes are not supported by the current parser.",
      },
      {
        question: "Can I copy the rendered HTML?",
        answer:
          "The preview panel shows the rendered output visually. To get the raw HTML, use the Markdown to HTML Converter tool on ToolBrigade, which outputs the HTML source you can copy.",
      },
      {
        question: "Is my content saved or sent anywhere?",
        answer:
          "No. The parser runs entirely in your browser. Your Markdown text is not stored or transmitted.",
      },
    ],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    description: "Crop any image to exact pixel coordinates — set X, Y, width, and height manually.",
    category: "Image",
    icon: "Crop",
    component: "ImageCropper",
    longDescription:
      "When you need to extract a precise region from an image — a specific product area from a photo, a chart from a screenshot, or a face from a group shot — this cropper lets you define the crop rectangle by entering exact pixel values for X offset, Y offset, width, and height. After uploading, the tool displays the original image dimensions so you know the valid coordinate range. The four numeric inputs are clamped to prevent out-of-bounds crops: width is capped at (imageWidth - X) and height at (imageHeight - Y). Click 'Crop Image' and the extracted region is drawn onto a Canvas and shown as a preview. Download saves it as PNG. This coordinate-based approach is more precise than drag handles for use cases like extracting a fixed-size thumbnail from a known position, or cropping to exact dimensions required by an API or CMS.",
    howToUse: [
      "Click the upload zone and select an image file.",
      "The original image dimensions are shown below the preview.",
      "Enter X (left offset), Y (top offset), Width, and Height in pixels.",
      "Click 'Crop Image' to generate the cropped preview, then click 'Download Cropped' to save as PNG.",
    ],
    keywords: [
      "image cropper online free",
      "crop image to exact pixels",
      "crop image by coordinates",
      "image crop tool no upload",
      "crop photo online precise",
      "extract region from image",
      "crop image to specific size",
      "image crop x y width height",
    ],
    faqs: [
      {
        question: "Can I crop to a specific aspect ratio?",
        answer:
          "Not automatically. Set width and height manually to match your target ratio. For example, for a 16:9 crop at 800px wide, set height to 450.",
      },
      {
        question: "What happens if I enter coordinates outside the image bounds?",
        answer:
          "The inputs are clamped automatically. Width is limited to (imageWidth - X) and height to (imageHeight - Y), so you can't accidentally request pixels that don't exist.",
      },
      {
        question: "What format is the output?",
        answer:
          "PNG, generated via the Canvas API. The crop preserves the full colour depth of the original image.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The Canvas API processes the image entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "base64-to-image",
    name: "Base64 to Image",
    description: "Paste a Base64 string or data URL to instantly preview and download the decoded image.",
    category: "Image",
    icon: "Image",
    component: "Base64ToImage",
    longDescription:
      "API responses, CSS background properties, and HTML email templates sometimes contain images encoded as Base64 data URLs rather than file references. Decoding them manually to see what the image actually looks like is tedious. Paste either a full data URL (starting with data:image/...) or a raw Base64 string into the input, and the image is rendered as a live preview instantly. If you paste a raw Base64 string without the data: prefix, the tool automatically prepends data:image/png;base64, so it renders correctly. The detected image format (png, jpg, webp, gif, svg) is extracted from the data URL and used as the download file extension. An error message appears if the string is not valid Base64 or the browser can't decode the image format. Developers debugging REST API responses, inspecting email template source code, or verifying CSS background-image data URLs are the primary users.",
    howToUse: [
      "Paste a full data URL (data:image/png;base64,...) or a raw Base64 string into the textarea.",
      "The image preview renders instantly below the input.",
      "If the input is invalid, an error message appears.",
      "Click 'Download Image' to save the decoded image to your device.",
    ],
    keywords: [
      "base64 to image converter online",
      "decode base64 image online",
      "base64 image preview",
      "data url to image",
      "render base64 image online",
      "base64 string to png",
      "decode data url image",
      "base64 image decoder free",
    ],
    faqs: [
      {
        question: "What is a data URL?",
        answer:
          "A data URL embeds file content directly in the URL string using Base64 encoding. It starts with data:image/png;base64, (or another MIME type) followed by the encoded bytes. Browsers render it as an image without fetching a separate file.",
      },
      {
        question: "What if I paste a raw Base64 string without the data: prefix?",
        answer:
          "The tool automatically prepends data:image/png;base64, to the raw string so it can be rendered. If the image is actually a JPG or WebP, the preview may still work since browsers are lenient, but the download extension will be .png.",
      },
      {
        question: "What formats are supported?",
        answer:
          "Any image format your browser can render: PNG, JPG, WebP, GIF, and SVG. The format is detected from the MIME type in the data URL.",
      },
      {
        question: "Is my data sent to a server?",
        answer:
          "No. The decoding and rendering happen entirely in your browser. Your Base64 string is never transmitted.",
      },
    ],
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG Converter",
    description: "Convert iPhone HEIC photos to JPG in your browser using the heic2any library — no upload.",
    category: "Image",
    icon: "Smartphone",
    component: "HeicToJpg",
    longDescription:
      "iPhones have shot photos in HEIC (High Efficiency Image Container) format by default since iOS 11. HEIC files are roughly half the size of equivalent JPGs, but the format is not supported by Windows Photo Viewer, most Android apps, many web platforms, or older image editors. This converter uses the heic2any JavaScript library — loaded on demand in your browser — to decode the HEIC/HEIF container and re-encode it as JPEG at 92% quality. The conversion can take a few seconds for large files because the library does the full decode-and-encode cycle client-side. A loading indicator shows while processing. If the file is not a valid HEIC/HEIF, an error message is shown. The output is a standard JPG you can open anywhere. No file is uploaded — the heic2any library runs entirely in your browser tab.",
    howToUse: [
      "Click the upload zone and select a .heic or .heif file from your device.",
      "Wait for the conversion to complete — a 'Converting…' message shows while processing.",
      "The converted JPG preview appears when ready.",
      "Click 'Download JPG' to save the file.",
    ],
    keywords: [
      "heic to jpg converter online free",
      "convert iphone heic to jpg",
      "heif to jpeg online",
      "heic converter no upload",
      "open heic file on windows",
      "iphone photo to jpg converter",
      "heic to jpg without software",
      "convert heic online free",
    ],
    faqs: [
      {
        question: "Why are iPhone photos in HEIC format?",
        answer:
          "Apple adopted HEIC (based on the HEIF standard) in iOS 11 because it produces files roughly 50% smaller than JPEG at the same visual quality. However, HEIC is not universally supported outside Apple's ecosystem.",
      },
      {
        question: "Why does the conversion take a few seconds?",
        answer:
          "The heic2any library performs a full software decode of the HEIC container and re-encodes it as JPEG entirely in your browser. This is more CPU-intensive than a simple format swap and takes 2–10 seconds depending on file size and device speed.",
      },
      {
        question: "What quality is the output JPG?",
        answer:
          "The output is encoded at 92% JPEG quality, which preserves near-lossless visual fidelity while producing a reasonably sized file.",
      },
      {
        question: "Is my photo uploaded to a server?",
        answer:
          "No. The heic2any library is loaded into your browser and runs locally. Your photo never leaves your device.",
      },
    ],
  },
  {
    slug: "svg-to-png",
    name: "SVG to PNG Converter",
    description: "Convert SVG vector files to PNG raster images at 1×, 2×, 3×, or 4× scale in your browser.",
    category: "Image",
    icon: "Layers",
    component: "SvgToPng",
    longDescription:
      "SVG is the right format for logos and icons on the web, but many platforms — app stores, social media, email clients, and print workflows — require raster PNG files. This converter reads your SVG file as text, creates a Blob URL, draws it onto a Canvas at your chosen scale multiplier (1×, 1.5×, 2×, 2.5×, 3×, 3.5×, or 4×), and exports a PNG. The scale slider lets you control output resolution: 2× is standard for retina displays, 4× is suitable for large print exports. The Canvas dimensions are set to (SVG natural width × scale) so the output is always pixel-perfect at the chosen multiplier. If the SVG has no explicit width/height attributes, the Canvas defaults to 800×600. The conversion is entirely local — no file is uploaded. Developers exporting icon sets, designers preparing app store assets, and anyone who needs a raster version of a vector logo are the typical users.",
    howToUse: [
      "Click the upload zone and select an SVG file.",
      "Drag the Scale slider to choose the output resolution multiplier (1× to 4×).",
      "The PNG preview updates automatically as you adjust the scale.",
      "Click 'Download PNG' to save the rasterised image.",
    ],
    keywords: [
      "svg to png converter online free",
      "convert svg to png online",
      "svg to png 2x retina",
      "export svg as png",
      "svg rasterizer online",
      "svg to png no upload",
      "svg to high resolution png",
      "svg to png for app store",
    ],
    faqs: [
      {
        question: "What scale should I use?",
        answer:
          "Use 2× for standard retina/HiDPI displays. Use 4× for large print exports or when you need a very high-resolution PNG. 1× gives a 1:1 pixel match to the SVG's declared dimensions.",
      },
      {
        question: "What if my SVG has no width or height attributes?",
        answer:
          "The Canvas defaults to 800×600 pixels at 1× scale. Add explicit width and height attributes to your SVG for accurate output dimensions.",
      },
      {
        question: "Does it support all SVG features?",
        answer:
          "Most standard SVG features render correctly. Complex filters, external font references, or SVGs that use JavaScript may not render perfectly in all browsers.",
      },
      {
        question: "Is my SVG file uploaded to a server?",
        answer:
          "No. The SVG is read as text and processed entirely in your browser using the Canvas API.",
      },
    ],
  },
  {
    slug: "png-to-svg",
    name: "PNG to SVG Converter",
    description: "Trace a PNG to SVG using pixel-level brightness analysis — best for simple logos and icons.",
    category: "Image",
    icon: "PenTool",
    component: "PngToSvg",
    longDescription:
      "True vector tracing — converting a raster image into smooth bezier curves — requires complex algorithms like Potrace. This tool takes a simpler, faster approach: it downscales your PNG to a maximum of 200px on the longest side, reads each pixel's brightness using the luminance formula (0.299R + 0.587G + 0.114B), and outputs a 1px × 1px SVG rect element for every pixel darker than the threshold you set. The result is an SVG made of small rectangles rather than smooth curves. This works well for simple black-and-white logos, QR codes, and line art where you need an SVG for scalability but don't need smooth paths. A darkness threshold slider (1–255) controls which pixels are included: lower values trace only the darkest pixels, higher values include more of the image. The output SVG is a data URL you can download directly. For complex photos or smooth-curve vectors, a desktop tool like Inkscape's Trace Bitmap is more appropriate.",
    howToUse: [
      "Click the upload zone and select a PNG file.",
      "Drag the Darkness Threshold slider to control which pixels are traced (lower = only darkest pixels, higher = more pixels included).",
      "The SVG preview updates automatically as you adjust the threshold.",
      "Click 'Download SVG' to save the result.",
    ],
    keywords: [
      "png to svg converter online free",
      "convert png to svg online",
      "image to vector online",
      "png svg tracer",
      "raster to vector online",
      "png to svg no upload",
      "simple image to svg",
      "logo png to svg",
    ],
    faqs: [
      {
        question: "Will it work on photos?",
        answer:
          "Basic tracing works best on simple images with clear contrast — logos, icons, and line art. Photos produce very large SVGs (one rect per pixel) with no practical scalability benefit.",
      },
      {
        question: "Is the output a true vector with smooth curves?",
        answer:
          "No. The output is an SVG composed of 1×1 pixel rectangles, not bezier curves. It scales without pixelation but won't have the smooth paths of a professionally traced vector. For smooth curves, use Inkscape's Trace Bitmap or Adobe Illustrator's Image Trace.",
      },
      {
        question: "Why is the image downscaled to 200px?",
        answer:
          "Each pixel becomes an SVG rect element. A 1000×1000 image would produce 1,000,000 rect elements, making the SVG file enormous and slow to render. Downscaling to 200px keeps the output manageable.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The pixel analysis runs entirely in your browser using the Canvas API.",
      },
    ],
  },
  {
    slug: "image-color-picker",
    name: "Image Color Picker",
    description: "Click anywhere on an uploaded image to pick the exact hex color of that pixel.",
    category: "Image",
    icon: "Pipette",
    component: "ImageColorPicker",
    longDescription:
      "Identifying the exact color used in a photo, screenshot, or design mockup is a common task for developers and designers who don't have access to the original design file. This tool uploads your image onto a Canvas element, then reads the exact RGB values of the pixel you click using getImageData(). The click coordinates are scaled from the displayed image size to the Canvas's native resolution, so the color reading is accurate regardless of how the image is displayed on screen. Each picked color is shown as a hex code with a color swatch, and up to 12 recent picks are saved in a history panel below the image so you can collect a palette from a single image. Click any color in the history to copy its hex code. The cursor changes to a crosshair over the image to indicate pick mode. Useful for matching brand colors from a logo, extracting a palette from a reference photo, or identifying a color in a screenshot to use in CSS.",
    howToUse: [
      "Click the upload zone and select any image file.",
      "The cursor changes to a crosshair over the image — click anywhere to pick that pixel's color.",
      "The picked hex code and color swatch appear below the image, with a Copy button.",
      "Up to 12 recent picks are saved in the history panel — click any to copy its hex code.",
    ],
    keywords: [
      "image color picker online free",
      "pick color from image online",
      "eyedropper tool online",
      "get hex color from image",
      "color picker from photo",
      "extract color from image",
      "hex color picker from screenshot",
      "image color sampler online",
    ],
    faqs: [
      {
        question: "How accurate is the color reading?",
        answer:
          "The tool reads the exact pixel color at the point you click, accurate to the full 8-bit per channel RGB value. Click coordinates are scaled to the Canvas's native resolution, so display scaling doesn't affect accuracy.",
      },
      {
        question: "Can I pick multiple colors?",
        answer:
          "Yes. Each click adds the color to a history panel showing up to 12 recent picks. Duplicate colors are moved to the top rather than added twice.",
      },
      {
        question: "Does it output RGB as well as hex?",
        answer:
          "Currently only hex codes are shown. To convert a hex code to RGB or HSL, use the Color Converter tool on ToolBrigade.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The image is drawn onto a Canvas in your browser. No data is transmitted.",
      },
    ],
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    description: "Generate favicon PNG files in all 6 standard sizes from any image — instant, no upload.",
    category: "Image",
    icon: "Star",
    component: "FaviconGenerator",
    longDescription:
      "A complete favicon setup requires PNG files at six sizes: 16×16 (browser tab), 32×32 (taskbar), 48×48 (Windows shortcut), 64×64 (high-DPI tab), 128×128 (Chrome Web Store), and 256×256 (Windows tile). Creating all six manually from a source image is repetitive. This generator draws your uploaded image onto a Canvas at each of the six sizes simultaneously and presents them in a grid with individual download links. The source image is drawn with drawImage() scaled to each target size, so a high-resolution square PNG or SVG gives the sharpest results at small sizes. All six are generated the moment you upload — no button to click. Download each size individually as a PNG. Web developers setting up a new site, designers handing off assets to developers, and anyone who needs a quick favicon from a logo are the primary users.",
    howToUse: [
      "Click the upload zone and select a square image (PNG, JPG, SVG, or WebP).",
      "All six favicon sizes (16×16, 32×32, 48×48, 64×64, 128×128, 256×256) are generated instantly.",
      "Click the 'Save' link under each size to download that PNG individually.",
    ],
    keywords: [
      "favicon generator online free",
      "generate favicon from image",
      "favicon maker all sizes",
      "create favicon png online",
      "favicon 16x16 32x32 generator",
      "favicon generator no upload",
      "website favicon creator",
      "favicon from logo online",
    ],
    faqs: [
      {
        question: "What size should my source image be?",
        answer:
          "Use a square image of at least 256×256 pixels for best results. A 512×512 or 1024×1024 PNG or SVG gives the sharpest downscaling to 16×16.",
      },
      {
        question: "How do I add a favicon to my website?",
        answer:
          "Place the favicon PNG files in your root directory and add link tags in your HTML head: <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32.png'>. Repeat for each size you want to declare.",
      },
      {
        question: "Can I generate an .ico file?",
        answer:
          "No. This tool generates PNG files only. For an .ico file (which can contain multiple sizes in one file), use a dedicated .ico generator tool.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. All six sizes are generated using the Canvas API in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "image-rotator",
    name: "Image Rotator",
    description: "Rotate images by any angle from 0–359° — canvas auto-resizes so nothing is cropped.",
    category: "Image",
    icon: "RotateCw",
    component: "ImageRotator",
    longDescription:
      "Most image editors only offer 90° rotation presets. When you need to straighten a slightly tilted photo or rotate to an arbitrary angle, you need a tool that handles the geometry correctly. This rotator calculates the bounding box of the rotated image using the formula w = |W·cosθ| + |H·sinθ|, h = |W·sinθ| + |H·cosθ|, then resizes the Canvas to fit the full rotated image without cropping any corners. The image is drawn centered on the new canvas with the rotation applied. Quick preset buttons for 90°, 180°, and 270° are available alongside the 0–359° slider. A Reset button returns to 0°. The output is always PNG. Photographers straightening horizon lines, developers rotating screenshots for documentation, and designers preparing assets at non-standard angles are the typical users.",
    howToUse: [
      "Click the upload zone and select an image file.",
      "Drag the Rotation slider (0–359°) or click the 90°, 180°, or 270° preset buttons.",
      "The rotated preview updates automatically — the canvas expands to fit the full image at any angle.",
      "Click 'Download' to save the rotated PNG.",
    ],
    keywords: [
      "image rotator online free",
      "rotate image any angle online",
      "rotate photo online no crop",
      "image rotation tool",
      "rotate image 90 degrees online",
      "rotate image without cropping",
      "straighten photo online",
      "rotate image free no upload",
    ],
    faqs: [
      {
        question: "Does it crop the image when rotating to non-90° angles?",
        answer:
          "No. The Canvas is resized to the bounding box of the rotated image, so all four corners are preserved. The background outside the original image area is transparent in the PNG output.",
      },
      {
        question: "What is the background color outside the rotated image?",
        answer:
          "Transparent. The output PNG has an alpha channel, so the areas outside the rotated image are transparent rather than white or black.",
      },
      {
        question: "What format is the output?",
        answer:
          "Always PNG, which supports transparency for the background areas created by non-90° rotations.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The rotation is performed using the Canvas API in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "image-flipper",
    name: "Image Flipper",
    description: "Flip images horizontally, vertically, or both — toggle axes independently, instant PNG download.",
    category: "Image",
    icon: "FlipHorizontal",
    component: "ImageFlipper",
    longDescription:
      "Mirroring an image is a common need for creating symmetrical designs, correcting selfie camera orientation, or producing a reflected version of a logo. This flipper uses the Canvas API's scale(-1, 1) and scale(1, -1) transforms to flip the image along the horizontal axis, vertical axis, or both simultaneously. The two buttons — Flip Horizontal and Flip Vertical — act as toggles: active (blue) means that axis is flipped, inactive means it's not. Both can be active at once for a combined flip on both axes. The preview updates instantly with each toggle. The output PNG has the same pixel dimensions as the input. No file is uploaded — the Canvas transform runs entirely in your browser.",
    howToUse: [
      "Click the upload zone and select an image file.",
      "Click 'Flip Horizontal' to mirror left-to-right (button turns blue when active).",
      "Click 'Flip Vertical' to mirror top-to-bottom (can be combined with horizontal).",
      "Click 'Download' to save the flipped PNG.",
    ],
    keywords: [
      "image flipper online free",
      "flip image horizontally online",
      "mirror image online",
      "flip photo vertically",
      "flip image no upload",
      "mirror photo online free",
      "flip jpg png online",
      "horizontal vertical image flip",
    ],
    faqs: [
      {
        question: "Can I flip both axes at once?",
        answer: "Yes. Click both Flip Horizontal and Flip Vertical buttons simultaneously. Both will be active (blue) and the image is flipped on both axes.",
      },
      {
        question: "Does flipping change the image dimensions?",
        answer: "No. The output PNG has exactly the same width and height as the input. Only the pixel arrangement changes.",
      },
      {
        question: "What format is the output?",
        answer: "PNG, preserving full colour depth and any transparency in the original image.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer: "No. The Canvas transform runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "grayscale-converter",
    name: "Grayscale Image Converter",
    description: "Convert any color image to grayscale using the ITU-R luminance formula — side-by-side preview, instant download.",
    category: "Image",
    icon: "Circle",
    component: "GrayscaleConverter",
    longDescription:
      "Converting a color image to grayscale isn't as simple as removing saturation — a naive approach produces flat, low-contrast results. This converter uses the ITU-R BT.601 luminance formula: gray = 0.299 x R + 0.587 x G + 0.114 x B. The green channel is weighted most heavily because the human eye is most sensitive to green light; red is weighted second; blue least. This produces a perceptually accurate grayscale that matches how humans perceive brightness. The conversion reads every pixel's RGB values via getImageData(), applies the formula, and writes the result back with putImageData(). A side-by-side preview shows the original and grayscale versions before you download. Transparency (alpha channel) is preserved in the output PNG. Photographers preparing images for print, designers creating monochrome assets, and developers generating grayscale thumbnails are the typical users.",
    howToUse: [
      "Click the upload zone and select any image file.",
      "The grayscale version is generated instantly and shown alongside the original.",
      "Click 'Download Grayscale' to save the PNG.",
    ],
    keywords: [
      "grayscale image converter online free",
      "convert image to grayscale online",
      "black and white image converter",
      "grayscale photo online",
      "desaturate image online",
      "image to black and white no upload",
      "grayscale png jpg converter",
      "luminance grayscale converter",
    ],
    faqs: [
      {
        question: "What formula is used for the grayscale conversion?",
        answer:
          "The ITU-R BT.601 luminance formula: 0.299 x Red + 0.587 x Green + 0.114 x Blue. This weights channels by human visual sensitivity, producing a perceptually accurate result rather than a simple average.",
      },
      {
        question: "Is transparency preserved?",
        answer: "Yes. The alpha channel is not modified. Transparent areas in the original PNG remain transparent in the grayscale output.",
      },
      {
        question: "Is the output truly grayscale or just desaturated?",
        answer: "The output uses the luminance formula, not CSS desaturation. Each pixel's R, G, and B channels are all set to the same luminance value, producing a true grayscale image.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer: "No. The pixel manipulation runs entirely in your browser using the Canvas API.",
      },
    ],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF Converter",
    description: "Combine multiple JPG or PNG images into a single PDF — one image per page, no upload.",
    category: "Image",
    icon: "FileDown",
    component: "ImageToPdf",
    longDescription:
      "Sending multiple photos as a single PDF is cleaner than attaching a folder of images — it's easier to email, print, and archive. This tool uses pdf-lib loaded in your browser to create a PDF where each uploaded image becomes one page, sized exactly to the image's pixel dimensions. Upload JPG or PNG files by clicking the upload zone (multiple files supported at once). Thumbnails appear in a grid with an X button to remove any you don't want. The 'Generate PDF' button shows the page count and triggers the download. The pdf-lib library embeds JPGs directly and re-encodes PNGs, so the process is fast even for large batches. No file is sent to a server — everything runs in your browser tab. Useful for scanning documents with a phone camera and combining them into one PDF, or packaging a set of design mockups for a client.",
    howToUse: [
      "Click the upload zone and select one or more JPG or PNG image files.",
      "Thumbnails appear in a grid — click the X on any thumbnail to remove it.",
      "Click 'Generate PDF (N pages)' to create and download the PDF.",
    ],
    keywords: [
      "image to pdf converter online free",
      "combine images into pdf",
      "jpg to pdf online no upload",
      "png to pdf converter",
      "multiple images to pdf",
      "photos to pdf online free",
      "merge images into one pdf",
      "convert pictures to pdf",
    ],
    faqs: [
      {
        question: "Is there a limit on the number of images?",
        answer: "No hard limit. Very large batches (50+ high-resolution images) may be slow depending on your device memory, but there is no enforced maximum.",
      },
      {
        question: "What page size is used?",
        answer: "Each page is sized to match the pixel dimensions of its image exactly. There is no fixed A4 or Letter size — the PDF pages are image-sized.",
      },
      {
        question: "Can I reorder the images before generating?",
        answer: "Currently images appear in the order they were uploaded. Remove and re-upload in the desired order if you need a specific sequence.",
      },
      {
        question: "Is my data uploaded to a server?",
        answer: "No. pdf-lib runs entirely in your browser. Your images never leave your device.",
      },
    ],
  },
  {
    slug: "meme-generator",
    name: "Meme Generator",
    description: "Add classic Impact-font top and bottom text to any image — adjustable font size, no watermark.",
    category: "Image",
    icon: "Laugh",
    component: "MemeGenerator",
    longDescription:
      "The classic meme format is deceptively specific: white Impact font, black outline, uppercase text, positioned at the top and bottom of the image. Getting this right in a generic image editor requires multiple steps. This generator handles it in one: upload any image, type your top and bottom text, adjust the font size slider (16-120px), and the Canvas renders the text in real time using bold Impact (falling back to Arial Black). Text is automatically converted to uppercase and centered horizontally. The outline is drawn at font-size/8 pixels wide, which scales correctly at any font size. The preview is the Canvas element itself — what you see is exactly what downloads. No watermark is added. Social media managers, community moderators, and anyone who needs a quick reaction image are the primary users.",
    howToUse: [
      "Click the upload zone and select any image file.",
      "Type your top text and bottom text in the two input fields.",
      "Drag the Font Size slider (16-120px) to adjust the text size.",
      "Click 'Download Meme' to save the PNG.",
    ],
    keywords: [
      "meme generator online free",
      "create meme with text online",
      "meme maker no watermark",
      "add impact font text to image",
      "meme creator free no sign up",
      "top bottom text meme maker",
      "custom meme generator",
      "meme text generator online",
    ],
    faqs: [
      {
        question: "What font is used?",
        answer: "Bold Impact, the classic meme font, rendered in white with a black outline. Arial Black is used as a fallback if Impact is not available on the device.",
      },
      {
        question: "Is the text automatically uppercased?",
        answer: "Yes. Both top and bottom text are converted to uppercase automatically, matching the traditional meme format.",
      },
      {
        question: "Is there a watermark on the output?",
        answer: "No. The downloaded PNG contains only your image and the text you entered — no ToolBrigade branding is added.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer: "No. The Canvas API renders everything in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "image-watermark",
    name: "Image Watermark Adder",
    description: "Add a text watermark to any image — choose position, opacity, and font size, then download as PNG.",
    category: "Image",
    icon: "Stamp",
    component: "ImageWatermark",
    longDescription:
      "Protecting photos with a watermark before sharing them online is a standard practice for photographers and content creators. This tool renders a text watermark onto your image using the Canvas API with full control over five parameters: watermark text, position (top-left, top-right, bottom-left, bottom-right, or center), opacity (10-100%), and font size (12-120px). The text is drawn in white with a black outline so it's visible on both light and dark backgrounds. The Canvas measures the text width using measureText() to position it correctly at the chosen anchor point with a 20px padding from the edge. The preview is the live Canvas — what you see is what downloads. No file is uploaded. Photographers watermarking portfolio images, designers protecting mockups, and anyone sharing original content online are the primary users.",
    howToUse: [
      "Click the upload zone and select an image file.",
      "Enter your watermark text and choose a position from the dropdown (top-left, top-right, bottom-left, bottom-right, center).",
      "Adjust the Opacity slider (10-100%) and Font Size slider (12-120px).",
      "Click 'Download' to save the watermarked PNG.",
    ],
    keywords: [
      "image watermark adder online free",
      "add text watermark to photo",
      "watermark image online no upload",
      "photo watermark tool free",
      "add copyright watermark to image",
      "watermark photo online no sign up",
      "custom watermark image tool",
      "watermark png jpg online",
    ],
    faqs: [
      {
        question: "Can I control the watermark opacity?",
        answer: "Yes. The Opacity slider ranges from 10% (nearly invisible) to 100% (fully opaque). A value of 30-50% is typical for a subtle watermark that doesn't obscure the image.",
      },
      {
        question: "Can I add an image watermark (logo) instead of text?",
        answer: "Currently only text watermarks are supported. Image/logo watermark support may be added in a future update.",
      },
      {
        question: "What font is used for the watermark?",
        answer: "Bold Arial (sans-serif fallback). The text is rendered in white with a black outline scaled to font-size/12 pixels wide, making it visible on both light and dark backgrounds.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer: "No. The Canvas API processes everything in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Merge multiple PDF files into one document in your browser — reorder, remove, then download.",
    category: "PDF",
    icon: "FilePlus",
    component: "PdfMerger",
    longDescription:
      "Combining multiple PDFs into one is a daily task for anyone who works with contracts, reports, or scanned documents. This merger uses pdf-lib loaded in your browser to copy all pages from each uploaded PDF into a single output document in the order they appear in the list. Upload PDFs by clicking the upload zone (multiple files at once supported). Each file appears in a list with an X button to remove it. The Merge button is enabled only when two or more PDFs are loaded. The merged PDF is downloaded directly to your device. Because pdf-lib runs entirely client-side, your files never leave your browser — no cloud service, no size limit beyond your device's available memory. Lawyers combining contract exhibits, accountants merging monthly reports, and students assembling research papers are the primary users.",
    howToUse: [
      "Click the upload zone and select two or more PDF files.",
      "Each file appears in the list — click the X next to any file to remove it.",
      "Click 'Merge N PDFs' to combine them in list order and download the result.",
    ],
    keywords: [
      "pdf merger online free",
      "merge pdf files online",
      "combine pdf online no upload",
      "join pdf files free",
      "pdf combiner no sign up",
      "merge multiple pdfs into one",
      "pdf merge tool no watermark",
      "combine pdf documents online",
    ],
    faqs: [
      {
        question: "Is there a limit on the number of PDFs I can merge?",
        answer: "No hard limit. Very large files (100+ MB total) may be slow depending on your device memory, but there is no enforced maximum.",
      },
      {
        question: "Can I reorder the PDFs before merging?",
        answer: "Currently the PDFs are merged in the order they appear in the list. Remove and re-upload in the desired order if you need a specific sequence.",
      },
      {
        question: "Are encrypted PDFs supported?",
        answer: "PDFs with owner passwords (editing restrictions) may work. PDFs with user passwords (open passwords) require the password to be removed first using the PDF Password Remover tool.",
      },
      {
        question: "Are my PDF files uploaded to a server?",
        answer: "No. pdf-lib runs entirely in your browser. Your files never leave your device.",
      },
    ],
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description: "Extract a continuous page range from a PDF into a new file — no upload, instant download.",
    category: "PDF",
    icon: "Scissors",
    component: "PdfSplitter",
    longDescription:
      "When you only need a chapter from a large report, or want to send specific pages of a contract without sharing the whole document, extracting a page range is the right approach. This splitter uses pdf-lib in your browser to load the PDF, detect its total page count, and copy only the pages you specify into a new document. After uploading, the tool shows the total page count and pre-fills the 'From' and 'To' fields with 1 and the last page. Adjust both fields to your target range — the From field is clamped to never exceed To, and To is clamped to the page count. Click 'Extract pages X-Y' and the new PDF downloads with the filename formatted as originalname-pages-X-Y.pdf. The entire operation runs in your browser with no server involved.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "The total page count is shown — set the 'From page' and 'To page' fields to your target range.",
      "Click 'Extract pages X-Y' to download the extracted PDF.",
    ],
    keywords: [
      "pdf splitter online free",
      "extract pages from pdf online",
      "split pdf by page range",
      "pdf page extractor no upload",
      "split pdf online no sign up",
      "extract pdf pages free",
      "pdf range extractor",
      "split pdf into parts online",
    ],
    faqs: [
      {
        question: "Can I extract non-consecutive pages?",
        answer: "This tool extracts a continuous range only. To remove specific individual pages and keep the rest, use the PDF Page Remover tool instead.",
      },
      {
        question: "Does it modify the original file?",
        answer: "No. A new PDF is created from the specified page range and downloaded. Your original file is unchanged.",
      },
      {
        question: "What happens if I set From and To to the same page?",
        answer: "A single-page PDF is extracted. This is valid and useful for extracting one specific page.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device.",
      },
    ],
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image Converter",
    description: "Render each PDF page as a high-resolution PNG using PDF.js — download pages individually.",
    category: "PDF",
    icon: "FileImage",
    component: "PdfToImage",
    longDescription:
      "Sometimes you need a PDF page as an image — for a presentation slide, a website thumbnail, or to share a single page without sending the whole document. This converter uses PDF.js (Mozilla's open-source PDF renderer) loaded in your browser to render each page at 2x scale onto a Canvas element, then exports it as a PNG. The 2x scale means a standard A4 page (595pt wide) renders at 1190px wide — sharp enough for most uses. Pages are rendered sequentially and displayed as a scrollable list, each with its own 'Download Page N' button. Encrypted or password-protected PDFs will show an error. Scanned PDFs render as images of the scanned pages (no text extraction). The entire process runs client-side — no file is uploaded.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Wait while pages render — a 'Rendering pages...' message shows progress.",
      "Each page appears as a preview image with a 'Download Page N' button below it.",
      "Click any download button to save that page as a PNG.",
    ],
    keywords: [
      "pdf to image converter online free",
      "convert pdf to png online",
      "pdf page to image no upload",
      "pdf to jpg online free",
      "render pdf as image",
      "pdf screenshot tool",
      "pdf to png each page",
      "extract pdf page as image",
    ],
    faqs: [
      {
        question: "What resolution are the output images?",
        answer: "Pages are rendered at 2x scale using PDF.js. A standard A4 page (595pt) renders at 1190px wide, which is sharp for most web and presentation uses.",
      },
      {
        question: "Does it work with scanned PDFs?",
        answer: "Yes, but scanned PDFs render as images of the scanned pages. The output will be a PNG of the scan, not extracted text.",
      },
      {
        question: "Why does my PDF show an error?",
        answer: "Encrypted PDFs with user passwords cannot be rendered without the password. Corrupted PDFs may also fail. Try removing the password first with the PDF Password Remover tool.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer: "No. PDF.js runs entirely in your browser. Your PDF never leaves your device.",
      },
    ],
  },
  {
    slug: "pdf-page-remover",
    name: "PDF Page Remover",
    description: "Select individual pages to remove from a PDF — click to mark red, then download the edited file.",
    category: "PDF",
    icon: "Trash2",
    component: "PdfPageRemover",
    longDescription:
      "Blank pages, duplicate cover sheets, and confidential appendices are common reasons to remove specific pages from a PDF before sharing it. This tool loads your PDF with pdf-lib, detects the page count, and displays each page number as a clickable button. Click any page number to mark it for removal (it turns red). Click again to deselect. A counter shows how many pages are marked and how many will remain. The Download button is disabled if all pages are selected (an empty PDF is invalid). When you download, a new PDF is created containing only the pages you kept — your original file is unchanged. The entire operation runs in your browser with no server involved.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Page number buttons appear — click any to mark it for removal (turns red). Click again to deselect.",
      "The counter shows how many pages will remain.",
      "Click 'Download PDF without selected pages' to save the edited file.",
    ],
    keywords: [
      "pdf page remover online free",
      "remove pages from pdf online",
      "delete pdf pages no upload",
      "pdf page deleter free",
      "remove blank pages from pdf",
      "pdf page selector tool",
      "delete specific pages from pdf",
      "pdf editor remove pages",
    ],
    faqs: [
      {
        question: "Can I undo a page selection before downloading?",
        answer: "Yes. Click the red page number button again to deselect it. Pages are only removed when you click the Download button.",
      },
      {
        question: "Can I remove all pages?",
        answer: "No. The Download button is disabled when all pages are selected, since an empty PDF is not a valid document.",
      },
      {
        question: "Does it modify my original file?",
        answer: "No. A new PDF is created with the selected pages omitted. Your original file is not changed.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device.",
      },
    ],
  },
  {
    slug: "pdf-page-reorder",
    name: "PDF Page Reorder",
    description: "Rearrange PDF pages using up/down arrow buttons — download the reordered document instantly.",
    category: "PDF",
    icon: "ArrowUpDown",
    component: "PdfPageReorder",
    longDescription: "Fixing a PDF where pages were scanned or inserted in the wrong order requires a tool that lets you move individual pages without re-creating the whole document. This tool loads your PDF with pdf-lib, lists each page by number, and provides up/down arrow buttons to move any page one position at a time. When the order is correct, click 'Download Reordered PDF' to get the new document. The original file is unchanged. Runs entirely in your browser using pdf-lib — no upload required.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Each page appears in a numbered list — use the up/down arrow buttons to move pages.",
      "Click 'Download Reordered PDF' when the order is correct.",
    ],
    keywords: [
      "pdf page reorder online free",
      "rearrange pdf pages online",
      "reorder pdf pages no upload",
      "pdf page organizer free",
      "change pdf page order online",
      "pdf reorder tool",
      "sort pdf pages online",
      "pdf page arranger",
    ],
    faqs: [
      { question: "Is there a page limit?", answer: "No hard limit. Very large PDFs may take a moment to load, but there is no enforced maximum." },
      { question: "Does it support drag-and-drop reordering?", answer: "Currently arrow buttons are used to move pages one position at a time. Drag-and-drop support may be added in a future update." },
      { question: "Does it modify my original file?", answer: "No. A new PDF is created with the reordered pages. Your original file is unchanged." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-rotator",
    name: "PDF Rotator",
    description: "Rotate individual PDF pages to 0, 90, 180, or 270 degrees — each page independently.",
    category: "PDF",
    icon: "RotateCw",
    component: "PdfRotator",
    longDescription: "Scanned documents often come in with pages rotated the wrong way — landscape pages in a portrait document, or upside-down scans. This tool loads your PDF with pdf-lib and lets you set a rotation angle (0, 90, 180, or 270 degrees) for each page independently. PDF rotation is stored as metadata in the page object, not by re-rendering the content, so the operation is lossless and fast regardless of file size. Download the rotated PDF instantly. Runs entirely in your browser — no upload required.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "A rotation selector appears for each page — choose 0, 90, 180, or 270 degrees.",
      "Click 'Download Rotated PDF' to save the result.",
    ],
    keywords: [
      "pdf rotator online free",
      "rotate pdf pages online",
      "rotate pdf no upload",
      "fix rotated pdf pages",
      "pdf page rotation tool",
      "rotate individual pdf pages",
      "pdf rotate 90 degrees online",
      "fix upside down pdf",
    ],
    faqs: [
      { question: "Can I rotate all pages at once?", answer: "Currently each page is set individually. Set the same angle for all pages to rotate the whole document uniformly." },
      { question: "Does rotation affect the content quality?", answer: "No. PDF rotation is stored as a metadata flag on the page object. The content is not re-rendered or re-encoded, so there is no quality loss." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-compressor",
    name: "PDF Compressor",
    description: "Re-save a PDF with object stream compression to reduce file size — no image re-encoding.",
    category: "PDF",
    icon: "FileDown",
    component: "PdfCompressor",
    longDescription: "Not all PDF compression is equal. This tool applies pdf-lib's object stream compression, which packs the PDF's internal object table more efficiently without touching image data or re-encoding content. PDFs that were saved without compression (common from older software or print-to-PDF drivers) can shrink significantly. PDFs already saved with compression may see little change. The tool loads your PDF, re-saves it with useObjectStreams: true, and triggers a download. Results vary widely — a 10 MB uncompressed PDF might shrink to 3 MB, while an already-optimised PDF might only shrink by a few KB. Runs entirely in your browser using pdf-lib.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Click 'Compress PDF' to re-save with object stream compression.",
      "Download the compressed result and compare the file size.",
    ],
    keywords: [
      "pdf compressor online free",
      "compress pdf online no upload",
      "reduce pdf file size online",
      "pdf size reducer free",
      "pdf optimizer online",
      "shrink pdf file size",
      "compress pdf without losing quality",
      "pdf compression tool",
    ],
    faqs: [
      { question: "How much will my PDF shrink?", answer: "Results vary widely. PDFs with uncompressed object streams may shrink by 50-70%. PDFs already optimised may see only a few KB reduction." },
      { question: "Does it reduce image quality?", answer: "No. This tool only applies structural object stream compression. Image data is not re-encoded or downsampled." },
      { question: "Why didn't my PDF shrink much?", answer: "Your PDF was likely already saved with compression enabled. This tool cannot further compress already-optimised PDFs without re-encoding images." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text Extractor",
    description: "Extract all readable text from a PDF using PDF.js — works on text-based PDFs, not scans.",
    category: "PDF",
    icon: "FileText",
    component: "PdfToText",
    longDescription: "Copying text from a PDF by hand is tedious, especially for multi-page documents. This extractor uses PDF.js to read the text content layer of each page and concatenate it into a single copyable block. It works on PDFs that contain actual text objects (created by word processors, export tools, or typesetting software). It does not work on scanned PDFs, which are images of text — those require OCR software. The extraction runs entirely in your browser using PDF.js — no file is uploaded. Useful for copying content from reports, extracting data for further processing, or feeding PDF text into other ToolBrigade tools like the Word Counter or Find and Replace.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Wait for text extraction to complete — all pages are processed sequentially.",
      "Copy the extracted text from the output textarea.",
    ],
    keywords: [
      "pdf to text extractor online free",
      "extract text from pdf online",
      "pdf text extractor no upload",
      "convert pdf to text online",
      "copy text from pdf online",
      "pdf text extraction tool",
      "pdf to plain text converter",
      "extract pdf content online",
    ],
    faqs: [
      { question: "Does it work on scanned PDFs?", answer: "No. Scanned PDFs are images of text. OCR (optical character recognition) is required to extract text from scans, which this tool does not perform." },
      { question: "Is formatting preserved?", answer: "Basic text content is extracted in reading order. Complex formatting like tables, columns, and text boxes may not be preserved exactly." },
      { question: "Why is some text missing or garbled?", answer: "Some PDFs use custom font encodings or embed text as paths rather than text objects. PDF.js may not extract these correctly." },
      { question: "Are my files uploaded to a server?", answer: "No. PDF.js runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-metadata",
    name: "PDF Metadata Viewer & Editor",
    description: "View and edit PDF title, author, and subject metadata — download the updated file instantly.",
    category: "PDF",
    icon: "Info",
    component: "PdfMetadata",
    longDescription: "PDF metadata — title, author, subject, and creator — is embedded in the document and visible to search engines, document management systems, and screen readers. Incorrect or missing metadata is common in PDFs exported from design tools or converted from other formats. This tool loads your PDF with pdf-lib, reads the existing metadata fields, and lets you edit the Title, Author, and Subject fields. The Creator field (the software that created the PDF) is shown as read-only. The page count is also displayed. Click 'Save with Updated Metadata' to download the modified PDF. The page content is completely unchanged — only the metadata fields are updated.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "The existing Title, Author, Subject, Creator, and page count are shown.",
      "Edit the Title, Author, and/or Subject fields.",
      "Click 'Save with Updated Metadata' to download the updated PDF.",
    ],
    keywords: [
      "pdf metadata editor online free",
      "edit pdf metadata online",
      "view pdf metadata",
      "change pdf title author online",
      "pdf properties editor",
      "pdf metadata viewer",
      "update pdf metadata no upload",
      "pdf document properties editor",
    ],
    faqs: [
      { question: "What metadata fields can I edit?", answer: "Title, Author, and Subject. The Creator field (the software that originally created the PDF) is read-only." },
      { question: "Will editing metadata affect the PDF content or layout?", answer: "No. Only the metadata fields are changed. Page content, fonts, images, and layout are completely untouched." },
      { question: "Why does my PDF show no metadata?", answer: "Many PDFs are created without metadata. The fields will be empty, and you can fill them in from scratch." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-password-remover",
    name: "PDF Password Remover",
    description: "Remove owner/permissions passwords from PDFs — enter the password if required, then download unlocked.",
    category: "PDF",
    icon: "Unlock",
    component: "PdfPasswordRemover",
    longDescription: "PDFs can have two types of passwords: a user password (required to open the file) and an owner password (restricts editing, printing, or copying). This tool uses pdf-lib to load the PDF with the password you provide and re-save it without password protection. If the PDF has only an owner password, it may load without a password but still have restrictions — re-saving removes those restrictions. If the PDF has a user password, you must enter the correct password for the tool to open it. This tool cannot crack or brute-force passwords — it only removes protection when the correct password is supplied. Runs entirely in your browser.",
    howToUse: [
      "Click the upload zone and select a password-protected PDF.",
      "Enter the password in the input field if the PDF requires one to open.",
      "Click 'Remove Password & Download' to save the unlocked PDF.",
    ],
    keywords: [
      "pdf password remover online free",
      "remove pdf password online",
      "unlock pdf online no upload",
      "pdf decryptor free",
      "remove pdf restrictions online",
      "unlock pdf permissions",
      "pdf password unlocker",
      "remove pdf owner password",
    ],
    faqs: [
      { question: "What is the difference between owner and user passwords?", answer: "A user password prevents opening the file without the password. An owner password allows viewing but restricts editing, printing, or copying. This tool handles both when the correct password is provided." },
      { question: "Can it crack or guess passwords?", answer: "No. This tool does not attempt to brute-force or crack passwords. You must know the correct password." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-watermark",
    name: "PDF Watermark Adder",
    description: "Add a diagonal text watermark to every page of a PDF — control text and opacity, no upload.",
    category: "PDF",
    icon: "Stamp",
    component: "PdfWatermark",
    longDescription: "Adding a watermark to a PDF before distributing it is standard practice for draft documents, confidential reports, and licensed content. This tool uses pdf-lib to draw a diagonal text watermark centered on every page of your PDF. You control the watermark text and opacity. The text is drawn at a 45-degree angle in a large font, centered on each page. The opacity slider lets you choose between a subtle background watermark and a prominent foreground stamp. The watermark is embedded as a PDF text object — it is permanent once downloaded. Runs entirely in your browser using pdf-lib.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Enter your watermark text (e.g. DRAFT, CONFIDENTIAL, or your name).",
      "Adjust the opacity slider.",
      "Click 'Apply Watermark & Download' to save the watermarked PDF.",
    ],
    keywords: [
      "pdf watermark adder online free",
      "add watermark to pdf online",
      "pdf watermark tool no upload",
      "stamp pdf online free",
      "add draft watermark to pdf",
      "pdf confidential watermark",
      "watermark pdf pages online",
      "pdf text watermark tool",
    ],
    faqs: [
      { question: "Can I add an image watermark?", answer: "Currently only text watermarks are supported. Image/logo watermark support may be added in a future update." },
      { question: "Is the watermark permanent?", answer: "Yes. Once applied and downloaded, the watermark is embedded in the PDF as a text object and cannot be removed without a PDF editor." },
      { question: "Can I control the watermark position?", answer: "The watermark is always centered diagonally on each page. Custom positioning is not currently supported." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "pdf-blank-page-inserter",
    name: "Blank PDF Page Inserter",
    description: "Insert one or more blank A4 pages at any position in a PDF — useful for double-sided printing layouts.",
    category: "PDF",
    icon: "FilePlus2",
    component: "PdfBlankPageInserter",
    longDescription: "Double-sided printing requires documents to start chapters on odd-numbered pages, which sometimes means inserting a blank page at the end of a section. This tool uses pdf-lib to insert one or more blank A4 pages (595 x 842 points) at any position in your PDF. Set 'Insert after page' to 0 to insert at the very beginning, or to any page number to insert after that page. Set the count to insert multiple blank pages at once. The blank pages are standard A4 size regardless of the surrounding page sizes. Runs entirely in your browser — no upload required.",
    howToUse: [
      "Click the upload zone and select a PDF file.",
      "Set 'Insert after page' (0 = beginning, or any page number).",
      "Set the number of blank pages to insert.",
      "Click 'Insert Blank Pages & Download'.",
    ],
    keywords: [
      "blank pdf page inserter online free",
      "insert blank page in pdf online",
      "add blank page to pdf",
      "pdf blank page tool no upload",
      "insert separator page in pdf",
      "add empty page to pdf",
      "pdf page inserter free",
      "double sided printing pdf blank page",
    ],
    faqs: [
      { question: "What size are the blank pages?", answer: "Blank pages are inserted at A4 size (595 x 842 points / 210 x 297 mm). This is fixed regardless of the surrounding page sizes." },
      { question: "Can I insert at the very beginning?", answer: "Yes. Set 'Insert after page' to 0 to insert blank pages before page 1." },
      { question: "Can I insert pages in the middle?", answer: "Yes. Set 'Insert after page' to any page number to insert after that specific page." },
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib runs entirely in your browser. Your PDF never leaves your device." },
    ],
  },
  {
    slug: "character-counter",
    name: "Character Counter",
    description: "Count characters, letters, digits, spaces, and lines in any text.",
    category: "Text",
    icon: "Hash",
    component: "CharacterCounter",
    longDescription:
      "When a word counter isn't granular enough, you need a character-level breakdown. This tool tracks six stats simultaneously as you type or paste: total characters (raw string length), characters excluding all whitespace, letters only (a-z A-Z matched by regex), digits only (0-9), space characters specifically, and line count (newline splits). All six update with every keystroke — no button to click. The distinction between 'Characters' and 'No Spaces' matters for platforms like Twitter that count every character including spaces, versus SMS systems that charge per 160-character segment of printable characters. The Letters stat is useful for language analysis tasks where you want to exclude punctuation and numbers. The Lines count helps when working with CSV files, code snippets, or any line-delimited data where you need to know the row count before processing. Everything runs locally in your browser — no paste limit, no sign-up.",
    howToUse: [
      "Paste or type your text into the textarea.",
      "The six stat cards (Characters, No Spaces, Letters, Digits, Spaces, Lines) update instantly with every keystroke.",
      "Clear the textarea to reset all counts to zero.",
    ],
    keywords: [
      "character counter online free",
      "count characters in text online",
      "letter counter tool",
      "count digits in text",
      "character count with spaces",
      "count lines in text online",
      "character counter no sign up",
      "text character analyzer",
    ],
    faqs: [
      {
        question: "What is the difference between 'Characters' and 'No Spaces'?",
        answer:
          "'Characters' is the raw string length including every space, tab, and newline. 'No Spaces' strips all whitespace characters first using a regex, giving you only printable characters.",
      },
      {
        question: "Does it count Unicode characters like emoji correctly?",
        answer:
          "The Characters count uses the string's .length property, which counts UTF-16 code units. Emoji and some CJK characters that use surrogate pairs may count as 2. The Letters count uses a /[a-zA-Z]/ regex, so emoji are excluded.",
      },
      {
        question: "How is the Lines count calculated?",
        answer:
          "The text is split on newline characters. A single line of text with no newlines counts as 1. An empty textarea counts as 0.",
      },
      {
        question: "Is there a maximum text length?",
        answer:
          "No enforced limit. The tool handles large pastes without issue, though very large inputs may cause a brief lag on older devices.",
      },
    ],
  },
  {
    slug: "text-reverser",
    name: "Text Reverser",
    description: "Reverse text by characters, words, or lines — three distinct modes.",
    category: "Text",
    icon: "ArrowLeftRight",
    component: "TextReverser",
    longDescription:
      "Reversing text sounds trivial until you realise there are three meaningfully different ways to do it. This tool offers all three as toggle buttons. Characters mode reverses the entire string character by character — 'Hello World' becomes 'dlroW olleH' — useful for creating mirror text or testing palindrome logic. Words mode splits on whitespace, reverses the word array, and rejoins with spaces — 'one two three' becomes 'three two one' — useful for reversing sentence order in data processing. Lines mode splits on newlines and reverses the line order — the last line becomes the first — useful for reversing log files, CSV rows, or any line-delimited data where you want the newest entries at the top. The output appears in a side-by-side panel with a Copy button. Switching modes updates the output instantly without re-pasting. Runs entirely in your browser.",
    howToUse: [
      "Click Characters, Words, or Lines to choose the reversal mode.",
      "Type or paste text into the left Input panel.",
      "The reversed result appears instantly in the right Reversed panel.",
      "Click Copy to copy the output to your clipboard.",
    ],
    keywords: [
      "text reverser online free",
      "reverse text characters online",
      "reverse words in sentence online",
      "reverse lines of text",
      "flip text online",
      "mirror text generator",
      "reverse string online",
      "reverse text no install",
    ],
    faqs: [
      {
        question: "What is the difference between the three modes?",
        answer:
          "Characters reverses every character in the string. Words splits on whitespace and reverses the word order. Lines splits on newlines and reverses the line order. Each produces a different result from the same input.",
      },
      {
        question: "Does Words mode preserve multiple spaces?",
        answer:
          "No. The text is split on any whitespace sequence and rejoined with single spaces. Multiple consecutive spaces are collapsed to one.",
      },
      {
        question: "Is my text sent to a server?",
        answer: "No. All reversal logic runs in your browser using JavaScript. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "duplicate-line-remover",
    name: "Duplicate Line Remover",
    description: "Remove duplicate lines from any text, with optional case sensitivity.",
    category: "Text",
    icon: "ListX",
    component: "DuplicateLineRemover",
    longDescription:
      "Cleaning up lists with repeated entries — email addresses, keywords, product SKUs, log lines — is a common data preparation task. This tool splits your input on newlines, tracks seen lines in a Set for O(n) performance, and outputs only the first occurrence of each line. A case-sensitive toggle controls whether 'Apple' and 'apple' are treated as the same line: when checked, comparison is exact; when unchecked, both are lowercased before comparison but the original casing of the first occurrence is preserved in the output. The output panel shows the line count and how many duplicates were removed, so you can verify the result before copying. Paste a list of 10,000 email addresses and get the unique set in milliseconds. Runs entirely in your browser — no file upload, no server.",
    howToUse: [
      "Paste your lines into the left Input panel — the line count is shown in the label.",
      "Toggle 'Case-sensitive comparison' to control whether 'Hello' and 'hello' are treated as duplicates.",
      "The right Output panel shows the unique lines and how many were removed.",
      "Click Copy to copy the deduplicated output.",
    ],
    keywords: [
      "duplicate line remover online free",
      "remove duplicate lines from text",
      "deduplicate list online",
      "remove duplicate entries text",
      "unique line extractor",
      "remove repeated lines online",
      "deduplicate text no upload",
      "remove duplicates from list online",
    ],
    faqs: [
      {
        question: "Does it preserve the original line order?",
        answer:
          "Yes. The first occurrence of each line is kept in its original position. Only subsequent duplicates are removed. The relative order of unique lines is unchanged.",
      },
      {
        question: "What does case-insensitive mode do exactly?",
        answer:
          "Lines are lowercased before comparison, so 'Apple' and 'apple' are treated as duplicates. The output keeps the first occurrence with its original casing — it does not convert everything to lowercase.",
      },
      {
        question: "Is there a line limit?",
        answer:
          "No enforced limit. The Set-based deduplication is efficient and handles tens of thousands of lines without issue.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. Everything runs in your browser. Your text is never transmitted.",
      },
    ],
  },
  {
    slug: "line-sorter",
    name: "Line Sorter",
    description: "Sort lines A-Z, Z-A, by shortest, by longest, or shuffle randomly.",
    category: "Text",
    icon: "ArrowUpDown",
    component: "LineSorter",
    longDescription:
      "Sorting a list of items manually is tedious and error-prone. This tool splits your input on newlines and applies one of five sort modes via toggle buttons: A to Z (localeCompare ascending), Z to A (localeCompare descending), Shortest first (by character length ascending), Longest first (by character length descending), or Shuffle (random order using Math.random). localeCompare handles accented characters and locale-specific ordering correctly — 'cafe' and 'café' sort in the right relative position. The Shuffle mode is useful for randomising a list of names for a raffle or generating a random question order. The output appears side by side with a Copy button. Switching modes re-sorts instantly without re-pasting. Developers sorting import lists, writers alphabetising bibliographies, and data analysts ordering keyword lists are the primary users.",
    howToUse: [
      "Paste your lines into the left Input panel.",
      "Click a sort mode button: A → Z, Z → A, Shortest first, Longest first, or Shuffle.",
      "The sorted output appears instantly in the right panel.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "line sorter online free",
      "sort lines alphabetically online",
      "sort text lines online",
      "alphabetical list sorter",
      "sort lines by length",
      "shuffle lines randomly online",
      "text line organizer",
      "sort list online free",
    ],
    faqs: [
      {
        question: "Does it sort numbers correctly?",
        answer:
          "Lines are sorted as text strings using localeCompare. For numeric sorting, zero-pad numbers to the same length (e.g. 001, 002, 010) so they sort correctly as strings.",
      },
      {
        question: "Does it handle accented characters?",
        answer:
          "Yes. localeCompare is used for A-Z and Z-A sorting, which handles accented characters and locale-specific ordering correctly.",
      },
      {
        question: "Is the shuffle truly random?",
        answer:
          "The shuffle uses Math.random(), which is pseudo-random. It is suitable for casual use but not for cryptographic or security purposes.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All sorting runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "whitespace-remover",
    name: "Whitespace Remover",
    description: "Trim lines, remove extra spaces, remove blank lines, or strip all whitespace.",
    category: "Text",
    icon: "RemoveFormatting",
    component: "WhitespaceRemover",
    longDescription:
      "Copied text from PDFs, web pages, and legacy systems often arrives with inconsistent whitespace — leading spaces on every line, double spaces between words, or blank lines scattered throughout. This tool offers four targeted cleaning modes via toggle buttons. Trim lines removes leading and trailing spaces from each line using .trim() but preserves internal spacing. Remove extra spaces collapses any run of spaces or tabs to a single space and also trims each line. Remove blank lines filters out any line that is empty or contains only whitespace. Remove all whitespace strips every whitespace character (spaces, tabs, newlines) from the entire string — useful for producing a compact single-token string. The output appears side by side with a Copy button. Modes switch instantly without re-pasting. Developers cleaning up pasted code, writers fixing copy-paste artefacts, and data analysts normalising CSV fields are the primary users.",
    howToUse: [
      "Paste text into the left Input panel.",
      "Click a mode button: Trim lines, Remove extra spaces, Remove blank lines, or Remove all whitespace.",
      "The cleaned output appears instantly in the right panel.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "whitespace remover online free",
      "remove extra spaces from text online",
      "trim whitespace online",
      "remove blank lines from text",
      "strip whitespace online",
      "clean up text spaces online",
      "remove leading trailing spaces",
      "text whitespace cleaner",
    ],
    faqs: [
      {
        question: "What is the difference between 'Trim lines' and 'Remove extra spaces'?",
        answer:
          "Trim lines only removes leading and trailing spaces from each line, leaving internal spacing unchanged. Remove extra spaces also collapses multiple consecutive spaces within a line to a single space.",
      },
      {
        question: "Does 'Remove blank lines' remove lines with only spaces?",
        answer:
          "Yes. A line is considered blank if it is empty or contains only whitespace characters. Such lines are filtered out.",
      },
      {
        question: "Does 'Remove all whitespace' remove newlines too?",
        answer:
          "Yes. It strips every whitespace character including spaces, tabs, and newlines, producing a single continuous string with no whitespace at all.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All processing runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "find-replace",
    name: "Find and Replace",
    description: "Find and replace text with optional regex and case sensitivity — shows match count live.",
    category: "Text",
    icon: "Replace",
    component: "FindReplace",
    longDescription:
      "Text editors have Find & Replace, but they can't process text you paste from an API response, a log file, or a data export without opening a file. This browser-based tool lets you find and replace in any pasted text with four options: plain text or regex pattern, case-sensitive or case-insensitive. The find pattern is compiled with the global flag so all occurrences are replaced at once. A match count appears below the controls showing how many replacements were made — '3 matches found' — so you can verify before copying. If you enter an invalid regex, the error message from the JavaScript engine is shown in red. Regex mode supports capture groups: use $1, $2 in the replace field to reference groups from your pattern. Case-insensitive mode adds the 'i' flag to the regex. The output updates in real time as you type in the find or replace fields. Developers normalising log output, writers doing bulk text substitutions, and data analysts cleaning CSV fields are the primary users.",
    howToUse: [
      "Paste text into the left Input panel.",
      "Enter your search term in the Find field and replacement in the Replace with field.",
      "Toggle Regex to use a regular expression pattern, and Case-sensitive to control case matching.",
      "The match count and replaced output update in real time — click Copy to copy the result.",
    ],
    keywords: [
      "find and replace text online free",
      "text find replace tool",
      "regex find replace online",
      "bulk text replacement online",
      "find replace with regex",
      "case insensitive find replace",
      "text substitution tool online",
      "replace all occurrences in text",
    ],
    faqs: [
      {
        question: "Does it replace all occurrences or just the first?",
        answer:
          "All occurrences. The global flag is always applied, so every match in the text is replaced in one operation.",
      },
      {
        question: "Does it support regex capture groups in the replace field?",
        answer:
          "Yes. Use $1, $2, etc. in the Replace field to reference capture groups from your regex pattern. For example, find (\\w+) (\\w+) and replace with $2 $1 to swap two words.",
      },
      {
        question: "What happens if I enter an invalid regex?",
        answer:
          "The error message from the JavaScript RegExp constructor is shown in red below the controls. The output is not changed until the pattern is valid.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All processing runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "text-to-slug",
    name: "Text to Slug Converter",
    description: "Convert any text into a URL-friendly slug with hyphen, underscore, or dot separator.",
    category: "Text",
    icon: "Link2",
    component: "TextToSlug",
    longDescription:
      "Blog post titles, product names, and page headings need to become clean URL slugs before they can be used in a CMS, routing system, or file name. This converter applies a four-step transformation: lowercase the entire string, normalise accented characters using Unicode NFD decomposition and strip the combining diacritical marks (so 'é' becomes 'e', 'ü' becomes 'u', 'ñ' becomes 'n'), remove all remaining non-alphanumeric characters except spaces, then replace whitespace runs with your chosen separator. Three separator buttons let you choose hyphen (-), underscore (_), or dot (.) — the most common slug formats. The result appears in a styled code block with a Copy button. The conversion updates instantly as you type. Developers setting up CMS routes, bloggers creating SEO-friendly URLs, and anyone naming files for a static site generator are the primary users.",
    howToUse: [
      "Type or paste your text into the Input text field.",
      "Click Hyphen (-), Underscore (_), or Dot (.) to choose the word separator.",
      "The slug appears in the output code block below — click Copy to copy it.",
    ],
    keywords: [
      "text to slug converter online free",
      "url slug generator",
      "convert title to url slug",
      "seo slug generator",
      "blog post slug creator",
      "slug from text online",
      "url friendly text converter",
      "remove special characters for url",
    ],
    faqs: [
      {
        question: "Does it handle accented characters like é, ü, ñ?",
        answer:
          "Yes. Unicode NFD normalisation decomposes accented characters into their base letter plus a combining mark, then the combining marks are stripped. So 'é' becomes 'e', 'ü' becomes 'u', 'ñ' becomes 'n'.",
      },
      {
        question: "Are numbers preserved in the slug?",
        answer:
          "Yes. Alphanumeric characters (a-z, 0-9) are kept. Only special characters and punctuation are removed.",
      },
      {
        question: "What happens to multiple consecutive spaces?",
        answer:
          "Multiple spaces are treated as a single separator. The regex replaces any run of whitespace with one instance of the chosen separator.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate Lorem Ipsum placeholder text in paragraphs, sentences, or words — up to 50 at a time.",
    category: "Text",
    icon: "AlignLeft",
    component: "LoremIpsum",
    longDescription:
      "Every designer and developer needs placeholder text for mockups, wireframes, and prototypes. This generator produces Lorem Ipsum text in three modes: Paragraphs (4-8 sentences each, separated by blank lines), Sentences (8-18 words each, joined with spaces), or Words (individual words from the classic Lorem Ipsum pool). Set the count (1-50) and click Generate. Each generation is randomised — words are sampled from the 69-word classic Lorem Ipsum vocabulary, sentences are capitalised and end with a period, and paragraphs contain a random number of sentences. The output appears in a textarea with a Copy button. Useful for filling a CMS template before real content is ready, testing a text layout at different lengths, or generating dummy data for a form field. Runs entirely in your browser — no API call, no network request.",
    howToUse: [
      "Set the Count field (1-50) to how many units you want.",
      "Choose the Type from the dropdown: Paragraphs, Sentences, or Words.",
      "Click Generate — the output appears in the textarea below.",
      "Click Copy to copy the generated text.",
    ],
    keywords: [
      "lorem ipsum generator online free",
      "placeholder text generator",
      "dummy text generator",
      "lorem ipsum paragraphs online",
      "generate lorem ipsum sentences",
      "filler text generator",
      "lorem ipsum no install",
      "random placeholder text",
    ],
    faqs: [
      {
        question: "Is the text truly random each time?",
        answer:
          "Yes. Words are randomly sampled from the Lorem Ipsum word pool using Math.random() on each generation. Paragraph and sentence lengths are also randomised within set ranges.",
      },
      {
        question: "What is the maximum count?",
        answer:
          "The count input accepts values from 1 to 50. For very large amounts of placeholder text, generate multiple times and combine.",
      },
      {
        question: "Is the text the classic Lorem Ipsum or random words?",
        answer:
          "Words are sampled from the classic 69-word Lorem Ipsum vocabulary (lorem, ipsum, dolor, sit, amet, etc.), so the output looks like traditional Lorem Ipsum but is randomly assembled.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The generator runs entirely in your browser. No network request is made.",
      },
    ],
  },
  {
    slug: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two texts line by line and highlight added and removed lines with a count.",
    category: "Text",
    icon: "GitCompare",
    component: "TextDiff",
    longDescription:
      "Spotting the difference between two versions of a document, config file, or code snippet by eye is unreliable. This diff checker uses a Longest Common Subsequence (LCS) algorithm — the same approach used by git diff — to compare two texts line by line. Paste the original text on the left and the modified text on the right, then click Compare. Lines present only in the modified version are shown in green with a + prefix; lines present only in the original are shown in red with a - prefix; unchanged lines are shown in grey. A summary above the diff shows the count of added and removed lines. The diff panel is scrollable for long documents. Developers reviewing config changes, writers comparing document drafts, and anyone who needs to audit what changed between two versions are the primary users. Runs entirely in your browser — no file upload.",
    howToUse: [
      "Paste the original text into the left 'Original text' panel.",
      "Paste the modified text into the right 'Modified text' panel.",
      "Click Compare to generate the diff.",
      "Green lines (+) were added; red lines (-) were removed; grey lines are unchanged.",
    ],
    keywords: [
      "text diff checker online free",
      "compare two texts online",
      "text comparison tool",
      "diff checker online",
      "find differences between two texts",
      "line by line text compare",
      "text diff no upload",
      "compare document versions online",
    ],
    faqs: [
      {
        question: "What algorithm is used for the diff?",
        answer:
          "The Longest Common Subsequence (LCS) algorithm, implemented with a dynamic programming table. This is the same approach used by git diff and produces a minimal set of additions and removals.",
      },
      {
        question: "Does it do word-level or character-level diffing?",
        answer:
          "Line-level only. Each line is treated as a single unit. A line that changed by one character will appear as one removed line and one added line.",
      },
      {
        question: "Is there a size limit?",
        answer:
          "No enforced limit, but the LCS algorithm has O(m×n) complexity. Very large texts (thousands of lines each) may be slow to compare.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The diff runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "text-encryptor",
    name: "Text Encryptor / Decryptor",
    description: "Encrypt and decrypt text using Caesar cipher (custom shift), ROT13, or Base64.",
    category: "Text",
    icon: "Lock",
    component: "TextEncryptor",
    longDescription:
      "Learning about classical ciphers or need a simple obfuscation method for non-sensitive text? This tool implements three methods. Caesar cipher shifts each letter by a custom amount (1-25) set with a slider — encrypting with shift 3 turns 'A' into 'D'; decrypting reverses the shift. ROT13 is a fixed Caesar cipher with shift 13, its own inverse (applying ROT13 twice returns the original), commonly used to hide spoilers in online forums. Base64 encodes text to Base64 using btoa() with UTF-8 pre-encoding, and decodes using atob() — the same method as the dedicated Base64 tool. Encrypt and Decrypt toggle buttons control the direction. Non-alphabetic characters (numbers, punctuation, spaces) pass through unchanged in Caesar and ROT13. These are educational and obfuscation tools only — none of them provide cryptographic security. For secure encryption, use AES or similar algorithms.",
    howToUse: [
      "Click Caesar Cipher, ROT13, or Base64 to choose the method.",
      "For Caesar Cipher, drag the Shift slider (1-25) to set the shift amount.",
      "Click Encrypt or Decrypt to set the direction.",
      "Paste text into the Input panel — the output appears instantly. Click Copy to copy it.",
    ],
    keywords: [
      "text encryptor online free",
      "caesar cipher tool online",
      "rot13 encoder decoder",
      "encrypt text online",
      "decrypt caesar cipher online",
      "text obfuscation tool",
      "rot13 converter",
      "simple text encryption online",
    ],
    faqs: [
      {
        question: "Is this secure encryption?",
        answer:
          "No. Caesar cipher and ROT13 are trivially reversible by brute force or frequency analysis. Base64 is encoding, not encryption — anyone can decode it. Do not use these methods for sensitive data.",
      },
      {
        question: "What shift value does ROT13 use?",
        answer:
          "ROT13 always uses a shift of 13. Because the alphabet has 26 letters, applying ROT13 twice returns the original text — the same function encrypts and decrypts.",
      },
      {
        question: "Does Caesar cipher affect numbers and punctuation?",
        answer:
          "No. Only alphabetic characters (a-z, A-Z) are shifted. Numbers, spaces, and punctuation pass through unchanged.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All cipher operations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML Converter",
    description: "Convert Markdown to HTML source code instantly — copy the raw tags, not just a preview.",
    category: "Text",
    icon: "Code",
    component: "MarkdownToHtml",
    longDescription:
      "The Markdown Preview tool shows you how Markdown renders visually. This tool gives you the actual HTML source code — the raw tags you can paste into a CMS, email template, or static site. The converter handles the most common Markdown elements: # h1, ## h2, ### h3 headings, **bold** to strong, *italic* to em, `inline code` to code, [link](url) to anchor tags (with javascript: URL sanitisation), and - list items wrapped in ul. HTML special characters (&, <, >) in the input are escaped before conversion so they appear correctly in the output. The conversion runs on every keystroke — no button to click. Paste Markdown on the left, copy HTML from the right. Bloggers migrating content to HTML-based CMSs, developers generating email template markup, and anyone who needs the HTML source rather than the rendered view are the primary users.",
    howToUse: [
      "Paste Markdown into the left panel.",
      "The HTML source code appears instantly in the right panel.",
      "Click Copy to copy the HTML to your clipboard.",
    ],
    keywords: [
      "markdown to html converter online free",
      "convert markdown to html",
      "md to html online",
      "markdown html source code",
      "markdown converter online",
      "markdown to html no install",
      "generate html from markdown",
      "markdown to html for cms",
    ],
    faqs: [
      {
        question: "What Markdown elements are supported?",
        answer:
          "Headings (h1-h3), bold (**text**), italic (*text*), inline code (`text`), links ([label](url)), and unordered lists (- item). Tables, task lists, and fenced code blocks are not supported.",
      },
      {
        question: "Are special HTML characters escaped?",
        answer:
          "Yes. &, <, and > in the input are escaped to &amp;, &lt;, and &gt; before conversion, so they appear correctly in the HTML output.",
      },
      {
        question: "Are javascript: links sanitised?",
        answer:
          "Yes. Links with a javascript: href are rendered as plain text rather than anchor tags to prevent XSS.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "html-to-markdown",
    name: "HTML to Markdown Converter",
    description: "Convert HTML markup to clean Markdown syntax — handles headings, bold, italic, links, and lists.",
    category: "Text",
    icon: "FileCode",
    component: "HtmlToMarkdown",
    longDescription:
      "Migrating content from an HTML-based CMS to a Markdown-based system like Jekyll, Hugo, or Notion requires converting HTML tags back to Markdown syntax. This converter handles the most common tags: h1-h3 to # headings, strong and b to **bold**, em and i to *italic*, code to backtick inline code, a href to [text](url) links, li to - list items, ul/ol wrappers removed, br to newlines, p to double-newline paragraphs, and HTML entities (&amp;, &lt;, &gt;, &nbsp;) decoded back to their characters. Any remaining unrecognised tags are stripped. The conversion runs on every keystroke. Paste HTML on the left, copy Markdown from the right. Content editors migrating blog posts, developers converting documentation, and anyone who needs clean Markdown from HTML source are the primary users.",
    howToUse: [
      "Paste HTML into the left panel.",
      "The Markdown output appears instantly in the right panel.",
      "Click Copy to copy the Markdown to your clipboard.",
    ],
    keywords: [
      "html to markdown converter online free",
      "convert html to markdown",
      "html to md online",
      "html markdown converter",
      "strip html to markdown",
      "html to markdown no install",
      "convert html tags to markdown",
      "html to markdown for cms migration",
    ],
    faqs: [
      {
        question: "What HTML tags are converted?",
        answer:
          "h1-h3, strong, b, em, i, code, a (with href), li, ul, ol, br, p. Unrecognised tags are stripped. Inline styles and class attributes are ignored.",
      },
      {
        question: "Does it handle nested HTML?",
        answer:
          "Basic nesting is handled. Very complex or deeply nested HTML (e.g. tables, nested divs) may not convert perfectly — the converter is designed for typical article content.",
      },
      {
        question: "Are HTML entities decoded?",
        answer:
          "Yes. &amp;, &lt;, &gt;, and &nbsp; are decoded to their character equivalents in the Markdown output.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "text-to-html",
    name: "Plain Text to HTML Converter",
    description: "Wrap plain text paragraphs in HTML p, div, or span tags — special characters escaped automatically.",
    category: "Text",
    icon: "FileCode2",
    component: "TextToHtml",
    longDescription:
      "Pasting plain text into an HTML template requires wrapping each paragraph in tags and escaping special characters. This tool automates both steps. Paste plain text where blank lines separate paragraphs — the tool splits on double newlines, trims each paragraph, escapes &, <, and > to their HTML entities, converts single newlines within a paragraph to br tags, and wraps each paragraph in your chosen tag. Three tag buttons let you choose p (standard paragraph), div (block container), or span (inline). The output is ready to paste directly into HTML. Developers building email templates, content editors preparing text for a CMS, and anyone converting plain text to HTML markup are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Paste plain text into the left panel — use blank lines to separate paragraphs.",
      "Click &lt;p&gt;, &lt;div&gt;, or &lt;span&gt; to choose the wrapper tag.",
      "The HTML output appears instantly in the right panel.",
      "Click Copy to copy the HTML.",
    ],
    keywords: [
      "plain text to html converter online free",
      "wrap text in html tags online",
      "convert text to html paragraphs",
      "text to html p tags",
      "escape html special characters online",
      "plain text html wrapper",
      "text to html no install",
      "convert paragraphs to html",
    ],
    faqs: [
      {
        question: "How are paragraphs detected?",
        answer:
          "The text is split on double newlines (blank lines). Each non-empty block becomes one wrapped element. Single newlines within a paragraph are converted to br tags.",
      },
      {
        question: "Are special characters escaped?",
        answer:
          "Yes. &, <, and > are escaped to &amp;, &lt;, and &gt; automatically, so they display correctly in HTML.",
      },
      {
        question: "When should I use span instead of p or div?",
        answer:
          "Use p for standard paragraphs, div for block-level containers, and span for inline content that should not create a new block. span is rarely the right choice for multi-line text.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "text-repeater",
    name: "Text Repeater",
    description: "Repeat any text up to 1000 times with newline, space, comma, or no separator.",
    category: "Text",
    icon: "Repeat",
    component: "TextRepeater",
    longDescription:
      "Generating repeated strings is a common need in testing and data preparation: filling a textarea with dummy values, creating a repeated pattern for a CSS content property, generating a list of identical placeholder rows, or stress-testing a character limit. This tool takes any text string, a repeat count (1-1000), and a separator choice — New line, Space, Comma, or None — and joins the repetitions accordingly. The output character count is shown so you can verify the total length before copying. The count is capped at 1000 to prevent browser slowdowns from extremely large outputs. The output appears in a textarea with a Copy button. Runs entirely in your browser.",
    howToUse: [
      "Enter the text to repeat in the Text to repeat field.",
      "Set the Repeat count (1-1000).",
      "Choose a Separator from the dropdown: New line, Space, Comma, or None.",
      "The output and character count appear below — click Copy to copy.",
    ],
    keywords: [
      "text repeater online free",
      "repeat text online",
      "duplicate text generator",
      "repeat string online",
      "text repeat tool",
      "generate repeated text",
      "repeat words online",
      "text repetition generator",
    ],
    faqs: [
      {
        question: "What is the maximum repeat count?",
        answer:
          "1000. The input is clamped to Math.min(1000, value) to prevent generating extremely large strings that could freeze the browser.",
      },
      {
        question: "What separators are available?",
        answer:
          "New line (\\n), Space ( ), Comma (, ), or None (repetitions joined with no separator). Choose None to concatenate the text directly.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The repetition runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "random-string-generator",
    name: "Random String Generator",
    description: "Generate random strings with custom length and character sets — up to 50 at once.",
    category: "Text",
    icon: "Shuffle",
    component: "RandomStringGenerator",
    longDescription:
      "Generating random strings for test data, temporary tokens, or sample IDs requires control over both length and character composition. This generator lets you set the string length (1-256), how many strings to generate at once (1-50), and which character sets to include via checkboxes: Uppercase (A-Z), Lowercase (a-z), Digits (0-9), and Symbols (!@#$%^&*()_+-=[]{}|;:,.<>?). The character pool is built from the checked sets and each position is filled by indexing into the pool using Math.random(). Results appear in a list with individual Copy buttons and a Refresh icon on the Generate button. Note: this tool uses Math.random(), not the Web Crypto API — for cryptographically secure random strings, use the Password Generator tool which uses crypto.getRandomValues.",
    howToUse: [
      "Set the Length (1-256) and How many (1-50) fields.",
      "Check the character sets to include: Uppercase, Lowercase, Digits, Symbols.",
      "Click Generate — results appear in a list with individual Copy buttons.",
    ],
    keywords: [
      "random string generator online free",
      "generate random string online",
      "random alphanumeric string generator",
      "random text string generator",
      "generate random token online",
      "random string with symbols",
      "bulk random string generator",
      "random string no install",
    ],
    faqs: [
      {
        question: "Is the output cryptographically secure?",
        answer:
          "No. This tool uses Math.random(), which is pseudo-random. For cryptographically secure random strings (e.g. API tokens, session IDs), use the Password Generator tool which uses crypto.getRandomValues.",
      },
      {
        question: "What symbols are included in the Symbols set?",
        answer:
          "The symbols pool is: !@#$%^&*()_+-=[]{}|;:,.<>? — 22 characters commonly found on standard keyboards.",
      },
      {
        question: "Can I generate strings with only digits?",
        answer:
          "Yes. Uncheck all sets except Digits to generate numeric-only strings of any length.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The generator runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "text-binary-converter",
    name: "Text to Binary Converter",
    description: "Convert text to space-separated 8-bit binary bytes and decode binary back to text.",
    category: "Text",
    icon: "Binary",
    component: "TextBinaryConverter",
    longDescription:
      "Binary representation of text is a fundamental concept in computer science education and a practical tool for debugging encoding issues. This converter works in two directions. Text to Binary: each character's Unicode code point is converted to an 8-bit binary string using charCodeAt(0).toString(2).padStart(8, '0'), and bytes are joined with spaces — so 'Hi' becomes '01001000 01101001'. Binary to Text: space-separated 8-bit groups are parsed with parseInt(b, 2) and converted back to characters with String.fromCharCode(). If the binary input contains invalid groups, an error message is shown. The two-button toggle (Text → Binary / Binary → Text) switches direction. The output appears in a side-by-side panel with a Copy button. Useful for computer science students learning binary encoding, developers debugging character encoding issues, and anyone who needs to inspect the binary representation of a string.",
    howToUse: [
      "Click 'Text → Binary' or 'Binary → Text' to choose the direction.",
      "Paste your input into the left panel (text or space-separated binary bytes).",
      "The output appears instantly in the right panel.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "text to binary converter online free",
      "binary to text converter",
      "convert text to binary online",
      "binary code translator",
      "text binary encoder decoder",
      "ascii to binary online",
      "binary text converter no install",
      "decode binary to text online",
    ],
    faqs: [
      {
        question: "What encoding is used?",
        answer:
          "Each character is converted using charCodeAt(0), which returns the UTF-16 code unit. For standard ASCII characters (0-127), this matches the ASCII value. For characters above 127, the code point may exceed 8 bits and the binary representation will be longer than 8 digits.",
      },
      {
        question: "How should I format binary input for decoding?",
        answer:
          "Enter space-separated 8-bit groups, e.g. '01001000 01100101 01101100 01101100 01101111'. The decoder splits on whitespace and parses each group as a base-2 integer.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "morse-converter",
    name: "Morse Code Converter",
    description: "Encode text to Morse code or decode Morse code back to text — supports letters, digits, and punctuation.",
    category: "Text",
    icon: "Radio",
    component: "MorseConverter",
    longDescription:
      "Morse code encodes letters and digits as sequences of dots and dashes. This converter handles both directions using a complete lookup table covering all 26 letters, digits 0-9, and common punctuation (. , ? ! / @ & : ; - _ ( ) = +). Text to Morse: the input is uppercased, each character is looked up in the table, and spaces between words are represented as ' / ' (space-slash-space). Unknown characters are represented as '?'. Morse to Text: the input is split on ' / ' to get words, each word is split on spaces to get individual codes, and each code is reverse-looked up. The two-button toggle switches direction. The output appears side by side with a Copy button. Useful for learning Morse code, encoding messages for amateur radio practice, or decoding Morse from a signal log.",
    howToUse: [
      "Click 'Text → Morse' or 'Morse → Text' to choose the direction.",
      "Paste your input into the left panel. For Morse input, use spaces between codes and ' / ' (space-slash-space) between words.",
      "The output appears instantly in the right panel.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "morse code converter online free",
      "text to morse code translator",
      "morse code decoder online",
      "encode text to morse",
      "morse code translator",
      "decode morse code online",
      "morse code generator",
      "morse code tool no install",
    ],
    faqs: [
      {
        question: "How do I separate words in Morse input?",
        answer:
          "Use a forward slash surrounded by spaces: ' / '. For example: '.... . / .-- --- .-. .-.. -..' decodes to 'HE WORLD'.",
      },
      {
        question: "What characters are supported?",
        answer:
          "All 26 letters (A-Z), digits 0-9, and punctuation: . , ? ! / @ & : ; - _ ( ) = +. Unsupported characters are represented as '?' in the Morse output.",
      },
      {
        question: "Is the input case-sensitive?",
        answer:
          "No. The input is automatically uppercased before encoding, so 'hello' and 'HELLO' produce the same Morse output.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "palindrome-checker",
    name: "Palindrome Checker",
    description: "Check if a word or phrase is a palindrome — toggle case, space, and punctuation options.",
    category: "Text",
    icon: "ArrowLeftRight",
    component: "PalindromeChecker",
    longDescription:
      "A palindrome reads the same forwards and backwards. Whether a phrase qualifies depends on how strictly you apply the definition — 'racecar' is obviously a palindrome, but 'A man a plan a canal Panama' only qualifies if you ignore case, spaces, and punctuation. This checker lets you control all three with checkboxes: Ignore case (lowercases before comparison), Ignore spaces (strips all whitespace), and Ignore punctuation (removes all non-alphanumeric characters). The cleaned string is shown below the result so you can see exactly what was compared. The result is displayed as a large green 'Palindrome!' or red 'Not a palindrome' card that updates instantly as you type. Useful for word games, linguistics exercises, and testing string manipulation logic.",
    howToUse: [
      "Type or paste text into the input field.",
      "Toggle Ignore case, Ignore spaces, and Ignore punctuation as needed.",
      "The result card shows instantly — green for palindrome, red for not.",
      "The cleaned string used for comparison is shown below the result.",
    ],
    keywords: [
      "palindrome checker online free",
      "check if word is palindrome",
      "palindrome detector online",
      "is it a palindrome tool",
      "palindrome tester",
      "check phrase palindrome online",
      "palindrome with spaces ignored",
      "palindrome checker no install",
    ],
    faqs: [
      {
        question: "What is a palindrome?",
        answer:
          "A palindrome reads the same forwards and backwards. 'racecar' and 'level' are simple examples. 'A man a plan a canal Panama' is a classic phrase palindrome when spaces and punctuation are ignored.",
      },
      {
        question: "What does 'Ignore punctuation' remove?",
        answer:
          "It removes all characters that are not letters or digits using a /[^a-z0-9]/gi regex. This strips spaces, commas, periods, apostrophes, and all other punctuation.",
      },
      {
        question: "Does it work for non-English text?",
        answer:
          "The ignore punctuation regex uses /[^a-z0-9]/gi, which removes non-ASCII characters. For non-English palindromes, uncheck Ignore punctuation and check only Ignore case and Ignore spaces.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The check runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV Converter",
    description: "Convert a JSON array of objects to CSV — all keys become headers, values properly escaped.",
    category: "Code",
    icon: "Table",
    component: "JsonToCsv",
    longDescription:
      "Exporting data from an API or database often returns JSON, but spreadsheet tools like Excel and Google Sheets expect CSV. This converter takes a JSON array of objects, collects all unique keys across all objects (using a Set to handle sparse objects where some rows have extra fields), uses those keys as the CSV header row, and maps each object's values to the corresponding columns. Values containing commas, double quotes, or newlines are wrapped in double quotes and internal quotes are escaped as double-double-quotes — the RFC 4180 CSV standard. A single object (not in an array) is also accepted and treated as a one-row CSV. Click Convert to generate the CSV, then Download CSV to save it as a .csv file or copy from the output panel. Runs entirely in your browser using JSON.parse() for validation.",
    howToUse: [
      "Paste a JSON array of objects into the left panel (e.g. [{\"name\":\"Alice\",\"age\":30}]).",
      "Click Convert — the CSV appears in the right panel.",
      "Click Download CSV to save as a .csv file, or copy from the output panel.",
    ],
    keywords: [
      "json to csv converter online free",
      "convert json to csv online",
      "json csv export tool",
      "json array to csv",
      "export json as csv file",
      "json to spreadsheet online",
      "json to csv no install",
      "convert api json to csv",
    ],
    faqs: [
      {
        question: "What happens if objects have different keys?",
        answer:
          "All unique keys across all objects are collected and used as headers. Objects missing a key will have an empty cell in that column.",
      },
      {
        question: "Are values with commas or quotes handled correctly?",
        answer:
          "Yes. Values containing commas, double quotes, or newlines are wrapped in double quotes. Internal double quotes are escaped as two double quotes, following RFC 4180.",
      },
      {
        question: "Does it handle nested objects?",
        answer:
          "Nested objects and arrays are converted to their JSON string representation (e.g. '{\"city\":\"London\"}'). Flat arrays of simple objects work best.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON Converter",
    description: "Convert CSV data to a JSON array of objects — handles quoted fields with commas.",
    category: "Code",
    icon: "Braces",
    component: "CsvToJson",
    longDescription:
      "Importing CSV data into a JavaScript application or API requires converting it to JSON first. This converter parses CSV using a proper field parser that handles quoted fields containing commas, escaped double quotes (two consecutive double quotes inside a quoted field), and multi-line values. The first row is used as the key names for each object. Each subsequent row becomes one object in the output array. The output is formatted with JSON.stringify(data, null, 2) for readability. Click Convert to generate the JSON, then copy from the output panel. Developers importing spreadsheet exports into a Node.js script, data analysts converting CSV reports to JSON for further processing, and anyone who needs to feed CSV data into a JSON-based API are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Paste CSV data into the left panel — the first row must be the header row.",
      "Click Convert — the JSON array appears in the right panel.",
      "Click Copy to copy the JSON output.",
    ],
    keywords: [
      "csv to json converter online free",
      "convert csv to json online",
      "csv json import tool",
      "csv to json array",
      "parse csv to json online",
      "csv to json no install",
      "spreadsheet to json converter",
      "csv to json with headers",
    ],
    faqs: [
      {
        question: "Does it handle quoted fields with commas?",
        answer:
          "Yes. Fields wrapped in double quotes containing commas are parsed correctly. The parser tracks whether it is inside a quoted field before treating a comma as a delimiter.",
      },
      {
        question: "What if a field contains a double quote?",
        answer:
          "Two consecutive double quotes inside a quoted field are treated as an escaped single double quote, following the CSV standard.",
      },
      {
        question: "Does the first row have to be headers?",
        answer:
          "Yes. The first row is always used as the key names for the JSON objects. If your CSV has no header row, the first data row will be used as keys.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    description: "Format and validate XML with 2-space indentation, or minify it — uses the browser's DOMParser.",
    category: "Code",
    icon: "Code2",
    component: "XmlFormatter",
    longDescription:
      "Minified XML from API responses, config files, and data exports is nearly impossible to read. This formatter uses the browser's native DOMParser with the 'application/xml' MIME type to validate your XML first — if there's a syntax error, the parsererror element's text content is shown in red so you know exactly what went wrong. On valid XML, clicking Format applies a custom indentation algorithm that tracks nesting depth and adds 2 spaces per level. Clicking Minify strips all whitespace between tags using a regex. Both operations validate first, so you can't accidentally minify invalid XML. The output appears in a side-by-side panel with a Copy button. Developers debugging SOAP responses, working with RSS feeds, editing Maven pom.xml files, or formatting Android layout XML are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Paste XML into the left 'Input XML' panel.",
      "Click Format to pretty-print with 2-space indentation, or Minify to compact it.",
      "If the XML is invalid, a red error message appears below the buttons.",
      "Copy the result from the right Output panel.",
    ],
    keywords: [
      "xml formatter online free",
      "format xml online",
      "xml beautifier",
      "xml minifier online",
      "xml validator and formatter",
      "pretty print xml online",
      "xml indentation tool",
      "xml formatter no install",
    ],
    faqs: [
      {
        question: "How does it validate XML?",
        answer:
          "The browser's DOMParser is used with the 'application/xml' MIME type. If parsing fails, a parsererror element is present in the result and its text content is shown as the error message.",
      },
      {
        question: "What indentation does Format use?",
        answer:
          "2 spaces per nesting level. The formatter tracks depth by detecting opening and closing tags and adjusts indentation accordingly.",
      },
      {
        question: "Does it support XML with namespaces?",
        answer:
          "Yes. The DOMParser handles namespaced XML correctly. The formatter preserves namespace prefixes in the output.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The DOMParser and formatting run entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "html-formatter",
    name: "HTML Formatter",
    description: "Beautify HTML with 2-space indentation or minify it — inline elements handled correctly.",
    category: "Code",
    icon: "FileCode",
    component: "HtmlFormatter",
    longDescription:
      "Minified HTML from build tools or CMS exports is hard to read and edit. This formatter applies a custom indentation algorithm that correctly handles the distinction between block and inline elements: block elements (div, p, h1-h6, ul, ol, li, table, etc.) get their own indented lines, while inline elements (a, span, strong, em, code, etc.) stay on the same line as their surrounding content. Self-closing elements (br, hr, img, input, link, meta) don't increase the indent depth. Minify strips all whitespace between tags and collapses runs of whitespace to a single space. The output appears in a side-by-side panel with a Copy button. Developers cleaning up HTML from a WYSIWYG editor, inspecting email template markup, or formatting HTML snippets before committing are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Paste HTML into the left 'Input HTML' panel.",
      "Click 'Format / Beautify' to pretty-print with 2-space indentation, or Minify to compact it.",
      "Copy the result from the right Output panel.",
    ],
    keywords: [
      "html formatter online free",
      "format html online",
      "html beautifier",
      "html minifier online",
      "beautify html code",
      "html indentation tool",
      "html formatter no install",
      "pretty print html online",
    ],
    faqs: [
      {
        question: "Does it validate HTML?",
        answer:
          "No. The formatter applies indentation rules without parsing the HTML through a validator. Invalid HTML may produce unexpected indentation.",
      },
      {
        question: "How does it handle inline elements?",
        answer:
          "A hardcoded set of inline elements (a, span, strong, em, code, etc.) are not given their own indented lines. Block elements always start on a new line.",
      },
      {
        question: "Does Minify remove comments?",
        answer:
          "No. The minifier only collapses whitespace. HTML comments are preserved.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The formatting runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "css-formatter",
    name: "CSS Formatter",
    description: "Format CSS with consistent indentation or minify it by stripping whitespace and comments.",
    category: "Code",
    icon: "Paintbrush",
    component: "CssFormatter",
    longDescription:
      "CSS copied from a minified stylesheet or generated by a build tool is a single unreadable line. This formatter applies a regex-based beautification: opening braces get a space before them and a newline after, each property is indented with 2 spaces and followed by a newline, and closing braces get their own line with a blank line after. Minify strips all CSS comments (/* ... */), collapses whitespace runs to a single space, and removes spaces around {, }, :, ;, ,, >, ~, and + characters. The output appears in a side-by-side panel with a Copy button. Front-end developers cleaning up vendor CSS, designers inspecting minified stylesheets, and anyone who needs to read or edit a compressed CSS file are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Paste CSS into the left 'Input CSS' panel.",
      "Click Format to pretty-print with 2-space indentation, or Minify to compact it.",
      "Copy the result from the right Output panel.",
    ],
    keywords: [
      "css formatter online free",
      "format css online",
      "css beautifier",
      "css minifier online",
      "beautify css code",
      "css indentation tool",
      "css formatter no install",
      "minify css online",
    ],
    faqs: [
      {
        question: "Does Minify remove CSS comments?",
        answer:
          "Yes. The minifier strips all /* ... */ comments before collapsing whitespace.",
      },
      {
        question: "Does it handle media queries and nested rules?",
        answer:
          "The formatter applies regex-based rules and does not track nesting depth. Media queries and nested rules are formatted but may not have correct inner indentation.",
      },
      {
        question: "Does it validate CSS?",
        answer:
          "No. The formatter applies string transformations without parsing the CSS. Invalid CSS will be formatted without error messages.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The formatting runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "js-formatter",
    name: "JavaScript Formatter",
    description: "Format or minify JavaScript code with basic indentation — no external library required.",
    category: "Code",
    icon: "FileJson",
    component: "JsFormatter",
    longDescription:
      "Quickly readable JavaScript is important when debugging minified code or reviewing a snippet. This formatter applies a character-by-character parsing approach: it tracks string literals (single quotes, double quotes, template literals) to avoid treating braces inside strings as structural, increments indent depth on { and [, decrements on } and ], and adds a newline after each semicolon. The result is a basic but functional indentation that makes most JavaScript readable. Minify strips single-line comments (//), block comments (/* */), and collapses whitespace runs to a single space. For production code formatting with full AST-based accuracy, use Prettier or ESLint. This tool is best for quick inspection of minified snippets or small scripts. Runs entirely in your browser.",
    howToUse: [
      "Paste JavaScript into the left 'Input JavaScript' panel.",
      "Click Format to apply basic indentation, or Minify to compact it.",
      "Copy the result from the right Output panel.",
    ],
    keywords: [
      "javascript formatter online free",
      "format javascript online",
      "js beautifier online",
      "js minifier online",
      "beautify javascript code",
      "javascript code formatter",
      "js formatter no install",
      "minify javascript online",
    ],
    faqs: [
      {
        question: "Is this as accurate as Prettier?",
        answer:
          "No. This is a basic character-level formatter, not an AST-based tool. It handles most simple cases but may produce incorrect indentation for complex code. For production use, use Prettier or ESLint.",
      },
      {
        question: "Does Minify remove comments?",
        answer:
          "Yes. Both single-line (//) and block (/* */) comments are stripped during minification.",
      },
      {
        question: "Does it handle template literals correctly?",
        answer:
          "Yes. The formatter tracks backtick string literals and does not treat braces inside them as structural indentation markers.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The formatting runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate cryptographically random UUID v4 values — up to 100 at once, copy individually or all.",
    category: "Code",
    icon: "Fingerprint",
    component: "UuidGenerator",
    longDescription:
      "UUID v4 (Universally Unique Identifier version 4) is the standard format for generating unique identifiers in databases, APIs, and distributed systems. Each UUID is a 128-bit random value formatted as 8-4-4-4-12 hexadecimal characters (e.g. 550e8400-e29b-41d4-a716-446655440000). This generator uses crypto.randomUUID() when available (all modern browsers), falling back to a Math.random()-based implementation. Set the Count field (1-100) and click Generate to produce a list. Each UUID has its own Copy button; a 'Copy all' button copies all UUIDs as newline-separated text. Developers seeding database tables, generating test fixture IDs, creating idempotency keys for API requests, and anyone who needs a batch of unique identifiers are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Set the Count field (1-100) to how many UUIDs you need.",
      "Click Generate — the list of UUIDs appears below.",
      "Click Copy next to any UUID to copy it individually, or 'Copy all' to copy all as newline-separated text.",
    ],
    keywords: [
      "uuid generator online free",
      "generate uuid v4 online",
      "random uuid generator",
      "guid generator online",
      "bulk uuid generator",
      "uuid for database",
      "uuid generator no install",
      "generate multiple uuids online",
    ],
    faqs: [
      {
        question: "Are these UUIDs truly random?",
        answer:
          "Yes. The generator uses crypto.randomUUID() which is cryptographically secure. The fallback uses Math.random() which is pseudo-random — modern browsers always use the crypto API.",
      },
      {
        question: "What is the difference between UUID v4 and other versions?",
        answer:
          "UUID v4 is randomly generated. UUID v1 is time-based. UUID v5 is name-based (SHA-1 hash). v4 is the most common choice for general-purpose unique IDs.",
      },
      {
        question: "Can two generated UUIDs ever be the same?",
        answer:
          "Theoretically yes, but the probability is astronomically small — approximately 1 in 5.3 × 10^36 for any two specific UUIDs to collide.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. UUID generation runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate SHA-1, SHA-256, and SHA-512 hashes from any text using the Web Crypto API.",
    category: "Code",
    icon: "ShieldCheck",
    component: "HashGenerator",
    longDescription:
      "Verifying file integrity, storing passwords securely, and generating content fingerprints all require cryptographic hash functions. This tool generates SHA-1, SHA-256, and SHA-512 hashes simultaneously from any text input using the browser's Web Crypto API (crypto.subtle.digest). The text is encoded to UTF-8 bytes with TextEncoder before hashing, and the resulting ArrayBuffer is converted to a lowercase hex string. All three hashes are generated in parallel with Promise.all for speed. Each hash has its own Copy button. A note in the UI explains that MD5 is not available in the Web Crypto API — SHA-256 is the recommended modern alternative for most use cases. Developers verifying checksums, security engineers generating test vectors, and anyone who needs a quick hash of a string are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Enter or paste text into the 'Input text' textarea.",
      "Click 'Generate Hashes' — SHA-1, SHA-256, and SHA-512 hashes appear below.",
      "Click Copy next to any hash to copy it to your clipboard.",
    ],
    keywords: [
      "hash generator online free",
      "sha256 hash generator",
      "sha512 hash online",
      "generate hash from text",
      "sha1 sha256 sha512 online",
      "text hash calculator",
      "cryptographic hash online",
      "hash generator no install",
    ],
    faqs: [
      {
        question: "Why is MD5 not available?",
        answer:
          "MD5 is not included in the Web Crypto API because it is considered cryptographically broken. SHA-256 is the recommended modern alternative for integrity checking and fingerprinting.",
      },
      {
        question: "Are the hashes deterministic?",
        answer:
          "Yes. The same input text always produces the same hash. Hash functions are deterministic by design.",
      },
      {
        question: "Can I hash a file instead of text?",
        answer:
          "This tool hashes text strings only. For file hashing, you would need to read the file as an ArrayBuffer and pass it to crypto.subtle.digest directly.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The Web Crypto API runs entirely in your browser. Your input is never transmitted.",
      },
    ],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JWT header and payload — shows expiry status and issued-at time.",
    category: "Code",
    icon: "KeyRound",
    component: "JwtDecoder",
    longDescription:
      "JSON Web Tokens (JWTs) are Base64Url-encoded strings used for authentication and API authorisation. When debugging an auth issue, you need to see what's inside the token without writing code. This decoder splits the JWT on dots, decodes the header and payload parts using Base64Url decoding (replacing - with + and _ with / before atob()), and displays them as formatted JSON. If the payload contains an exp claim, the tool shows whether the token is expired or still valid and displays the expiry time in your local timezone. The iat (issued at) claim is also shown if present. The signature is not verified — this tool is for inspection only. An error is shown if the token doesn't have exactly three dot-separated parts or if the header/payload can't be decoded. Developers debugging OAuth flows, inspecting API tokens, and verifying JWT claims are the primary users.",
    howToUse: [
      "Paste a JWT token into the textarea (the full eyJ... string).",
      "The decoded Header and Payload appear as formatted JSON below.",
      "If the token has an exp claim, a green or red banner shows whether it is expired.",
    ],
    keywords: [
      "jwt decoder online free",
      "decode jwt token online",
      "jwt token inspector",
      "jwt parser online",
      "json web token decoder",
      "inspect jwt claims",
      "jwt expiry checker",
      "jwt decoder no install",
    ],
    faqs: [
      {
        question: "Does it verify the JWT signature?",
        answer:
          "No. Signature verification requires the secret key or public key. This tool only decodes the Base64Url-encoded header and payload parts for inspection.",
      },
      {
        question: "What is Base64Url encoding?",
        answer:
          "Base64Url is a variant of Base64 that replaces + with - and / with _ to make the string URL-safe. The decoder reverses this before calling atob().",
      },
      {
        question: "Why does my token show as expired?",
        answer:
          "The exp claim is a Unix timestamp (seconds since epoch). The tool compares it to the current time. If exp is in the past, the token is expired.",
      },
      {
        question: "Is my token sent to a server?",
        answer: "No. The decoding runs entirely in your browser. Your token is never transmitted.",
      },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions with live match highlighting, flag toggles, and match position list.",
    category: "Code",
    icon: "Search",
    component: "RegexTester",
    longDescription:
      "Writing a regular expression and not knowing if it matches correctly is a common frustration. This tester shows live match highlighting as you type the pattern: matched substrings are highlighted in yellow in the test string panel. A match list below shows each match's index position and matched text. Four flag toggle buttons (g, i, m, s) let you switch global, case-insensitive, multiline, and dotAll modes on and off. The pattern is entered in a styled input with / delimiters and a flags field, matching the syntax you'd write in JavaScript code. If the pattern is invalid, the error message from the RegExp constructor is shown in red. The global flag is always applied for the match list; toggling g controls whether the highlighting replaces all matches or just the first. Developers writing validation patterns, data engineers building extraction regexes, and anyone learning regex syntax are the primary users.",
    howToUse: [
      "Enter your regex pattern in the pattern field (between the / delimiters).",
      "Toggle the g, i, m, s flag buttons to set regex flags.",
      "Paste your test string in the 'Test string' textarea.",
      "Matches are highlighted in yellow and listed below with their positions.",
    ],
    keywords: [
      "regex tester online free",
      "test regular expression online",
      "regex checker online",
      "javascript regex tester",
      "regex match highlighter",
      "regular expression debugger",
      "regex tester with flags",
      "regex tester no install",
    ],
    faqs: [
      {
        question: "What regex flavour is used?",
        answer:
          "JavaScript's built-in RegExp, which follows the ECMAScript standard. This is the same engine used in Node.js and all major browsers.",
      },
      {
        question: "What do the flag buttons do?",
        answer:
          "g = global (find all matches), i = case-insensitive, m = multiline (^ and $ match line boundaries), s = dotAll (. matches newlines). Click a button to toggle it on (blue) or off.",
      },
      {
        question: "Can I use capture groups?",
        answer:
          "Yes. Capture groups work normally. The match list shows the full match (group 0). Individual group values are not shown separately in the current UI.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The regex engine runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "cron-generator",
    name: "Cron Expression Generator",
    description: "Build cron expressions from presets or type your own — get a plain-English explanation instantly.",
    category: "Code",
    icon: "Clock",
    component: "CronGenerator",
    longDescription:
      "Cron expressions are powerful but cryptic. '0 */6 * * *' means 'every 6 hours' but you have to know the field order to read it. This tool works in both directions: select from 10 common presets (Every minute, Every hour, Every day at midnight, Every day at noon, Every Monday, Every weekday, Every Sunday, 1st of every month, Every 15 minutes, Every 6 hours) to populate the expression field, or type your own 5-field cron expression and get a plain-English explanation generated by a custom parser. The parser handles * (every), */n (every n units), specific values, and day-of-week ranges (1-5 = Monday to Friday). If the expression doesn't have exactly 5 fields, an 'Invalid cron expression' message is shown. A Copy button copies the expression. The field order is shown as a reminder: minute hour day-of-month month day-of-week. Runs entirely in your browser.",
    howToUse: [
      "Click a preset button (e.g. 'Every 15 minutes') to populate the expression field, or type your own 5-field cron expression.",
      "The plain-English explanation updates instantly below the input.",
      "Click Copy to copy the cron expression.",
    ],
    keywords: [
      "cron expression generator online free",
      "cron job builder",
      "cron syntax helper",
      "cron expression explainer",
      "generate cron expression online",
      "cron schedule generator",
      "cron expression to english",
      "cron generator no install",
    ],
    faqs: [
      {
        question: "What is the field order for a 5-field cron expression?",
        answer:
          "minute (0-59), hour (0-23), day-of-month (1-31), month (1-12), day-of-week (0-7, where 0 and 7 are Sunday). The tool shows this as a reminder below the input.",
      },
      {
        question: "Does it support seconds (6-field cron)?",
        answer:
          "No. This tool uses standard 5-field cron syntax. Some systems (like Spring Scheduler or Quartz) use a 6-field format with a seconds field — those are not supported here.",
      },
      {
        question: "Does it support step values like */15?",
        answer:
          "Yes. The explanation parser handles */n syntax and describes it as 'every n units'. For example, */15 in the minute field is explained as 'every 15 minutes'.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The explanation runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "length-converter",
    name: "Length Converter",
    description: "Convert between mm, cm, m, km, inches, feet, yards, and miles — all values shown at once.",
    category: "Converter",
    icon: "Ruler",
    component: "LengthConverter",
    longDescription:
      "Converting between metric and imperial length units is a daily task for engineers, architects, and anyone working across measurement systems. This converter stores all units as a base value in meters and converts to all eight units simultaneously: millimeter (0.001 m), centimeter (0.01 m), meter (1 m), kilometer (1000 m), inch (0.0254 m), foot (0.3048 m), yard (0.9144 m), and mile (1609.344 m). Enter a value, choose the source unit from the dropdown, and all eight conversions appear instantly in a grid. The source unit card is highlighted with a ring. Values are formatted to 7 significant figures with trailing zeros removed. Architects converting between feet and meters, engineers checking tolerances in millimeters, and travellers converting miles to kilometers are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Enter a numeric value in the Value field.",
      "Select the source unit from the 'From unit' dropdown.",
      "All eight conversions appear instantly in the grid below.",
    ],
    keywords: [
      "length converter online free",
      "meters to feet converter",
      "km to miles converter",
      "cm to inches converter",
      "unit converter length online",
      "mm cm m km converter",
      "feet to meters online",
      "length unit converter no install",
    ],
    faqs: [
      {
        question: "How accurate are the conversions?",
        answer:
          "Conversions use exact SI and imperial factors (e.g. 1 inch = 0.0254 m exactly) and are displayed to 7 significant figures with trailing zeros removed.",
      },
      {
        question: "Does it support nautical miles?",
        answer:
          "Not currently. The eight supported units are mm, cm, m, km, inch, foot, yard, and mile (statute mile).",
      },
      {
        question: "Can I enter decimal values?",
        answer:
          "Yes. The input accepts any numeric value including decimals and negative numbers.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All conversions run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "weight-converter",
    name: "Weight Converter",
    description: "Convert between mg, g, kg, metric tons, oz, lb, and stone — all values shown at once.",
    category: "Converter",
    icon: "Scale",
    component: "WeightConverter",
    longDescription:
      "Weight conversions between metric and imperial units come up constantly in cooking, shipping, fitness, and science. This converter stores all units as a base value in kilograms and converts to all seven units simultaneously: milligram (0.000001 kg), gram (0.001 kg), kilogram (1 kg), metric ton (1000 kg), ounce (0.0283495 kg), pound (0.453592 kg), and stone (6.35029 kg). Enter a value, choose the source unit, and all seven conversions appear instantly in a grid. The source unit card is highlighted. Values are formatted to 7 significant figures. Nutritionists converting grams to ounces for recipes, logistics teams converting kg to pounds for shipping labels, and fitness enthusiasts converting stone to kg for BMI calculations are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Enter a numeric value in the Value field.",
      "Select the source unit from the 'From unit' dropdown.",
      "All seven conversions appear instantly in the grid below.",
    ],
    keywords: [
      "weight converter online free",
      "kg to lbs converter",
      "pounds to kg converter",
      "grams to ounces converter",
      "stone to kg converter",
      "weight unit converter online",
      "metric imperial weight converter",
      "weight converter no install",
    ],
    faqs: [
      {
        question: "What is a stone in kg?",
        answer:
          "One stone equals 6.35029 kilograms. Stone is used primarily in the UK and Ireland for measuring body weight.",
      },
      {
        question: "What is the difference between a metric ton and a short ton?",
        answer:
          "A metric ton (tonne) is exactly 1000 kg. A US short ton is 907.185 kg. This tool uses the metric ton.",
      },
      {
        question: "Can I enter decimal values?",
        answer:
          "Yes. The input accepts any numeric value including decimals.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All conversions run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "temperature-converter",
    name: "Temperature Converter",
    description: "Convert between Celsius, Fahrenheit, and Kelvin — all three values shown simultaneously.",
    category: "Converter",
    icon: "Thermometer",
    component: "TemperatureConverter",
    longDescription:
      "Temperature conversions are needed constantly in cooking, science, weather, and engineering. This converter uses exact formulas: Celsius to Fahrenheit is C × 9/5 + 32, Fahrenheit to Celsius is (F - 32) × 5/9, and Kelvin is always Celsius + 273.15. Enter a value, choose the source unit (Celsius, Fahrenheit, or Kelvin), and all three values appear simultaneously in large cards. The source unit card is highlighted with a ring. Values are shown to 2 decimal places. Scientists working in Kelvin, cooks converting oven temperatures between Celsius and Fahrenheit, and travellers checking weather forecasts in unfamiliar units are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Enter a temperature value in the Value field.",
      "Select the source unit: Celsius (°C), Fahrenheit (°F), or Kelvin (K).",
      "All three values appear instantly in the cards below.",
    ],
    keywords: [
      "temperature converter online free",
      "celsius to fahrenheit converter",
      "fahrenheit to celsius converter",
      "kelvin to celsius converter",
      "temperature unit converter online",
      "convert celsius fahrenheit kelvin",
      "temperature conversion tool",
      "temperature converter no install",
    ],
    faqs: [
      {
        question: "What is the formula for Celsius to Fahrenheit?",
        answer:
          "F = C × 9/5 + 32. For example, 100°C = 100 × 1.8 + 32 = 212°F (boiling point of water).",
      },
      {
        question: "What is absolute zero in Celsius and Fahrenheit?",
        answer:
          "Absolute zero is 0 Kelvin = -273.15°C = -459.67°F. It is the theoretical lowest possible temperature.",
      },
      {
        question: "Can I enter negative temperatures?",
        answer:
          "Yes. Negative Celsius and Fahrenheit values are valid. Negative Kelvin is not physically meaningful but the tool will calculate it mathematically.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All conversions run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    description: "Convert between 160+ currencies using live exchange rates from exchangerate-api.com.",
    category: "Converter",
    icon: "DollarSign",
    component: "CurrencyConverter",
    longDescription:
      "Convert between 160+ currencies using live exchange rates from exchangerate-api.com. The result shows the converted amount, the full precision rate (e.g. 1 USD = 0.923456 EUR), and the exact conversion. Rates are fetched live each time you click Convert — they are updated daily by the provider. An internet connection is required. Travellers checking exchange rates, businesses invoicing in foreign currencies, and anyone comparing prices across markets are the primary users.",
    howToUse: [
      "Enter the amount to convert.",
      "Select the source currency from the 'From' dropdown.",
      "Select the target currency from the 'To' dropdown.",
      "Click Convert — the result and exchange rate appear below.",
    ],
    keywords: [
      "currency converter online free",
      "live currency converter",
      "exchange rate calculator",
      "usd to eur converter",
      "forex converter online",
      "real time currency converter",
      "currency exchange rate tool",
      "convert currency online",
    ],
    faqs: [
      {
        question: "How current are the exchange rates?",
        answer:
          "Rates are fetched live from exchangerate-api.com each time you click Convert. The provider updates rates daily.",
      },
      {
        question: "Does it work offline?",
        answer:
          "No. The tool requires an internet connection to fetch live rates from the API. If the request fails, an error message is shown.",
      },
      {
        question: "Which currencies are supported?",
        answer:
          "160+ currencies grouped by region: Major (USD, EUR, GBP, JPY, CHF, CAD, AUD, NZD), Asia & Pacific, Europe, Middle East & Africa, Americas, and more. All currencies supported by the exchangerate-api.com free tier are included.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "The exchange rate API call is made to exchangerate-api.com. Your amount and currency selection are not sent — only the source currency code is used in the API URL.",
      },
    ],
  },
  {
    slug: "timezone-converter",
    name: "Time Zone Converter",
    description: "Convert a date and time across 30 time zones simultaneously — add or remove zones freely.",
    category: "Converter",
    icon: "Globe",
    component: "TimeZoneConverter",
    longDescription:
      "Scheduling a meeting across multiple time zones requires knowing what time it is in each location simultaneously. This converter takes a date and time input and a source time zone, then displays the equivalent time in each of your target time zones. Start with three default targets (America/New_York, Europe/London, Asia/Tokyo) and add more from a dropdown of 30 zones covering all major regions. Remove any zone with the ✕ button. The conversion uses Intl.DateTimeFormat with the target time zone for accurate DST-aware formatting — the browser's Intl API handles daylight saving time transitions automatically. The source time zone offset is calculated by comparing UTC and local representations of the date. Remote teams scheduling standups, travellers planning calls home, and event organisers setting global launch times are the primary users.",
    howToUse: [
      "Set the date and time using the datetime-local input.",
      "Choose the source time zone from the 'Source time zone' dropdown.",
      "Add target time zones from the 'Add time zone' dropdown.",
      "All target times update instantly — click ✕ to remove a zone.",
    ],
    keywords: [
      "timezone converter online free",
      "time zone converter online",
      "convert time zones online",
      "world clock converter",
      "dst time converter",
      "meeting time zone planner",
      "time zone calculator",
      "timezone converter no install",
    ],
    faqs: [
      {
        question: "Does it account for daylight saving time?",
        answer:
          "Yes. The Intl.DateTimeFormat API handles DST automatically based on the specific date entered. A date in summer will use summer time; a date in winter will use standard time.",
      },
      {
        question: "How many time zones are available?",
        answer:
          "30 zones covering UTC, major US cities, Europe, Africa, Middle East, Asia, Australia, and Pacific regions.",
      },
      {
        question: "Can I add the same zone twice?",
        answer:
          "No. The 'Add time zone' dropdown only shows zones not already in the target list.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All conversions use the browser's Intl API. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "number-to-words",
    name: "Number to Words Converter",
    description: "Convert any whole number up to 999 billion into English words instantly.",
    category: "Converter",
    icon: "Type",
    component: "NumberToWords",
    longDescription:
      "Writing a cheque, drafting a legal contract, or generating an invoice often requires spelling out a number in words. This converter handles whole numbers from 0 to 999,999,999,999 (999 billion) using a recursive algorithm: numbers under 20 use a direct lookup, 20-99 use tens + hyphen + ones, 100-999 use hundreds + recursive remainder, and larger numbers use thousand/million/billion multipliers with recursive remainders. Negative numbers are prefixed with 'negative'. The result is capitalised and appears in a styled card with a Copy button. Enter a number with or without commas (commas are stripped before parsing). An error message appears for numbers outside the supported range or non-numeric input. Accountants writing cheques, lawyers drafting contracts, and developers generating invoice text are the primary users.",
    howToUse: [
      "Enter a whole number in the Number field (commas are accepted and stripped).",
      "The word representation appears instantly in the output card.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "number to words converter online free",
      "convert number to english words",
      "spell out numbers online",
      "number words generator",
      "number to words for cheques",
      "integer to words converter",
      "number spelling tool online",
      "number to words no install",
    ],
    faqs: [
      {
        question: "What is the maximum number supported?",
        answer:
          "999,999,999,999 (999 billion). Numbers at or above 1 trillion show an error message.",
      },
      {
        question: "Does it support decimals?",
        answer:
          "No. Only whole integers are supported. Decimal values are not converted.",
      },
      {
        question: "Does it support negative numbers?",
        answer:
          "Yes. Negative numbers are prefixed with 'negative' in the output.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "words-to-number",
    name: "Words to Number Converter",
    description: "Convert English number words like 'two million five hundred thousand' back to digits.",
    category: "Converter",
    icon: "Hash",
    component: "WordsToNumber",
    longDescription:
      "Parsing a number written in words back to digits is useful when processing text from documents, forms, or voice transcriptions. This converter handles standard English number words: ones (zero through nineteen), tens (twenty through ninety), hundred, thousand, million, and billion. The input is lowercased, punctuation stripped, and split on spaces and hyphens. 'and' is ignored. Negative and minus prefixes are supported. The algorithm accumulates a running total: ones and tens add to a current value, 'hundred' multiplies the current value by 100, and thousand/million/billion flush the current value into the total with the appropriate multiplier. The result appears as a formatted number with a Copy button. If the input can't be parsed, an error message suggests the expected format. Runs entirely in your browser.",
    howToUse: [
      "Type the number in words into the input field (e.g. 'two million five hundred thousand').",
      "The numeric value appears instantly in the output card.",
      "Click Copy to copy the result.",
    ],
    keywords: [
      "words to number converter online free",
      "convert english words to number",
      "number words to digits",
      "parse number from words online",
      "english number words converter",
      "words to digits online",
      "number word parser",
      "words to number no install",
    ],
    faqs: [
      {
        question: "What formats are supported?",
        answer:
          "Standard English number words: ones (zero-nineteen), tens (twenty-ninety), hundred, thousand, million, billion. Hyphens (twenty-one) and 'and' are handled. Ordinals (first, second) are not supported.",
      },
      {
        question: "Does it support negative numbers?",
        answer:
          "Yes. Start with 'negative' or 'minus' to produce a negative result.",
      },
      {
        question: "What happens if the input can't be parsed?",
        answer:
          "An error message is shown: 'Could not parse. Try: one hundred twenty three'. Check for unsupported words like ordinals or fractions.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The conversion runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "base-converter",
    name: "Number Base Converter",
    description: "Convert numbers between decimal, binary, hexadecimal, and octal — all four shown at once.",
    category: "Converter",
    icon: "Binary",
    component: "BaseConverter",
    longDescription:
      "Working with different number bases is fundamental in programming, digital electronics, and computer science. This converter accepts a number in any of four bases and shows all four representations simultaneously: Decimal (base 10), Binary (base 2), Hexadecimal (base 16, uppercase), and Octal (base 8). The conversion uses JavaScript's parseInt(input, base) to parse the input and .toString(base) to format each output. If the input contains characters invalid for the selected base (e.g. '2' in binary), an error message is shown. Each output card has its own Copy button. The source base card is highlighted with a ring. Developers converting memory addresses from hex to decimal, students learning binary arithmetic, and engineers working with bitfields are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Enter a number in the Input field.",
      "Select the source base from the 'From base' dropdown: Decimal, Binary, Hexadecimal, or Octal.",
      "All four representations appear instantly in the grid.",
      "Click Copy next to any value to copy it.",
    ],
    keywords: [
      "number base converter online free",
      "decimal to binary converter",
      "binary to hex converter",
      "hex to decimal converter",
      "octal converter online",
      "base conversion tool",
      "number system converter",
      "base converter no install",
    ],
    faqs: [
      {
        question: "Does it support negative numbers?",
        answer:
          "Positive integers only. Negative numbers and floating-point values are not supported.",
      },
      {
        question: "Is hexadecimal output uppercase or lowercase?",
        answer:
          "Uppercase. The hex output uses .toString(16).toUpperCase(), so 'ff' is shown as 'FF'.",
      },
      {
        question: "What happens if I enter an invalid character for the selected base?",
        answer:
          "An error message 'Invalid input for selected base.' is shown. For example, entering '9' when Binary is selected is invalid since binary only uses 0 and 1.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All conversions run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Three percentage calculators in one: A% of B, X is what % of Y, and % change from P to Q.",
    category: "Converter",
    icon: "Percent",
    component: "PercentageCalculator",
    longDescription:
      "Percentage calculations come in three distinct forms that people confuse constantly. This tool provides all three in separate panels. 'What is A% of B?' computes (A/100) × B — useful for calculating a 15% tip on a $60 bill or a 20% discount on a price. 'X is what % of Y?' computes (X/Y) × 100 — useful for finding what percentage 45 is of 180, or what share of a budget one item represents. '% change from P to Q' computes ((Q-P)/P) × 100 — useful for calculating revenue growth, price changes, or weight loss percentages. Results are shown to 4 decimal places with trailing zeros removed. All three calculators update in real time as you type. Runs entirely in your browser.",
    howToUse: [
      "Fill in the values for the calculation you need — each panel is independent.",
      "'What is A% of B?' — enter A and B.",
      "'X is what % of Y?' — enter X and Y.",
      "'% change from P to Q' — enter the original value (From) and new value (To).",
    ],
    keywords: [
      "percentage calculator online free",
      "calculate percentage online",
      "percent of a number calculator",
      "percentage change calculator",
      "what percent is x of y",
      "percentage increase decrease calculator",
      "percentage tool online",
      "percentage calculator no install",
    ],
    faqs: [
      {
        question: "How is percentage change calculated?",
        answer:
          "Percentage change = ((new - old) / old) × 100. A positive result means an increase; negative means a decrease. For example, from 80 to 100 is a 25% increase.",
      },
      {
        question: "What if I divide by zero?",
        answer:
          "If Y is 0 in 'X is what % of Y?' or P is 0 in '% change', the result will be Infinity or NaN. Enter non-zero denominators for valid results.",
      },
      {
        question: "Does it support decimal inputs?",
        answer:
          "Yes. All input fields accept decimal values.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All calculations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age in years, months, days, total days, and total weeks from any date of birth.",
    category: "Converter",
    icon: "Calendar",
    component: "AgeCalculator",
    longDescription:
      "Calculating an exact age requires more than subtracting years — you need to account for whether the birthday has occurred yet in the current year, and how many days remain in the current month. This calculator uses a three-step algorithm: subtract years, then adjust months (borrowing from years if negative), then adjust days (borrowing from months using the actual days in the previous month). The result shows years, months, and days as a breakdown, plus total days (millisecond difference divided by 86,400,000) and total weeks (total days divided by 7, floored). The 'As of date' defaults to today but can be set to any date — past or future — to calculate age at a specific point in time. The date of birth input is capped at the 'as of' date. HR professionals verifying employee ages, parents tracking milestones, and developers building age-gated features are the primary users.",
    howToUse: [
      "Enter a date of birth using the 'Date of birth' date picker.",
      "The 'As of date' defaults to today — change it to calculate age at a different date.",
      "The age breakdown (years, months, days) and totals (days, weeks) appear instantly.",
    ],
    keywords: [
      "age calculator online free",
      "calculate age from date of birth",
      "exact age calculator",
      "birthday age calculator",
      "age in years months days",
      "how old am i calculator",
      "age calculator no install",
      "calculate age as of date",
    ],
    faqs: [
      {
        question: "How are the months and days calculated?",
        answer:
          "Years are subtracted first. If the month hasn't been reached yet, one year is borrowed and 12 months added. If the day hasn't been reached, one month is borrowed and the days in the previous month are added. This matches how humans count age.",
      },
      {
        question: "Can I calculate a future age?",
        answer:
          "Yes. Set the 'As of date' to any future date to calculate how old someone will be on that date.",
      },
      {
        question: "Does it account for leap years?",
        answer:
          "Yes. Total days is calculated from the millisecond difference between dates, which accounts for leap years exactly.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All calculations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "date-diff-calculator",
    name: "Date Difference Calculator",
    description: "Calculate the difference between two dates in days, weeks, months, years, hours, and minutes.",
    category: "Converter",
    icon: "CalendarDays",
    component: "DateDiffCalculator",
    longDescription:
      "Knowing the exact number of days between two dates is useful for project planning, contract durations, event countdowns, and deadline tracking. This calculator takes a start date and end date and computes six metrics simultaneously: days (absolute millisecond difference divided by 86,400,000), weeks (days divided by 7, floored), months (absolute difference in calendar months), years (absolute difference in calendar years), hours (millisecond difference divided by 3,600,000), and minutes (millisecond difference divided by 60,000). A note shows whether the end date is before or after the start date. All values are absolute (positive) regardless of order. The calculation updates instantly when either date changes. Project managers tracking sprint durations, lawyers calculating contract periods, and anyone planning a countdown are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Set the Start date using the date picker.",
      "Set the End date using the date picker.",
      "All six difference values (Days, Weeks, Months, Years, Hours, Minutes) appear instantly.",
    ],
    keywords: [
      "date difference calculator online free",
      "days between two dates calculator",
      "date diff tool online",
      "calculate days between dates",
      "date range calculator",
      "how many days between dates",
      "date calculator no install",
      "days weeks months between dates",
    ],
    faqs: [
      {
        question: "Does it account for leap years?",
        answer:
          "Yes. The days and hours calculations use the actual millisecond difference between dates, which accounts for leap years and DST transitions exactly.",
      },
      {
        question: "Are the values always positive?",
        answer:
          "Yes. All values are absolute. If the end date is before the start date, the tool notes this but still shows positive difference values.",
      },
      {
        question: "How are months calculated?",
        answer:
          "Months = |((endYear - startYear) × 12) + (endMonth - startMonth)|. This is a calendar month count, not a 30-day approximation.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All calculations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index in metric (kg/cm) or imperial (lb/ft/in) — shows category and reference chart.",
    category: "Converter",
    icon: "Activity",
    component: "BmiCalculator",
    longDescription:
      "Body Mass Index is calculated as weight in kilograms divided by height in meters squared (kg/m²). For imperial units, the formula is (weight in pounds / (height in inches)²) × 703. This calculator supports both with a toggle: Metric mode takes weight in kg and height in cm (converted to meters internally); Imperial mode takes weight in lb and height in feet and inches (converted to total inches). The BMI value is shown to one decimal place in a large display, with the category colour-coded: Underweight (< 18.5, blue), Normal weight (18.5-24.9, green), Overweight (25-29.9, amber), Obese (≥ 30, red). A reference chart below shows all four ranges. Note that BMI is a screening tool only and does not account for muscle mass, age, sex, or body composition.",
    howToUse: [
      "Click 'Metric (kg/cm)' or 'Imperial (lb/ft)' to choose the unit system.",
      "Enter your weight and height in the fields provided.",
      "Your BMI and category appear instantly in the result card.",
    ],
    keywords: [
      "bmi calculator online free",
      "body mass index calculator",
      "bmi calculator metric imperial",
      "calculate bmi online",
      "bmi kg cm calculator",
      "bmi lb ft calculator",
      "bmi category checker",
      "bmi calculator no install",
    ],
    faqs: [
      {
        question: "What is the BMI formula?",
        answer:
          "Metric: BMI = weight(kg) / height(m)². Imperial: BMI = (weight(lb) / height(in)²) × 703.",
      },
      {
        question: "What are the BMI categories?",
        answer:
          "Underweight: < 18.5. Normal weight: 18.5-24.9. Overweight: 25-29.9. Obese: ≥ 30. These are WHO standard ranges.",
      },
      {
        question: "Is BMI an accurate health measure?",
        answer:
          "BMI is a simple screening tool but does not account for muscle mass, age, sex, or body composition. Athletes may have a high BMI due to muscle, not fat. Consult a healthcare professional for a full assessment.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All calculations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "calculator",
    name: "Calculator",
    description: "A clean browser calculator with +, -, ×, ÷, %, √, x², 1/x, and sign toggle.",
    category: "Converter",
    icon: "Calculator",
    component: "Calculator",
    longDescription:
      "Sometimes you just need a calculator without opening a new app or tab. This browser-based calculator provides a 4×5 button grid with the standard operations: digits 0-9, decimal point, addition, subtraction, multiplication (×), division (÷), percentage (%), square root (√), square (x²), reciprocal (1/x), sign toggle (±), clear (C), and backspace (⌫). The expression is evaluated using the Function constructor with 'use strict' for safety. Infinity and -Infinity are displayed as ∞ and -∞. Results are formatted to 10 decimal places with trailing zeros removed. The display shows the current expression above the result. The = button is styled in brand blue; operator buttons are styled differently from digit buttons for visual clarity. Runs entirely in your browser with no install required.",
    howToUse: [
      "Click digit and operator buttons to build an expression.",
      "Press = to evaluate.",
      "Press C to clear, or ⌫ to delete the last digit.",
    ],
    keywords: [
      "online calculator free",
      "browser calculator",
      "basic calculator online",
      "arithmetic calculator online",
      "calculator no install",
      "simple calculator online",
      "calculator with square root",
      "free online calculator",
    ],
    faqs: [
      {
        question: "Does it support keyboard input?",
        answer:
          "Click-based input only. Keyboard support is not currently implemented.",
      },
      {
        question: "What does the % button do?",
        answer:
          "The % button appends the % operator to the expression. In the context of the Function evaluator, 50 % 100 evaluates to 50 (JavaScript's modulo operator). It does not calculate percentage of a number — use the Percentage Calculator tool for that.",
      },
      {
        question: "What happens on division by zero?",
        answer:
          "JavaScript returns Infinity for division by zero. The calculator displays ∞.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All calculations run in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for any text or URL with custom size, foreground, and background colors.",
    category: "Utilities",
    icon: "QrCode",
    component: "QrGenerator",
    longDescription:
      "QR codes are the fastest way to share a URL, contact card, or text with someone who has a phone. This generator uses the qrcode npm library loaded in your browser to render a QR code onto a Canvas element. Enter any text or URL, set the size in pixels (64-1024, step 32), and choose foreground and background colors with native color pickers. The QR code updates automatically as you type or change settings. Click 'Download PNG' to save the Canvas as a PNG file. The qrcode library uses error correction level M by default and a 2-module margin. QR codes can encode up to approximately 4,000 characters depending on the error correction level and character type. Marketers adding QR codes to print materials, developers testing QR scanning flows, and anyone who needs to share a link without typing it are the primary users.",
    howToUse: [
      "Enter text or a URL in the 'Text or URL' field.",
      "Set the Size (px) and choose Foreground and Background colors.",
      "The QR code updates automatically.",
      "Click 'Download PNG' to save the QR code image.",
    ],
    keywords: [
      "qr code generator online free",
      "generate qr code from url",
      "qr code maker online",
      "create qr code free",
      "custom color qr code generator",
      "qr code png download",
      "qr code generator no sign up",
      "qr code from text online",
    ],
    faqs: [
      {
        question: "What is the maximum data length for a QR code?",
        answer:
          "QR codes can hold up to approximately 4,296 alphanumeric characters or 7,089 numeric characters at the lowest error correction level. The qrcode library automatically selects the appropriate QR version.",
      },
      {
        question: "Can I use a transparent background?",
        answer:
          "The background color picker sets a solid color. Transparent backgrounds are not supported — the Canvas always has a solid background.",
      },
      {
        question: "What size should I use for print?",
        answer:
          "For print use, generate at 512px or 1024px for high resolution. QR codes should be at least 2cm × 2cm when printed for reliable scanning.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The qrcode library runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "qr-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes using your device camera or by uploading an image — uses jsQR in your browser.",
    category: "Utilities",
    icon: "ScanLine",
    component: "QrScanner",
    longDescription:
      "Reading a QR code without a dedicated app is useful when you want to inspect what a QR code contains before opening it, or when you have a QR code image file you need to decode. This scanner uses the jsQR library loaded in your browser. Camera mode: click 'Start Camera' to access your device camera (rear camera is requested by default on mobile), which streams video to a hidden Canvas. Each frame is scanned with jsQR using requestAnimationFrame — when a QR code is detected, the camera stops and the decoded content is shown. Image mode: click 'Scan from Image' to upload an image file, which is drawn onto a Canvas and scanned once. If the decoded content starts with 'http', an 'Open link' button appears. An error is shown if no QR code is found in the image. Runs entirely in your browser — no data is sent to any server.",
    howToUse: [
      "Click 'Start Camera' to scan live using your device camera, or 'Scan from Image' to upload an image file.",
      "For camera mode, point the camera at a QR code — it stops automatically when detected.",
      "The decoded content appears in a green panel. If it's a URL, an 'Open link' button appears.",
    ],
    keywords: [
      "qr code scanner online free",
      "scan qr code online",
      "qr code reader online",
      "scan qr from image online",
      "qr code decoder online",
      "read qr code from photo",
      "qr scanner no app",
      "qr code scanner no install",
    ],
    faqs: [
      {
        question: "Does it work on mobile?",
        answer:
          "Yes. On mobile, the rear camera is requested by default (facingMode: 'environment') for easy scanning. Camera access requires HTTPS.",
      },
      {
        question: "What image formats can I upload?",
        answer:
          "Any image format your browser supports: JPG, PNG, WebP, GIF. The image is drawn onto a Canvas and scanned with jsQR.",
      },
      {
        question: "Why wasn't my QR code detected from an image?",
        answer:
          "jsQR requires a reasonably clear, undistorted QR code. Blurry, very small, or heavily rotated QR codes may not be detected. Try a higher-resolution image.",
      },
      {
        question: "Is my camera feed or image sent to a server?",
        answer: "No. jsQR runs entirely in your browser. Camera frames and uploaded images are never transmitted.",
      },
    ],
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    description: "Generate barcodes in CODE128, EAN13, EAN8, UPC, CODE39, ITF14, and more — download as SVG.",
    category: "Utilities",
    icon: "BarChart2",
    component: "BarcodeGenerator",
    longDescription:
      "Barcodes are required for retail products, shipping labels, inventory systems, and library management. This generator uses the JsBarcode library loaded in your browser to render barcodes as SVG elements. Enter a value, choose a format from the dropdown (CODE128, EAN13, EAN8, UPC, CODE39, ITF14, MSI, pharmacode), and the barcode renders instantly with the value displayed below it. If the value is invalid for the selected format (e.g. a non-numeric value for EAN13, or wrong digit count), JsBarcode throws an error which is shown in red. Click 'Download SVG' to save the barcode as a scalable vector file suitable for print. CODE128 is the most versatile format and works for any alphanumeric string. EAN13 and UPC require specific digit counts and check digits. Runs entirely in your browser.",
    howToUse: [
      "Enter the barcode value in the Value field.",
      "Choose the barcode format from the Format dropdown.",
      "The barcode renders instantly — if the value is invalid for the format, an error is shown.",
      "Click 'Download SVG' to save the barcode.",
    ],
    keywords: [
      "barcode generator online free",
      "generate barcode online",
      "code128 barcode generator",
      "ean13 barcode generator",
      "barcode maker online",
      "svg barcode generator",
      "upc barcode generator",
      "barcode generator no install",
    ],
    faqs: [
      {
        question: "Which format should I use?",
        answer:
          "CODE128 works for any alphanumeric string and is the most versatile. EAN13 and UPC are for retail products and require specific digit counts. CODE39 is common in logistics and supports letters and digits. ITF14 is used for shipping containers.",
      },
      {
        question: "Why does EAN13 show an error?",
        answer:
          "EAN13 requires exactly 12 or 13 digits. The 13th digit is a check digit calculated from the first 12. Enter 12 digits and JsBarcode will calculate the check digit automatically.",
      },
      {
        question: "Can I use the SVG in print materials?",
        answer:
          "Yes. SVG is a vector format that scales to any size without pixelation, making it ideal for print. Import the SVG into Illustrator, InDesign, or any vector-capable tool.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. JsBarcode runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong random passwords with custom length and character sets — strength indicator included.",
    category: "Utilities",
    icon: "KeyRound",
    component: "PasswordGenerator",
    longDescription:
      "Weak passwords are the most common cause of account breaches. This generator uses crypto.getRandomValues to fill a Uint32Array with cryptographically secure random values, then maps each value to a character from the pool you configure. Set the length with a slider (4-128), and choose which character sets to include via checkboxes: Uppercase (A-Z), Lowercase (a-z), Digits (0-9), and Symbols (!@#$%^&*()_+-=[]{}|;:,.<>?). A strength indicator bar evaluates the generated password on seven criteria: length ≥ 8, ≥ 12, ≥ 16, contains uppercase, lowercase, digits, and symbols. The result is Weak, Fair, Good, or Strong. The password appears in a monospace display with a Copy button. Click 'Generate Password' to generate a new one. Passwords are never stored or transmitted.",
    howToUse: [
      "Drag the Length slider (4-128) to set the password length.",
      "Check the character sets to include: Uppercase, Lowercase, Digits, Symbols.",
      "Click 'Generate Password' — the password and strength indicator appear.",
      "Click Copy to copy the password to your clipboard.",
    ],
    keywords: [
      "password generator online free",
      "generate strong password online",
      "random password generator",
      "secure password maker",
      "password generator with symbols",
      "cryptographic password generator",
      "strong password creator",
      "password generator no install",
    ],
    faqs: [
      {
        question: "Is the password cryptographically secure?",
        answer:
          "Yes. The generator uses crypto.getRandomValues which is cryptographically secure, unlike Math.random(). This makes it suitable for generating real passwords.",
      },
      {
        question: "Is the password stored anywhere?",
        answer:
          "No. The password is generated and displayed only in your browser. It is never stored, logged, or transmitted.",
      },
      {
        question: "What length should I use?",
        answer:
          "At least 16 characters with all four character sets for a Strong rating. For most accounts, 16-24 characters is sufficient. Use a password manager to store generated passwords.",
      },
      {
        question: "What symbols are included?",
        answer:
          "The symbols pool is: !@#$%^&*()_+-=[]{}|;:,.<>? — 22 characters. All are printable ASCII and accepted by most websites.",
      },
    ],
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    description: "Generate random integers within a custom min/max range — with optional no-duplicates mode.",
    category: "Utilities",
    icon: "Dices",
    component: "RandomNumberGenerator",
    longDescription:
      "Picking random numbers for raffles, sampling, simulations, and games requires control over the range and whether duplicates are allowed. This generator takes a Min value, Max value, and Count, then generates random integers using Math.floor(Math.random() × (max - min + 1)) + min. A 'No duplicates' checkbox enables unique mode: the full range is built as an array, shuffled with Math.random(), and the first Count items are taken — ensuring no number appears twice. If Count exceeds the range size in unique mode, an error is shown. Results appear as styled number badges with a 'Copy all' button that copies them as a comma-separated list. Teachers picking random students, developers generating test data, and anyone running a lottery or raffle are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Set the Min, Max, and Count fields.",
      "Check 'No duplicates (unique numbers)' if you need each number to appear only once.",
      "Click Generate — results appear as number badges.",
      "Click 'Copy all' to copy all numbers as a comma-separated list.",
    ],
    keywords: [
      "random number generator online free",
      "generate random number online",
      "random integer generator",
      "random number picker",
      "unique random number generator",
      "random number no duplicates",
      "lottery number generator",
      "random number generator no install",
    ],
    faqs: [
      {
        question: "Are the numbers truly random?",
        answer:
          "Math.random() is used, which is pseudo-random. It is suitable for games, raffles, and sampling but not for cryptographic purposes. For cryptographic randomness, use the Password Generator.",
      },
      {
        question: "What is the maximum count?",
        answer:
          "The count input accepts up to 1000. In unique mode, the count cannot exceed the range size (max - min + 1).",
      },
      {
        question: "How does the no-duplicates mode work?",
        answer:
          "The full range of integers is built as an array, shuffled using a Fisher-Yates-style sort with Math.random(), and the first Count items are taken. This guarantees no duplicates.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All generation runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "coin-dice",
    name: "Coin Flip & Dice Roller",
    description: "Flip a virtual coin or roll up to 20 dice with d4, d6, d8, d10, d12, d20, or d100 sides.",
    category: "Utilities",
    icon: "Dices",
    component: "CoinDice",
    longDescription:
      "Board games, tabletop RPGs, and classroom activities all need a quick way to flip a coin or roll dice without physical props. The coin flip section shows a spinning coin animation (600ms) before revealing Heads (crown emoji) or Tails (eagle emoji). The dice roller lets you set the number of dice (1-20) and choose the die type from a dropdown: d4, d6, d8, d10, d12, d20, or d100. Each die result is shown as an individual badge; when rolling multiple dice, the total is shown below. A 400ms rolling animation plays before results appear. Both use Math.random() for uniform distribution. Tabletop RPG players rolling ability scores, teachers picking random students, and game designers testing probability are the primary users. Runs entirely in your browser.",
    howToUse: [
      "Click 'Flip Coin' to flip — a spinning animation plays before the result appears.",
      "Set the number of dice and choose the die type (d4, d6, d8, d10, d12, d20, d100).",
      "Click the Roll button (e.g. 'Roll 2d6') — individual results and total appear.",
    ],
    keywords: [
      "coin flip online free",
      "dice roller online",
      "flip a coin online",
      "roll dice online",
      "virtual dice roller",
      "d20 dice roller online",
      "tabletop rpg dice roller",
      "coin dice tool no install",
    ],
    faqs: [
      {
        question: "Is the coin flip fair?",
        answer:
          "Yes. Math.random() < 0.5 gives exactly 50% probability for each outcome.",
      },
      {
        question: "What dice types are available?",
        answer:
          "d4, d6, d8, d10, d12, d20, and d100 (percentile). These cover all standard tabletop RPG dice.",
      },
      {
        question: "Can I roll multiple dice at once?",
        answer:
          "Yes. Set the number of dice (1-20) and click Roll. Individual results are shown as badges and the total is displayed below.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All randomness runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Generate 5-color palettes using monochromatic, analogous, complementary, triadic, or rainbow harmony.",
    category: "Utilities",
    icon: "Palette",
    component: "ColorPaletteGenerator",
    longDescription:
      "Choosing colors that work well together requires understanding color theory. This generator produces 5-color palettes using five harmony types, all computed in HSL and converted to hex using a custom hslToHex function. Monochromatic: five lightness steps (20%, 35%, 50%, 65%, 80%) at the same hue and 70% saturation. Analogous: five hues spaced -30, -15, 0, +15, +30 degrees from the base. Complementary: three colors near the base hue and two near the complementary (base + 180°). Triadic: two colors each at 0°, 120°, and 240° offsets. Rainbow: five hues evenly spaced 60° apart. Set the base hue with a slider (0-359°) or click Random to randomise it. Click Generate to apply. Click any color swatch or its Copy button to copy the hex code. Designers building UI color systems, developers choosing brand colors, and anyone who needs a harmonious palette are the primary users.",
    howToUse: [
      "Choose a palette type from the dropdown: Monochromatic, Analogous, Complementary, Triadic, or Rainbow.",
      "Drag the Base hue slider (0-359°) or click Random to randomise.",
      "Click Generate to produce the palette.",
      "Click any color swatch or its Copy button to copy the hex code.",
    ],
    keywords: [
      "color palette generator online free",
      "generate color palette online",
      "color scheme generator",
      "complementary color palette",
      "analogous color palette generator",
      "monochromatic palette generator",
      "color harmony tool",
      "color palette maker no install",
    ],
    faqs: [
      {
        question: "What color model is used?",
        answer:
          "Palettes are generated in HSL (Hue, Saturation, Lightness) and converted to hex using a custom hslToHex function. This makes it easy to control hue relationships mathematically.",
      },
      {
        question: "What is the difference between analogous and complementary?",
        answer:
          "Analogous colors are adjacent on the color wheel (harmonious, low contrast). Complementary colors are opposite on the wheel (high contrast, vibrant). Triadic uses three evenly spaced hues.",
      },
      {
        question: "Can I export the palette?",
        answer:
          "Copy individual hex codes by clicking each swatch. There is no bulk export — copy each color individually.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All palette generation runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "gradient-generator",
    name: "CSS Gradient Generator",
    description: "Generate linear or radial CSS gradients with unlimited color stops — copy the CSS property instantly.",
    category: "Utilities",
    icon: "Blend",
    component: "GradientGenerator",
    longDescription:
      "CSS gradients are powerful but the syntax is verbose and hard to write by hand. This generator provides a live preview and a ready-to-copy CSS background property. Choose Linear or Radial gradient type. For linear gradients, set the angle with a slider (0-360°). Add color stops with the 'Add stop' button — each stop has a color picker and a position field (0-100%). Remove stops with the X button (minimum 2 stops required). Stops are sorted by position before generating the CSS string. The live preview updates instantly as you change any setting. The output shows the full CSS property: background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); — ready to paste into your stylesheet. Click Copy to copy it. Designers building hero sections, developers creating button hover effects, and anyone who needs a CSS gradient without memorising the syntax are the primary users.",
    howToUse: [
      "Click Linear or Radial to choose the gradient type.",
      "For linear gradients, drag the Angle slider (0-360°).",
      "Add color stops with 'Add stop' — set each stop's color and position (%).",
      "Click Copy to copy the CSS background property.",
    ],
    keywords: [
      "css gradient generator online free",
      "linear gradient generator",
      "radial gradient css generator",
      "gradient maker online",
      "css background gradient tool",
      "gradient color picker online",
      "css gradient no install",
      "gradient generator with color stops",
    ],
    faqs: [
      {
        question: "What CSS property does it output?",
        answer:
          "The full background property: background: linear-gradient(...); or background: radial-gradient(...); — ready to paste into a CSS rule.",
      },
      {
        question: "Can I use this gradient in Tailwind CSS?",
        answer:
          "Yes. Copy the CSS value and use it in a style attribute or add it to your Tailwind config as a custom background value.",
      },
      {
        question: "What is the minimum number of color stops?",
        answer:
          "Two. The X button is disabled when only two stops remain.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All gradient generation runs in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "placeholder-image",
    name: "Placeholder Image Generator",
    description: "Generate placeholder images at any size with custom colors and label — download as PNG.",
    category: "Utilities",
    icon: "ImagePlus",
    component: "PlaceholderImage",
    longDescription:
      "Mockups and wireframes need placeholder images at specific dimensions before real assets are ready. This generator uses the Canvas API to draw a rectangle at your specified width and height (1-4096px each), fills it with your chosen background color, and renders a centered label in your chosen text color. The label defaults to the dimensions (e.g. '800 × 600') if you leave the custom label field empty. Font size is calculated as Math.max(14, Math.min(width, height) / 8) so it scales proportionally. Five preset buttons cover common sizes: 16:9 (1280×720), 4:3 (800×600), 1:1 (500×500), OG Image (1200×630), and Banner (1500×500). Click 'Generate Placeholder' to render, then download as PNG. Designers filling layout slots, developers testing responsive images, and anyone building a prototype are the primary users.",
    howToUse: [
      "Set Width and Height in pixels (1-4096), or click a preset button (16:9, 4:3, 1:1, OG Image, Banner).",
      "Choose Background color and Text color with the color pickers.",
      "Optionally enter a Custom label — defaults to the dimensions if left empty.",
      "Click 'Generate Placeholder' then download the PNG.",
    ],
    keywords: [
      "placeholder image generator online free",
      "dummy image generator",
      "placeholder image online",
      "test image generator",
      "mockup placeholder image",
      "generate placeholder png",
      "image placeholder tool",
      "placeholder image no install",
    ],
    faqs: [
      {
        question: "What format is the output?",
        answer:
          "PNG, generated using the Canvas toDataURL API in your browser.",
      },
      {
        question: "What is the maximum size?",
        answer:
          "4096 × 4096 pixels. Very large canvases may be slow to generate on older devices.",
      },
      {
        question: "Can I use a custom label?",
        answer:
          "Yes. Enter any text in the Custom label field. If left empty, the label defaults to the dimensions (e.g. '800 × 600').",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. The Canvas API runs entirely in your browser. Nothing is transmitted.",
      },
    ],
  },
  {
    slug: "invoice-number-generator",
    name: "Invoice Number Generator",
    description: "Generate sequential invoice numbers with custom prefix, separator, year/month, and zero-padded sequence.",
    category: "Utilities",
    icon: "Receipt",
    component: "InvoiceNumberGenerator",
    longDescription:
      "Consistent invoice numbering is important for accounting, tax compliance, and client communication. This generator builds invoice numbers by joining configurable parts with a separator: Prefix (e.g. INV), optional current year (e.g. 2025), optional current month (e.g. 01), and a zero-padded sequence number. The separator can be -, /, _, or .. Set the number of digits for zero-padding (1-10), the starting number, and how many to generate (1-100). For example, with prefix INV, separator -, year on, month on, 4 digits, starting at 1, the output is INV-2025-01-0001, INV-2025-01-0002, etc. Each number has its own Copy button; a 'Copy all' button copies all as newline-separated text. Freelancers setting up invoice sequences, accountants generating batch invoice numbers, and small businesses standardising their numbering format are the primary users.",
    howToUse: [
      "Set the Prefix, Separator, Number digits, and Starting number.",
      "Toggle 'Include year' and 'Include month' checkboxes.",
      "Set 'How many to generate' (1-100) and click Generate.",
      "Copy individual numbers or click 'Copy all' for all as newline-separated text.",
    ],
    keywords: [
      "invoice number generator online free",
      "generate invoice numbers online",
      "sequential invoice number generator",
      "invoice numbering tool",
      "invoice number format generator",
      "batch invoice number generator",
      "invoice number with year month",
      "invoice number generator no install",
    ],
    faqs: [
      {
        question: "Can I start from a specific number?",
        answer:
          "Yes. Set the 'Starting number' field to any value. The sequence increments by 1 from that starting point.",
      },
      {
        question: "What separators are available?",
        answer:
          "Hyphen (-), forward slash (/), underscore (_), and dot (.). Choose the one that matches your accounting system's format.",
      },
      {
        question: "Does it use the current year and month automatically?",
        answer:
          "Yes. When 'Include year' or 'Include month' is checked, the current year and month are used at the time you click Generate.",
      },
      {
        question: "Is my data sent to a server?",
        answer: "No. All generation runs in your browser. Nothing is transmitted.",
      },
    ],
  },
];

export const categories = Array.from(new Set(tools.map((t) => t.category)));

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getRelatedTools(slug: string, limit = 3): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tools.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, limit);
}
