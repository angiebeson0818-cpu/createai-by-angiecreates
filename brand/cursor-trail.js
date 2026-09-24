// CREATE Gold Cursor Trail — butterflies, sparkles & stars
// Drop-in: <script src="brand/cursor-trail.js" defer></script>
(function () {
  if (window.__createCursorTrail) return;
  window.__createCursorTrail = true;

  // Respect visitors who turn on "reduce motion" in their device settings
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Styling lives here, so nothing else needs to be added to the site
  var style = document.createElement('style');
  style.textContent =
    '.gold-star-particle{' +
      'position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;user-select:none;' +
      'font-size:18px;line-height:1;transform:translate(-50%,-50%);' +
      'filter:drop-shadow(0 0 4px rgba(212,175,55,.9)) drop-shadow(0 0 10px rgba(255,215,0,.55));' +
      'animation:createGoldFloat 1s ease-out forwards;will-change:transform,opacity;' +
    '}' +
    '@keyframes createGoldFloat{' +
      '0%{opacity:1;transform:translate(-50%,-50%) scale(1)}' +
      '100%{opacity:0;transform:translate(-50%,calc(-50% - 28px)) scale(.6) rotate(15deg)}' +
    '}';
  (document.head || document.documentElement).appendChild(style);

  var shapes = ['🦋', '✨', '⭐'];

  document.addEventListener('mousemove', function (e) {
    var particle = document.createElement('span');
    particle.className = 'gold-star-particle';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    document.body.appendChild(particle);

    setTimeout(function () {
      particle.remove();
    }, 1000);
  });
})();
