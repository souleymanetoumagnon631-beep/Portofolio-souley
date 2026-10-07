
const ASSET_NAMES = ['founder.webp','hero-villa.webp','villa-interior.webp','villa-sunset.webp','yacht.webp'];
const assetUrls = {};
async function loadAssets(){
  await Promise.all(ASSET_NAMES.map(async name => {
    const r = await fetch(`/assets/${name}.b64`, { cache: 'force-cache' });
    if (!r.ok) throw new Error(`Asset load failed: ${name}`);
    const b64 = (await r.text()).trim();
    assetUrls[name] = `data:image/webp;base64,${b64}`;
  }));
  document.querySelectorAll('[data-asset]').forEach(el => { const u=assetUrls[el.dataset.asset]; if(u) el.src=u; });
  document.querySelectorAll('[data-asset-bg]').forEach(el => { const u=assetUrls[el.dataset.assetBg]; if(u) el.style.backgroundImage=`url("${u}")`; });
}
loadAssets().catch(console.error);

const $ = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];

const header = $('.site-header');
const progress = $('#scrollProgress');
const menuToggle = $('#menuToggle');
const mobileNav = $('#mobileNav');
const modal = $('#quoteModal');
const form = $('#quoteForm');
const status = $('#formStatus');
const submitBtn = $('.submit-btn');

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-parallax]').forEach(el => {
      const speed = Number(el.dataset.parallax || 0.08);
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * speed;
      el.style.transform = `translate3d(0, ${Math.min(offset, 90)}px, 0) scale(1.03)`;
    });
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => observer.observe(el));

menuToggle?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#mobileNav a, #mobileNav button').forEach(el => el.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

function openModal(service = '') {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if (service) form.elements.service.value = service;
  setTimeout(() => form.elements.name.focus(), 120);
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
$$('.js-open-quote').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.service || '')));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = '';
  status.className = 'form-status';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('loading');

  const data = Object.fromEntries(new FormData(form).entries());
  data.consent = Boolean(form.elements.consent.checked);

  try {
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(payload.error || 'Une erreur est survenue.');

    status.textContent = 'Votre demande a bien été transmise. Nous reviendrons vers vous rapidement.';
    status.classList.add('success');
    form.reset();
  } catch (err) {
    status.textContent = err.message || 'Impossible d’envoyer la demande pour le moment.';
    status.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
});

$('#year').textContent = new Date().getFullYear();
