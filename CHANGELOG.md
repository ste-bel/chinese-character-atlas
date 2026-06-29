# Changelog — Chinese Character Atlas

Each entry covers one session. Format: what changed, why, and what to do next.

---

## 2026-06-29 (Session 4) — Visual Excellence Sprint

Acceptance review (v0.2) scored architecture/engine highly but flagged the
visual experience: Infographic Fidelity 3/10, Museum Experience 5/10, Homepage
6/10, Typography 6.5/10. This sprint is experience-only — no architectural
refactor — and addresses all ten review priorities.

### What changed

**Design tokens & typography (P2, P10)**
- `assets/css/tokens.css`: added line-height, letter-spacing, reading-measure,
  and rhythm token families; enlarged the *reading* scale (base 17px, lh 1.8)
  while keeping UI chrome compact; roomier cards (pad 28 / gap 20 / radius 10).
- `assets/css/layout.css`, `theme.css`: 16px root, token-driven body type,
  generous `main` padding, prose constrained to `--measure`, larger h3/h4.
- New `DESIGN_TOKENS.md` — the flat token reference (single source of truth).

**Museum card grid (P1, P7)**
- New `engine/src/sections.ts`: fence-aware H2 splitter turns each section into
  a self-contained museum panel — crimson number circle + gold line-art icon +
  tracked title — stacked at a comfortable measure with generous rhythm.
  (Long-form content is stacked, not force-fit into a rigid poster grid, to
  protect reading width.) Title→icon/variant map; feature/quiet/warning cards.
- `05-render.ts`: uses `renderSectionedBody`; relations/backlinks adopt the
  same card structure. Retired the old flat h2 banner rule.

**Hero (P3)**
- `components.css`: entry banner enlarged — Hanzi `clamp(96–168px)` on a soft
  radial backdrop, taller banner, monumental WORD strip, enlarged crimson
  pinyin, roomier Quick Audio; reflows (stacks) under 720px.

**Atlas Notes (P8)**
- `markdown.ts`: note inner Markdown is now parsed (was opaque block HTML) and
  emitted with the diamond/label structure; restyled as a gilded manuscript
  aside — signature, instantly recognizable.

**Pinyin validation (P9)**
- New `engine/src/pinyin.ts` + stage 3: strict checks on `pinyin`/
  `author_pinyin` fields (numeric tones, stray markers, combining diacritics =
  errors) and a conservative body scan for numeric-tone pinyin (warnings).
  Existing content passes clean (0/0).

**Branding & homepage (P4, P5)**
- Homepage seal framed as a museum logo — radial halo, generous whitespace,
  aspect preserved. Logo (round seal) vs Author Signature (full composition,
  About page) separation confirmed.
- Homepage hero introduces a *civilization*: grand `clamp(64–104px)` title,
  evocative copy, frameless hairline stat ledger, "Enter the Atlas" → W0001.

**W0001 (P6)**
- Now the reference implementation end-to-end: hero, numbered museum cards,
  warning/feature/quiet variants, signature Atlas Notes, clean tables, museum
  footer. Verified desktop + mobile.

### What to do next
- Author Historical Evolution as the 5-stage `.evolution-grid` and examples as
  `.example-block` structures (CSS already exists) to deepen infographic
  fidelity — a content-shape pass, deferred per "don't add content yet."
- Apply the W0001 standard to one Character, one Component, and one Lesson page.

---

## 2026-06-28 (Session 3) — Museum Edition Sprint

### What changed

**`engine/src/templates.ts`**
- Header completely redesigned: gold shimmer top rule, taller identity block, animated hamburger mobile menu, navigation with hover-card style buttons
- Premium three-column footer: Fire Horse seal, two nav columns (Explore / Atlas), info column with description, author credit, license, GitHub link
- SEO meta tags: `og:title`, `og:description`, `og:type`, `twitter:card`, `twitter:title`, canonical URL
- Breadcrumb trail: auto-generated from entry type and lesson context (Home › Words › Lesson 1 › W0001)
- Mobile nav drawer: full-width animated drawer opens from hamburger

**`assets/css/layout.css`**
- Complete header redesign matching new HTML structure
- Sidebar sticky offset corrected to match actual header height
- Premium footer layout: three-column grid, responsive at 1000px/600px
- Breadcrumb styles
- Hamburger animation (lines rotate on open)

**`assets/css/components.css`**
- Discovery panels: `.panel-insight`, `.panel-culture`, `.panel-mistake`, `.panel-tip` — each with a distinct color identity
- Hero character component: `.hero-char` for large featured character display (homepage + future)
- Difficulty level indicators: `.difficulty-beginner`, `.difficulty-intermediate`, `.difficulty-advanced`
- Homepage two-column grid: `.home-grid`, `.home-main-col`, `.home-aside-col`
- CTA button: `.home-cta` with hover lift and shadow
- English subtitle below 漢字之美 on homepage

**`assets/css/theme.css`**
- Section h2 headers now render as full card-style: shadow, thicker left border (4px crimson), rounded corners — each section is visually framed

**`engine/src/stages/06-output.ts`**
- Homepage: Featured Character panel (是, with audio, pinyin, meaning, link)
- "Begin Exploring" CTA button
- "Chinese Character Atlas" English subtitle
- Two-column homepage grid (entry cards left, featured character right)

**`atlas/words/W0001-是.md`**
- Complete reference implementation, 14 full sections:
  Pronunciation (with tone change notes), Meaning (when NOT to use table), Examples (Beginner / Intermediate / Advanced with full breakdown), Questions (positive/negative/alternative forms), Grammar (4 patterns with common constructions table), Character Analysis (components with wiki-links), Historical Evolution (Oracle → Modern with narrative), Pronunciation in Depth (regional, historical), Modern Usage (formal/informal/internet), Common Mistakes (English/French/Spanish interference tables), Cultural Notes (Confucius quotation), Atlas Note, References (4 academic sources)
- Status changed: draft → published

### Why
The sprint mandate was "turn the Atlas into something people remember — not because it contains information, because it is beautiful." W0001 sets the reference standard for every future entry. The header and footer needed to feel like a museum entrance and exit, not a utility bar.

### Next recommended task
1. **Apply W0001 depth to W0002–W0005** — Each word needs the full treatment: grammar patterns, historical evolution, cultural notes. Start with 的 (W0002) and 我 (W0003).
2. **CH0001 — 是 character page** — Add the full character story: complete evolution grid (Oracle/Bronze/Seal/Clerical/Regular/Modern), stroke order, component breakdown linking CMP0001.
3. **Homepage "Atlas Philosophy" card** — Link to a new philosophy page or P0001 section about the Atlas mission.
4. **Search page styling** — Pagefind UI should match the parchment/crimson palette via CSS overrides.
5. **Component pages** — CMP0001 (日) and CMP0002 (人) deserve exploration-style pages showing all characters that use them.

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
