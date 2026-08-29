(() => {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const year = document.querySelector('#year');
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  year.textContent = new Date().getFullYear();

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  navToggle?.addEventListener('click', () => {
    const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNav.hidden = !willOpen;
  });

  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -7% 0px' });

  document.querySelectorAll('.reveal-up, .reveal-scale').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    revealObserver.observe(el);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const orb = document.querySelector('.cursor-orb');
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    window.addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (orb) orb.style.opacity = '1';
    }, { passive: true });
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      if (orb) orb.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.1;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.1;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent = 'Envoi en cours…';
    form.querySelector('button[type="submit"]')?.setAttribute('disabled', 'disabled');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Une erreur est survenue.');

      form.reset();
      status.textContent = result.message || 'Votre demande a bien été envoyée. Je reviens vers vous rapidement.';
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : 'Impossible d’envoyer la demande. Utilisez l’email indiqué à côté.';
    } finally {
      form.querySelector('button[type="submit"]')?.removeAttribute('disabled');
    }
  });

  const heroVideo = document.querySelector('.hero-video-media');
  if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.pause();
  }
})();
