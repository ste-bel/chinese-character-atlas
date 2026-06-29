# Chinese Character Atlas — Master Reference Bible

> Every character tells a story. Every story opens a civilization.

This document is the single authoritative reference for anyone working on the
Chinese Character Atlas — human or AI. Read it before touching anything.

---

## 1. Identity

**Name:** Chinese Character Atlas
**Chinese name:** 漢字之美 (Hànzì zhī měi — The Beauty of Chinese Characters)
**Tagline:** A Journey Through Language, History & Culture
**Motto:** Every character tells a story. Every story opens a civilization.

---

## 2. What This Is

The Chinese Character Atlas is not a vocabulary list.
It is not a flashcard app.
It is not a dictionary.

It is a long-form, illustrated, cross-referenced encyclopedia of the Chinese
language — its words, characters, history, culture, pronunciation, and usage.
Every page should feel like a museum exhibit that happens to be interactive.

---

## 3. Authorship

**Author:** Stéphane Bélanger
**Chinese name:** 白朗志远 (Bái Lǎng Zhì Yuǎn)
**Seal script:** 白朗志遠
**Meaning:** White / bright / pure · Open / cheerful · Aspiration / will · Far / long-term
**Chinese zodiac:** 丙午年 · Fire Horse (火马之人)
**Motto (from Zhuge Liang):** 非淡泊无以明志，非宁静无以致远。

---

## 4. Branding System

The Atlas has two official marks. They are never interchangeable.

### Mark 1 — Atlas Logo (Round Seal)

**File:** `assets/images/logo/fire-horse-seal.png`
**Use for:** site header, navigation, homepage hero, search page, favicon, app icon, GitHub avatar

The round seal is the identity of the Atlas itself. It is monumental, ancient,
and immediately recognizable. Use it wherever the Atlas must identify itself.

Never stretch it. Never crop it. Never add effects beyond a clean drop-shadow.

### Mark 2 — Author Signature (Full Composition)

**File:** `assets/images/signature/bai-lang-zhiyuan-signature.png`
**Use for:** About page, credits, PDF title page, book colophon, repository documentation

The full composition — Fire Horse, name characters, decorative framing, motto —
is a personal mark. It represents the author, not the Atlas.

Never use the signature as a navigation element. It is a colophon, not a logo.

---

## 5. Philosophy

### Hierarchy of concerns

1. **Accuracy** — no invented facts, no invented etymologies
2. **Beauty** — every page should feel handcrafted
3. **Depth** — connect everything, explain everything
4. **Scale** — every decision must work at 100,000 entries

### Content hierarchy on every page

1. Chinese character or hanzi — dominant, visual, large
2. Pinyin — supporting, italic, secondary size
3. English — explanatory, never dominant

Never invert this order.

---

## 6. Architecture

The engine transforms Markdown → HTML. That relationship is sacred.

- `atlas/` is the single source of truth
- `docs/` is generated output — never edit manually
- IDs never change (W0001, CH0001, CMP0001, L0001 …)
- One entity per file
- No duplicate information — link instead

---

## 7. Design Authority

The supplied infographic (stored at
`assets/images/reference/infographic.png`) is the authoritative visual
specification. Any ambiguity in CSS or layout is resolved by the infographic.

The infographic wins over any personal preference, any framework default,
and any AI-generated suggestion.

---

## 8. Quality Standard

Before any page is considered complete, ask:

> "Would I proudly show this to someone who owns a first-edition Cihai?"

If the answer is no, improve it.

The reference implementation is W0001 — 是.
Every future entry must meet or exceed that standard.

---

## 9. What Belongs Here

Every decision that would otherwise require re-reading the entire repository.

Do not add trivial implementation notes.
Add decisions that define the project's character.

---

## 10. Current Milestone

Phase 2 — Visual Excellence

W0001 is the reference implementation.
Every new page is measured against it.
The visual standard is set by the infographic.
Architecture changes are frozen until the visual standard is achieved.
