# Changelog — Chinese Character Atlas

Each entry covers one session. Format: what changed, why, and what to do next.

---

## 2026-06-28 — Visual Identity Restoration + Frequency Badges

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
