# Word Frequency Reference

The Atlas orders words by **descending usage frequency**. This file is the
single reference for that ordering — its source, the alternatives considered,
and the ranks used.

## Chosen source

**Jun Da (笪骏) — *Modern Chinese Character Frequency List* (现代汉语单字频率列表).**
A widely cited academic list derived from a large modern-Chinese corpus
(~258 million characters: news, fiction, and general modern texts).

- List: <https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO>
- Author: Jun Da, Middle Tennessee State University.

The Atlas stores each word's rank in its frontmatter `frequency_rank`, and
`frequency_rank` drives both the lesson ordering and the hero frequency badge.

## Why Jun Da

Several frequency lists were studied before choosing:

| Source | Basis | Note |
|--------|-------|------|
| **Jun Da MCF** *(chosen)* | ~258M-char modern corpus | Authoritative, stable, character-level — fits the Atlas's single-character core vocabulary; freely citable. |
| SUBTLEX-CH | Film/TV subtitles | Excellent for *spoken* word frequency, but skews conversational; word- not character-keyed. |
| BCC corpus | 15B-char balanced corpus | Very large, but ranks shift by sub-corpus weighting; less reproducible to cite. |
| Wiktionary list | Mixed/derived | Inconsistent ranks observed (e.g. 的 ranked far from #1); not used. |

For the Atlas's first lessons — which are single high-frequency characters and
particles — character frequency ≈ word frequency, so Jun Da is the cleanest,
most defensible single authority. When multi-character words enter the Atlas,
SUBTLEX-CH word frequencies should be layered in for those entries.

## Reference ranks (Lesson 1 vocabulary)

Jun Da rank for each character currently in the Atlas, in descending frequency:

| Rank | Char | Pinyin | ID |
|------|------|--------|-----|
| 1  | 的 | de    | W0002 |
| 3  | 是 | shì   | W0001 |
| 4  | 不 | bù    | W0004 |
| 5  | 了 | le    | W0005 |
| 6  | 在 | zài   | W0007 |
| 7  | 人 | rén   | W0006 |
| 8  | 有 | yǒu   | W0008 |
| 9  | 我 | wǒ    | W0003 |
| 10 | 他 | tā    | W0009 |
| 11 | 这 | zhè   | W0010 |
| 13 | 们 | men   | W0016 |
| 14 | 中 | zhōng | W0011 |
| 15 | 来 | lái   | W0012 |
| 16 | 上 | shàng | W0013 |
| 17 | 大 | dà    | W0018 |
| 18 | 为 | wéi   | W0020 |
| 20 | 国 | guó   | W0014 |
| 24 | 说 | shuō  | W0017 |
| 31 | 也 | yě    | W0019 |
| 32 | 你 | nǐ    | W0015 |

> 是 (the Atlas's reference page, W0001) is the 3rd most frequent character —
> not the 1st. Its ID stays W0001 (IDs are immutable); only its position in the
> frequency-ordered lesson reflects the real rank.

*Ranks transcribed from Jun Da's published list; verify against the source when
adding new entries.*
