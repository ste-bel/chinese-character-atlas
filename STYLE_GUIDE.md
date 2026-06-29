# Chinese Character Atlas — Writing Style Guide

## Purpose

This document defines how every page should be written.

The goal is consistency, clarity, historical accuracy, and readability.

---

# General Style

Write for intelligent beginners.

Assume curiosity, not prior knowledge.

Explain concepts clearly without oversimplifying.

Whenever possible, tell the story behind the language.

---

# English

Use clear modern English.

Avoid unnecessary academic jargon.

If a technical linguistic term is required, explain it.

---

# Chinese

Chinese must always be written in Simplified Chinese.

Traditional forms should be shown only when relevant.

---

# Pinyin

Always include tone marks.

Correct:

shì

Incorrect:

shi4

---

# Translation Order

Always use this order.

Chinese

Pinyin

Natural English

Literal English

Example:

我是加拿大人。

Wǒ shì Jiānádà rén.

I am Canadian.

Literal:
I / am / Canada / person.

---

# Definitions

Begin with the most common meaning.

Then list secondary meanings.

Example:

要

Primary:

to want

Secondary:

need

going to

must

---

# Historical Notes

Separate facts from theories.

Good:

"Most scholars believe..."

Avoid:

"This certainly means..."

---

# Cultural Notes

Explain cultural context without making assumptions.

Whenever possible explain

- why
- when
- where

instead of simply stating facts.

---

# Pronunciation Notes

Explain pronunciation difficulties.

Example

x

is not pronounced like English x.

zh

is different from j.

---

# Common Mistakes

Every important word should include mistakes commonly made by English speakers.

Example:

❌ 我是很好。

✅ 我很好。

Explain why.

---

# Mnemonics

A mnemonic should help memory.

It should never replace historical truth.

If history and memory differ, clearly separate them.

---

# Sources

Whenever possible reference:

- dictionaries
- historical works
- classical texts
- linguistic research

Do not invent quotations.

---

# Images

Images should support learning.

Prefer:

- historical scripts
- diagrams
- component breakdowns
- maps
- timelines

Avoid decorative images that add no educational value.

---

# Audio

Every Chinese sentence should eventually have audio.

---

# Tone

Friendly.

Curious.

Respectful.

Historically careful.

Never sensational.


---

# Atlas Markdown Extensions

The Atlas uses standard CommonMark with three custom extensions.
No other custom syntax is supported.

---

## 1. Wiki-Links — `[[ID]]` and `[[ID|label]]`

Use wiki-links to create cross-references between atlas entries.

**Syntax:**

```
[[W0001]]
[[W0001|label text]]
```

**Rules:**

- The ID must be a valid stable identifier (W0001, CH0001, CMP0001, etc.).
- If no label is given, the engine renders the entry's ID + hanzi + title.
- If the ID does not exist, the link renders as literal `[[W0001]]` text and the build reports a validation error.
- Wiki-links in content create graph edges of kind `wiki-link`.
- For typed graph edges (word→character, lesson→word), use YAML relation arrays instead.

**Examples:**

```markdown
See [[CH0001]] for the full character history.

The component [[CMP0001|日]] appears in over a hundred common characters.
```

---

## 2. Audio Buttons — `{{audio:text}}`

Renders an inline 🔊 button that speaks the given Chinese text using the Web Speech API.

**Syntax:**

```
{{audio:Chinese text here}}
```

**Rules:**

- The text between `audio:` and `}}` is spoken verbatim.
- Always place the audio button immediately before the Chinese text it covers.
- One button per sentence or phrase.
- Do not nest custom syntax inside the audio tag.

**Examples:**

```markdown
{{audio:我是加拿大人。}}
我是加拿大人。
*Wǒ shì Jiānádà rén.*
I am Canadian.
```

---

## 3. Atlas Notes — `{{atlas-note}}...{{/atlas-note}}`

Renders a highlighted callout box for pedagogical notes, learning tips,
or important clarifications that sit outside the main prose.

**Syntax:**

```
{{atlas-note}}
Your note content here.
{{/atlas-note}}
```

**Rules:**

- Content inside the tags is rendered as HTML (no nested Markdown headers).
- Use for learning observations, not for factual corrections.
- Do not nest other custom extensions inside atlas-note.
- One atlas-note per major section at most.

**Examples:**

```
{{atlas-note}}
English uses "to be" everywhere. Chinese uses 是 more selectively.
Learning when **not** to use 是 is as important as learning when to use it.
{{/atlas-note}}
```

---

## Syntax Not Supported

Do not invent new syntax. Unsupported patterns are passed through as literal text
or silently dropped. If you need a new rendering behaviour, open an issue or
propose an engine change — do not embed undocumented syntax in content files.

