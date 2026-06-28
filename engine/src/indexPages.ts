import fs from "node:fs";
import path from "node:path";
import { DOCS } from "./config.js";
import { Entry } from "./types.js";
import { ensureDir, esc } from "./utils.js";
import { page } from "./templates.js";

export function writeIndexPage(type: string, title: string, entries: Entry[]) {
  const body = `<section class="card"><h1>${esc(title)}</h1><ul>
${entries.map(e => `<li><a href="/chinese-character-atlas${e.url}">${esc(`${e.id || ""} ${e.hanzi || ""} ${e.title || ""}`)}</a>${e.pinyin ? ` — <em>${esc(e.pinyin)}</em>` : ""}</li>`).join("\n")}
</ul></section>`;

  const file = path.join(DOCS, type, "index.html");
  ensureDir(file);
  fs.writeFileSync(file, page(title, body), "utf8");
}
