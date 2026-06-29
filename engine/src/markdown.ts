// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

import { marked } from "marked";
import { Entry } from "./types.js";
import { esc } from "./utils.js";

export function extractLinks(md: string): string[] {
  return [...md.matchAll(/\[\[([A-Z]+\d+)(?:\|[^\]]+)?\]\]/g)]
    .map(m => m[1])
    .filter((id): id is string => id !== undefined);
}

export function preprocess(md: string, byId: Map<string, Entry>): string {
  let out = md.replace(/\{\{audio:(.*?)\}\}/g, (_, text) =>
    `<button class="audio" onclick="speak('${esc(text)}')">🔊</button>`
  );

  // Atlas Note — the Atlas's signature callout. The inner Markdown is parsed
  // here (marked treats block-level HTML as opaque, so it would not parse it
  // otherwise) and wrapped in the diamond/label structure the CSS expects.
  out = out.replace(/\{\{atlas-note\}\}([\s\S]*?)\{\{\/atlas-note\}\}/g, (_, content) => {
    const inner = (marked.parse(content.trim()) as string).trim();
    return `<aside class="atlas-note" role="note" aria-label="Atlas Note">
  <div class="atlas-note-head">
    <span class="atlas-note-diamond" aria-hidden="true">◆</span>
    <span class="atlas-note-label">Atlas Note</span>
  </div>
  <div class="atlas-note-body">${inner}</div>
</aside>`;
  });

  out = out.replace(/\[\[([A-Z]+\d+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
    const entry = byId.get(id);
    if (!entry) return `[[${id}]]`;
    const text = label || `${entry.id} ${entry.hanzi || entry.title}`;
    return `<a href="/chinese-character-atlas${entry.url}">${esc(text)}</a>`;
  });

  return out;
}
