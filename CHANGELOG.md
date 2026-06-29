# Changelog — Chinese Character Atlas

Each entry covers one session. Format: what changed, why, and what to do next.

---

## 2026-06-28 (Session 2) — Design System, Two-Mark Branding, Museum Homepage

### What changed
- **`ATLAS_BIBLE.md`** — Master project reference doc. Defines two-mark branding rule, quality standard, editorial philosophy.
- **`DESIGN_SYSTEM.md`** — Full design language extracted from infographic: color tokens, type scale, spacing scale, card anatomy, badge specs, motion rules.
- **`assets/css/`** — CSS refactored from monolithic `style.css` into four-layer architecture:
  - `tokens.css` — All CSS custom properties (colors, fonts, spacing, shadows)
  - `layout.css` — Page structure, lesson sidebar, responsive breakpoints
  - `components.css` — Cards, banners, badges, entry banner, atlas-note, evolution grid, homepage hero
  - `theme.css` — Base typography, CSS counters for h2, index grid, relation sections
  - `style.css` — Now just four `@import` statements
- **`assets/images/logo/fire-horse-seal.png`** — 512px round seal, cropped from source artwork (top 725px only, cream background fill). Logo only — never used in the author signature context.
- **`assets/images/logo/fire-horse-seal-64.png`** — 64px header version.
- **`assets/images/signature/bai-lang-zhiyuan-signature.png`** — Full poster composition, 900px wide. Author page only.
- **`engine/src/config.ts`** — `BASE` constant added; single source of truth for `/chinese-character-atlas` deployment path.
- **`engine/src/navigation.ts`** — Deleted (dead code; never imported; inline nav already in templates.ts).
- **`engine/src/templates.ts`** — Full rewrite: round logo in header at 40×40; `renderEntryBanner()` differentiates word vs character; all paths use `${BASE}`; About link points to P0001.
- **`engine/src/stages/05-render.ts`** — `stroke_count` passed into PageContext; all paths use `${BASE}`.
- **`engine/src/stages/06-output.ts`** — Index pages render as `.index-grid` card layouts; homepage rebuilt as museum hero with seal, 漢字之美, motto, statistics strip, and entry-point cards.
- **`atlas/people/P0001-stephane-belanger.md`** — New About/Author page: name etymology, Fire Horse zodiac, Zhuge Liang motto, full signature composition image.

### Why
Creative Director mandate: transform the Atlas into a premium visual experience matching the infographic design reference. The prior CSS was a single large file with no design token discipline. The new four-layer system allows consistent theming across all generated pages. Two-mark branding separates the round seal (logo) from the full composition (author signature) — these serve different contexts and must never be interchanged.

### Next recommended task
1. **W0001 content enrichment** — Add `[[CH0001]]` and `[[CMP0001]]` wiki-links in prose; add pronunciation tone guidance for English speakers.
2. **CH0001 and CMP0001 cross-links** — Replace plain text "Related Words: W0001" with `[[W0001]]`; replace "CMP0001 — 日" with `[[CMP0001]]`.
3. **Search page styling** — Pagefind's default UI should be wrapped in the crimson/parchment palette via `pagefind-ui` CSS overrides.
4. **Clean up `assets/images/seals/`** — Old 91KB seal file superseded by the new `logo/` and `signature/` assets.
5. **Lesson 2** — W0021–W0040 would exercise sidebar prev/next navigation across lessons.

---

## 2026-06-28 (Session 1) — Visual Identity Restoration + Frequency Badges

### What changed
- **`assets/css/style.css`** — Complete rewrite. Implements the infographic design reference:
  - Crimson/gold header with 漢字之美 title and 64px Fire Horse seal (drop-shadow, no crop)
  - Two-column layout: parchment `<aside class="sidebar">` + `<main>`
  - Lesson sidebar: scrollable word list with active highlight, prev/next buttons, atlas quote
  - Word banner: dark-red "WORD N" label, large hanzi (5 rem), pinyin, badges, quick-audio panel
  - Numbered section headers via CSS counter (auto-incremented red circle badges)
  - Sticky bottom bar: audio toggle, jump-to-word input, back-to-top
  - Responsive collapse at 800 px and 520 px
- **`engine/src/templates.ts`** — Full rewrite:
  - New interfaces: `SidebarItem`, `LessonSidebar`, `PageContext`
  - Helpers: `freqLabel()`, `renderSidebar()`, `renderWordBanner()`
  - `page()` now emits complete two-column layout with all new sections
  - Frequency badge now shows `1 / N` proportion (rank over 2,000 common words) instead of tier labels like "Very High Frequency". Example: rank 1 → `1 / 2,000`, rank 20 → `1 / 100`
- **`engine/src/stages/05-render.ts`** — Full rewrite:
  - `buildLessonSidebar()`: finds which lesson owns a word entry, builds word list with active state, computes prev/next URLs
  - `render()` passes full `PageContext` (lesson, hsk, frequency_rank, wordIndexInLesson, sidebar)
- **`engine/src/navigation.ts`** — Updated to emit vertical `<nav class="sidebar-nav">` used by non-lesson pages
- **`assets/js/atlas.js`** — New file: `toggleAudio()` and `jumpToWord()` for the bottom bar
- **`assets/images/seals/bai-lang-zhiyuan-fire-horse-seal.png`** — Real Fire Horse emblem (200×200 px, 93 KB) copied from the supplied ZIP asset

### Why
The site was technically functional but looked like a generic documentation page. The goal is a modern Chinese encyclopedia / digital museum aesthetic — crimson, gold, parchment, seal — matching the infographic design reference provided by the user.

Frequency labels were replaced with proportions because `"Very High Frequency"` is vague; `1 / 100` is precise and immediately meaningful to a learner.

### Next recommended task
1. **Homepage** — the index page currently renders as a generic entry list. It should feel like an atlas landing page: Fire Horse seal hero, project motto, entry-point cards (Words · Characters · Components · Lessons · Search), and a short "About this atlas" blurb.
2. **Search page styling** — Pagefind's default UI clashes with the new theme; wrap it in the same crimson/parchment palette.
3. **More word entries** — Only W0001–W0020 exist. Lesson 2 (W0021–W0040) would exercise the sidebar's prev/next navigation across lessons.
4. **Character and component pages** — `CH` and `CMP` entries don't yet have a banner equivalent; consider a `character-banner` variant showing stroke count, radical, and Unicode codepoint.
