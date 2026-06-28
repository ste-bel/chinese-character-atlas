# Chinese Character Atlas — Data Schema

## Entity Types

The Atlas is composed of interconnected entities.

### Word

ID format:

W0001

Represents a spoken vocabulary item.

Examples:

是

中国

学习

老师

---

### Character

ID format:

CH0001

Represents a single Hanzi.

Examples:

是

人

学

国

---

### Component

ID format:

CMP0001

Represents a reusable graphical component.

Examples:

日

女

木

心

---

### Lesson

ID format:

L0001

Learning sequence.

---

### Grammar

ID format:

G0001

Grammar concept.

---

### Idiom

ID format:

I0001

Chinese idiom.

---

### Book

ID format:

B0001

Historical or modern work.

---

### Person

ID format:

P0001

Historical or modern individual.

---

### Topic

ID format:

T0001

Large concepts.

Examples:

Chinese Numbers

Tea

Calligraphy

Five Elements

Confucianism

Buddhism

Taoism

---

## Relationships

Everything can link to everything else.

Examples

Word
→ Character

Character
→ Component

Word
→ Grammar

Book
→ Person

Character
→ Topic

Lesson
→ Words

Component
→ Characters

Person
→ Books

Book
→ Quotations

Topic
→ Lessons

The Atlas is a knowledge graph rather than a collection of isolated pages.

---

## Future

Eventually every entity should be exportable as JSON for:

- search
- flashcards
- quizzes
- mobile apps
- AI
- APIs

