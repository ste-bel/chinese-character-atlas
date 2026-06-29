# Chinese Character Atlas — Architecture

This document describes the technical architecture of the Chinese Character Atlas as it is actually implemented. It is the authoritative reference for contributors working on the engine.

---

## Principles

**Markdown is the single source of truth.** Every entity lives in one `.md` file under `atlas/`. Generated artifacts in `docs/` are disposable and fully reproducible from `atlas/` alone.

**IDs never change.** Every entity has a permanent stable identifier. URLs are derived from file names, which contain the ID. If a file is renamed, the ID stays the same and the URL stays the same.

**The build is a pipeline.** Each stage is a pure module with typed inputs and outputs. Stages run in order. No stage reaches into another stage's concerns.

**Validation is separate from rendering.** The validator reports all problems in one pass before any HTML is written. Errors abort the build. Warnings do not.

---

## Directory Structure

```
atlas/                  ← canonical source — the only truth
  words/                W0001-是.md
  characters/           CH0001-是.md
  components/           CMP0001-日.md
  lessons/              L0001-first-20-words.md
  grammar/
  books/                B0001-admonitions-to-my-son.md
  idioms/
  people/
  topics/
  history/
  pronunciation/

assets/
  css/                  style.css
  js/                   audio.js
  images/
    seals/
    oracle/
    bronze/
    seal-script/
    regular/
  audio/

data/
  id-registry.json      next available ID per type prefix

engine/
  src/
    build.ts            pipeline orchestrator
    validate.ts         standalone validator (no HTML output)
    config.ts           ROOT, ATLAS, DOCS paths
    types.ts            all TypeScript types
    utils.ts            walk(), ensureDir(), esc()
    markdown.ts         extractLinks(), preprocess()
    templates.ts        page() HTML shell
    navigation.ts       nav HTML fragment
    stages/
      01-discover.ts
      02-parse.ts
      03-validate.ts
      04-graph.ts
      05-render.ts
      06-output.ts

scripts/
  next-id.mjs           ID allocation tool

docs/                   ← generated output — never edit manually
  *.html
  search-index.json
  statistics.json
  graph.json

.github/
  workflows/
    ci.yml              runs on every PR and push to main
    deploy.yml          builds and deploys to gh-pages on push to main
```

---

## File Naming Convention

Every source file must include its stable ID in the filename.

```
atlas/words/W0001-是.md
atlas/characters/CH0001-是.md
atlas/components/CMP0001-日.md
atlas/lessons/L0001-first-20-words.md
atlas/books/B0001-admonitions-to-my-son.md
```

Pattern: `{ID}-{descriptive-slug}.md`

The validator warns when a file's name does not contain its declared ID. This is checked at build time.

---

## ID System

Every entity has a permanent identifier that never changes.

| Prefix | Type        | Example  |
|--------|-------------|----------|
| W      | word        | W0001    |
| CH     | character   | CH0001   |
| CMP    | component   | CMP0001  |
| L      | lesson      | L0001    |
| G      | grammar     | G0001    |
| I      | idiom       | I0001    |
| B      | book        | B0001    |
| P      | person      | P0001    |
| T      | topic       | T0001    |

Allocate new IDs using the registry tool:

```bash
npm run next-id -- word       # prints W0002, increments registry
npm run next-id -- character  # prints CH0002, increments registry
npm run next-id -- word --dry-run  # prints without incrementing
```

The registry is in `data/id-registry.json`. Never edit it by hand. Never reuse a retired ID.

---

## YAML Metadata

Every file begins with YAML frontmatter. Four fields are required:

```yaml
---
id: W0001
type: word
title: The Character of Existence
status: draft
---
```

Valid `type` values: `word`, `character`, `component`, `lesson`, `grammar`, `book`, `idiom`, `person`, `topic`, `history`, `pronunciation`.

Valid `status` values: `draft`, `review`, `published`.

The full set of optional fields per type is defined in `engine/src/types.ts` as discriminated interfaces (`WordMetadata`, `CharacterMetadata`, etc.).

### Relation arrays

YAML relation arrays create typed edges in the knowledge graph:

```yaml
# In a word file
characters:
  - CH0001
components:
  - CMP0001

# In a lesson file
words:
  - W0001
  - W0002
```

All IDs in relation arrays must resolve to existing entries. The validator catches dangling references.

---

## Markdown Extensions

Three custom extensions are supported. No others. Full syntax reference is in `STYLE_GUIDE.md`.

### Wiki-links

```
[[W0001]]
[[W0001|display text]]
```

Creates a hyperlink to the target entry. Creates a `wiki-link` edge in the graph. Renders as raw `[[W0001]]` text if the ID does not exist (and the validator reports an error).

### Audio buttons

```
{{audio:我是加拿大人。}}
```

Renders a 🔊 button that speaks the text via the Web Speech API (`lang: zh-CN`).

### Atlas notes

```
{{atlas-note}}
Content here.
{{/atlas-note}}
```

Renders a highlighted callout box for pedagogical observations.

---

## Build Pipeline

Run with `npm run build`. Aborts on validation errors.
Run with `npm run build:warn` to continue past errors (for debugging).

```
npm run build
     │
     ▼
Stage 1  DISCOVER     atlas/ → string[]
         Walk atlas/, return sorted absolute file paths.

     ▼
Stage 2  PARSE        string[] → ParseResult
         Read each file. Extract YAML frontmatter and body.
         Validate required fields (id, type, status, title).
         Produce typed Entry objects. Files missing required
         fields become ParseFailure records and are skipped.

     ▼
Stage 3  VALIDATE     Entry[] → ValidationIssue[]
         Check all entries together:
           • Duplicate IDs
           • ID prefix / type mismatch (B prefix on type: word)
           • File name does not contain declared ID (warning)
           • [[wiki-links]] to non-existent IDs
           • YAML relation arrays to non-existent IDs
         Errors abort the build. Warnings are reported only.

     ▼
Stage 4  GRAPH        Entry[] → Graph
         Build the typed knowledge graph.
         Two sources of edges:
           • YAML relation arrays → typed edges (word→character, etc.)
           • [[wiki-links]] → wiki-link edges
         Deduplicates edges and builds forward/reverse adjacency maps.

     ▼
Stage 5  RENDER       Entry[], Graph → Map<source, html>
         Convert each entry's Markdown body to HTML via marked.
         Preprocess custom extensions (wiki-links, audio, atlas-note).
         Append typed relation sections from YAML metadata.
         Append backlink section from graph.incoming[id].

     ▼
Stage 6  OUTPUT       rendered map, entries, graph → docs/
         Write HTML pages.
         Write index pages (words/, characters/, components/, etc.)
         Write search-index.json (no absolute paths).
         Write statistics.json (includes version from package.json).
         Write graph.json (full typed graph export).
```

---

## Build Artifacts

All artifacts in `docs/` are generated. Never edit them manually.

| File | Description |
|------|-------------|
| `docs/{type}/{id}-slug.html` | One HTML page per entry |
| `docs/{type}/index.html` | Index page per entity type |
| `docs/search-index.json` | Flat array of all entries for search |
| `docs/statistics.json` | Entry counts + version + timestamp |
| `docs/graph.json` | Full typed knowledge graph (edges + adjacency maps) |

### `search-index.json` shape

```json
[
  {
    "id": "W0001",
    "type": "word",
    "hanzi": "是",
    "pinyin": "shì",
    "title": "The Character of Existence",
    "source": "atlas/words/W0001-是.md",
    "url": "/words/W0001-是.html",
    "linksTo": ["CH0001", "CMP0001"]
  }
]
```

### `graph.json` shape

```json
{
  "edges": [
    { "from": "W0001", "to": "CH0001", "kind": "word→character" },
    { "from": "W0001", "to": "CMP0001", "kind": "word→component" },
    { "from": "W0001", "to": "CH0001", "kind": "wiki-link" }
  ],
  "outgoing": { "W0001": ["CH0001", "CMP0001"] },
  "incoming": { "CH0001": ["W0001"] }
}
```

Edge kinds: `word→character`, `word→component`, `word→lesson`, `word→grammar`, `character→component`, `character→word`, `component→character`, `lesson→word`, `book→person`, `person→book`, `wiki-link`.

---

## Standalone Validator

```bash
npm run validate
```

Runs stages 1–3 only. No HTML output. Exits 0 if clean (or only warnings). Exits 1 on any error. Used in CI on every pull request separately from the build, so validation failures are visible as a distinct check.

---

## Type System

All types live in `engine/src/types.ts`.

Key types:

- `EntityType` — union of the 11 valid type strings
- `StatusValue` — `"draft" | "review" | "published"`
- `AnyMetadata` — discriminated union of per-type metadata interfaces
- `Entry` — fully parsed internal pipeline type (id, type, hanzi, pinyin, title, source, url, linksTo, metadata)
- `Graph` — typed knowledge graph (edges, outgoing, incoming)
- `GraphEdge` — single typed edge (from, to, kind)
- `ValidationIssue` — (severity, file, message)
- `SearchEntry` — flattened shape written to search-index.json (no filesystem paths)

`metaRecord(meta)` converts `AnyMetadata` to `Record<string, unknown>` for safe generic field access without type-unsafe casts.

The type checker runs with `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`. Run it with `npm run type-check`.

---

## CI / CD

Two GitHub Actions workflows:

**`.github/workflows/ci.yml`** — runs on every pull request and push to `main`:
1. `npm run type-check`
2. `npm run validate`
3. `npm run build`
4. Prints entry count and statistics to the workflow log

**`.github/workflows/deploy.yml`** — runs on push to `main` only:
1. Same three steps as CI
2. Deploys `docs/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`
3. GitHub Pages serves the `gh-pages` branch

PRs must pass CI before merging. Deployment is automatic on merge to `main`.

---

## Adding a New Entry

1. Allocate an ID:
   ```bash
   npm run next-id -- word
   # → W0002
   ```

2. Create the file:
   ```
   atlas/words/W0002-我.md
   ```

3. Write the YAML frontmatter and content following `WORD_TEMPLATE.md`.

4. Build and validate:
   ```bash
   npm run build
   ```

5. Fix any reported errors before committing.

---

## Knowledge Graph Design

Edges come from two sources and are combined in stage 4:

**YAML relation arrays** — typed, explicit, machine-readable. Use these for the structured relationships the engine understands (word→character, lesson→word, etc.).

**Wiki-links in content** — typed as `wiki-link`. Use these for prose cross-references where the relationship type is implicit or narrative.

Do not duplicate relationships: if `W0001` declares `characters: [CH0001]` in YAML, do not also write `[[CH0001]]` in the body unless there is a specific prose reason to link there. The YAML edge is sufficient for graph purposes.

Backlinks are computed from `graph.incoming` in stage 5 and rendered as a "Linked from" section at the bottom of every page.

The full graph is exported to `docs/graph.json` at every build. This is the foundation for future interactive visualisation, graph traversal, and semantic search.

---

## Future Architecture

Items planned but not yet implemented:

- **Pagefind** — replace the hand-rolled `search.js` with static sharded CJK-aware search
- **Incremental builds** — skip unchanged entries using content hashes; required at scale
- **AI embeddings** — generate and store embedding vectors per entry at build time
- **PDF / EPUB export** — derive from the same Markdown source
- **Language independence** — the engine design supports non-Chinese scripts without modification
