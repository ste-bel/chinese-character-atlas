// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

import path from "node:path";

export const ROOT  = process.cwd();
export const ATLAS = path.join(ROOT, "atlas");
export const DOCS  = path.join(ROOT, "docs");

// Site root path as deployed (GitHub Pages sub-path).
// Change here only — never hard-code elsewhere.
export const BASE  = "/chinese-character-atlas";
