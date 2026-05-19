/**
 * ui.js — Apple-aesthetic UI controller
 * Aligned with HTML structure: #siteHeader, #siteNav, data-target counters, .rec-slide
 */

import { setScrollT } from './scene.js';

const sectionIds = ['hero', 'about', 'experience', 'projects', 'education', 'recommendations', 'contact'];

export function initUI() {
  initRevealObserver();
  initCounterObserver();
  initSectionObserver();
  initNavBehavior();
  initNavSmooth();
  initHamburger();
}

export function handleScroll(scrollY, maxScroll) {
  const t = maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0;
  setScrollT(t);
}

// ── Reveal animations ─────────────────────────────────────────────────────────
function initRevealObserver() {
  // Mark all animatable elements
  const targets = document.querySelectorAll(
    '[data-reveal], .exp-card, .project-card, .edu-item, .rec-slide, .stat-item, .skill-chip, .experience-item'
  );

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        e.target.classList.add('revealed'); // for .reveal CSS class
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 60}ms`;
    io.observe(el);
  });
}

// ── Counter animation — uses data-target (HTML uses data-target) ──────────────
function initCounterObserver() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = '1';
        countUp(e.target);
      }
    });
  }, { threshold: 0.6 });

  // Support both data-target (new HTML) and data-count (legacy)
  document.querySelectorAll('[data-target], [data-count]').forEach(el => io.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.target || el.dataset.count || '0', 10);
  if (!target) return;

  const dur = 1800;
  const t0  = performance.now();
  // Store the suffix (e.g. the <span> inside stat-number)
  const suffixEl = el.querySelector('.stat-sup, sup');
  const suffixHTML = suffixEl ? suffixEl.outerHTML : '';

  const tick = (now) => {
    const p    = Math.min(1, (now - t0) / dur);
    const ease = 1 - Math.pow(1 - p, 4);
    el.innerHTML = Math.round(ease * target) + suffixHTML;
    if (p < 1) requestAnimationFrame(tick);
    else el.innerHTML = target + suffixHTML;
  };
  requestAnimationFrame(tick);
}

// ── Section observer (updates nav active state) ───────────────────────────────
function initSectionObserver() {
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { threshold: 0.4 });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
}

// ── Nav glass effect on scroll ────────────────────────────────────────────────
function initNavBehavior() {
  // Support both #mainNav (CSS target) and #siteNav (HTML)
  const nav = document.getElementById('mainNav') || document.getElementById('siteNav') || document.getElementById('siteHeader');
  if (!nav) return;

  // Show nav immediately (it starts hidden via transform)
  nav.classList.add('visible');

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastY = y;
  }, { passive: true });
}

// ── Smooth scroll ─────────────────────────────────────────────────────────────
function initNavSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href   = a.getAttribute('href');
      const target = href && href !== '#' ? document.querySelector(href) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Mobile hamburger menu ─────────────────────────────────────────────────────
function initHamburger() {
  const btn  = document.getElementById('navHamburger');
  const menu = document.getElementById('navMobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-hidden', String(open));
    menu.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}
