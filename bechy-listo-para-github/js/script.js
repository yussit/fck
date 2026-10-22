(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.getElementById('motionToggle');
  const loveButton = document.getElementById('loveButton');
  const secret = document.getElementById('secretMessage');
  const effects = document.querySelector('.effects');
  let manuallyPaused = false;
  const timers = new Set();
  const motionAllowed = () => !reducedMotion.matches && !manuallyPaused && !document.hidden;

  function clearEffects() {
    timers.forEach(timer => window.clearTimeout(timer));
    timers.clear();
    effects.replaceChildren();
  }
  function syncMotion() {
    root.classList.toggle('motion-paused', manuallyPaused || document.hidden);
    motionButton.hidden = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(manuallyPaused));
    motionButton.textContent = manuallyPaused ? 'Activar animaciones' : 'Pausar animaciones';
    if (!motionAllowed()) clearEffects();
  }
  // Opening the card creates one small burst, with animation and timeout cleanup.
  function burst() {
    if (!motionAllowed()) return;
    const symbols = ['💛', '♡'];
    const count = 8;
    for (let i = 0; i < count; i += 1) {
      const item = document.createElement('span');
      item.className = 'floating-love';
      item.textContent = symbols[i % symbols.length];
      item.style.setProperty('--x', `${4 + Math.random() * 88}%`);
      item.style.setProperty('--size', `${14 + Math.random() * 14}px`);
      item.style.setProperty('--duration', `${3.2 + Math.random() * 1.5}s`);
      const remove = () => { item.remove(); window.clearTimeout(timer); timers.delete(timer); };
      const timer = window.setTimeout(remove, 5000);
      timers.add(timer);
      item.addEventListener('animationend', remove, { once: true });
      effects.appendChild(item);
    }
  }
  function initConfession() {
    // Without JavaScript the entire message remains readable.
    loveButton.addEventListener('click', () => {
      if (!secret.hidden) return;
      secret.hidden = false;
      loveButton.setAttribute('aria-expanded', 'true');
      document.body.classList.add('confession-open');
      document.getElementById('confession-title').focus({ preventScroll: true });
      secret.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'instant', block: 'nearest' });
      burst();
    });
    secret.hidden = true;
    loveButton.hidden = false;
  }
  motionButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; syncMotion(); });
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('pagehide', clearEffects);
  initConfession();
  syncMotion();
})();
