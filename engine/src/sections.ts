// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Section → museum card transform.
 *
 * The authoritative infographic presents each part of an entry as a
 * self-contained museum card: a crimson number circle, a line-art icon, a
 * tracked uppercase title, then content. This module reproduces that visual
 * language for the long-form Atlas content.
 *
 * Strategy: split the Markdown body at H2 (`## `) boundaries — fence-aware so
 * code blocks are never split — and wrap each section in a `.card` with a
 * `.section-head`. Content before the first H2 (the H1 title + any lede) is
 * emitted as a preamble. The standalone "Atlas Note" section is rendered as the
 * bare note block (it is its own signature element, not a numbered exhibit).
 *
 * Pages with no H2 sections (index pages, people) pass through unchanged.
 */
import { marked } from "marked";
import { Entry } from "./types.js";
import { preprocess } from "./markdown.js";
import { esc } from "./utils.js";

interface Section {
  title: string;
  body: string; // Markdown
}

interface SectionMeta {
  icon: string;
  variant: string; // extra class(es) on the card, or ""
}

/** Map a section title to its line-art icon and card variant. */
export function sectionMeta(title: string): SectionMeta {
  const t = title.toLowerCase();
  const has = (...keys: string[]) => keys.some(k => t.includes(k));

  if (has("common mistake", "mistake", "pitfall", "error"))
    return { icon: "⚠", variant: "card-warning" };
  if (has("historical", "evolution", "history"))
    return { icon: "⌛", variant: "card-feature" };
  if (has("example", "sentence"))
    return { icon: "✎", variant: "card-feature" };
  if (has("grammar", "pattern", "construction"))
    return { icon: "▦", variant: "card-feature" };
  if (has("pronunciation", "phonetic", "tone"))
    return { icon: "🔊", variant: "" };
  if (has("meaning", "usage", "definition"))
    return { icon: "📖", variant: "" };
  if (has("composition", "character analysis", "structure", "component"))
    return { icon: "⬡", variant: "" };
  if (has("cultural", "culture", "significance"))
    return { icon: "⛰", variant: "" };
  if (has("question"))
    return { icon: "？", variant: "" };
  if (has("modern", "today", "contemporary"))
    return { icon: "◷", variant: "" };
  if (has("related", "links", "see also", "cross"))
    return { icon: "🔗", variant: "" };
  if (has("reference", "source", "further reading"))
    return { icon: "📚", variant: "card-quiet" };
  if (has("mnemonic", "memory"))
    return { icon: "💡", variant: "" };
  return { icon: "❖", variant: "" };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

/** Split Markdown into a preamble plus H2-delimited sections (fence-aware). */
function splitSections(md: string): { preamble: string; sections: Section[] } {
  const lines = md.split(/\r?\n/);
  const preamble: string[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;

    const h2 = !inFence ? /^##\s+(.+?)\s*$/.exec(line) : null;
    // Match H2 only (## ), never H3+ (### ). The regex above already excludes
    // ### because the captured group would start with "#".
    if (h2 && !line.startsWith("###")) {
      current = { title: h2[1]!.trim(), body: "" };
      sections.push(current);
    } else if (current) {
      current.body += line + "\n";
    } else {
      preamble.push(line);
    }
  }

  return { preamble: preamble.join("\n"), sections };
}

function md2html(md: string, byId: Map<string, Entry>): string {
  return marked.parse(preprocess(md, byId)) as string;
}

/**
 * Render an entry body as museum cards. Returns inner HTML for `.entry-body`.
 * If the content has no H2 sections, the whole body is rendered as-is.
 */
export function renderSectionedBody(content: string, byId: Map<string, Entry>): string {
  const { preamble, sections } = splitSections(content);

  if (sections.length === 0) {
    return md2html(content, byId);
  }

  const parts: string[] = [];
  if (preamble.trim()) parts.push(md2html(preamble, byId));

  let num = 0;
  for (const section of sections) {
    const isAtlasNote = /^atlas note$/i.test(section.title.trim());
    const inner = md2html(section.body, byId);

    // Standalone Atlas Note: emit the bare note block (its own signature element).
    if (isAtlasNote) {
      parts.push(inner);
      continue;
    }

    num += 1;
    const { icon, variant } = sectionMeta(section.title);
    const id = slugify(section.title);

    parts.push(
      `<section class="card section-card${variant ? " " + variant : ""}" id="${id}">
  <div class="section-head">
    <span class="section-num">${num}</span>
    <span class="section-icon" aria-hidden="true">${esc(icon)}</span>
    <h2 class="section-title">${esc(section.title)}</h2>
  </div>
  <div class="card-body">
${inner}
  </div>
</section>`,
    );
  }

  return parts.join("\n");
}
