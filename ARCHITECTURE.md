# Chinese Character Atlas — Architecture

## Purpose

This document defines the technical architecture of the Chinese Character Atlas.

The goal is to ensure that the encyclopedia remains scalable, maintainable, and internally consistent as it grows.

---

# Directory Structure

```
content/
    lessons/
    words/
    characters/
    components/
    grammar/
    idioms/
    books/
    people/
    history/
    pronunciation/
    topics/

assets/
    css/
    js/
    images/
        seals/
        oracle/
        bronze/
        seal-script/
        regular/
    audio/

templates/

data/

docs/
```

---

# Types of Pages

## Lessons

Purpose:

Guide the learner through a structured sequence.

Example:

Lesson 1

contains

- W0001
- W0002
- ...
- W0020

---

## Words

A word is something that can be spoken.

Examples

中国

老师

学习

朋友

Every word has:

- pronunciation
- meaning
- examples
- usage
- links

---

## Characters

Characters explain individual Hanzi.

Examples

中

国

学

Each character includes:

- evolution
- construction
- components
- pronunciation
- history

---

## Components

Examples

日

木

心

女

口

Each component page contains:

- origin
- meaning
- historical development
- list of characters using it
- related components

---

## Grammar

Grammar explains how words work together.

Examples

- 是
- 把
- 被
- Measure words
- Aspect particles

---

## Idioms

Each idiom receives its own page.

Example

塞翁失马

Including

- story
- meaning
- usage
- cultural notes

---

## Books

Classical and modern references.

Examples

Dao De Jing

Analects

Dream of the Red Chamber

Journey to the West

---

## People

Historical figures.

Examples

Confucius

Laozi

Zhuge Liang

Xu Shen

---

# Metadata

Every page begins with YAML.

Example

```yaml
---
id: W0001
hanzi: 是
pinyin: shì
lesson: 1
status: draft
---
```

---

# Linking Rules

Every page should link to related pages whenever possible.

Examples

Word

↓

Character

↓

Component

↓

Book

↓

Historical figure

↓

Grammar

↓

Lesson

Knowledge should never exist in isolation.

---

# Images

Whenever possible include

- oracle script
- bronze inscription
- seal script
- regular script
- diagrams
- calligraphy

---

# Audio

Every Chinese sentence should eventually have audio.

Words

Examples

Questions

Answers

---

# Knowledge Graph

Every page should answer:

What links to me?

What do I link to?

Knowledge grows as a network rather than a hierarchy.

---

# Future Features

- Full-text search
- Browse by component
- Browse by pronunciation
- Browse by lesson
- Browse by frequency
- Browse by HSK
- Browse by dynasty
- Interactive knowledge graph
- Flashcards
- Quizzes
- Printable lessons
- PDF export
- Offline mode

---

# Long-term Goal

The Chinese Character Atlas should become a living encyclopedia that remains enjoyable to browse long after the learner has mastered basic Chinese.
