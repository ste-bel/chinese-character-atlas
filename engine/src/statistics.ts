import fs from "node:fs";
import path from "node:path";
import { DOCS } from "./config.js";
import { Entry } from "./types.js";

export function writeStatistics(entries: Entry[]) {
  const stats: Record<string, number> = {};

  for (const entry of entries) {
    const type = entry.type || "unknown";
    stats[type] = (stats[type] || 0) + 1;
  }

  const output = {
    generated_at: new Date().toISOString(),
    total: entries.length,
    ...stats
  };

  fs.writeFileSync(
    path.join(DOCS, "statistics.json"),
    JSON.stringify(output, null, 2),
    "utf8"
  );
}
