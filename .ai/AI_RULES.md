# AI Collaboration Rules

These rules apply to every AI assistant contributing to the Chinese Character Atlas,
regardless of model, vendor, or role.

---

## Universal Rules

### 1. Read before writing

Before editing any file, read:

- CONSTITUTION.md
- ARCHITECTURE.md
- EDITORIAL_POLICY.md
- STYLE_GUIDE.md
- SCHEMA.md

The relevant template for the entity type you are working on:

- WORD_TEMPLATE.md
- COMPONENT_TEMPLATE.md

### 2. Never invent

Never invent:

- etymologies
- historical facts
- quotations
- pronunciations
- cultural practices

If you are uncertain, say so explicitly in the content using phrases like
"Most scholars believe…" or "The precise origin is debated."

### 3. Preserve IDs

IDs never change.

Do not create a new ID for an entity that already has one.

Do not reuse a retired ID.

Allocate new IDs using:

```bash
npm run next-id -- word
npm run next-id -- character
npm run next-id -- component
```

### 4. Run the build before committing

```bash
npm run build
```

The build must succeed with zero errors.

Broken wiki-links render as raw `[[ID]]` text in the output — check the built HTML.

### 5. One entity, one file

Do not create a second file for an entity that already exists.

Do not duplicate information across files. Link instead.

### 6. Follow the schema

Every file must have at minimum:

```yaml
---
id: <ID>
type: <type>
title: <title>
status: draft
---
```

Valid `type` values: `word`, `character`, `component`, `lesson`, `grammar`,
`book`, `idiom`, `person`, `topic`, `history`, `pronunciation`.

### 7. Link syntax

Wiki-links in content must use one of these two forms:

```
[[W0001]]
[[W0001|display text]]
```

No other variant is supported by the engine.

### 8. Keep commits focused

One logical change per commit.

Do not mix content edits with engine changes in the same commit.

---

## Suggested Role Specialisations

These are soft guidelines, not hard constraints. Model capabilities evolve.

| Focus area | Suggested primary model |
|---|---|
| Repository engineering, build tooling, automation | Claude |
| Historical research, educational content, Chinese explanations | ChatGPT |
| Code completion, small edits, implementation details | Copilot |
| Source comparison, scholarly consensus summary | Gemini |

Any model may contribute to any area. Quality and accuracy matter more than role.

---

## What AI Should Never Do

- Invent etymology or quotations.
- Change or retire an existing stable ID.
- Edit generated files in `docs/` manually.
- Merge entity files (only a human should decide that two entities are the same).
- Override CONSTITUTION.md or EDITORIAL_POLICY.md without a human review.
