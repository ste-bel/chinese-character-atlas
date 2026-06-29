// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

import { esc } from "./utils.js";
import { BASE } from "./config.js";

// ── Context types ─────────────────────────────────────────────────────────────

export interface PageMeta {
  id?: string;
  type?: string;
  hanzi?: string;
  pinyin?: string;
}

export interface SidebarItem {
  id: string;
  hanzi: string | null;
  pinyin: string | null;
  url: string;
  active: boolean;
}

export interface LessonSidebar {
  lessonId: string;
  lessonTitle: string;
  lessonNumber: number;
  items: SidebarItem[];
  prevUrl: string | null;
  nextUrl: string | null;
  allUrl: string;
}

export interface PageContext extends PageMeta {
  lesson?: number;
  hsk?: number;
  frequency_rank?: number;
  stroke_count?: number;
  wordIndexInLesson?: number;   // 1-based
  sidebar?: LessonSidebar;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function freqLabel(rank: number): string {
  // Express as fraction of 2000 most common words
  const denom = Math.round(2000 / rank);
  if (denom <= 0) return `#${rank}`;
  return `1 / ${denom.toLocaleString("en")}`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function renderSidebar(ctx: PageContext): string {
  if (!ctx.sidebar) {
    return `
<nav class="sidebar-nav" aria-label="Atlas sections">
  <div class="sidebar-nav-title">Atlas</div>
  <ul>
    <li><a href="${BASE}/"><span>🏠</span> Home</a></li>
    <li><a href="${BASE}/lessons/"><span>📖</span> Lessons</a></li>
    <li><a href="${BASE}/words/"><span>字</span> Words</a></li>
    <li><a href="${BASE}/characters/"><span>文</span> Characters</a></li>
    <li><a href="${BASE}/components/"><span>部</span> Components</a></li>
    <li><a href="${BASE}/search.html"><span>🔍</span> Search</a></li>
  </ul>
</nav>`;
  }

  const { lessonNumber, lessonTitle, items, prevUrl, nextUrl, allUrl } = ctx.sidebar;

  const wordList = items.map(item => `
    <li>
      <a href="${esc(item.url)}" class="${item.active ? "active" : ""}">
        <span class="sw-id">${esc(item.id.replace(/^W0*/, ""))}</span>
        ${item.hanzi ? `<span class="sw-hanzi">${esc(item.hanzi)}</span>` : ""}
        ${item.pinyin ? `<span class="sw-pinyin">${esc(item.pinyin)}</span>` : ""}
      </a>
    </li>`).join("");

  return `
<div class="lesson-sidebar">
  <div class="ls-header">
    <div class="ls-lesson">Lesson ${lessonNumber}</div>
    <div class="ls-title">${esc(lessonTitle)}</div>
  </div>
  <nav class="ls-wordlist" aria-label="Lesson words">
    <ul>${wordList}</ul>
  </nav>
  <div class="ls-nav-btns">
    ${prevUrl
      ? `<a href="${esc(prevUrl)}" class="ls-btn">← Previous</a>`
      : `<span class="ls-btn disabled">← Previous</span>`}
    ${nextUrl
      ? `<a href="${esc(nextUrl)}" class="ls-btn">Next →</a>`
      : `<span class="ls-btn disabled">Next →</span>`}
    <a href="${esc(allUrl)}" class="ls-btn ls-btn-all">All Lessons</a>
  </div>
  <div class="ls-quote">
    <p>Learning a character<br>is discovering<br>a piece of history.</p>
  </div>
</div>`;
}

// ── Entry banner (word and character pages) ───────────────────────────────────

function renderEntryBanner(ctx: PageContext): string {
  if (!ctx.hanzi) return "";

  const isWord      = ctx.type === "word";
  const typeLabel   = isWord ? "WORD" : "CHARACTER";
  const numDisplay  = isWord ? (ctx.wordIndexInLesson ?? "") : "";

  const hskBadge  = ctx.hsk
    ? `<span class="badge badge-hsk">HSK ${ctx.hsk}</span>` : "";
  const freqBadge = ctx.frequency_rank
    ? `<span class="badge badge-freq">${esc(freqLabel(ctx.frequency_rank))}</span>` : "";
  const idBadge   = ctx.id
    ? `<span class="badge badge-id">${esc(ctx.id)}</span>` : "";
  const typeBadge = ctx.type
    ? `<span class="badge badge-type">${esc(ctx.type)}</span>` : "";

  const strokeMeta = ctx.stroke_count
    ? `<span>Strokes: ${ctx.stroke_count}</span>` : "";

  const audioChar = `<button class="audio-btn banner-audio" onclick="speak('${esc(ctx.hanzi)}')" aria-label="Pronounce ${esc(ctx.hanzi)}">🔊</button>`;
  const audioPy   = ctx.pinyin
    ? `<button class="audio-btn" onclick="speak('${esc(ctx.pinyin)}')" aria-label="Pronounce ${esc(ctx.pinyin)}">🔊</button>` : "";

  return `
<div class="entry-banner" aria-label="${esc(typeLabel)} entry for ${esc(ctx.hanzi ?? "")}">
  <div class="eb-label">
    <span class="eb-type">${typeLabel}</span>
    <span class="eb-num">${numDisplay}</span>
  </div>
  <div class="eb-hanzi-block">
    <div class="eb-hanzi">${esc(ctx.hanzi)}</div>
    ${audioChar}
  </div>
  <div class="eb-info">
    <div class="eb-pinyin-row">
      <span class="eb-pinyin">${ctx.pinyin ? esc(ctx.pinyin) : ""}</span>
      ${audioPy}
    </div>
    <div class="eb-badges">${hskBadge}${freqBadge}${idBadge}${typeBadge}</div>
    ${strokeMeta ? `<div class="eb-meta">${strokeMeta}</div>` : ""}
  </div>
  <div class="eb-quick-audio">
    <div class="qa-title">Quick Audio</div>
    <ul>
      <li>
        <span class="ql-hanzi">${esc(ctx.hanzi)}</span>
        ${audioChar}
      </li>
      ${ctx.pinyin ? `<li><span class="ql-label">${esc(ctx.pinyin)}</span>${audioPy}</li>` : ""}
    </ul>
  </div>
</div>`;
}

// ── Page shell ────────────────────────────────────────────────────────────────

export function page(title: string, body: string, ctx: PageContext = {}): string {
  const metaTags = [
    ctx.id     ? `<meta data-pagefind-meta="id"     content="${esc(ctx.id)}">` : "",
    ctx.type   ? `<meta data-pagefind-meta="type"   content="${esc(ctx.type)}">` : "",
    ctx.hanzi  ? `<meta data-pagefind-meta="hanzi"  content="${esc(ctx.hanzi)}">` : "",
    ctx.pinyin ? `<meta data-pagefind-meta="pinyin" content="${esc(ctx.pinyin)}">` : "",
  ].filter(Boolean).join("\n    ");

  const hasEntryBanner = (ctx.type === "word" || ctx.type === "character") && !!ctx.hanzi;
  const entryBanner    = hasEntryBanner ? renderEntryBanner(ctx) : "";

  const pageTitle = title === "Chinese Character Atlas"
    ? title
    : `${esc(title)} · Chinese Character Atlas`;

  const wordUrlsJson = ctx.sidebar
    ? JSON.stringify(ctx.sidebar.items.map(i => ({ id: i.id, url: i.url })))
    : "[]";

  const bottomBar = hasEntryBanner ? `
<div class="bottom-bar" data-pagefind-ignore>
  <button class="bb-btn" id="audio-toggle" onclick="toggleAudio(this)">🔊 Audio On</button>
  <span class="bb-sep">|</span>
  <span class="bb-label">Jump to Word #</span>
  <input class="bb-input" type="number" id="jump-input" min="1"
         value="${ctx.wordIndexInLesson ?? 1}" aria-label="Word number">
  <button class="bb-btn" onclick="jumpToWord(${JSON.stringify(wordUrlsJson)})">Go</button>
  <span class="bb-spacer"></span>
  <a href="#top" class="bb-btn">↑ Top</a>
</div>` : "";

  return `<!doctype html>
<html lang="en" id="top">
<head>
<meta charset="utf-8">
<title>${pageTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="${BASE}/assets/css/style.css">
<script src="${BASE}/assets/js/audio.js" defer></script>
<script src="${BASE}/assets/js/atlas.js" defer></script>
${metaTags ? `    ${metaTags}` : ""}
</head>
<body>

<header class="site-header" data-pagefind-ignore>
  <div class="header-inner">
    <div class="header-brand">
      <a href="${BASE}/" class="header-logo" aria-label="Chinese Character Atlas — Home">
        <img src="${BASE}/assets/images/logo/fire-horse-seal.png"
             alt="白朗志远 Fire Horse seal" width="40" height="40">
      </a>
      <div class="header-title">
        <div class="header-title-chinese">漢字之美</div>
        <div class="header-title-english">The Beauty of Chinese Characters</div>
      </div>
    </div>
    <div class="header-tagline">A Journey Through Language, History &amp; Culture</div>
    <nav class="header-nav" aria-label="Site navigation">
      <a href="${BASE}/"><span class="nav-icon">🏠</span>Home</a>
      <a href="${BASE}/words/"><span class="nav-icon">☰</span>Index</a>
      <a href="${BASE}/search.html"><span class="nav-icon">🔍</span>Search</a>
      <a href="${BASE}/people/P0001-stephane-belanger.html"><span class="nav-icon">◉</span>About</a>
    </nav>
  </div>
</header>

<div class="page-layout" data-pagefind-ignore="nav">
  <aside class="site-sidebar" data-pagefind-ignore>
    ${renderSidebar(ctx)}
  </aside>
  <main data-pagefind-body>
    ${entryBanner}
    <div class="entry-body ${hasEntryBanner ? "is-entry" : ""}">
      ${body}
    </div>
  </main>
</div>

${bottomBar}

<footer class="site-footer" data-pagefind-ignore>
  <div class="footer-inner">
    <p>© 2026 Stéphane Bélanger · 白朗志远 · Chinese Character Atlas</p>
    <p>Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
     · Engine: <a href="https://opensource.org/licenses/MIT">MIT</a></p>
  </div>
</footer>

</body>
</html>`;
}
