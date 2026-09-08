document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── HAMBURGER ──
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a:not(.nav-parent)').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── DROPDOWN MOBILE ──
  document.querySelectorAll('.nav-parent').forEach(el => {
    el.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        el.closest('.nav-item').classList.toggle('open');
      }
    });
  });

  // ── SCROLL REVEAL ──
  // Passo 1: rendi visibili SUBITO tutti gli elementi già nel viewport
  function revealVisible() {
    document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
        el.classList.add('visible');
      }
    });
  }

  // Esegui subito
  revealVisible();

  // Passo 2: osserva gli elementi fuori viewport e rivelali allo scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });

  // Passo 3: controllo extra dopo 100ms (fallback per font e immagini lente)
  setTimeout(revealVisible, 100);
  setTimeout(revealVisible, 500);

  // ── HERO ZOOM / VIDEO ──
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
    heroVideo.removeAttribute('autoplay');
  }
  const heroImg = document.querySelector('.hero-right .ph');
  if (heroImg && !heroVideo) setTimeout(() => heroImg.classList.add('zoomed'), 100);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.band-video').forEach(video => {
    if (reduceMotion) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.35 });
    io.observe(video);
  });

});

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
