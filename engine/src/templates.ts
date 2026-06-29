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

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface PageContext extends PageMeta {
  lesson?: number;
  hsk?: number;
  frequency_rank?: number;
  stroke_count?: number;
  wordIndexInLesson?: number;   // 1-based
  sidebar?: LessonSidebar;
  description?: string;         // for SEO meta description
  breadcrumbs?: BreadcrumbItem[];
  lessonTitle?: string;         // for breadcrumb display
}

// ── Brand ───────────────────────────────────────────────────────────────────

/**
 * The Atlas Logo — the round Fire Horse seal, the Atlas's living guardian.
 *
 * Centralized so the planned animated logo (see `brand/fire-horse-3d/`: 3D
 * carved medallion, living flame, ember loop, video intro) can be introduced
 * in ONE place — swap this <img> for a <picture>, animated SVG, or <video>
 * loop — without editing every template. Static PNG remains the fallback.
 */
export function siteSeal(opts: { size: number; className: string; alt: string }): string {
  const { size, className, alt } = opts;
  return `<img src="${BASE}/assets/images/logo/fire-horse-seal-round.svg" `
       + `alt="${esc(alt)}" width="${size}" height="${size}" class="${esc(className)}">`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function freqLabel(rank: number): string {
  const denom = Math.round(2000 / rank);
  if (denom <= 0) return `#${rank}`;
  return `1 / ${denom.toLocaleString("en")}`;
}

function typeDir(type: string): string {
  const map: Record<string, string> = {
    word: "words", character: "characters", component: "components",
    lesson: "lessons", grammar: "grammar", book: "books",
    person: "people", idiom: "idioms", topic: "topics",
  };
  return map[type] ?? type + "s";
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    word: "Words", character: "Characters", component: "Components",
    lesson: "Lessons", grammar: "Grammar", book: "Books",
    person: "People", idiom: "Idioms", topic: "Topics",
  };
  return map[type] ?? type;
}

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

function renderBreadcrumbs(ctx: PageContext): string {
  const items: BreadcrumbItem[] = [{ label: "Home", url: `${BASE}/` }];

  if (ctx.type) {
    items.push({ label: typeLabel(ctx.type), url: `${BASE}/${typeDir(ctx.type)}/` });
  }

  if (ctx.sidebar && ctx.type === "word") {
    items.push({
      label: `Lesson ${ctx.sidebar.lessonNumber}`,
      url: ctx.sidebar.allUrl,
    });
  }

  if (ctx.id) {
    items.push({ label: ctx.id });
  }

  if (items.length <= 2) return "";

  const crumbs = items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast || !item.url) {
      return `<span class="bc-current">${esc(item.label)}</span>`;
    }
    return `<a href="${esc(item.url)}" class="bc-link">${esc(item.label)}</a>`;
  }).join(`<span class="bc-sep">›</span>`);

  return `<nav class="breadcrumb" aria-label="Breadcrumb">${crumbs}</nav>`;
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function renderSidebar(ctx: PageContext): string {
  if (!ctx.sidebar) {
    const currentType = ctx.type ? typeDir(ctx.type) : null;
    function navItem(label: string, dir: string, icon: string): string {
      const active = currentType === dir ? ' class="active"' : "";
      return `<li><a href="${BASE}/${dir}/"${active}><span class="sw-icon">${icon}</span>${esc(label)}</a></li>`;
    }
    return `
<nav class="sidebar-nav" aria-label="Atlas sections">
  <div class="sidebar-nav-title">Atlas</div>
  <ul>
    <li><a href="${BASE}/"><span class="sw-icon">🏛</span>Home</a></li>
    ${navItem("Lessons",    "lessons",    "📖")}
    ${navItem("Words",      "words",      "字")}
    ${navItem("Characters", "characters", "文")}
    ${navItem("Components", "components", "部")}
    <li><a href="${BASE}/books/"><span class="sw-icon">📚</span>Books</a></li>
    <li><a href="${BASE}/search.html"><span class="sw-icon">🔍</span>Search</a></li>
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

function renderEntryBanner(ctx: PageContext, gloss?: string): string {
  if (!ctx.hanzi) return "";

  const isWord      = ctx.type === "word";
  const typeLabel_  = isWord ? "WORD" : "CHARACTER";
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
    ? `<span class="eb-stroke">Strokes: ${ctx.stroke_count}</span>` : "";

  const audioChar = `<button class="audio-btn banner-audio" onclick="speak('${esc(ctx.hanzi)}')" aria-label="Pronounce ${esc(ctx.hanzi)}">🔊</button>`;
  const audioPy   = ctx.pinyin
    ? `<button class="audio-btn" onclick="speak('${esc(ctx.pinyin)}')" aria-label="Pronounce ${esc(ctx.pinyin)}">🔊</button>` : "";

  return `
<div class="entry-banner" aria-label="${esc(typeLabel_)} entry for ${esc(ctx.hanzi ?? "")}">
  <div class="eb-label">
    <span class="eb-type">${typeLabel_}</span>
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
    ${gloss ? `<div class="eb-gloss">${esc(gloss)}</div>` : ""}
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

// ── SEO helpers ───────────────────────────────────────────────────────────────

function buildDescription(title: string, ctx: PageContext): string {
  if (ctx.description) return ctx.description;
  const parts: string[] = [];
  if (ctx.hanzi && ctx.pinyin) {
    parts.push(`${ctx.hanzi} (${ctx.pinyin})`);
  }
  parts.push(title);
  if (ctx.type === "word") parts.push("— Chinese Character Atlas");
  if (ctx.type === "character") parts.push("— character etymology, evolution, and usage");
  return parts.join(" ").slice(0, 160);
}

// ── Page shell ────────────────────────────────────────────────────────────────

export function page(title: string, body: string, ctx: PageContext = {}): string {
  const pagefindMeta = [
    ctx.id     ? `<meta data-pagefind-meta="id"     content="${esc(ctx.id)}">` : "",
    ctx.type   ? `<meta data-pagefind-meta="type"   content="${esc(ctx.type)}">` : "",
    ctx.hanzi  ? `<meta data-pagefind-meta="hanzi"  content="${esc(ctx.hanzi)}">` : "",
    ctx.pinyin ? `<meta data-pagefind-meta="pinyin" content="${esc(ctx.pinyin)}">` : "",
  ].filter(Boolean).join("\n    ");

  const hasEntryBanner = (ctx.type === "word" || ctx.type === "character") && !!ctx.hanzi;
  const entryBanner    = hasEntryBanner ? renderEntryBanner(ctx, title) : "";
  const breadcrumbs    = hasEntryBanner ? renderBreadcrumbs(ctx) : "";

  const pageTitle = title === "Chinese Character Atlas"
    ? "Chinese Character Atlas · 漢字之美"
    : `${esc(title)} · Chinese Character Atlas`;

  const description = buildDescription(title, ctx);
  const canonicalPath = ctx.id && ctx.type
    ? `${BASE}/${typeDir(ctx.type)}/${ctx.id}`
    : `${BASE}/`;

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
<script>document.documentElement.classList.add('js')</script>
<title>${pageTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(description)}">
<meta name="language" content="en">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chinese Character Atlas">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(pageTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<link rel="canonical" href="https://ste-bel.github.io${canonicalPath}">
<link rel="stylesheet" href="${BASE}/assets/css/style.css">
<script src="${BASE}/assets/js/audio.js" defer></script>
<script src="${BASE}/assets/js/atlas.js" defer></script>
${pagefindMeta ? `    ${pagefindMeta}` : ""}
</head>
<body>

<header class="site-header" data-pagefind-ignore>
  <div class="header-top-rule" aria-hidden="true"></div>
  <div class="header-inner">
    <a href="${BASE}/" class="header-brand" aria-label="Chinese Character Atlas — Home">
      ${siteSeal({ size: 44, className: "header-seal", alt: "Fire Horse seal — site logo" })}
      <div class="header-identity">
        <div class="header-hanzi">漢字之美</div>
        <div class="header-subtitle">Chinese Character Atlas</div>
      </div>
    </a>
    <nav class="header-nav" aria-label="Site navigation">
      <a href="${BASE}/" class="nav-item">Home</a>
      <a href="${BASE}/lessons/" class="nav-item">Lessons</a>
      <a href="${BASE}/words/" class="nav-item">Words</a>
      <a href="${BASE}/characters/" class="nav-item">Characters</a>
      <a href="${BASE}/search.html" class="nav-item">Search</a>
      <a href="${BASE}/people/P0001-stephane-belanger.html" class="nav-item nav-about">About</a>
    </nav>
    <button class="header-menu-btn" aria-label="Open navigation menu" onclick="toggleMenu(this)">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="header-mobile-nav" id="mobile-nav" aria-hidden="true">
    <a href="${BASE}/">Home</a>
    <a href="${BASE}/lessons/">Lessons</a>
    <a href="${BASE}/words/">Words</a>
    <a href="${BASE}/characters/">Characters</a>
    <a href="${BASE}/components/">Components</a>
    <a href="${BASE}/search.html">Search</a>
    <a href="${BASE}/people/P0001-stephane-belanger.html">About</a>
  </div>
</header>

<div class="page-layout" data-pagefind-ignore="nav">
  <aside class="site-sidebar" data-pagefind-ignore>
    ${renderSidebar(ctx)}
  </aside>
  <main data-pagefind-body>
    ${breadcrumbs}
    ${entryBanner}
    <div class="entry-body ${hasEntryBanner ? "is-entry" : ""}">
      ${body}
    </div>
  </main>
</div>

${bottomBar}

<footer class="site-footer" data-pagefind-ignore>
  <div class="footer-rule" aria-hidden="true"></div>
  <div class="footer-inner">
    <div class="footer-brand">
      ${siteSeal({ size: 52, className: "footer-seal", alt: "Fire Horse seal" })}
      <div class="footer-brand-text">
        <div class="footer-title">漢字之美</div>
        <div class="footer-tagline">Chinese Character Atlas</div>
      </div>
    </div>
    <nav class="footer-nav" aria-label="Footer navigation">
      <div class="footer-nav-col">
        <div class="footer-nav-head">Explore</div>
        <a href="${BASE}/lessons/">Lessons</a>
        <a href="${BASE}/words/">Words</a>
        <a href="${BASE}/characters/">Characters</a>
        <a href="${BASE}/components/">Components</a>
      </div>
      <div class="footer-nav-col">
        <div class="footer-nav-head">Atlas</div>
        <a href="${BASE}/books/">Books</a>
        <a href="${BASE}/search.html">Search</a>
        <a href="${BASE}/people/P0001-stephane-belanger.html">About</a>
        <a href="https://github.com/ste-bel/chinese-character-atlas">GitHub</a>
      </div>
    </nav>
    <div class="footer-info">
      <div class="footer-info-head">Chinese Character Atlas</div>
      <p>A museum-quality encyclopedia of Chinese language, history, and culture.</p>
      <p class="footer-author">Curated by 白朗志远<br>Stéphane Bélanger</p>
      <p class="footer-license">
        Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a><br>
        Engine: <a href="https://opensource.org/licenses/MIT">MIT</a>
      </p>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 白朗志远 · Stéphane Bélanger</span>
    <span class="footer-bottom-sep">·</span>
    <span>Chinese Character Atlas</span>
  </div>
</footer>

<script>
function toggleMenu(btn) {
  const nav = document.getElementById('mobile-nav');
  const open = nav.getAttribute('aria-hidden') === 'false';
  nav.setAttribute('aria-hidden', open ? 'true' : 'false');
  btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  btn.classList.toggle('open', !open);
}
</script>

</body>
</html>`;
}
