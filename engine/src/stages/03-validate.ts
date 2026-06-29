// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 3 — Validate
 *
 * Runs semantic checks across all parsed entries.
 * Does NOT halt on first failure — collects all issues so contributors
 * see the complete problem set in one pass.
 *
 * Checks:
 *   - Duplicate IDs
 *   - [[wiki-links]] targeting non-existent IDs
 *   - YAML relation arrays (characters, words, etc.) targeting non-existent IDs
 *   - ID prefix matches declared type (W→word, CH→character, etc.)
 *   - File name contains the declared ID
 *
 * Input:  Entry[]         — all successfully parsed entries
 * Output: ValidationIssue[]
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Entry, ValidationIssue, metaRecord } from "../types.js";
import { checkPinyinField, scanBodyForNumericTones } from "../pinyin.js";

/** Maps ID prefix to expected entity type */
const PREFIX_TO_TYPE: Record<string, string> = {
  W:   "word",
  CH:  "character",
  CMP: "component",
  L:   "lesson",
  G:   "grammar",
  I:   "idiom",
  B:   "book",
  P:   "person",
  T:   "topic",
};

/** YAML fields that contain arrays of IDs pointing to other entries */
const RELATION_FIELDS = [
  "words", "characters", "components", "lessons",
  "grammar", "books", "people", "idioms", "topics", "related",
  "related_components", "related_words",
];

function relFile(entry: Entry): string {
  return path.basename(entry.source);
}

export function validate(entries: Entry[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const byId = new Map<string, Entry>();

  // ── Pass 1: Duplicate ID detection ──────────────────────────────────
  for (const entry of entries) {
    if (byId.has(entry.id)) {
      const existing = byId.get(entry.id)!;
      issues.push({
        severity: "error",
        file: relFile(entry),
        message: `Duplicate ID "${entry.id}" — already used in ${relFile(existing)}`,
      });
    } else {
      byId.set(entry.id, entry);
    }
  }

  // ── Pass 2: Per-entry checks ─────────────────────────────────────────
  for (const entry of entries) {

    // ID prefix must match declared type
    const prefixMatch = entry.id.match(/^([A-Z]+)\d+$/);
    if (prefixMatch) {
      const prefix = prefixMatch[1]!;
      const expectedType = PREFIX_TO_TYPE[prefix];
      if (expectedType && expectedType !== entry.type) {
        issues.push({
          severity: "error",
          file: relFile(entry),
          message: `ID "${entry.id}" has prefix "${prefix}" (expected type: ${expectedType}) but file declares type: "${entry.type}"`,
        });
      }
    }

    // File name should contain the declared ID
    const fileName = path.basename(entry.source);
    if (!fileName.includes(entry.id)) {
      issues.push({
        severity: "warning",
        file: relFile(entry),
        message: `File name "${fileName}" does not contain the declared ID "${entry.id}". Convention: ${entry.id}-汉字.md`,
      });
    }

    // Wiki-links must resolve
    for (const linkedId of entry.linksTo) {
      if (!byId.has(linkedId)) {
        issues.push({
          severity: "error",
          file: relFile(entry),
          message: `[[${linkedId}]] links to a non-existent ID`,
        });
      }
    }

    // YAML relation arrays must resolve
    const meta = metaRecord(entry.metadata);
    for (const field of RELATION_FIELDS) {
      const val = meta[field];
      if (!Array.isArray(val)) continue;
      for (const relId of val) {
        if (typeof relId === "string" && !byId.has(relId)) {
          issues.push({
            severity: "error",
            file: relFile(entry),
            message: `YAML field "${field}" references non-existent ID "${relId}"`,
          });
        }
      }
    }

    // Pinyin fields must use standard Unicode tone marks
    for (const field of ["pinyin", "author_pinyin"]) {
      const val = meta[field];
      if (typeof val !== "string") continue;
      for (const p of checkPinyinField(val)) {
        issues.push({
          severity: p.severity,
          file: relFile(entry),
          message: `YAML field "${field}": ${p.message}`,
        });
      }
    }

    // Body must not contain numeric-tone pinyin (e.g. shi4) — warning only,
    // since free-text detection is heuristic.
    try {
      const body = matter(fs.readFileSync(entry.source, "utf8")).content;
      const hits = scanBodyForNumericTones(body);
      const seen = new Set<string>();
      for (const hit of hits) {
        if (seen.has(hit.token)) continue;
        seen.add(hit.token);
        issues.push({
          severity: "warning",
          file: relFile(entry),
          message: `body uses numeric-tone pinyin "${hit.token}" (line ${hit.line}) — use Unicode tone marks`,
        });
      }
    } catch {
      /* unreadable source is reported elsewhere */
    }
  }

  return issues;
}
