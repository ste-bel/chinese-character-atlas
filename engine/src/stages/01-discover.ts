// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Stage 1 — Discover
 *
 * Walk the atlas/ directory and return all Markdown file paths.
 * Input:  atlas root directory path
 * Output: absolute file paths, sorted for deterministic order
 */
import { walk } from "../utils.js";

export function discover(atlasDir: string): string[] {
  return walk(atlasDir).sort();
}
