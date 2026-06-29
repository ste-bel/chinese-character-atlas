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
  // Build data-pagefind-meta tags for structured search facets
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
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js" defer></script>
${metaTags}
</head>
<body>
<header data-pagefind-ignore>
<h1>Chinese Character Atlas</h1>
<p>Every character tells a story. Every story opens a civilization.</p>
</header>

<main data-pagefind-body>
<div data-pagefind-ignore>
${navigation()}
</div>
${body}
</main>

<footer data-pagefind-ignore>
<p>© 2026 Stéphane Bélanger (白朗志远) · Chinese Character Atlas</p>
<p>Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a> · Engine: <a href="https://opensource.org/licenses/MIT">MIT</a></p>
</footer>

</body>
</html>`;
}
