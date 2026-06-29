// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

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

  out = out.replace(/\{\{atlas-note\}\}([\s\S]*?)\{\{\/atlas-note\}\}/g, (_, content) =>
    `<section class="atlas-note"><strong>Atlas Note</strong><br>${content.trim()}</section>`
  );

  out = out.replace(/\[\[([A-Z]+\d+)(?:\|([^\]]+))?\]\]/g, (_, id, label) => {
    const entry = byId.get(id);
    if (!entry) return `[[${id}]]`;
    const text = label || `${entry.id} ${entry.hanzi || entry.title}`;
    return `<a href="/chinese-character-atlas${entry.url}">${esc(text)}</a>`;
  });

  return out;
}
