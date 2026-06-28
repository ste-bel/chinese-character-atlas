import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const root = process.cwd();
const atlasDir = path.join(root, "atlas");
const docsDir = path.join(root, "docs");

type Entry = {
  id: string | null;
  type: string | null;
  hanzi: string | null;
  pinyin: string | null;
  title: string;
  source: string;
  url: string;
  linksTo: string[];
};

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".md") ? [full] : [];
  });
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function outPath(source: string): string {
  return path.join(docsDir, path.relative(atlasDir, source).replace(/\.md$/, ".html"));
}

function siteUrl(output: string): string {
  return "/" + path.relative(docsDir, output).replace(/\\/g, "/");
}

function extractLinks(md: string): string[] {
  return [...md.matchAll(/\[\[([A-Z]+\d+)(?:\|[^\]]+)?\]\]/g)].map(m => m[1]);
}

function preprocess(md: string, byId: Map<string, Entry>): string {
  let out = md.replace(/\{\{audio:(.*?)\}\}/g, (_, text) =>
    `<button class="audio" onclick="speak('${esc(text)}')">🔊</button>`
  );

  out = out.replace(/\[\[([A-Z]+\d+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
    const entry = byId.get(id);
    if (!entry) return `[[${id}]]`;
    const text = label || `${entry.id} ${entry.hanzi || entry.title}`;
    return `<a href="/chinese-character-atlas${entry.url}">${esc(text)}</a>`;
  });

  return out;
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js"></script>
</head>
<body>
<header><h1>Chinese Character Atlas</h1><p>Every character tells a story. Every story opens a civilization.</p></header>
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

function backlinksSection(entry: Entry, entries: Entry[]): string {
  if (!entry.id) return "";
  const backlinks = entries.filter(e => e.linksTo.includes(entry.id as string));
  if (!backlinks.length) return "";
  return `<section class="card">
<h2>Linked from</h2>
<ul>
${backlinks.map(e => `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id || ""} ${e.hanzi || ""} ${e.title}`)}</a></li>`).join("\n")}
</ul>
</section>`;
}

function writeIndexPage(type: string, title: string, entries: Entry[]) {
  const body = `<section class="card"><h1>${esc(title)}</h1><ul>
${entries.map(e => `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id || ""} ${e.hanzi || ""} ${e.title || ""}`)}</a>${e.pinyin ? ` — <em>${esc(e.pinyin)}</em>` : ""}</li>`).join("\n")}
</ul></section>`;
  const file = path.join(docsDir, type, "index.html");
  ensureDir(file);
  fs.writeFileSync(file, layout(title, body), "utf8");
}

const files = walk(atlasDir);
const entries: Entry[] = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const output = outPath(file);
  entries.push({
    id: parsed.data.id || null,
    type: parsed.data.type || null,
    hanzi: parsed.data.hanzi || null,
    pinyin: parsed.data.pinyin || null,
    title: parsed.data.title || parsed.data.hanzi || path.basename(file, ".md"),
    source: file,
    url: siteUrl(output),
    linksTo: extractLinks(parsed.content)
  });
}

const byId = new Map(entries.filter(e => e.id).map(e => [e.id as string, e]));

for (const entry of entries) {
  const raw = fs.readFileSync(entry.source, "utf8");
  const parsed = matter(raw);
  const html = marked.parse(preprocess(parsed.content, byId));
  const output = outPath(entry.source);

  ensureDir(output);
  fs.writeFileSync(output, layout(entry.title, html.toString() + backlinksSection(entry, entries)), "utf8");
}

fs.writeFileSync(path.join(docsDir, "search-index.json"), JSON.stringify(entries, null, 2), "utf8");

writeIndexPage("words", "Word Atlas", entries.filter(e => e.type === "word"));
writeIndexPage("characters", "Character Atlas", entries.filter(e => e.type === "character"));
writeIndexPage("components", "Component Atlas", entries.filter(e => e.type === "component"));
writeIndexPage("lessons", "Learning Paths", entries.filter(e => e.type === "lesson"));

console.log(`Built ${entries.length} pages.`);
