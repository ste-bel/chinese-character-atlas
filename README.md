# Chinese Character Atlas

An interactive encyclopedia of Chinese language, characters, history, culture, pronunciation, and usage.

**By Stéphane Bélanger (白朗志远)**

[![Content: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Engine: MIT](https://img.shields.io/badge/Engine-MIT-blue.svg)](LICENSE)

---

## Goal

Learn Chinese through:
- common words
- character origins
- components and radicals
- historical scripts
- examples with audio
- modern usage
- regional differences
- classical references
- cross-linked knowledge

---

## Structure

- `atlas/words` — word entries, W0001, W0002…
- `atlas/characters` — individual character pages
- `atlas/components` — radicals/components like 日, 女, 木
- `atlas/lessons` — 20-word learning paths
- `atlas/books` — classical and modern references
- `assets` — CSS, JavaScript, images, audio
- `engine` — static site generator
- `docs` — published website (GitHub Pages)

---

## Build

```bash
npm install
npm run build:full   # build HTML + generate search index
npm run validate     # check content schema without building
npm run type-check   # TypeScript type check
```

See [BUILD.md](BUILD.md) for full instructions.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CONSTITUTION.md](CONSTITUTION.md).

Every character tells a story. Every story opens a civilization.

---

## License

**Engine** (all code in `engine/`, `scripts/`, configuration files):
MIT License — © 2026 Stéphane Bélanger (白朗志远). See [LICENSE](LICENSE).

**Content** (all files in `atlas/`, `assets/`):
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International —
© 2026 Stéphane Bélanger (白朗志远). See [LICENSE-CONTENT](LICENSE-CONTENT).

You may share and adapt the content for non-commercial purposes with attribution.
Derivatives must carry the same license.
