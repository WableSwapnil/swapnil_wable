/**
 * recommendations.js — Apple-style recommendation carousel
 * Aligns with HTML structure: .rec-slide, #recPrev, #recNext
 */

export function initRecommendations() {
  const slides  = document.querySelectorAll('.rec-slide');
  const prevBtn = document.getElementById('recPrev');
  const nextBtn = document.getElementById('recNext');
  const dotWrap = document.querySelector('.rec-dots');

  if (!slides.length) return;

  // Remove any inline-script driven active class first
  slides.forEach(s => s.classList.remove('active'));

  let current   = 0;
  const total   = slides.length;
  let autoTimer = null;

  // Build dots if container exists
  if (dotWrap) {
    dotWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className  = 'rec-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to recommendation ${i + 1}`);
      d.addEventListener('click', () => { goTo(i); reset(); });
      dotWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dotWrap?.querySelectorAll('.rec-dot')[current]?.classList.remove('active');

    current = ((idx % total) + total) % total;

    slides[current]?.classList.add('active');
    dotWrap?.querySelectorAll('.rec-dot')[current]?.classList.add('active');

    // Update ARIA
    const carousel = document.getElementById('recCarousel');
    if (carousel) carousel.setAttribute('aria-live', 'polite');
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); reset(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); reset(); });

  function reset() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }

  // Init
  slides[0]?.classList.add('active');
  reset();

  // Keyboard when section in view
  document.addEventListener('keydown', e => {
    const sec = document.getElementById('recommendations');
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); reset(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); reset(); }
    }
  });
}
