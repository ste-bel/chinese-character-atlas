// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Pinyin quality checks.
 *
 * The Atlas must always display standard Unicode pinyin with correctly placed,
 * precomposed tone marks (shì, xué, lǎoshī) — never numeric tones (shi4),
 * stray markers (shi`), or combining diacritics. These helpers back the
 * build-time validation in stage 3 so authoring regressions are caught early.
 */

/** Precomposed tone-marked vowels that are valid in pinyin. */
const TONE_VOWELS = "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ";

/** Combining diacritics that should have been precomposed (U+0300–U+036F). */
const COMBINING = /[̀-ͯ]/;

/** Characters legal inside a pinyin field. */
const VALID_FIELD = new RegExp(
  `^[a-zA-Z${TONE_VOWELS}üÜ '·\\-,/()]+$`,
);

export interface PinyinProblem {
  severity: "error" | "warning";
  message: string;
}

/**
 * Validate a pinyin frontmatter field (e.g. `pinyin: shì`). Returns a list of
 * problems; empty means clean.
 */
export function checkPinyinField(value: string): PinyinProblem[] {
  const problems: PinyinProblem[] = [];
  const v = value.trim();
  if (!v) return problems;

  if (/[0-9]/.test(v)) {
    problems.push({
      severity: "error",
      message: `pinyin "${v}" uses numeric tones — write Unicode tone marks (e.g. shì, not shi4)`,
    });
  }
  if (/[`^~]/.test(v)) {
    problems.push({
      severity: "error",
      message: `pinyin "${v}" contains a stray tone marker (\` ^ ~) — use a precomposed tone vowel`,
    });
  }
  if (COMBINING.test(v)) {
    problems.push({
      severity: "warning",
      message: `pinyin "${v}" uses combining diacritics — normalize to precomposed Unicode (NFC)`,
    });
  }
  if (!/[0-9`^~]/.test(v) && !COMBINING.test(v) && !VALID_FIELD.test(v)) {
    problems.push({
      severity: "warning",
      message: `pinyin "${v}" contains unexpected characters for a pinyin field`,
    });
  }
  return problems;
}

// ── Body scan for numeric-tone pinyin ───────────────────────────────────────

// A plausible pinyin syllable (atonal), used to keep the body scan high-signal
// so dates ("1200 BCE"), codes ("MP3"), and the like are not flagged.
const SYLLABLE =
  "(?:zh|ch|sh|[bpmfdtnlgkhjqxzcsrwy])?(?:i?ong|i?ang|uai|uang|[iu]?an|[iu]?ang|er|[aoe]i?|ai|ei|ao|ou|i[aeou]?|u[aeio]?|[üv]e?|ng?|[aoeiuü])";

const NUMERIC_TONE = new RegExp(`\\b(${SYLLABLE})([1-5])\\b`, "gi");

/** Words that look like syllable+digit but are not pinyin. */
const DENYLIST = new Set(["mp3", "co2", "h2o", "n95", "g7", "g8", "g20", "k2"]);

export interface BodyPinyinHit {
  line: number;
  token: string;
}

/**
 * Scan body text (Markdown, frontmatter stripped) for numeric-tone pinyin like
 * "shi4". Conservative: only lowercase tokens whose alphabetic part contains a
 * vowel and parses as a single pinyin syllable are reported.
 */
export function scanBodyForNumericTones(text: string): BodyPinyinHit[] {
  const hits: BodyPinyinHit[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((line, i) => {
    // Skip fenced code and obvious URLs to cut false positives.
    if (/^\s*(```|~~~)/.test(line)) return;

    for (const m of line.matchAll(NUMERIC_TONE)) {
      const token = m[0];
      const letters = (m[1] ?? "").toLowerCase();
      if (token !== token.toLowerCase()) continue;        // skip CODE4, BCE2
      if (!/[aeiouü]/.test(letters)) continue;            // must have a vowel
      if (DENYLIST.has(token.toLowerCase())) continue;
      hits.push({ line: i + 1, token });
    }
  });

  return hits;
}
