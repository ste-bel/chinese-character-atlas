# Chinese Character Atlas — Design Tokens

The single source of truth for every spacing, colour, type, radius, shadow, and
motion decision in the Atlas. Tokens are declared once in
[`assets/css/tokens.css`](assets/css/tokens.css) as CSS custom properties on
`:root` and consumed everywhere else. **No component file may hard-code a value
that a token already expresses.**

> Relationship to the other design docs:
> [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) explains *why* each value exists (it is
> derived from the authoritative infographic). This file is the *flat reference*
> — the list a developer scans while writing CSS. [`ATLAS_BIBLE.md`](ATLAS_BIBLE.md)
> §7 names the infographic as the final tie-breaker.

---

## How to use

```css
.thing {
  padding: var(--card-pad);
  border-radius: var(--card-radius);
  font-size: var(--text-base);
  line-height: var(--lh-base);
  box-shadow: var(--shadow-card);
}
```

If you need a value that no token provides, **add the token first**, document it
here, then use it. This keeps the system coherent as the Atlas grows toward
100,000 entries.

---

## Colour

### Paper (backgrounds)
| Token | Hex | Use |
|-------|-----|-----|
| `--paper` | `#F5EDD6` | Main page background |
| `--paper-warm` | `#EDE0C4` | Sidebar, code, inset panels |
| `--paper-card` | `#FFFEF6` | Cards, content panels |
| `--paper-dark` | `#E2D2B0` | Footer, deeply nested panels |

### Crimson
| Token | Hex | Use |
|-------|-----|-----|
| `--crimson-header` | `#7A1515` | Header bar, banner label strip |
| `--crimson-bar` | `#4A0808` | Bottom bar, darkest sections |
| `--crimson` | `#8B1A1A` | Section circles, active states |
| `--crimson-mid` | `#A32020` | Hover, links |
| `--crimson-bright` | `#C0392B` | Emphasis, warning accent |

### Gold
| Token | Hex | Use |
|-------|-----|-----|
| `--gold-rule` | `#C0A040` | Rules, decorative lines, Atlas Note border |
| `--gold-mid` | `#B88C28` | Border accents, secondary gold |
| `--gold-light` | `#D4AF5A` | Text on dark crimson |
| `--gold-pale` | `#E8D090` | Subtle highlights (`--gold-pale-rgb` for rgba) |

### Ink (text)
| Token | Hex | Use |
|-------|-----|-----|
| `--ink` | `#1A0E08` | Primary text, main hanzi |
| `--ink-mid` | `#3D2010` | Body copy |
| `--ink-light` | `#6B4423` | Captions, metadata, pinyin |
| `--ink-faint` | `#9B7A5A` | Placeholders, disabled |

### Borders & badges
| Token | Hex | Use |
|-------|-----|-----|
| `--border` | `#C9A97A` | Card borders, dividers |
| `--border-light` | `#DDC7A1` | Subtle inner dividers |
| `--border-warm` | `#B89060` | Emphasis / active borders |
| `--badge-hsk` | `#1A3A5C` | HSK level badge |
| `--badge-freq` | `#1A5E28` | Frequency badge |
| `--badge-essential` | `#145040` | Essential badge |
| `--badge-type` | `#5C3A00` | Entry-type badge |

---

## Typography

The infographic is a dense A4 poster. On screen the Atlas must **breathe**, so
the *reading* scale is enlarged from the poster's raw values while the *UI*
scale (labels, badges) stays compact. Two families of size token express this:
`--text-xs/--text-sm` drive chrome; `--text-base` and up drive prose.

### Font stacks
| Token | Stack |
|-------|-------|
| `--font-hanzi` | Noto Serif CJK SC → Source Han Serif CN → FangSong → STSong → serif |
| `--font-body` | Palatino Linotype → Palatino → Book Antiqua → Georgia → serif |
| `--font-ui` | Optima → Segoe UI → Helvetica Neue → Arial → sans-serif |
| `--font-mono` | Menlo → Consolas → Courier New → monospace |

### Size scale
| Token | Value | Use |
|-------|-------|-----|
| `--text-xs` | 11px | Badges, micro-labels |
| `--text-sm` | 13px | Captions, sidebar, metadata |
| `--text-base` | 17px | **Primary reading size** for body prose |
| `--text-md` | 19px | Lead paragraphs, example Chinese |
| `--text-lg` | 24px | Sub-heads, motto |
| `--text-xl` | 34px | Banner pinyin |
| `--text-2xl` | 44px | Card display hanzi |
| `--text-hanzi` | 104px | Standalone hero hanzi in prose |

Root is `16px`; the banner hanzi is sized independently in `components.css`
because it is the single most important visual element on a word page.

### Line height
| Token | Value | Use |
|-------|-------|-----|
| `--lh-solid` | 1 | Display hanzi, numerals |
| `--lh-tight` | 1.2 | Headings |
| `--lh-snug` | 1.45 | Short hanzi lines, captions |
| `--lh-base` | 1.8 | Body reading rhythm |
| `--lh-relaxed` | 1.95 | Atlas Notes, lead prose |

### Letter spacing
| Token | Value | Use |
|-------|-------|-----|
| `--ls-tight` | −0.01em | Large hanzi |
| `--ls-normal` | 0.01em | Body text |
| `--ls-wide` | 0.08em | Badges |
| `--ls-wider` | 0.12em | Navigation |
| `--ls-widest` | 0.15em | Card section titles |
| `--ls-mega` | 0.28em | English overline subtitles |

### Reading measure
| Token | Value | Use |
|-------|-------|-----|
| `--measure` | 68ch | Comfortable max line length for prose |
| `--measure-wide` | 80ch | Full-width cards (tables, examples) |

---

## Spacing

4px base unit. Use the scale; avoid arbitrary pixel values.

| Token | Value | | Token | Value |
|-------|-------|---|-------|-------|
| `--sp-1` | 4px | | `--sp-10` | 40px |
| `--sp-2` | 8px | | `--sp-12` | 48px |
| `--sp-3` | 12px | | `--sp-16` | 64px |
| `--sp-4` | 16px | | `--sp-20` | 80px |
| `--sp-5` | 20px | | `--sp-24` | 96px |
| `--sp-6` | 24px | | | |
| `--sp-8` | 32px | | | |

### Rhythm (vertical gaps between sections/cards)
| Token | Value | Use |
|-------|-------|-----|
| `--rhythm` | 28px | Gap between stacked cards |
| `--rhythm-loose` | 40px | Gap around full-width feature cards |

---

## Layout

| Token | Value | Use |
|-------|-------|-----|
| `--sidebar-w` | 200px | Lesson / atlas sidebar width |
| `--content-max` | 1120px | Header, footer, page max width |
| `--header-h` | 56px | Header height reference |
| `--bottom-bar-h` | 44px | Sticky bottom bar height |

---

## Cards, badges, shapes

| Token | Value | Use |
|-------|-------|-----|
| `--card-radius` | 10px | Card / panel corner radius |
| `--card-gap` | 20px | Gap in card grids |
| `--card-pad` | 28px | Card interior padding |
| `--badge-radius` | 4px | Badge corner radius |
| `--section-circle` | 24px | Numbered section circle diameter |

---

## Shadows & motion

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-card` | `0 2px 8px rgba(74,38,10,.07)` | Resting card |
| `--shadow-hover` | `0 4px 16px rgba(74,38,10,.13)` | Hovered card |
| `--shadow-seal` | `drop-shadow(0 2px 6px rgba(0,0,0,.45))` | Logo seal |
| `--ease` | `150ms ease` | All hover transitions |

Motion stays restrained per `DESIGN_SYSTEM.md` § Motion: opacity and
border-colour only, no bounce, content arrives complete.

---

## Changing a token

1. Edit the value in `assets/css/tokens.css`.
2. Update the row in this file.
3. Run `npm run build` and review the affected pages.
4. If the change contradicts the infographic, it must be justified in
   `DESIGN_SYSTEM.md` — the infographic is the tie-breaker.
