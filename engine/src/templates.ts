// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

import { navigation } from "./navigation.js";
import { esc } from "./utils.js";

export interface PageMeta {
  id?: string;
  type?: string;
  hanzi?: string;
  pinyin?: string;
}

export function page(title: string, body: string, meta: PageMeta = {}): string {
  const metaTags = [
    meta.id     ? `<meta data-pagefind-meta="id"     content="${esc(meta.id)}">` : "",
    meta.type   ? `<meta data-pagefind-meta="type"   content="${esc(meta.type)}">` : "",
    meta.hanzi  ? `<meta data-pagefind-meta="hanzi"  content="${esc(meta.hanzi)}">` : "",
    meta.pinyin ? `<meta data-pagefind-meta="pinyin" content="${esc(meta.pinyin)}">` : "",
  ].filter(Boolean).join("\n");

  // Entry hero block for word / character / component pages
  const heroBlock = meta.hanzi ? `
<div class="entry-hero">
  <div class="entry-hanzi">${esc(meta.hanzi)}</div>
  <div class="entry-meta-row">
    ${meta.pinyin ? `<span class="entry-pinyin">${esc(meta.pinyin)}</span>` : ""}
    ${meta.id    ? `<span class="badge">${esc(meta.id)}</span>` : ""}
    ${meta.type  ? `<span class="badge type">${esc(meta.type)}</span>` : ""}
  </div>
</div>` : "";

  const pageTitle = title === "Chinese Character Atlas"
    ? title
    : `${esc(title)} · Chinese Character Atlas`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${pageTitle}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js" defer></script>
${metaTags}
</head>
<body>

<header data-pagefind-ignore>
  <div class="header-inner">

    <div class="header-brand">
      <a href="/chinese-character-atlas/" class="header-seal" aria-label="Home">
        <img src="/chinese-character-atlas/assets/images/seals/bai-lang-zhiyuan-fire-horse-seal.png"
             alt="白朗志远 Fire Horse seal" width="88" height="88">
      </a>
      <div class="header-title-block">
        <div class="header-chinese">漢字之美</div>
        <div class="header-english">THE BEAUTY OF CHINESE CHARACTERS</div>
      </div>
    </div>

    <div class="header-tagline">
      A Journey through Language, History &amp; Culture
    </div>

    <nav class="header-nav" aria-label="Site navigation">
      <a href="/chinese-character-atlas/">Home</a>
      <a href="/chinese-character-atlas/words/">Index</a>
      <a href="/chinese-character-atlas/search.html">Search</a>
    </nav>

  </div>
</header>

<div class="page-layout" data-pagefind-ignore="nav">

  <aside class="sidebar" data-pagefind-ignore>
    ${navigation()}
  </aside>

  <main data-pagefind-body>
    ${heroBlock}
    <div class="entry-body">
      ${body}
    </div>
  </main>

</div>

<footer data-pagefind-ignore>
  <div class="footer-inner">
    <p>© 2026 Stéphane Bélanger (白朗志远) · Chinese Character Atlas</p>
    <p>Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> · Engine: <a href="https://opensource.org/licenses/MIT">MIT</a></p>
  </div>
</footer>

</body>
</html>`;
}
