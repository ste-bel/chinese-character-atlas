# Chinese Character Atlas Specification

Version: 1.0 (Draft)

---

# Philosophy

The Atlas is a knowledge graph of the Chinese language.

Markdown is the single source of truth.

Generated artifacts are disposable.

---

# Source of Truth

Only the following directories contain canonical knowledge:

atlas/
assets/

Everything else can be regenerated.

---

# Stable IDs

Every entity receives a permanent identifier.

Word

W0001

Character

CH0001

Component

CMP0001

Lesson

L0001

Grammar

G0001

Book

B0001

Person

P0001

Topic

T0001

Idiom

I0001

IDs never change.

---

# File Naming

Words

W0001-是.md

Characters

CH0001-是.md

Components

CMP0001-日.md

Lessons

L0001.md

---

# YAML Metadata

Every page begins with metadata.

Minimum

id

type

title

status

Recommended

hanzi

pinyin

lesson

frequency

hsk

components

characters

related

sources

---

# Allowed Types

word

character

component

lesson

grammar

book

idiom

person

topic

history

pronunciation

---

# Generated Artifacts

The engine may generate

HTML

PDF

EPUB

JSON

Flashcards

Search indexes

Knowledge graphs

Statistics

AI embeddings

These are never edited manually.

---

# Relationships

Knowledge should be linked.

Never duplicate knowledge.

Use IDs.

---

# Audio

Every Chinese sentence should eventually support audio.

---

# Search

Everything should eventually be searchable by

Chinese

Pinyin

English

ID

Component

Stroke count

HSK

Frequency

Lesson

Topic

---

# Future

The Atlas should be language-independent.

The engine should eventually support:

Chinese

Japanese

Korean

Classical Chinese

Sanskrit

Latin

Greek

using the same architecture.

