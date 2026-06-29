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

// Exhibit reveal — each gallery panel settles into place as it scrolls into
// view, so descending a page feels like walking deeper into the museum.
(function () {
  function reveal() {
    var cards = document.querySelectorAll('.entry-body > .section-card');
    if (!cards.length) return;
    var all = function () { cards.forEach(function (c) { c.classList.add('is-in'); }); };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { all(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    cards.forEach(function (c) { io.observe(c); });
    // Failsafe: never leave an exhibit invisible if the observer never fires.
    setTimeout(all, 1600);
  }
  if (document.readyState !== 'loading') reveal();
  else document.addEventListener('DOMContentLoaded', reveal);
})();
