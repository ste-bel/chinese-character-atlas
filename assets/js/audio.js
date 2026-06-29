/* Chinese Character Atlas — Audio */

/**
 * Speak Chinese text using the Web Speech API.
 * Falls back silently if the browser does not support it.
 *
 * @param {string} text - The Chinese text to speak.
 */
function speak(text) {
  if (!window.speechSynthesis) return;

  // Cancel any in-progress speech before starting a new utterance.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.85;

  // Try to find a Mandarin voice; fall back to whatever the browser picks.
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang === "zh-CN" || v.lang === "zh_CN" || v.lang.startsWith("zh")
  );
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.speak(utterance);
}

// Voices load asynchronously in some browsers; re-bind on change.
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = function () {
    // Voices are now available. No action needed — speak() reads them on call.
  };
}
