(() => {
  'use strict';

  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  const navLinks = [...document.querySelectorAll('.nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const year = document.getElementById('year');
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitButton = document.getElementById('submit-button');

  // Theme preference
  const savedTheme = localStorage.getItem('aman-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('aman-theme', nextTheme);
  });

  // Mobile navigation
  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', event => {
    if (!nav?.classList.contains('open')) return;
    if (!nav.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Active navigation state
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Scroll progress and back-to-top button
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    backToTop?.classList.toggle('visible', window.scrollY > 650);
  };

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Footer year
  if (year) year.textContent = new Date().getFullYear();

  // Contact form: submits to contact.php when hosted on a PHP-enabled server.
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    status.className = 'form-status';

    if (!form.checkValidity()) {
      status.textContent = 'Please complete all required fields correctly.';
      status.classList.add('error');
      form.reportValidity();
      return;
    }

    const websiteField = form.querySelector('input[name="website"]');
    if (websiteField?.value.trim()) return;

    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      let result = {};
      try { result = await response.json(); } catch (_) { /* no-op */ }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to send the message from this server.');
      }

      status.textContent = result.message || 'Thank you. Your message has been sent successfully.';
      status.classList.add('success');
      form.reset();
    } catch (error) {
      status.innerHTML = 'This hosting may not support PHP mail. Please email me directly at <a href="mailto:aman.sharma6231@gmail.com">aman.sharma6231@gmail.com</a>.';
      status.classList.add('error');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
})();
