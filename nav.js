document.addEventListener('DOMContentLoaded', () => {

  const y = String(new Date().getFullYear());
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = y; });

  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  function setMenu(open) {
    if (!navLinks || !burger) return;
    navLinks.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (burger && navLinks) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'navLinks');
    burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    navLinks.querySelectorAll('a:not(.nav-parent)').forEach(a => {
      a.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  document.querySelectorAll('.nav-parent').forEach(el => {
    el.setAttribute('aria-expanded', 'false');
    el.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const item = el.closest('.nav-item');
        const open = !item.classList.contains('open');
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        item.classList.toggle('open', open);
        el.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  });

  function revealVisible() {
    document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
        el.classList.add('visible');
      }
    });
  }

  revealVisible();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal, .reveal-fade, .reveal-scale').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });

  setTimeout(revealVisible, 100);
  setTimeout(revealVisible, 500);

  const heroImg = document.querySelector('.hero-right .ph');
  if (heroImg) setTimeout(() => heroImg.classList.add('zoomed'), 100);
});

document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
