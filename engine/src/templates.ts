import { navigation } from "./navigation.js";

export function page(title:string,body:string){
return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/chinese-character-atlas/assets/css/style.css">
<script src="/chinese-character-atlas/assets/js/audio.js"></script>
</head>
<body>
<header>
<h1>Chinese Character Atlas</h1>
<p>Every character tells a story. Every story opens a civilization.</p>
</header>

<main>
${navigation()}
${body}
</main>

<footer>
白朗志远 · Chinese Character Atlas
</footer>

</body>
</html>`;
}
