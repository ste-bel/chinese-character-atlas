// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 2 — Parse
 *
 * Read each Markdown file, extract YAML frontmatter and body,
 * and produce a typed Entry for every file that has a valid id + type.
 *
 * Files without id or type are returned as ParseFailure and reported
 * separately; they do not enter the pipeline.
 *
 * Input:  string[]        — absolute file paths from Stage 1
 * Output: ParseResult     — entries + failures
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ATLAS, DOCS } from "../config.js";
import {
  Entry,
  AnyMetadata,
  EntityType,
  StatusValue,
} from "../types.js";
import { extractLinks } from "../markdown.js";

const VALID_TYPES = new Set<EntityType>([
  "word", "character", "component", "lesson", "grammar",
  "book", "idiom", "person", "topic", "history", "pronunciation",
]);

const VALID_STATUSES = new Set<StatusValue>(["draft", "review", "published"]);

export interface ParseFailure {
  file: string;
  reason: string;
}

export interface ParseResult {
  entries: Entry[];
  failures: ParseFailure[];
}

function outPath(source: string): string {
  return path.join(DOCS, path.relative(ATLAS, source).replace(/\.md$/, ".html"));
}

function siteUrl(output: string): string {
  return "/" + path.relative(DOCS, output).replace(/\\/g, "/");
}

export function parse(files: string[]): ParseResult {
  const entries: Entry[] = [];
  const failures: ParseFailure[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const data = parsed.data as Record<string, unknown>;

    // ── Required fields ────────────────────────────────────────────────
    const id = typeof data["id"] === "string" ? data["id"].trim() : null;
    if (!id) {
      failures.push({ file: path.basename(file), reason: "missing required field: id" });
      continue;
    }

    const rawType = typeof data["type"] === "string" ? data["type"].trim() : null;
    if (!rawType) {
      failures.push({ file: path.basename(file), reason: "missing required field: type" });
      continue;
    }
    if (!VALID_TYPES.has(rawType as EntityType)) {
      failures.push({
        file: path.basename(file),
        reason: `unknown type: "${rawType}". Valid types: ${[...VALID_TYPES].join(", ")}`,
      });
      continue;
    }
    const type = rawType as EntityType;

    const rawTitle = data["title"];
    const title: string =
      typeof rawTitle === "string" ? rawTitle.trim()
      : typeof data["hanzi"] === "string" ? (data["hanzi"] as string)
      : path.basename(file, ".md");

    const rawStatus = data["status"];
    const status: StatusValue = VALID_STATUSES.has(rawStatus as StatusValue)
      ? (rawStatus as StatusValue)
      : "draft";

    const hanzi  = typeof data["hanzi"]  === "string" ? data["hanzi"]  : null;
    const pinyin = typeof data["pinyin"] === "string" ? data["pinyin"] : null;

    // ── Coerce metadata to typed shape ─────────────────────────────────
    // We trust the content author for optional fields; validation in Stage 3
    // will catch semantic problems. Here we just carry the raw data forward
    // as the narrowed AnyMetadata type.
    const metadata: AnyMetadata = {
      ...(data as object),
      id,
      type,
      title,
      status,
    } as AnyMetadata;

    const output = outPath(file);

    entries.push({
      id,
      type,
      hanzi,
      pinyin,
      title,
      source: file,
      url: siteUrl(output),
      linksTo: extractLinks(parsed.content),
      metadata,
    });
  }

  return { entries, failures };
}
