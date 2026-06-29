// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 4 — Graph
 *
 * Builds the typed knowledge graph from all parsed entries.
 * Combines two sources of edges:
 *   1. YAML relation arrays (typed edges: word→character, lesson→word, etc.)
 *   2. [[wiki-links]] in content (typed as "wiki-link")
 *
 * Input:  Entry[]     — all parsed entries (after validation)
 * Output: Graph       — typed edge list + forward/reverse adjacency maps
 */
import { Entry, Graph, GraphEdge, EdgeKind, EntityType, metaRecord } from "../types.js";

/** Maps (fromType, yamlField) → EdgeKind */
const FIELD_EDGE_KIND: Partial<Record<EntityType, Partial<Record<string, EdgeKind>>>> = {
  word:      { characters: "word→character", components: "word→component", lessons: "word→lesson", grammar: "word→grammar" },
  character: { components: "character→component", words: "character→word" },
  component: { characters: "component→character" },
  lesson:    { words: "lesson→word" },
  book:      { people: "book→person" },
  person:    { books: "person→book" },
};

export function buildGraph(entries: Entry[]): Graph {
  const edges: GraphEdge[] = [];
  const byId = new Map(entries.map(e => [e.id, e]));

  for (const entry of entries) {
    const meta = metaRecord(entry.metadata);
    const typeEdges = FIELD_EDGE_KIND[entry.type] ?? {};

    // ── Typed YAML relation edges ──────────────────────────────────────
    for (const [field, kind] of Object.entries(typeEdges)) {
      const ids = meta[field];
      if (!Array.isArray(ids)) continue;
      for (const targetId of ids) {
        if (typeof targetId === "string" && byId.has(targetId)) {
          edges.push({ from: entry.id, to: targetId, kind: kind as EdgeKind });
        }
      }
    }

    // ── Wiki-link edges ────────────────────────────────────────────────
    for (const linkedId of entry.linksTo) {
      if (byId.has(linkedId)) {
        edges.push({ from: entry.id, to: linkedId, kind: "wiki-link" });
      }
    }
  }

  // Deduplicate edges (same from+to+kind)
  const seen = new Set<string>();
  const dedupedEdges: GraphEdge[] = [];
  for (const edge of edges) {
    const key = `${edge.from}→${edge.to}:${edge.kind}`;
    if (!seen.has(key)) {
      seen.add(key);
      dedupedEdges.push(edge);
    }
  }

  // Build adjacency maps (deduplicated per node — same ID reachable via multiple edge kinds still counts once)
  const outgoing: Record<string, string[]> = {};
  const incoming: Record<string, string[]> = {};

  for (const entry of entries) {
    outgoing[entry.id] = [];
    incoming[entry.id] = [];
  }

  for (const edge of dedupedEdges) {
    const out = outgoing[edge.from] ??= [];
    if (!out.includes(edge.to)) out.push(edge.to);

    const inc = incoming[edge.to] ??= [];
    if (!inc.includes(edge.from)) inc.push(edge.from);
  }

  return { edges: dedupedEdges, outgoing, incoming };
}
