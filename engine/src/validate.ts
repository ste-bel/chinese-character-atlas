// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Standalone validator — runs Stages 1–3 only, no HTML output.
 *
 * Usage:
 *   npm run validate
 *
 * Exit codes:
 *   0 — all clear (or only warnings)
 *   1 — one or more validation errors
 */
import { ATLAS } from "./config.js";
import { discover } from "./stages/01-discover.js";
import { parse }    from "./stages/02-parse.js";
import { validate } from "./stages/03-validate.js";

const files = discover(ATLAS);
console.log(`Scanning ${files.length} files...\n`);

const { entries, failures } = parse(files);

let exitCode = 0;

if (failures.length > 0) {
  console.error(`Parse failures (${failures.length}):`);
  for (const f of failures) {
    console.error(`  ✗  ${f.file}`);
    console.error(`       ${f.reason}`);
  }
  console.log();
  exitCode = 1;
}

const issues = validate(entries);
const errors   = issues.filter(i => i.severity === "error");
const warnings = issues.filter(i => i.severity === "warning");

if (warnings.length > 0) {
  console.warn(`Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.warn(`  ⚠  ${w.file}`);
    console.warn(`       ${w.message}`);
  }
  console.log();
}

if (errors.length > 0) {
  console.error(`Errors (${errors.length}):`);
  for (const e of errors) {
    console.error(`  ✗  ${e.file}`);
    console.error(`       ${e.message}`);
  }
  console.log();
  exitCode = 1;
}

const total = failures.length + issues.length;
if (total === 0) {
  console.log(`✓  ${entries.length} entries — no issues found`);
} else {
  console.log(`${entries.length} entries — ${errors.length} error(s), ${warnings.length} warning(s), ${failures.length} parse failure(s)`);
}

process.exit(exitCode);
