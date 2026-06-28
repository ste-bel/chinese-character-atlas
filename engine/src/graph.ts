import { Entry } from "./types.js";
import { esc } from "./utils.js";

export function backlinksSection(entry: Entry, entries: Entry[]): string {
  if (!entry.id) return "";

  const backlinks = entries.filter(e => e.linksTo.includes(entry.id as string));

  if (!backlinks.length) return "";

  return `<section class="card">
<h2>Linked from</h2>
<ul>
${backlinks.map(e => `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id || ""} ${e.hanzi || ""} ${e.title}`)}</a></li>`).join("\n")}
</ul>
</section>`;
}
