import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const atlasDir = path.join(root, "atlas");
const docsDir = path.join(root, "docs");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js"></script>
</head>
<body>
<header>
  <h1>Chinese Character Atlas</h1>
  <p>Every character tells a story. Every story opens a civilization.</p>
</header>
<main>
<nav class="card">
  <a href="/chinese-character-atlas/">Home</a> ·
  <a href="/chinese-character-atlas/lessons/">Lessons</a> ·
  <a href="/chinese-character-atlas/words/">Words</a> ·
  <a href="/chinese-character-atlas/characters/">Characters</a> ·
  <a href="/chinese-character-atlas/components/">Components</a>
</nav>
${body}
</main>
<footer>白朗志远 · Chinese Character Atlas</footer>
</body>
</html>`;
}

function ensureDir(file: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function outPath(source: string): string {
  const rel = path.relative(atlasDir, source).replace(/\.md$/, ".html");
  return path.join(docsDir, rel);
}

fs.mkdirSync(docsDir, { recursive: true });

const files = walk(atlasDir);
const index: any[] = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const title = parsed.data.title || parsed.data.hanzi || path.basename(file, ".md");
  const html = marked.parse(parsed.content);
  const output = outPath(file);

  ensureDir(output);
  fs.writeFileSync(output, layout(title, html.toString()), "utf8");

  index.push({
    id: parsed.data.id || null,
    type: parsed.data.type || null,
    hanzi: parsed.data.hanzi || null,
    pinyin: parsed.data.pinyin || null,
    title,
    url: "/" + path.relative(docsDir, output).replace(/\\/g, "/")
  });
}

fs.writeFileSync(
  path.join(docsDir, "search-index.json"),
  JSON.stringify(index, null, 2),
  "utf8"
);

console.log(`Built ${files.length} atlas pages.`);
