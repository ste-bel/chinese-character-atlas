// Chinese Character Atlas — UI helpers

let audioEnabled = true;

function toggleAudio(btn) {
  audioEnabled = !audioEnabled;
  btn.textContent = audioEnabled ? "🔊 Audio On" : "🔇 Audio Off";
  // Patch the global speak() defined in audio.js
  if (!audioEnabled) {
    window._speakReal = window.speak;
    window.speak = () => {};
  } else {
    if (window._speakReal) window.speak = window._speakReal;
  }
}

function jumpToWord(wordUrlsJson) {
  const words = JSON.parse(wordUrlsJson);
  const n = parseInt(document.getElementById("jump-input")?.value ?? "1", 10);
  if (!n || n < 1 || n > words.length) return;
  const target = words[n - 1];
  if (target?.url) window.location.href = target.url;
}
