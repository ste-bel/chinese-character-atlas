// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Stéphane Bélanger (白朗志远)

/**
 * Build Orchestrator
 *
 * Runs the six-stage pipeline:
 *
 *   Stage 1  discover  — find all .md files in atlas/
 *   Stage 2  parse     — extract YAML metadata + body from each file
 *   Stage 3  validate  — check IDs, links, schema; abort on errors
 *   Stage 4  graph     — build the typed knowledge graph
 *   Stage 5  render    — convert Markdown to HTML pages
 *   Stage 6  output    — write docs/ artifacts
 *
 * Usage:
 *   npm run build              — build; abort if validation errors exist
 *   npm run build -- --warn    — build even if there are validation errors
 */
import { ATLAS } from "./config.js";
import { discover }   from "./stages/01-discover.js";
import { parse }      from "./stages/02-parse.js";
import { validate }   from "./stages/03-validate.js";
import { buildGraph } from "./stages/04-graph.js";
import { render }     from "./stages/05-render.js";
import { output }     from "./stages/06-output.js";

const warnOnly = process.argv.includes("--warn");

// ── Stage 1: Discover ─────────────────────────────────────────────────────────
const files = discover(ATLAS);
console.log(`[1/6] Discovered ${files.length} files`);

// ── Stage 2: Parse ────────────────────────────────────────────────────────────
const { entries, failures } = parse(files);

if (failures.length > 0) {
  console.error(`\n[2/6] Parse failures (${failures.length}):`);
  for (const f of failures) {
    console.error(`  ✗  ${f.file}: ${f.reason}`);
  }
  if (!warnOnly) {
    console.error("\nBuild aborted. Fix parse failures and retry.");
    console.error("Run with --warn to build anyway.");
    process.exit(1);
  }
}
console.log(`[2/6] Parsed ${entries.length} entries${failures.length ? ` (${failures.length} skipped)` : ""}`);

// ── Stage 3: Validate ─────────────────────────────────────────────────────────
const issues = validate(entries);
const errors   = issues.filter(i => i.severity === "error");
const warnings = issues.filter(i => i.severity === "warning");

if (warnings.length > 0) {
  console.warn(`\n[3/6] Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.warn(`  ⚠  ${w.file}: ${w.message}`);
  }
}

if (errors.length > 0) {
  console.error(`\n[3/6] Validation errors (${errors.length}):`);
  for (const e of errors) {
    console.error(`  ✗  ${e.file}: ${e.message}`);
  }
  if (!warnOnly) {
    console.error("\nBuild aborted. Fix validation errors and retry.");
    console.error("Run with --warn to build anyway.");
    process.exit(1);
  }
}

const issueCount = issues.length;
console.log(`[3/6] Validated — ${errors.length} error(s), ${warnings.length} warning(s)`);

// ── Stage 4: Graph ────────────────────────────────────────────────────────────
const graph = buildGraph(entries);
console.log(`[4/6] Graph — ${graph.edges.length} edges`);

// ── Stage 5: Render ───────────────────────────────────────────────────────────
const rendered = render(entries, graph);
console.log(`[5/6] Rendered ${rendered.size} pages`);

// ── Stage 6: Output ───────────────────────────────────────────────────────────
output(rendered, entries, graph);
console.log(`[6/6] Output written to docs/`);

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`\nBuild complete — ${entries.length} pages`);
if (issueCount > 0 && warnOnly) {
  console.warn(`Build completed with ${errors.length} error(s) and ${warnings.length} warning(s). Review and fix.`);
  process.exit(errors.length > 0 ? 1 : 0);
}
