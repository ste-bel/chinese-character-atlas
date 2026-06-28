# Chinese Character Atlas — Build Guide

## Purpose

This document explains how to build, develop, and publish the Chinese Character Atlas.

---

# Prerequisites

Install:

- Git
- Node.js 22 or later
- npm

Verify:

```bash
node --version
npm --version
git --version
```

---

# Clone

```bash
git clone https://github.com/ste-bel/chinese-character-atlas.git
cd chinese-character-atlas
```

---

# Install

```bash
npm install
```

---

# Build

```bash
npm run build
```

The build reads:

```
atlas/
```

and generates:

```
docs/
```

---

# Publish

Simply push to GitHub.

GitHub Pages publishes the contents of:

```
docs/
```

---

# Repository Layout

```
atlas/
    words/
    characters/
    components/
    lessons/
    grammar/
    books/
    idioms/
    people/
    topics/

engine/
    src/

templates/

assets/

docs/
```

---

# Build Pipeline

```
Markdown

↓

Read YAML

↓

Resolve links

↓

Resolve relations

↓

Generate backlinks

↓

Generate search index

↓

Generate statistics

↓

Generate HTML

↓

docs/
```

---

# Engine

The engine is responsible for:

- Markdown parsing
- Metadata
- Navigation
- Search index
- Statistics
- Cross-links
- Backlinks
- HTML generation

The Atlas itself never contains HTML.

Markdown is the single source of truth.

---

# Adding a Word

1. Create

```
atlas/words/Wxxxx-汉字.md
```

2. Fill YAML metadata.

3. Write the page.

4. Run

```bash
npm run build
```

5. Commit.

---

# Adding a Character

Create

```
atlas/characters/CHxxxx-汉字.md
```

Run build.

---

# Adding a Component

Create

```
atlas/components/CMPxxxx-部件.md
```

Run build.

---

# Quality Checklist

Before committing:

- Build succeeds
- Links work
- Search index generated
- Statistics updated
- No broken references

---

# Long-Term Goal

The Atlas Engine should eventually generate:

- Website
- PDF
- EPUB
- Flashcards
- JSON API
- AI embeddings
- Mobile application data

from the same Markdown source.

