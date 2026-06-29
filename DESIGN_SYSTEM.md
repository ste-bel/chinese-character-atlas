# Chinese Character Atlas — Design System

This system *began* by observing the origin infographic — but the infographic
was training wheels, not the ceiling. These values are now the Atlas's **own**
design language, free to evolve beyond their origin toward a museum identity the
poster only hinted at. See `DESIGN_TOKENS.md` for the flat token reference.

---

## Color Palette

### Background tones

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--paper`           | `#F5EDD6` | Main page background                   |
| `--paper-warm`      | `#EDE0C4` | Sidebar background                     |
| `--paper-card`      | `#FFFEF6` | Card backgrounds, content panels       |
| `--paper-dark`      | `#E2D2B0` | Footer, deeply nested panels           |

### Crimson family

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--crimson-header`  | `#7A1515` | Site header bar                        |
| `--crimson-bar`     | `#4A0808` | Bottom bar, very dark sections         |
| `--crimson`         | `#8B1A1A` | Section counter circles, active states |
| `--crimson-mid`     | `#A32020` | Hover states, word banner label        |
| `--crimson-bright`  | `#C0392B` | Emphasis text, warning icons           |

### Gold family

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--gold-rule`       | `#C0A040` | Horizontal rules, decorative lines     |
| `--gold-mid`        | `#B88C28` | Border accents, secondary gold         |
| `--gold-light`      | `#D4AF5A` | Text on dark crimson backgrounds       |
| `--gold-pale`       | `#E8D090` | Subtle gold tint for highlights        |

### Ink family

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--ink`             | `#1A0E08` | Primary text, main Chinese characters  |
| `--ink-mid`         | `#3D2010` | Secondary text, body copy              |
| `--ink-light`       | `#6B4423` | Tertiary text, metadata, captions      |
| `--ink-faint`       | `#9B7A5A` | Placeholder text, disabled states      |

### Border family

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--border`          | `#C9A97A` | Card borders, main dividers            |
| `--border-light`    | `#DDC7A1` | Subtle dividers, inner card sections   |
| `--border-warm`     | `#B89060` | Emphasis borders, active cards         |

### Badge colors (observed from infographic)

| Token               | Hex       | Use                                    |
|---------------------|-----------|----------------------------------------|
| `--badge-hsk`       | `#1A3A5C` | HSK level badge (dark navy)            |
| `--badge-freq`      | `#1A5E28` | Frequency badge (forest green)         |
| `--badge-essential` | `#145040` | Essential badge (dark teal)            |
| `--badge-type`      | `#5C3A00` | Entry type badge (dark amber)          |

---

## Typography

### Font stack

```css
--font-hanzi:  "Noto Serif CJK SC", "Source Han Serif CN", "FangSong", "STSong", serif;
--font-body:   "Palatino Linotype", "Palatino", "Book Antiqua", Georgia, serif;
--font-ui:     "Optima", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--font-mono:   "Menlo", "Consolas", "Courier New", monospace;
```

### Type scale (observed from infographic)

| Role                       | Size      | Weight | Style  | Font       |
|----------------------------|-----------|--------|--------|------------|
| Word banner hanzi          | 96px      | 400    | normal | --font-hanzi |
| Site title (漢字之美)       | 24px      | 600    | normal | --font-hanzi |
| Sidebar hanzi              | 18px      | 400    | normal | --font-hanzi |
| Card hanzi (components)    | 40px      | 400    | normal | --font-hanzi |
| History evolution hanzi    | 32px      | 400    | normal | --font-hanzi |
| Word banner pinyin         | 28px      | 400    | italic | --font-body |
| Body text                  | 14px      | 400    | normal | --font-body |
| Card title                 | 11px      | 700    | normal | --font-ui  |
| Navigation labels          | 11px      | 600    | normal | --font-ui  |
| Badge text                 | 10px      | 700    | normal | --font-ui  |
| Sidebar word ID            | 11px      | 700    | normal | --font-ui  |
| Sidebar pinyin             | 11px      | 400    | italic | --font-body |

### Letter-spacing rules

- Card section titles: `0.15em` (heavily tracked)
- Navigation: `0.12em`
- Badges: `0.08em`
- Site title subtitle: `0.25em`
- All body text: `0.01em` (barely tracked)

---

## Spacing System

All values derived from the infographic grid.

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### Component-specific spacing

| Component              | Value            |
|------------------------|------------------|
| Card padding           | `20px`           |
| Card gap (grid)        | `14px`           |
| Sidebar padding        | `10px 12px`      |
| Header padding         | `0 20px`         |
| Banner padding         | `0` (structured) |
| Section circle size    | `24px`           |
| Badge padding          | `3px 8px`        |
| Bottom bar padding     | `8px 20px`       |

---

## Layout

### Dimensions

```
--sidebar-width:   200px
--content-max:    1120px
--header-height:   56px
--banner-height:  120px
--bottom-bar-height: 44px
```

### Grid structure

The infographic shows a strict two-column card grid for most sections:

```
[ Word Banner — full width ]
[ Card 1  ] [ Card 2  ]
[ Card 3  ] [ Card 4  ]
[ Card 5 — full width (Historical Evolution) ]
[ Card 6  ] [ Card 7  ]
```

Card grid: `repeat(2, 1fr)` with `14px` gap.
Full-width cards span both columns.

---

## Cards

The card is the primary unit of information in the Atlas.

### Anatomy

```
┌─────────────────────────────────────────────┐
│ ● N   🔷 SECTION TITLE                      │
│ ─────────────────────────────────────────── │
│                                             │
│  Content...                                 │
│                                             │
└─────────────────────────────────────────────┘
```

- **Number circle:** 24px diameter, `--crimson` background, white text, bold
- **Icon:** 16px, line-art, monochrome, inline with title
- **Title:** 11px, uppercase, `0.15em` tracking, `--font-ui`, `--ink-mid`
- **Rule under header:** 1px solid `--border-light`

### Card visual properties

```css
background:    var(--paper-card);
border:        1px solid var(--border);
border-radius: 8px;
padding:       20px;
box-shadow:    0 2px 8px rgba(74, 38, 10, 0.07);
```

### Card variants

**Normal card:** as above
**Warning card (Common Mistakes):** left border 3px `--crimson-bright`, badge uses crimson
**Atlas Note:** left border 4px `--gold-rule`, background `--gold-pale` at 30% opacity

---

## Word Banner

The banner is the hero of every word/character page.

### Structure (left to right)

```
[ CRIMSON STRIP ] [ HANZI + AUDIO ] [ PINYIN + BADGES ] [ QUICK AUDIO ]
```

1. **Crimson strip** (~60px wide)
   - Background: `--crimson-header`
   - "WORD" — 9px, white, uppercase, `0.2em` tracking
   - "N" — 32px, white, bold (word number in lesson)

2. **Hanzi block** (flex, centered)
   - Character: 96px, `--ink`, `--font-hanzi`
   - Audio button inline below or beside

3. **Info block** (flex-grow: 1)
   - Pinyin: 28px, italic, `--ink-light`, `--font-body`
   - Badges row: HSK, Frequency, type
   - Metadata row: Stroke count, Radical (smaller, `--ink-faint`)

4. **Quick Audio panel** (~160px wide)
   - Separated by `--border-light` left border
   - Title: "QUICK AUDIO" — 10px, uppercase, `--crimson`, tracked
   - Rows: character + speaker / pinyin + speaker / example + speaker

---

## Sidebar (Lesson)

```
┌────────────────────┐
│ LESSON N           │  ← crimson bg, white text
│ The Title Here     │  ← smaller, gold-tinted
├────────────────────┤
│ 1  是  shì     ●  │  ← active (crimson)
│ 2  的  de         │
│ 3  我  wǒ         │
│ ...               │
├────────────────────┤
│ ← Previous         │
│      Next →        │
│    All Lessons     │
├────────────────────┤
│ "Learning a        │
│  character is      │
│  discovering       │
│  a piece of        │
│  history."         │
└────────────────────┘
```

- Background: `--paper-warm`
- Item height: ~36px
- Active item: `--crimson` background, white text
- ID column: 32px wide, right-aligned, `--ink-faint`
- Hanzi column: 22px wide, `--font-hanzi`
- Pinyin: italic, small, `--ink-light`

---

## Header

```
[ Seal logo ] [ 漢字之美 ]  [ tagline ]  [ HOME  INDEX  SEARCH  ABOUT ]
```

- Background: linear-gradient(`--crimson-header` → `--crimson-bar`)
- Height: 56px
- Gold rule line at bottom: 2px solid `--gold-rule`
- Logo: 40px × 40px, drop-shadow
- Site title: 22px, `--font-hanzi`, `--gold-light`
- Subtitle: 9px, uppercase, `0.25em` tracking, `--gold-light` at 60% opacity
- Tagline: 11px, italic, `--gold-light` at 50% opacity
- Nav items: icon above label, 10px uppercase, `--gold-light`

---

## Bottom Bar

- Background: `--crimson-bar`
- Gold rule line at top: 2px solid `--gold-rule`
- Height: 44px
- All text/buttons: `--gold-light` or white
- Buttons: subtle border, no fill (ghost style on dark bg)

---

## Badges

Pill-shaped. All uppercase. Font: `--font-ui` 10px bold.

```css
padding:       3px 10px;
border-radius: 4px;        /* slightly rounded, not pill — matches infographic */
font-size:     10px;
font-weight:   700;
letter-spacing: 0.08em;
text-transform: uppercase;
```

---

## Historical Evolution Timeline

Full-width card. Shows 5 stages of character evolution.

Each stage:
- Script name: 10px, uppercase, `--crimson`, bold
- Date: 10px, `--ink-faint`
- Character image: 32–40px, `--font-hanzi` or image
- Caption: 11px, italic, `--ink-light`

Layout: 5 equal columns, centered, with thin vertical rules between.

---

## Atlas Notes

Signature feature. Must be visually distinctive without being garish.

```
╔══════════════════════════════════════════════════╗
║  ◆ ATLAS NOTE                                    ║
║                                                  ║
║  Content here. Pedagogically important           ║
║  observation that the learner must not miss.     ║
╚══════════════════════════════════════════════════╝
```

```css
border:           1px solid var(--gold-rule);
border-left:      4px solid var(--gold-rule);
border-radius:    8px;
background:       linear-gradient(135deg, rgba(var(--gold-pale-rgb), 0.25), transparent);
padding:          20px 24px;
```

Header:
- Diamond (◆) in `--gold-rule` color
- "ATLAS NOTE" in 10px uppercase, `0.15em` tracking, `--gold-mid`

---

## Icon System

The infographic uses simple line-art icons (~16–18px) next to every section title.

Each icon type:
- 📖 / book shape — Meaning & Usage
- ⬡ / geometry — Character Composition
- ⌛ / timeline — Historical Evolution
- ⛰ / landscape — Cultural Significance
- 💡 / bulb — Mnemonic
- ⚠ / triangle — Common Mistakes
- 📝 / text — Examples
- 🔗 / link — Related Words
- ← — Links to Previous Words

Implementation: Unicode characters styled with CSS, not image files.
Color: `--ink-mid`. Size: 14px.

---

## Motion

The infographic is static. Motion in the Atlas should be:

- **Hover transitions:** 150ms ease, opacity and border-color only
- **No bounce, no elastic, no dramatic transforms**
- **Audio button:** pulse once on click (subtle ring expand)
- **Page load:** no animation — the content arrives complete

---

## Responsive

The infographic is desktop-first (single-page, rich layout).

Mobile strategy:
- Sidebar collapses to horizontal strip (lesson indicator + prev/next)
- Word banner stacks vertically (WORD N / hanzi / pinyin / badges)
- Card grid collapses to single column
- Bottom bar simplifies (fewer buttons visible)
- Typography scales DOWN slightly (not UP — generous spacing stays)
- No feature removed — only layout reflows
