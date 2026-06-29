#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)
/**
 * Allocates the next available stable ID for a given entity type.
 *
 * Usage:
 *   node scripts/next-id.mjs word        → W0002
 *   node scripts/next-id.mjs character   → CH0002
 *   node scripts/next-id.mjs component   → CMP0002
 *   node scripts/next-id.mjs lesson      → L0002
 *   node scripts/next-id.mjs grammar     → G0001
 *   node scripts/next-id.mjs idiom       → I0001
 *   node scripts/next-id.mjs book        → B0002
 *   node scripts/next-id.mjs person      → P0001
 *   node scripts/next-id.mjs topic       → T0001
 *
 * Pass --dry-run to print the next ID without incrementing the registry.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY = path.join(__dirname, "../data/id-registry.json");

const TYPE_TO_PREFIX = {
  word:         "W",
  character:    "CH",
  component:    "CMP",
  lesson:       "L",
  grammar:      "G",
  idiom:        "I",
  book:         "B",
  person:       "P",
  topic:        "T",
};

const typeName = process.argv[2];
const dryRun   = process.argv.includes("--dry-run");

if (!typeName) {
  console.error("Usage: node scripts/next-id.mjs <type> [--dry-run]");
  console.error("Types:", Object.keys(TYPE_TO_PREFIX).join(", "));
  process.exit(1);
}

const prefix = TYPE_TO_PREFIX[typeName.toLowerCase()];
if (!prefix) {
  console.error(`Unknown type: "${typeName}"`);
  console.error("Valid types:", Object.keys(TYPE_TO_PREFIX).join(", "));
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
const next     = registry[prefix] ?? 1;
const id       = `${prefix}${String(next).padStart(4, "0")}`;

console.log(id);

if (!dryRun) {
  registry[prefix] = next + 1;
  fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + "\n", "utf8");
}
