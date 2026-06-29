// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 5 — Render
 *
 * Converts each entry's Markdown body to an HTML page.
 * Uses the graph for backlinks rather than scanning all entries.
 *
 * Input:  Entry[], Graph, Map<id, Entry>
 * Output: Map<url, html string>
 */
import matter from "gray-matter";
import fs from "node:fs";
import { marked } from "marked";
import { Entry, Graph, metaRecord } from "../types.js";
import { preprocess } from "../markdown.js";
import { page, PageMeta } from "../templates.js";
import { esc } from "../utils.js";

const RELATION_FIELDS: string[] = [
  "words", "characters", "components", "lessons",
  "grammar", "books", "people", "idioms", "topics", "related",
];

function renderRelations(
  entry: Entry,
  byId: Map<string, Entry>,
): string {
  const meta = metaRecord(entry.metadata);
  const groups: string[] = [];

  for (const field of RELATION_FIELDS) {
    const ids = meta[field];
    if (!Array.isArray(ids) || ids.length === 0) continue;

    const items = ids.map((id: unknown) => {
      if (typeof id !== "string") return "";
      const target = byId.get(id);
      if (!target) return `<li>${esc(id)}</li>`;
      return `<li><a href="/chinese-character-atlas${target.url}">${esc(`${target.id}${target.hanzi && !target.title.includes(target.hanzi) ? ` ${target.hanzi}` : ""} ${target.title}`.trim())}</a></li>`;
    }).filter(Boolean).join("\n");

    if (items) {
      groups.push(`<h3>${esc(field)}</h3><ul>${items}</ul>`);
    }
  }

  if (!groups.length) return "";

  return `<section class="card" data-pagefind-ignore>
<h2>Related Atlas Entries</h2>
${groups.join("\n")}
</section>`;
}

function renderBacklinks(
  entry: Entry,
  graph: Graph,
  byId: Map<string, Entry>,
): string {
  const incomingIds = graph.incoming[entry.id] ?? [];
  if (incomingIds.length === 0) return "";

  const items = incomingIds
    .map(id => byId.get(id))
    .filter((e): e is Entry => e !== undefined)
    .map(e => `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id}${e.hanzi && !e.title.includes(e.hanzi) ? ` ${e.hanzi}` : ""} ${e.title}`.trim())}</a></li>`)
    .join("\n");

  if (!items) return "";

  return `<section class="card" data-pagefind-ignore>
<h2>Linked from</h2>
<ul>
${items}
</ul>
</section>`;
}

export function render(
  entries: Entry[],
  graph: Graph,
): Map<string, string> {
  const byId = new Map(entries.map(e => [e.id, e]));
  const result = new Map<string, string>();

  for (const entry of entries) {
    const raw = fs.readFileSync(entry.source, "utf8");
    const parsed = matter(raw);
    const html = (marked.parse(preprocess(parsed.content, byId)) as string);

    const meta: PageMeta = {
      id:   entry.id,
      type: entry.type,
      ...(entry.hanzi  ? { hanzi:  entry.hanzi  } : {}),
      ...(entry.pinyin ? { pinyin: entry.pinyin } : {}),
    };

    const body =
      html +
      renderRelations(entry, byId) +
      renderBacklinks(entry, graph, byId);

    result.set(entry.source, page(entry.title, body, meta));
  }

  return result;
}
