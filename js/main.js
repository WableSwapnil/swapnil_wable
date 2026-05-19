/**
 * main.js — Three.js scene bootstrap only
 * All UI/DOM logic lives in the inline <script> in index.html
 */
import { initScene, updateScene, onResize, setScrollT } from './scene.js';

(async function boot() {
  try {
    await initScene(null);
  } catch (e) {
    console.warn('[scene] WebGL unavailable:', e);
    const c = document.getElementById('threeCanvas');
    if (c) c.style.display = 'none';
    return;
  }

  // Animation loop
  let raf;
  (function frame(ts) {
    raf = requestAnimationFrame(frame);
    updateScene(ts);
  })(0);

  // Scroll → camera path
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setScrollT(max > 0 ? window.scrollY / max : 0);
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    onResize(window.innerWidth, window.innerHeight);
  }, { passive: true });
})();
