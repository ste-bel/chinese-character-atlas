// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 5 — Render
 *
 * Converts each entry's Markdown body to an HTML page.
 * Builds lesson sidebar context for word/character entries.
 *
 * Input:  Entry[], Graph, Map<id, Entry>
 * Output: Map<url, html string>
 */
import matter from "gray-matter";
import fs from "node:fs";
import { marked } from "marked";
import { Entry, Graph, metaRecord } from "../types.js";
import { preprocess } from "../markdown.js";
import { page, PageContext, LessonSidebar, SidebarItem } from "../templates.js";
import { esc } from "../utils.js";
import { BASE } from "../config.js";

const RELATION_FIELDS: string[] = [
  "words", "characters", "components", "lessons",
  "grammar", "books", "people", "idioms", "topics", "related",
];

function renderRelations(entry: Entry, byId: Map<string, Entry>): string {
  const meta = metaRecord(entry.metadata);
  const groups: string[] = [];

  for (const field of RELATION_FIELDS) {
    const ids = meta[field];
    if (!Array.isArray(ids) || ids.length === 0) continue;

    const items = ids.map((id: unknown) => {
      if (typeof id !== "string") return "";
      const target = byId.get(id);
      if (!target) return `<li>${esc(id)}</li>`;
      return `<li><a href="${BASE}${target.url}">${esc(`${target.id}${target.hanzi && !target.title.includes(target.hanzi) ? ` ${target.hanzi}` : ""} ${target.title}`.trim())}</a></li>`;
    }).filter(Boolean).join("\n");

    if (items) groups.push(`<h3>${esc(field)}</h3><ul>${items}</ul>`);
  }

  if (!groups.length) return "";
  return `<section class="card" data-pagefind-ignore>
<h2>Related Atlas Entries</h2>
${groups.join("\n")}
</section>`;
}

function renderBacklinks(entry: Entry, graph: Graph, byId: Map<string, Entry>): string {
  const incomingIds = graph.incoming[entry.id] ?? [];
  if (incomingIds.length === 0) return "";

  const items = incomingIds
    .map(id => byId.get(id))
    .filter((e): e is Entry => e !== undefined)
    .map(e => `<li><a href="${BASE}${e.url}">${esc(`${e.id}${e.hanzi && !e.title.includes(e.hanzi) ? ` ${e.hanzi}` : ""} ${e.title}`.trim())}</a></li>`)
    .join("\n");

  if (!items) return "";
  return `<section class="card" data-pagefind-ignore>
<h2>Linked from</h2>
<ul>
${items}
</ul>
</section>`;
}

/**
 * Build the lesson sidebar for word entries that belong to a lesson.
 */
function buildLessonSidebar(
  entry: Entry,
  byId: Map<string, Entry>,
): LessonSidebar | undefined {
  if (entry.type !== "word") return undefined;

  const meta = metaRecord(entry.metadata);
  const lessonNum = meta.lesson as number | undefined;
  if (!lessonNum) return undefined;

  // Find the lesson entry that lists this word
  let lessonEntry: Entry | undefined;
  for (const e of byId.values()) {
    if (e.type !== "lesson") continue;
    const lm = metaRecord(e.metadata);
    const wordIds = lm.words as string[] | undefined;
    if (Array.isArray(wordIds) && wordIds.includes(entry.id)) {
      lessonEntry = e;
      break;
    }
  }
  if (!lessonEntry) return undefined;

  const lessonMeta  = metaRecord(lessonEntry.metadata);
  const wordIds     = (lessonMeta.words as string[] | undefined) ?? [];

  const items: SidebarItem[] = wordIds
    .map(id => {
      const w = byId.get(id);
      if (!w) return null;
      return {
        id: w.id,
        hanzi: w.hanzi,
        pinyin: w.pinyin,
        url: `${BASE}${w.url}`,
        active: w.id === entry.id,
      } satisfies SidebarItem;
    })
    .filter((x): x is SidebarItem => x !== null);

  const idx     = wordIds.indexOf(entry.id);
  const prevId  = idx > 0 ? wordIds[idx - 1] : null;
  const nextId  = idx < wordIds.length - 1 ? wordIds[idx + 1] : null;

  return {
    lessonId:      lessonEntry.id,
    lessonTitle:   lessonEntry.title,
    lessonNumber:  lessonNum,
    items,
    prevUrl:  prevId  ? `${BASE}${byId.get(prevId)?.url  ?? ""}` : null,
    nextUrl:  nextId  ? `${BASE}${byId.get(nextId)?.url  ?? ""}` : null,
    allUrl:   `${BASE}${lessonEntry.url}`,
  };
}

export function render(entries: Entry[], graph: Graph): Map<string, string> {
  const byId   = new Map(entries.map(e => [e.id, e]));
  const result = new Map<string, string>();

  for (const entry of entries) {
    const raw    = fs.readFileSync(entry.source, "utf8");
    const parsed = matter(raw);
    const html   = marked.parse(preprocess(parsed.content, byId)) as string;
    const meta   = metaRecord(entry.metadata);

    const sidebar  = buildLessonSidebar(entry, byId);
    const wordIdx  = sidebar
      ? sidebar.items.findIndex(i => i.active) + 1
      : undefined;

    const lessonVal        = meta.lesson         as number | undefined;
    const hskVal           = meta.hsk            as number | undefined;
    const freqVal          = meta.frequency_rank as number | undefined;
    const strokeVal        = meta.stroke_count   as number | undefined;
    const hanziVal         = entry.hanzi  ?? undefined;
    const pinyinVal        = entry.pinyin ?? undefined;

    const ctx: PageContext = {
      id:   entry.id,
      type: entry.type,
      ...(hanziVal   !== undefined && { hanzi:  hanziVal }),
      ...(pinyinVal  !== undefined && { pinyin: pinyinVal }),
      ...(lessonVal  !== undefined && { lesson: lessonVal }),
      ...(hskVal     !== undefined && { hsk:    hskVal }),
      ...(freqVal    !== undefined && { frequency_rank: freqVal }),
      ...(strokeVal  !== undefined && { stroke_count:   strokeVal }),
      ...(wordIdx    !== undefined && { wordIndexInLesson: wordIdx }),
      ...(sidebar    !== undefined && { sidebar }),
    };

    const body =
      html +
      renderRelations(entry, byId) +
      renderBacklinks(entry, graph, byId);

    result.set(entry.source, page(entry.title, body, ctx));
  }

  return result;
}
