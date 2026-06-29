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
import { ROOT, ATLAS, DOCS, BASE } from "../config.js";
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
        const pinyin = e.pinyin ? `<span class="index-item-pinyin">${esc(e.pinyin)}</span>` : "";
        const hanzi  = e.hanzi  ? `<span class="index-item-hanzi">${esc(e.hanzi)}</span>` : "";
        return `<a class="index-item" href="${BASE}${e.url}">
          <span class="index-item-id">${esc(e.id)}</span>
          ${hanzi}
          ${pinyin}
          <span class="index-item-title">${esc(e.title)}</span>
        </a>`;
      })
      .join("\n");

    const body = `<h1 style="margin-bottom:1.2rem;font-family:var(--font-hanzi);font-size:24px;color:var(--crimson)">${esc(title)}</h1>
<div class="index-grid">\n${items}\n</div>`;
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
  const books      = entries.filter(e => e.type === "book");

  function entryCard(numeral: string, title: string, icon: string, items: Entry[], dir: string, desc: string): string {
    if (items.length === 0) return "";
    return `
<a class="home-entry-card" href="${BASE}/${dir}/">
  <div class="hec-gallery">Gallery ${numeral}</div>
  <div class="hec-icon">${icon}</div>
  <div class="hec-title">${esc(title)}</div>
  <div class="hec-count">${items.length}</div>
  <div class="hec-desc">${esc(desc)}</div>
</a>`;
  }

  // The existing destinations, framed as the museum's galleries. (Future
  // galleries — Calligraphy, Oracle Bones — arrive when their exhibits exist.)
  const sections = [
    entryCard("I",   "Lessons",    "📖", lessons,     "lessons",    "Be guided, word by word, along the path through the Atlas"),
    entryCard("II",  "Words",      "字", words,        "words",      "Each word an exhibit — meaning, grammar, and the threads between them"),
    entryCard("III", "Characters", "文", characters,   "characters", "Origin, evolution, and the cultural memory each character carries"),
    entryCard("IV",  "Components", "部", components,    "components", "The radicals and strokes from which every character is built"),
    entryCard("V",   "Texts",      "📚", books,        "books",      "The classical and modern sources the Atlas draws upon"),
  ].filter(Boolean).join("\n");

  // Featured character (W0001 / 是 — the reference implementation)
  const featuredWord = words.find(e => e.id === "W0001");
  const featuredChar = featuredWord ? `
<div class="hero-char">
  <div class="hero-char-hanzi">${esc(featuredWord.hanzi ?? "是")}</div>
  <div class="hero-char-pinyin">${esc(featuredWord.pinyin ?? "shì")}</div>
  <div class="hero-char-meaning">TO BE · IS · CORRECT · AFFIRMATION</div>
  <div class="hero-char-audio">
    <button class="audio-btn banner-audio"
            onclick="speak('${esc(featuredWord.hanzi ?? "是")}')"
            aria-label="Pronounce ${esc(featuredWord.hanzi ?? "是")}">🔊 Listen</button>
  </div>
  <a href="${BASE}${featuredWord.url}" class="ls-btn" style="margin-top:var(--sp-3)">
    Explore this character →
  </a>
</div>` : "";

  const body = `
<div class="home-hero">
  <a href="${BASE}/people/P0001-stephane-belanger.html" class="home-seal" aria-label="About the author">
    <img src="${BASE}/assets/images/logo/fire-horse-seal-round.svg"
         alt="Fire Horse seal — the Atlas logo" width="168" height="168">
  </a>

  <div class="home-chinese">漢字之美</div>
  <div class="home-english">Chinese Character Atlas</div>

  <p class="home-motto">Every character tells a story.<br>Every story opens a civilization.</p>

  <p class="home-sub">
    Four thousand years of thought, poetry, and history live inside a few
    thousand characters. The Atlas opens them one at a time — origin and
    evolution, sound and meaning, the culture each one carries, and the
    threads that bind them together.
  </p>

  <a href="${BASE}/words/W0001-是.html" class="home-cta">Enter the Atlas</a>

  <div class="home-stats">
    ${words.length      ? `<div class="home-stat"><div class="home-stat-num">${words.length}</div><div class="home-stat-label">Words</div></div>` : ""}
    ${characters.length ? `<div class="home-stat"><div class="home-stat-num">${characters.length}</div><div class="home-stat-label">Characters</div></div>` : ""}
    ${components.length ? `<div class="home-stat"><div class="home-stat-num">${components.length}</div><div class="home-stat-label">Components</div></div>` : ""}
    ${lessons.length    ? `<div class="home-stat"><div class="home-stat-num">${lessons.length}</div><div class="home-stat-label">Lessons</div></div>` : ""}
  </div>
</div>

<div class="home-section-rule">
  <hr class="gold-rule">
  <div class="home-section-label">The Galleries</div>
</div>

<div class="home-grid">
  <div class="home-main-col">
    <div class="home-entry-grid">
      ${sections}
    </div>
  </div>
  <div class="home-aside-col">
    <div class="home-featured-label">Featured Character</div>
    ${featuredChar}
  </div>
</div>`;

  fs.writeFileSync(path.join(DOCS, "index.html"), page("Chinese Character Atlas", body), "utf8");
}

// ── Static pages ──────────────────────────────────────────────────────────────

function copyStaticPages(): void {
  const TEMPLATES = path.join(ROOT, "templates");
  if (fs.existsSync(TEMPLATES)) {
    for (const name of fs.readdirSync(TEMPLATES)) {
      if (name.endsWith(".html")) {
        fs.copyFileSync(path.join(TEMPLATES, name), path.join(DOCS, name));
      }
    }
  }

  // Copy .nojekyll to docs/ so GitHub Pages skips Jekyll processing
  const noJekyll = path.join(ROOT, ".nojekyll");
  if (fs.existsSync(noJekyll)) {
    fs.copyFileSync(noJekyll, path.join(DOCS, ".nojekyll"));
  }

  // Copy assets/ into docs/assets/ so CSS, JS, and images are served
  const ASSETS_SRC = path.join(ROOT, "assets");
  const ASSETS_DST = path.join(DOCS, "assets");
  if (fs.existsSync(ASSETS_SRC)) {
    copyDir(ASSETS_SRC, ASSETS_DST);
  }
}

function copyDir(src: string, dst: string): void {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}
