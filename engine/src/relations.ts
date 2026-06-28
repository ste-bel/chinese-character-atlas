import { Entry } from "./types.js";
import { esc } from "./utils.js";

const relationFields = [
  "words",
  "characters",
  "components",
  "lessons",
  "grammar",
  "books",
  "people",
  "idioms",
  "topics",
  "related"
];

export function relationSection(entry: Entry, byId: Map<string, Entry>, metadata: any): string {
  const groups: string[] = [];

  for (const field of relationFields) {
    const ids = metadata[field];
    if (!Array.isArray(ids) || ids.length === 0) continue;

    const items = ids.map(id => {
      const target = byId.get(id);
      if (!target) return `<li>${esc(id)}</li>`;
      return `<li><a href="/chinese-character-atlas${target.url}">${esc(`${target.id || ""} ${target.hanzi || ""} ${target.title}`)}</a></li>`;
    }).join("\n");

    groups.push(`<h3>${esc(field)}</h3><ul>${items}</ul>`);
  }

  if (!groups.length) return "";

  return `<section class="card">
<h2>Related Atlas Entries</h2>
${groups.join("\n")}
</section>`;
}
