/** Programmatic code examples shown on tool pages to signal developer authority to search engines. */
export const codeExamples: Record<string, { lang: string; label: string; code: string }[]> = {
  "base64-encoder": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Encode (handles Unicode / emoji)
const encode = (str) =>
  btoa(unescape(encodeURIComponent(str)));

// Decode
const decode = (b64) =>
  decodeURIComponent(escape(atob(b64)));`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import base64

encoded = base64.b64encode("hello 🌍".encode()).decode()
decoded = base64.b64decode(encoded).decode()`,
    },
  ],
  "url-encoder": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `const encoded = encodeURIComponent("hello world & more");
// → "hello%20world%20%26%20more"

const decoded = decodeURIComponent(encoded);`,
    },
    {
      lang: "python",
      label: "Python",
      code: `from urllib.parse import quote, unquote

encoded = quote("hello world & more")
decoded = unquote(encoded)`,
    },
  ],
  "json-formatter": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Pretty-print
const pretty = JSON.stringify(JSON.parse(raw), null, 2);

// Minify
const minified = JSON.stringify(JSON.parse(raw));`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import json

pretty = json.dumps(json.loads(raw), indent=2)
minified = json.dumps(json.loads(raw), separators=(',', ':'))`,
    },
  ],
  "hash-generator": [
    {
      lang: "javascript",
      label: "JavaScript (Web Crypto)",
      code: `async function sha256(text) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import hashlib

digest = hashlib.sha256("hello".encode()).hexdigest()`,
    },
  ],
  "uuid-generator": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Modern browsers & Node 19+
const id = crypto.randomUUID();

// Node < 19
const { randomUUID } = require("crypto");
const id = randomUUID();`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import uuid

uid = str(uuid.uuid4())`,
    },
  ],
  "jwt-decoder": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function decodeJwt(token) {
  const [, payload] = token.split(".");
  return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
}`,
    },
  ],
  "regex-tester": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `const pattern = /\\b\\d{4}-\\d{2}-\\d{2}\\b/g;
const matches = text.match(pattern) ?? [];`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import re

matches = re.findall(r'\\b\\d{4}-\\d{2}-\\d{2}\\b', text)`,
    },
  ],
  "cron-generator": [
    {
      lang: "bash",
      label: "Crontab",
      code: `# Every 15 minutes
*/15 * * * * /path/to/script.sh

# Every day at 9 AM
0 9 * * * /path/to/script.sh

# Every Monday at midnight
0 0 * * 1 /path/to/script.sh`,
    },
  ],
  "px-to-rem": [
    {
      lang: "css",
      label: "CSS",
      code: `/* root font size */
html { font-size: 16px; }

/* 24px → 1.5rem */
.heading { font-size: 1.5rem; }

/* SCSS helper */
@function rem($px) {
  @return #{$px / 16}rem;
}`,
    },
  ],
  "json-to-csv": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `const data = [{name: "Alice", age: 30}, {name: "Bob", age: 25}];
const headers = Object.keys(data[0]);
const csv = [
  headers.join(","),
  ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))
].join("\n");`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import csv, io

data = [{"name": "Alice", "age": 30}]
buf = io.StringIO()
writer = csv.DictWriter(buf, fieldnames=data[0].keys())
writer.writeheader()
writer.writerows(data)
print(buf.getvalue())`,
    },
  ],
  "csv-to-json": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function csvToJson(csv) {
  const [headerLine, ...rows] = csv.trim().split("\n");
  const headers = headerLine.split(",");
  return rows.map(row =>
    Object.fromEntries(row.split(",").map((v, i) => [headers[i], v.trim()]))
  );
}`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import csv, json

with open("data.csv") as f:
    reader = csv.DictReader(f)
    result = json.dumps(list(reader), indent=2)
print(result)`,
    },
  ],
  "xml-formatter": [
    {
      lang: "javascript",
      label: "JavaScript (DOMParser)",
      code: `const parser = new DOMParser();
const doc = parser.parseFromString(xmlString, "application/xml");
const err = doc.querySelector("parsererror");
if (err) throw new Error(err.textContent);`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import xml.dom.minidom

pretty = xml.dom.minidom.parseString(xml_str).toprettyxml(indent="  ")
minified = "".join(line.strip() for line in pretty.splitlines() if line.strip())`,
    },
  ],
  "html-formatter": [
    {
      lang: "javascript",
      label: "JavaScript (Prettier)",
      code: `// Using prettier in Node.js
const prettier = require("prettier");
const formatted = await prettier.format(htmlString, { parser: "html" });`,
    },
    {
      lang: "python",
      label: "Python (BeautifulSoup)",
      code: `from bs4 import BeautifulSoup

pretty = BeautifulSoup(html_str, "html.parser").prettify()`,
    },
  ],
  "css-formatter": [
    {
      lang: "javascript",
      label: "JavaScript (PostCSS)",
      code: `// Minify with PostCSS + cssnano
const postcss = require("postcss");
const cssnano = require("cssnano");
const result = await postcss([cssnano]).process(css, { from: undefined });`,
    },
    {
      lang: "css",
      label: "CSS — minify manually",
      code: `/* Before */
.button {
  background: #3b82f6;
  padding: 8px 16px;
}

/* After minify */
.button{background:#3b82f6;padding:8px 16px}`,
    },
  ],
  "js-formatter": [
    {
      lang: "javascript",
      label: "Node.js (Prettier)",
      code: `const prettier = require("prettier");
const formatted = await prettier.format(code, {
  parser: "babel",
  semi: true,
  singleQuote: true,
  printWidth: 80,
});`,
    },
    {
      lang: "bash",
      label: "CLI (Prettier)",
      code: `# Format a file in place
npx prettier --write src/index.js

# Check without writing
npx prettier --check src/`,
    },
  ],
  "sql-formatter": [
    {
      lang: "sql",
      label: "SQL — before & after",
      code: `-- Before (minified)
SELECT u.id,u.name,o.total FROM users u JOIN orders o ON u.id=o.user_id WHERE o.total>100 ORDER BY o.total DESC;

-- After (formatted)
SELECT
  u.id,
  u.name,
  o.total
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.total > 100
ORDER BY o.total DESC;`,
    },
    {
      lang: "python",
      label: "Python (sqlparse)",
      code: `import sqlparse

formatted = sqlparse.format(
    raw_sql,
    reindent=True,
    keyword_case="upper"
)`,
    },
  ],
  "yaml-formatter": [
    {
      lang: "javascript",
      label: "JavaScript (js-yaml)",
      code: `const yaml = require("js-yaml");

// Parse YAML → JS object
const obj = yaml.load(yamlString);

// Dump JS object → formatted YAML
const formatted = yaml.dump(obj, { indent: 2 });`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import yaml

obj = yaml.safe_load(yaml_string)
formatted = yaml.dump(obj, default_flow_style=False, indent=2)`,
    },
  ],
  "json-to-xml": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function jsonToXml(obj, tag = "root") {
  if (typeof obj !== "object") return \`<\${tag}>\${obj}</\${tag}>\`;
  const inner = Object.entries(obj)
    .map(([k, v]) => jsonToXml(v, k))
    .join("");
  return \`<\${tag}>\${inner}</\${tag}>\`;
}`,
    },
    {
      lang: "python",
      label: "Python (xmltodict)",
      code: `import json, xmltodict

obj = json.loads(json_string)
xml_str = xmltodict.unparse({"root": obj}, pretty=True)`,
    },
  ],
  "xml-to-json": [
    {
      lang: "javascript",
      label: "JavaScript (DOMParser)",
      code: `function xmlNodeToObj(node) {
  if (node.nodeType === 3) return node.nodeValue.trim();
  const obj = {};
  for (const child of node.childNodes) {
    const val = xmlNodeToObj(child);
    if (val) obj[child.nodeName] = val;
  }
  return obj;
}`,
    },
    {
      lang: "python",
      label: "Python (xmltodict)",
      code: `import xmltodict, json

obj = xmltodict.parse(xml_string)
print(json.dumps(obj, indent=2))`,
    },
  ],
  "yaml-to-json": [
    {
      lang: "javascript",
      label: "JavaScript (js-yaml)",
      code: `const yaml = require("js-yaml");
const obj = yaml.load(yamlString);
const json = JSON.stringify(obj, null, 2);`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import yaml, json

obj = yaml.safe_load(yaml_string)
print(json.dumps(obj, indent=2))`,
    },
  ],
  "json-to-yaml": [
    {
      lang: "javascript",
      label: "JavaScript (js-yaml)",
      code: `const yaml = require("js-yaml");
const obj = JSON.parse(jsonString);
const yamlOut = yaml.dump(obj, { indent: 2 });`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import json, yaml

obj = json.loads(json_string)
print(yaml.dump(obj, default_flow_style=False, indent=2))`,
    },
  ],
  "json-diff-checker": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function diffKeys(a, b, path = "") {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const p = path ? \`\${path}.\${k}\` : k;
    if (!(k in a)) console.log(\`+ \${p}: \${JSON.stringify(b[k])}\`);
    else if (!(k in b)) console.log(\`- \${p}: \${JSON.stringify(a[k])}\`);
    else if (JSON.stringify(a[k]) !== JSON.stringify(b[k]))
      console.log(\`~ \${p}: \${JSON.stringify(a[k])} → \${JSON.stringify(b[k])}\`);
  }
}`,
    },
  ],
  "env-file-tool": [
    {
      lang: "javascript",
      label: "Node.js (dotenv)",
      code: `// Load .env into process.env
require("dotenv").config();
console.log(process.env.API_KEY);

// Parse without loading
const parsed = require("dotenv").parse(fs.readFileSync(".env"));`,
    },
    {
      lang: "bash",
      label: "Shell",
      code: `# Export all vars from .env
export $(grep -v '^#' .env | xargs)

# Print a specific var
grep '^API_KEY=' .env | cut -d= -f2`,
    },
  ],
  "http-status-codes": [
    {
      lang: "javascript",
      label: "JavaScript (fetch)",
      code: `const res = await fetch("/api/data");
if (res.status === 200) { /* OK */ }
if (res.status === 401) { /* Unauthorized — redirect to login */ }
if (res.status === 429) { /* Too Many Requests — back off */ }
if (res.status >= 500) { /* Server error — retry */ }`,
    },
    {
      lang: "python",
      label: "Python (requests)",
      code: `import requests

r = requests.get("https://api.example.com/data")
r.raise_for_status()  # raises HTTPError for 4xx/5xx
print(r.status_code, r.json())`,
    },
  ],
  "css-unit-converter": [
    {
      lang: "css",
      label: "CSS — common units",
      code: `/* px → rem (root 16px) */
.text { font-size: 1.5rem; }   /* = 24px */

/* px → em (relative to parent) */
.child { font-size: 0.875em; } /* = 14px if parent is 16px */

/* px → vw */
.hero { width: 50vw; }         /* 50% of viewport width */`,
    },
    {
      lang: "javascript",
      label: "JavaScript",
      code: `const pxToRem = (px, root = 16) => px / root;
const remToPx = (rem, root = 16) => rem * root;
const pxToVw  = (px, vw = window.innerWidth) => (px / vw) * 100;`,
    },
  ],
  "meta-tag-generator": [
    {
      lang: "html",
      label: "HTML — essential meta tags",
      code: `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="Your page description here.">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Your page description here.">
<meta property="og:image" content="https://example.com/og.png">
<meta name="twitter:card" content="summary_large_image">`,
    },
  ],
  "robots-txt-generator": [
    {
      lang: "bash",
      label: "robots.txt — common patterns",
      code: `# Allow all crawlers
User-agent: *
Disallow:

# Block all crawlers
User-agent: *
Disallow: /

# Block specific paths
User-agent: *
Disallow: /admin/
Disallow: /private/
Sitemap: https://example.com/sitemap.xml`,
    },
  ],
  "gitignore-generator": [
    {
      lang: "bash",
      label: ".gitignore — Node.js + Next.js",
      code: `node_modules/
.next/
.env
.env.local
.env*.local
dist/
build/
*.log
.DS_Store
Thumbs.db`,
    },
    {
      lang: "bash",
      label: ".gitignore — Python",
      code: `__pycache__/
*.py[cod]
*.egg-info/
dist/
build/
.venv/
venv/
.env
*.log`,
    },
  ],
  "regex-builder": [
    {
      lang: "javascript",
      label: "JavaScript — common patterns",
      code: `// Email
const email = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// URL
const url = /https?:\/\/[^\\s]+/;

// ISO date
const date = /^\\d{4}-\\d{2}-\\d{2}$/;

// UUID v4
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import re

# Named groups
pattern = re.compile(r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})')
m = pattern.match("2024-01-15")
print(m.group("year"), m.group("month"))`,
    },
  ],
  "api-response-viewer": [
    {
      lang: "javascript",
      label: "JavaScript (fetch)",
      code: `const res = await fetch("https://api.example.com/users", {
  headers: { Authorization: "Bearer " + token }
});
const data = await res.json();
console.log(JSON.stringify(data, null, 2));`,
    },
    {
      lang: "bash",
      label: "curl",
      code: `curl -s https://api.example.com/users \\
  -H "Authorization: Bearer TOKEN" \\
  | python3 -m json.tool`,
    },
  ],
  "curl-generator": [
    {
      lang: "bash",
      label: "curl — common patterns",
      code: `# GET with auth header
curl -H "Authorization: Bearer TOKEN" https://api.example.com/data

# POST JSON body
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Alice","email":"alice@example.com"}'

# Follow redirects + show status
curl -L -o /dev/null -w "%{http_code}" https://example.com`,
    },
  ],
  "html-entity-converter": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Encode
const encode = (str) =>
  str.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",
    '"':"&quot;","'":"&#39;"
  })[c]);

// Decode
const decode = (str) => {
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value;
};`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import html

encoded = html.escape('<script>alert("xss")</script>')
decoded = html.unescape(encoded)`,
    },
  ],
  "semver-comparator": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Compare two semver strings
function semverGt(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if (pa[i] > pb[i]) return true;
    if (pa[i] < pb[i]) return false;
  }
  return false;
}
// semverGt("2.1.0", "2.0.9") → true`,
    },
    {
      lang: "bash",
      label: "npm / Node",
      code: `# Check if installed version satisfies range
npx semver 2.1.0 -r ">=2.0.0 <3.0.0"

# Get latest satisfying version
npx semver 1.2.3 2.0.0 2.1.0 -r "^2" --include-prerelease`,
    },
  ],
  "timestamp-converter": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Current Unix timestamp (seconds)
const now = Math.floor(Date.now() / 1000);

// Unix → human-readable
const date = new Date(1700000000 * 1000).toISOString();

// Human → Unix
const ts = Math.floor(new Date("2024-01-15T12:00:00Z").getTime() / 1000);`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import time
from datetime import datetime, timezone

# Current timestamp
now = int(time.time())

# Unix → datetime
dt = datetime.fromtimestamp(1700000000, tz=timezone.utc)

# datetime → Unix
ts = int(dt.timestamp())`,
    },
  ],
  "base32-converter": [
    {
      lang: "python",
      label: "Python",
      code: `import base64

encoded = base64.b32encode(b"hello world").decode()
decoded = base64.b32decode(encoded).decode()`,
    },
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Base32 alphabet
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(input) {
  let bits = 0, value = 0, output = "";
  for (const byte of new TextEncoder().encode(input)) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += CHARS[(value << (5 - bits)) & 31];
  return output.padEnd(Math.ceil(output.length / 8) * 8, "=");
}`,
    },
  ],
  "ascii-unicode-converter": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Char → code point
"A".codePointAt(0);          // 65
"😀".codePointAt(0);         // 128512

// Code point → char
String.fromCodePoint(65);    // "A"
String.fromCodePoint(128512); // "😀"

// Unicode escape
"\\u0041";  // "A"
"\\u{1F600}"; // "😀"`,
    },
    {
      lang: "python",
      label: "Python",
      code: `# Char → code point
ord("A")          # 65
ord("😀")         # 128512

# Code point → char
chr(65)           # 'A'
chr(128512)       # '😀'

# Unicode name
import unicodedata
unicodedata.name("😀")  # 'GRINNING FACE'`,
    },
  ],
  "password-strength-checker": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function checkStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return ["Very Weak","Weak","Fair","Strong","Very Strong"][score] ?? "Very Strong";
}`,
    },
  ],
  "email-validator": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `// Basic RFC-compliant check
const isEmail = (s) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(s);

// HTML5 built-in validation
const input = document.createElement("input");
input.type = "email";
input.value = "test@example.com";
console.log(input.checkValidity()); // true`,
    },
    {
      lang: "python",
      label: "Python",
      code: `import re

pattern = re.compile(r'^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')
is_valid = bool(pattern.match("user@example.com"))`,
    },
  ],
  "color-converter": [
    {
      lang: "javascript",
      label: "JavaScript",
      code: `function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}`,
    },
    {
      lang: "css",
      label: "CSS",
      code: `/* Use in CSS custom properties */
:root {
  --brand: #3b82f6;
  --brand-rgb: 59, 130, 246;
}
.box { background: rgba(var(--brand-rgb), 0.2); }`,
    },
  ],
};
