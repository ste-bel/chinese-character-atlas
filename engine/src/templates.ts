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

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title === "Chinese Character Atlas" ? title : esc(title) + " · Chinese Character Atlas"}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js" defer></script>
${metaTags}
</head>
<body>

<header data-pagefind-ignore>
  <div class="header-inner">
    <a href="/chinese-character-atlas/" class="header-seal" aria-label="Home">
      <img src="/chinese-character-atlas/assets/images/seals/bai-lang-zhiyuan-fire-horse-seal.png"
           alt="白朗志远 Fire Horse seal" width="80" height="80">
    </a>
    <div class="header-titles">
      <h1>Chinese Character Atlas</h1>
      <p class="subtitle">Every character tells a story · Every story opens a civilization</p>
    </div>
    <span class="header-hanzi" aria-hidden="true">漢字</span>
  </div>
</header>

<main data-pagefind-body>
  <div class="page-shell">
    <div data-pagefind-ignore>
      ${navigation()}
    </div>
    ${body}
  </div>
</main>

<footer data-pagefind-ignore>
  <div class="footer-inner">
    <p>© 2026 Stéphane Bélanger (白朗志远) · Chinese Character Atlas</p>
    <p>Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> · Engine: <a href="https://opensource.org/licenses/MIT">MIT</a></p>
  </div>
</footer>

</body>
</html>`;
}
