// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

import { esc } from "./utils.js";

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
  wordIndexInLesson?: number;   // 1-based
  sidebar?: LessonSidebar;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function freqLabel(rank: number): string {
  if (rank <= 5)   return "Very High Frequency";
  if (rank <= 20)  return "High Frequency";
  if (rank <= 100) return "Common";
  return "Standard";
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function renderSidebar(ctx: PageContext): string {
  if (!ctx.sidebar) {
    // Generic atlas navigation for non-lesson pages
    return `
<nav class="sidebar-nav" aria-label="Atlas sections">
  <div class="sidebar-nav-title">Atlas</div>
  <ul>
    <li><a href="/chinese-character-atlas/">🏠 Home</a></li>
    <li><a href="/chinese-character-atlas/lessons/">📖 Lessons</a></li>
    <li><a href="/chinese-character-atlas/words/">字 Words</a></li>
    <li><a href="/chinese-character-atlas/characters/">文 Characters</a></li>
    <li><a href="/chinese-character-atlas/components/">部 Components</a></li>
    <li><a href="/chinese-character-atlas/search.html">🔍 Search</a></li>
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
    <div class="ls-lesson">LESSON ${lessonNumber}</div>
    <div class="ls-title">${esc(lessonTitle)}</div>
  </div>
  <nav class="ls-wordlist" aria-label="Lesson words">
    <ul>${wordList}</ul>
  </nav>
  <div class="ls-nav-btns">
    ${prevUrl ? `<a href="${esc(prevUrl)}" class="ls-btn">← Previous Word</a>` : `<span class="ls-btn disabled">← Previous</span>`}
    ${nextUrl ? `<a href="${esc(nextUrl)}" class="ls-btn">Next Word →</a>` : `<span class="ls-btn disabled">Next →</span>`}
    <a href="${esc(allUrl)}" class="ls-btn ls-btn-all">All Lessons</a>
  </div>
  <div class="ls-quote">
    <p>Learning a character<br>is discovering<br>a piece of history.</p>
  </div>
</div>`;
}

// ── Word banner ───────────────────────────────────────────────────────────────

function renderWordBanner(ctx: PageContext): string {
  if (!ctx.hanzi) return "";

  const wordNum  = ctx.wordIndexInLesson ?? "";
  const hskBadge = ctx.hsk
    ? `<span class="badge hsk">HSK ${ctx.hsk}</span>` : "";
  const freqBadge = ctx.frequency_rank
    ? `<span class="badge freq">${esc(freqLabel(ctx.frequency_rank))}</span>` : "";
  const idBadge  = ctx.id
    ? `<span class="badge id-badge">${esc(ctx.id)}</span>` : "";
  const typeBadge = ctx.type
    ? `<span class="badge type">${esc(ctx.type)}</span>` : "";

  const audioChar = ctx.hanzi
    ? `<button class="audio banner-audio" onclick="speak('${esc(ctx.hanzi)}')">🔊</button>` : "";
  const audioPy = ctx.pinyin
    ? `<button class="audio" onclick="speak('${esc(ctx.pinyin)}')">🔊</button>` : "";

  return `
<div class="word-banner">
  <div class="wb-label">
    <span class="wb-word">WORD</span>
    <span class="wb-num">${wordNum}</span>
  </div>
  <div class="wb-hanzi-block">
    <div class="wb-hanzi">${esc(ctx.hanzi)}</div>
    ${audioChar}
  </div>
  <div class="wb-info">
    <div class="wb-pinyin-row">
      <span class="wb-pinyin">${ctx.pinyin ? esc(ctx.pinyin) : ""}</span>
      ${audioPy}
    </div>
    <div class="wb-badges">${hskBadge}${freqBadge}${idBadge}${typeBadge}</div>
  </div>
  <div class="wb-quick-audio">
    <div class="qa-title">QUICK AUDIO</div>
    <ul>
      <li>${esc(ctx.hanzi)} ${audioChar}</li>
      ${ctx.pinyin ? `<li><em>${esc(ctx.pinyin)}</em> ${audioPy}</li>` : ""}
    </ul>
  </div>
</div>`;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function page(title: string, body: string, ctx: PageContext = {}): string {
  const metaTags = [
    ctx.id     ? `<meta data-pagefind-meta="id"     content="${esc(ctx.id)}">` : "",
    ctx.type   ? `<meta data-pagefind-meta="type"   content="${esc(ctx.type)}">` : "",
    ctx.hanzi  ? `<meta data-pagefind-meta="hanzi"  content="${esc(ctx.hanzi)}">` : "",
    ctx.pinyin ? `<meta data-pagefind-meta="pinyin" content="${esc(ctx.pinyin)}">` : "",
  ].filter(Boolean).join("\n");

  const isWord = ctx.type === "word" || ctx.type === "character";
  const wordBanner = isWord ? renderWordBanner(ctx) : "";

  const pageTitle = title === "Chinese Character Atlas"
    ? title
    : `${esc(title)} · Chinese Character Atlas`;

  // Lesson word URLs for JS jump-to-word
  const wordUrlsJson = ctx.sidebar
    ? JSON.stringify(ctx.sidebar.items.map(i => ({ id: i.id, url: i.url })))
    : "[]";

  const bottomBar = isWord ? `
<div class="bottom-bar" data-pagefind-ignore>
  <button class="bb-btn" id="audio-toggle" onclick="toggleAudio(this)">🔊 Audio On</button>
  <span class="bb-sep">|</span>
  <span class="bb-label">Jump to Word #</span>
  <input class="bb-input" type="number" id="jump-input" min="1" value="${ctx.wordIndexInLesson ?? 1}">
  <button class="bb-btn" onclick="jumpToWord(${JSON.stringify(wordUrlsJson)})">Go</button>
  <span class="bb-spacer"></span>
  <a href="#top" class="bb-btn">Back to Top ↑</a>
</div>` : "";

  return `<!doctype html>
<html lang="en" id="top">
<head>
<meta charset="utf-8">
<title>${pageTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js" defer></script>
<script src="/chinese-character-atlas/assets/js/atlas.js" defer></script>
${metaTags}
</head>
<body>

<header data-pagefind-ignore>
  <div class="header-inner">
    <div class="header-brand">
      <a href="/chinese-character-atlas/" class="header-seal" aria-label="Home">
        <img src="/chinese-character-atlas/assets/images/seals/bai-lang-zhiyuan-fire-horse-seal.png"
             alt="白朗志远 Fire Horse seal" width="72" height="72">
      </a>
      <div class="header-title-block">
        <div class="header-chinese">漢字之美</div>
        <div class="header-english">THE BEAUTY OF CHINESE CHARACTERS</div>
      </div>
    </div>
    <div class="header-tagline">A Journey through Language, History &amp; Culture</div>
    <nav class="header-nav" aria-label="Site navigation">
      <a href="/chinese-character-atlas/">🏠 Home</a>
      <a href="/chinese-character-atlas/words/">☰ Index</a>
      <a href="/chinese-character-atlas/search.html">🔍 Search</a>
    </nav>
  </div>
</header>

<div class="page-layout" data-pagefind-ignore="nav">
  <aside class="sidebar" data-pagefind-ignore>
    ${renderSidebar(ctx)}
  </aside>

  <main data-pagefind-body>
    ${wordBanner}
    <div class="entry-body ${isWord ? "is-entry" : ""}">
      ${body}
    </div>
  </main>
</div>

${bottomBar}

<footer data-pagefind-ignore>
  <div class="footer-inner">
    <p>© 2026 Stéphane Bélanger (白朗志远) · Chinese Character Atlas</p>
    <p>Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> · Engine: <a href="https://opensource.org/licenses/MIT">MIT</a></p>
  </div>
</footer>

</body>
</html>`;
}
