import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { ATLAS, DOCS } from "./config.js";
import { Entry } from "./types.js";
import { walk, ensureDir } from "./utils.js";
import { page } from "./templates.js";
import { extractLinks, preprocess } from "./markdown.js";
import { backlinksSection } from "./graph.js";
import { relationSection } from "./relations.js";
import { writeStatistics } from "./statistics.js";
import { writeIndexPage } from "./indexPages.js";

function outPath(source: string): string {
  return path.join(DOCS, path.relative(ATLAS, source).replace(/\.md$/, ".html"));
}

function siteUrl(output: string): string {
  return "/" + path.relative(DOCS, output).replace(/\\/g, "/");
}

fs.mkdirSync(DOCS, { recursive: true });

const files = walk(ATLAS);
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
  fs.writeFileSync(output, page(entry.title, html.toString() + relationSection(entry, byId, parsed.data) + backlinksSection(entry, entries)), "utf8");
}

fs.writeFileSync(path.join(DOCS, "search-index.json"), JSON.stringify(entries, null, 2), "utf8");
writeStatistics(entries);

writeIndexPage("words", "Word Atlas", entries.filter(e => e.type === "word"));
writeIndexPage("characters", "Character Atlas", entries.filter(e => e.type === "character"));
writeIndexPage("components", "Component Atlas", entries.filter(e => e.type === "component"));
writeIndexPage("lessons", "Learning Paths", entries.filter(e => e.type === "lesson"));

console.log(`Built ${entries.length} pages.`);
