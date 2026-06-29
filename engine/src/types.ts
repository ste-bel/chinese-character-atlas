// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

// ── Entity types ──────────────────────────────────────────────────────────────

/** All valid entity type strings, matching ATLAS_SPEC.md */
export type EntityType =
  | "word"
  | "character"
  | "component"
  | "lesson"
  | "grammar"
  | "book"
  | "idiom"
  | "person"
  | "topic"
  | "history"
  | "pronunciation";

/** Valid status values */
export type StatusValue = "draft" | "review" | "published";

// ── Raw YAML metadata per entity type ────────────────────────────────────────
// These represent the frontmatter as parsed by gray-matter.
// All fields beyond the core four are optional — content grows over time.

interface BaseMetadata {
  id: string;
  type: EntityType;
  title: string;
  status: StatusValue;
  hanzi?: string;
  pinyin?: string;
  related?: string[];
  sources?: string[];
}

export interface WordMetadata extends BaseMetadata {
  type: "word";
  lesson?: number;
  frequency_rank?: number;
  hsk?: number;
  characters?: string[];
  components?: string[];
  related_words?: string[];
  words?: string[];
}

export interface CharacterMetadata extends BaseMetadata {
  type: "character";
  traditional?: string;
  stroke_count?: number;
  unicode?: string;
  words?: string[];
  components?: string[];
  lessons?: string[];
}

export interface ComponentMetadata extends BaseMetadata {
  type: "component";
  meaning?: string;
  category?: string;
  characters?: string[];
  words?: string[];
  related_components?: string[];
}

export interface LessonMetadata extends BaseMetadata {
  type: "lesson";
  words?: string[];
}

export interface GrammarMetadata extends BaseMetadata {
  type: "grammar";
  words?: string[];
}

export interface BookMetadata extends BaseMetadata {
  type: "book";
  english_title?: string;
  author?: string;
  author_pinyin?: string;
  period?: string;
  people?: string[];
}

export interface IdiomMetadata extends BaseMetadata {
  type: "idiom";
  characters?: string[];
  topics?: string[];
}

export interface PersonMetadata extends BaseMetadata {
  type: "person";
  period?: string;
  books?: string[];
  topics?: string[];
}

export interface TopicMetadata extends BaseMetadata {
  type: "topic";
  lessons?: string[];
}

export interface HistoryMetadata extends BaseMetadata {
  type: "history";
  period?: string;
  topics?: string[];
}

export interface PronunciationMetadata extends BaseMetadata {
  type: "pronunciation";
  words?: string[];
}

/** Discriminated union of all metadata shapes */
export type AnyMetadata =
  | WordMetadata
  | CharacterMetadata
  | ComponentMetadata
  | LessonMetadata
  | GrammarMetadata
  | BookMetadata
  | IdiomMetadata
  | PersonMetadata
  | TopicMetadata
  | HistoryMetadata
  | PronunciationMetadata;

// ── Parsed entry (internal pipeline type) ────────────────────────────────────

/**
 * A fully parsed atlas entry.
 * `source` is the absolute filesystem path (used only during the build).
 * `url`    is the site-relative URL of the output HTML page.
 * `linksTo` are IDs extracted from [[ID]] wiki-links in the Markdown body.
 */
export interface Entry {
  id: string;
  type: EntityType;
  hanzi: string | null;
  pinyin: string | null;
  title: string;
  source: string;
  url: string;
  linksTo: string[];
  metadata: AnyMetadata;
}

// ── Validation ────────────────────────────────────────────────────────────────

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  severity: ValidationSeverity;
  file: string;
  message: string;
}

// ── Graph ─────────────────────────────────────────────────────────────────────

export type EdgeKind =
  | "word→character"
  | "word→component"
  | "word→lesson"
  | "word→grammar"
  | "character→component"
  | "character→word"
  | "component→character"
  | "lesson→word"
  | "book→person"
  | "person→book"
  | "wiki-link";

export interface GraphEdge {
  from: string;   // source ID
  to: string;     // target ID
  kind: EdgeKind;
}

export interface Graph {
  /** All edges in the atlas knowledge graph */
  edges: GraphEdge[];
  /** Adjacency list: ID → IDs it points to */
  outgoing: Record<string, string[]>;
  /** Reverse adjacency: ID → IDs that point to it */
  incoming: Record<string, string[]>;
}

// ── Search index ──────────────────────────────────────────────────────────────

/** Shape written to docs/search-index.json — no filesystem paths */
export interface SearchEntry {
  id: string;
  type: EntityType;
  hanzi: string | null;
  pinyin: string | null;
  title: string;
  source: string;   // relative path e.g. "atlas/words/W0001-是.md"
  url: string;
  linksTo: string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Convert AnyMetadata to a plain string-keyed record for generic field access.
 * Use this wherever code needs to iterate arbitrary YAML fields by name
 * without knowing the specific metadata shape.
 */
export function metaRecord(meta: AnyMetadata): Record<string, unknown> {
  return meta as unknown as Record<string, unknown>;
}
