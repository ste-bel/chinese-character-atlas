// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 6 — Output
 *
 * Writes all build artifacts to docs/:
 *   - HTML pages (one per entry)
 *   - Index pages (words/, characters/, components/, lessons/)
 *   - search-index.json
 *   - statistics.json
 *   - graph.json
 *
 * Input:  rendered pages map, entries, graph
 * Output: void (side effects only)
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { ROOT, ATLAS, DOCS } from "../config.js";
import { Entry, Graph, SearchEntry, EntityType } from "../types.js";
import { ensureDir, esc } from "../utils.js";
import { page } from "../templates.js";

const require = createRequire(import.meta.url);

function readVersion(): string {
  try {
    const pkg = require(path.join(ROOT, "package.json")) as { version?: unknown };
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
}

function outPath(source: string): string {
  return path.join(DOCS, path.relative(ATLAS, source).replace(/\.md$/, ".html"));
}

// ── HTML pages ────────────────────────────────────────────────────────────────

function writePages(rendered: Map<string, string>, entries: Entry[]): void {
  for (const entry of entries) {
    const html = rendered.get(entry.source);
    if (!html) continue;
    const out = outPath(entry.source);
    ensureDir(out);
    fs.writeFileSync(out, html, "utf8");
  }
}

// ── Index pages ───────────────────────────────────────────────────────────────

const INDEX_SECTIONS: Array<{ type: EntityType; dir: string; title: string }> = [
  { type: "word",      dir: "words",      title: "Word Atlas" },
  { type: "character", dir: "characters", title: "Character Atlas" },
  { type: "component", dir: "components", title: "Component Atlas" },
  { type: "lesson",    dir: "lessons",    title: "Learning Paths" },
  { type: "grammar",   dir: "grammar",    title: "Grammar" },
  { type: "book",      dir: "books",      title: "Books" },
  { type: "person",    dir: "people",     title: "People" },
  { type: "idiom",     dir: "idioms",     title: "Idioms" },
  { type: "topic",     dir: "topics",     title: "Topics" },
];

function writeIndexPages(entries: Entry[]): void {
  for (const { type, dir, title } of INDEX_SECTIONS) {
    const section = entries.filter(e => e.type === type);
    if (section.length === 0) continue;

    const items = section
      .map(e => {
        const label = esc(`${e.id} ${e.hanzi ?? ""} ${e.title}`.trim());
        const pinyin = e.pinyin ? ` — <em>${esc(e.pinyin)}</em>` : "";
        return `<li><a href="/chinese-character-atlas${e.url}">${label}</a>${pinyin}</li>`;
      })
      .join("\n");

    const body = `<section class="card"><h1>${esc(title)}</h1><ul>\n${items}\n</ul></section>`;
    const file = path.join(DOCS, dir, "index.html");
    ensureDir(file);
    fs.writeFileSync(file, page(title, body), "utf8");
  }
}

// ── Search index ──────────────────────────────────────────────────────────────

function writeSearchIndex(entries: Entry[]): void {
  const index: SearchEntry[] = entries.map(e => ({
    id:       e.id,
    type:     e.type,
    hanzi:    e.hanzi,
    pinyin:   e.pinyin,
    title:    e.title,
    source:   path.relative(ROOT, e.source).replace(/\\/g, "/"),
    url:      e.url,
    linksTo:  e.linksTo,
  }));

  fs.writeFileSync(
    path.join(DOCS, "search-index.json"),
    JSON.stringify(index, null, 2),
    "utf8",
  );
}

// ── Statistics ────────────────────────────────────────────────────────────────

function writeStatistics(entries: Entry[]): void {
  const counts: Record<string, number> = {};
  for (const e of entries) {
    counts[e.type] = (counts[e.type] ?? 0) + 1;
  }

  const output = {
    version:      readVersion(),
    generated_at: new Date().toISOString(),
    total:        entries.length,
    ...counts,
  };

  fs.writeFileSync(
    path.join(DOCS, "statistics.json"),
    JSON.stringify(output, null, 2),
    "utf8",
  );
}

// ── Graph export ──────────────────────────────────────────────────────────────

function writeGraph(graph: Graph): void {
  fs.writeFileSync(
    path.join(DOCS, "graph.json"),
    JSON.stringify(graph, null, 2),
    "utf8",
  );
}

// ── Orchestrator ──────────────────────────────────────────────────────────────

export function output(
  rendered: Map<string, string>,
  entries: Entry[],
  graph: Graph,
): void {
  fs.mkdirSync(DOCS, { recursive: true });
  writePages(rendered, entries);
  writeIndexPages(entries);
  writeHomepage(entries);
  copyStaticPages();
  writeSearchIndex(entries);
  writeStatistics(entries);
  writeGraph(graph);
}

// ── Homepage ──────────────────────────────────────────────────────────────────

function writeHomepage(entries: Entry[]): void {
  const words      = entries.filter(e => e.type === "word");
  const characters = entries.filter(e => e.type === "character");
  const components = entries.filter(e => e.type === "component");
  const lessons    = entries.filter(e => e.type === "lesson");

  function sectionCard(title: string, items: Entry[], dir: string): string {
    if (items.length === 0) return "";
    const links = items.slice(0, 6).map(e =>
      `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id} ${e.hanzi ?? ""} ${e.title}`.trim())}</a></li>`
    ).join("\n");
    const more = items.length > 6
      ? `<li><a href="/chinese-character-atlas/${dir}/">All ${items.length} →</a></li>`
      : `<li><a href="/chinese-character-atlas/${dir}/">Browse all →</a></li>`;
    return `<div class="card">
<h2>${esc(title)} <span class="badge">${items.length}</span></h2>
<ul>
${links}
${more}
</ul>
</div>`;
  }

  const body = `<section class="card">
<h2>Every character tells a story.</h2>
<p>Every story opens a civilization.</p>
<p>The Chinese Character Atlas is an interactive encyclopedia of Chinese language, characters, history, culture, and usage — built for learners who want to understand not just <em>what</em> Chinese means, but <em>why</em>.</p>
</section>

<section class="grid">
${[
  sectionCard("Words", words, "words"),
  sectionCard("Characters", characters, "characters"),
  sectionCard("Components", components, "components"),
  sectionCard("Lessons", lessons, "lessons"),
].filter(Boolean).join("\n")}
</section>`;

  fs.writeFileSync(path.join(DOCS, "index.html"), page("Chinese Character Atlas", body), "utf8");
}

// ── Static pages ──────────────────────────────────────────────────────────────

function copyStaticPages(): void {
  const TEMPLATES = path.join(ROOT, "templates");
  if (!fs.existsSync(TEMPLATES)) return;
  for (const name of fs.readdirSync(TEMPLATES)) {
    if (name.endsWith(".html")) {
      fs.copyFileSync(path.join(TEMPLATES, name), path.join(DOCS, name));
    }
  }
}
