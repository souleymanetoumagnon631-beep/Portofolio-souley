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


const SITE_COPY = {
  fr: {
    title: "Maison Privée — Villas, yachts & expériences sur mesure",
    description: "Maison Privée — sourcing sur mesure de villas, yachts et expériences privées pour clients, entreprises, agences et partenaires.",
    ogDescription: "Sourcing privé de villas, yachts et expériences d’exception.",
    nav: ["Univers","Approche","Yachts","À propos"],
    headerCta: "Demander une sélection",
    heroEyebrow: "SOURCING PRIVÉ · HOSPITALITÉ · EXPÉRIENCES",
    heroTitle: "L’art de vivre le luxe,<br><em>en villa & en yacht.</em>",
    heroCopy: "Une sélection sur mesure pour voyageurs privés, entreprises, agences et partenaires qui recherchent confidentialité, flexibilité et sens du détail.",
    heroPrimary: "Recevoir une sélection <span>↗</span>",
    heroSecondary: "Explorer l’univers",
    heroFoot: ["VILLAS PRIVÉES","YACHTS","ÉVÉNEMENTS & RETREATS","PARTENARIATS B2B"],
    values: [
      ["Sur mesure","Chaque demande commence par votre brief."],
      ["Sourcing ciblé","Des options adaptées au lieu, au format et au budget."],
      ["Confidentialité","Un échange direct, discret et professionnel."],
      ["Interlocuteur unique","Un point de contact de la demande à la coordination."]
    ],
    universeEyebrow:"NOS UNIVERS",
    universeTitle:"Des expériences privées,<br><em>pensées autour de vous.</em>",
    universeIntro:"Villa de bord de mer, yacht pour une journée privée, lieu pour un lancement ou un retreat : le point de départ est votre besoin, pas un catalogue figé.",
    universeCards:[
      ["Villas d’exception","Séjours privés, hospitality et lieux exclusifs."],
      ["Yachts privés","Charters, journées en mer et événements confidentiels."],
      ["Expériences signature","Retreats, célébrations, activations et moments sur mesure."]
    ],
    approachEyebrow:"L’APPROCHE",
    approachTitle:"Le bon lieu.<br>Le bon niveau de service.<br><em>Sans bruit inutile.</em>",
    approachCopy:"Nous travaillons à partir d’un brief clair : destination, dates, nombre de personnes, type d’expérience et enveloppe. La sélection est ensuite construite autour de ces critères.",
    approachPoints:[
      ["Brief & critères","Comprendre précisément le besoin."],
      ["Sourcing","Identifier les options les plus pertinentes."],
      ["Coordination","Faciliter les échanges jusqu’à la réservation."]
    ],
    briefLink:"Soumettre un brief <span>→</span>",
    aboutEyebrow:"À PROPOS",
    aboutTitle:"Votre interlocuteur<br><em>privilégié.</em>",
    aboutCopy:"J’accompagne personnellement chaque demande avec une approche fondée sur la précision, la discrétion et la qualité de l’exécution. Pour les agences et partenaires, l’objectif est aussi simple : devenir une option fiable lorsque le brief exige plus qu’un hébergement standard.",
    founderRole:"FONDATEUR · SOURCING PRIVÉ",
    founderQuote:"“Chaque demande mérite une réponse claire, élégante et adaptée — jamais un catalogue générique.”",
    yachtEyebrow:"YACHTS PRIVÉS",
    yachtTitle:"Naviguez<br><em>autrement.</em>",
    yachtCopy:"Pour une journée privée, une célébration, une activation de marque ou un programme hospitality, nous sourçons une option cohérente avec votre brief.",
    yachtCta:"Demander une proposition",
    yachtPoints:[
      ["Format privé","Sorties, séjours et événements."],
      ["Destination flexible","Selon disponibilité et saison."],
      ["Sourcing sur brief","Pas de flotte fictive affichée."]
    ],
    galleryEyebrow:"INSPIRATION",
    galleryTitle:"Une esthétique qui donne<br><em>le ton.</em>",
    galleryDisclaimer:"Visuels de direction artistique générés par IA. Les biens et yachts réels seront proposés selon votre demande et les disponibilités.",
    galleryCaps:["Villa · Méditerranée","Sunset · Séjour privé","Hospitality · Intérieur","Yacht · Charter privé"],
    partnerEyebrow:"POUR AGENCES & PARTENAIRES",
    partnerTitle:"Un fournisseur à activer<br><em>quand le brief l’exige.</em>",
    partnerCopy:"Agences événementielles, travel advisors, conciergeries et entreprises : nous pouvons travailler en referral, en marque blanche ou comme interlocuteur sourcing selon le projet.",
    partnerCta:"Parler partenariat",
    ctaEyebrow:"VOTRE PROCHAIN BRIEF",
    ctaTitle:"Parlons de votre prochaine<br><em>expérience privée.</em>",
    ctaCopy:"Décrivez le besoin. Nous revenons vers vous avec une première lecture et les prochaines étapes.",
    ctaButton:"Demander une sélection privée",
    footerNav:["Univers","Approche","À propos","Contact"],
    footerAi:"Visuels d’inspiration IA",
    modalClose:"Fermer",
    modalEyebrow:"DEMANDE PRIVÉE",
    modalTitle:"Parlez-nous de<br><em>votre projet.</em>",
    modalIntro:"Nous utilisons ces informations uniquement pour comprendre votre demande et revenir vers vous.",
    labels:{name:"Nom complet *",email:"Email *",phone:"Téléphone",company:"Société / agence",service:"Type de demande *",destination:"Destination",dates:"Dates",guests:"Invités",budget:"Budget indicatif",message:"Votre brief *"},
    placeholders:{name:"Votre nom",email:"vous@entreprise.com",phone:"+33…",company:"Optionnel",destination:"Ex. Côte d’Azur, Ibiza…",dates:"Ex. 12–16 juin",guests:"8",budget:"Ex. 8 000–15 000 €",message:"Contexte, objectif, niveau de service, contraintes particulières…"},
    options:["Choisir","Villa privée","Yacht privé","Événement / retreat","Partenariat B2B","Autre demande"],
    consent:"J’accepte d’être recontacté au sujet de cette demande.",
    submit:"Envoyer ma demande",
    success:"Votre demande a bien été transmise. Nous reviendrons vers vous rapidement.",
    error:"Impossible d’envoyer la demande pour le moment.",
    genericError:"Une erreur est survenue."
  },
  en: {
    title: "Maison Privée — Bespoke villas, yachts & private experiences",
    description: "Maison Privée — bespoke sourcing of private villas, yachts and experiences for private clients, companies, agencies and partners.",
    ogDescription: "Private sourcing of exceptional villas, yachts and bespoke experiences.",
    nav: ["Experiences","Approach","Yachts","About"],
    headerCta: "Request a selection",
    heroEyebrow: "PRIVATE SOURCING · HOSPITALITY · EXPERIENCES",
    heroTitle: "The art of luxury living,<br><em>by villa & by yacht.</em>",
    heroCopy: "A bespoke selection for private travellers, companies, agencies and partners seeking privacy, flexibility and attention to detail.",
    heroPrimary: "Receive a selection <span>↗</span>",
    heroSecondary: "Explore the experience",
    heroFoot: ["PRIVATE VILLAS","YACHTS","EVENTS & RETREATS","B2B PARTNERSHIPS"],
    values: [
      ["Bespoke","Every request starts with your brief."],
      ["Targeted sourcing","Options aligned with location, format and budget."],
      ["Confidentiality","Direct, discreet and professional communication."],
      ["Single point of contact","One contact from request through coordination."]
    ],
    universeEyebrow:"OUR WORLDS",
    universeTitle:"Private experiences,<br><em>built around you.</em>",
    universeIntro:"A seaside villa, a yacht for a private day, a venue for a launch or a retreat: the starting point is your brief, not a fixed catalogue.",
    universeCards:[
      ["Exceptional villas","Private stays, hospitality and exclusive venues."],
      ["Private yachts","Charters, days at sea and confidential events."],
      ["Signature experiences","Retreats, celebrations, activations and bespoke moments."]
    ],
    approachEyebrow:"THE APPROACH",
    approachTitle:"The right place.<br>The right level of service.<br><em>Without unnecessary noise.</em>",
    approachCopy:"We work from a clear brief: destination, dates, number of guests, type of experience and budget range. The selection is then built around those criteria.",
    approachPoints:[
      ["Brief & criteria","Understand the need precisely."],
      ["Sourcing","Identify the most relevant options."],
      ["Coordination","Streamline communication through booking."]
    ],
    briefLink:"Submit a brief <span>→</span>",
    aboutEyebrow:"ABOUT",
    aboutTitle:"Your dedicated<br><em>point of contact.</em>",
    aboutCopy:"I personally oversee each request with an approach built on precision, discretion and quality of execution. For agencies and partners, the objective is equally simple: become a reliable option when the brief requires more than standard accommodation.",
    founderRole:"FOUNDER · PRIVATE SOURCING",
    founderQuote:"“Every request deserves a clear, elegant and tailored response — never a generic catalogue.”",
    yachtEyebrow:"PRIVATE YACHTS",
    yachtTitle:"Navigate<br><em>differently.</em>",
    yachtCopy:"For a private day, a celebration, a brand activation or a hospitality programme, we source an option aligned with your brief.",
    yachtCta:"Request a proposal",
    yachtPoints:[
      ["Private format","Day trips, stays and events."],
      ["Flexible destination","Subject to availability and season."],
      ["Brief-led sourcing","No fictional fleet displayed."]
    ],
    galleryEyebrow:"INSPIRATION",
    galleryTitle:"An aesthetic that sets<br><em>the tone.</em>",
    galleryDisclaimer:"AI-generated art-direction visuals. Real properties and yachts are proposed according to your request and current availability.",
    galleryCaps:["Villa · Mediterranean","Sunset · Private stay","Hospitality · Interior","Yacht · Private charter"],
    partnerEyebrow:"FOR AGENCIES & PARTNERS",
    partnerTitle:"A supplier to activate<br><em>when the brief calls for it.</em>",
    partnerCopy:"Event agencies, travel advisors, concierges and companies: we can work on a referral basis, white-label basis or as a dedicated sourcing contact depending on the project.",
    partnerCta:"Discuss partnership",
    ctaEyebrow:"YOUR NEXT BRIEF",
    ctaTitle:"Let’s discuss your next<br><em>private experience.</em>",
    ctaCopy:"Tell us what you need. We’ll come back with an initial assessment and the next steps.",
    ctaButton:"Request a private selection",
    footerNav:["Experiences","Approach","About","Contact"],
    footerAi:"AI-generated inspiration visuals",
    modalClose:"Close",
    modalEyebrow:"PRIVATE REQUEST",
    modalTitle:"Tell us about<br><em>your project.</em>",
    modalIntro:"We use this information only to understand your request and get back to you.",
    labels:{name:"Full name *",email:"Email *",phone:"Phone",company:"Company / agency",service:"Request type *",destination:"Destination",dates:"Dates",guests:"Guests",budget:"Indicative budget",message:"Your brief *"},
    placeholders:{name:"Your name",email:"you@company.com",phone:"+44…",company:"Optional",destination:"E.g. French Riviera, Ibiza…",dates:"E.g. 12–16 June",guests:"8",budget:"E.g. €8,000–€15,000",message:"Context, objective, service level, special requirements…"},
    options:["Choose","Private villa","Private yacht","Event / retreat","B2B partnership","Other request"],
    consent:"I agree to be contacted regarding this request.",
    submit:"Send my request",
    success:"Your request has been received. We’ll get back to you shortly.",
    error:"Unable to send your request right now.",
    genericError:"Something went wrong."
  }
};

let currentLang = "fr";

function textAll(selector, value) {
  $$(selector).forEach(el => { el.textContent = value; });
}
function htmlAll(selector, value) {
  $$(selector).forEach(el => { el.innerHTML = value; });
}
function fieldLabel(name, value) {
  const field = form?.elements?.[name];
  const label = field?.closest("label");
  if (!label) return;
  const node = [...label.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
  if (node) node.nodeValue = value;
}
function applyLanguage(lang) {
  const c = SITE_COPY[lang] || SITE_COPY.fr;
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = c.title;
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (description) description.content = c.description;
  if (ogTitle) ogTitle.content = c.title;
  if (ogDescription) ogDescription.content = c.ogDescription;

  $$(".desktop-nav a").forEach((el,i) => { if (c.nav[i]) el.textContent = c.nav[i]; });
  $$("#mobileNav > a").forEach((el,i) => { if (c.nav[i]) el.textContent = c.nav[i]; });
  textAll(".header-cta", c.headerCta);
  textAll("#mobileNav > .js-open-quote", c.headerCta);

  textAll(".hero-content .eyebrow", c.heroEyebrow);
  htmlAll("#hero-title", c.heroTitle);
  textAll(".hero-copy", c.heroCopy);
  htmlAll(".hero-actions .btn-gold", c.heroPrimary);
  textAll(".hero-actions .btn-ghost", c.heroSecondary);
  $$(".hero-foot span").forEach((el,i)=>{ if(c.heroFoot[i]) el.textContent=c.heroFoot[i]; });

  $$(".value-strip article").forEach((el,i)=>{
    const pair=c.values[i]; if(!pair) return;
    const strong=$("strong",el), small=$("small",el);
    if(strong) strong.textContent=pair[0];
    if(small) small.textContent=pair[1];
  });

  textAll("#univers .eyebrow", c.universeEyebrow);
  htmlAll("#univers .section-head h2", c.universeTitle);
  textAll("#univers .section-head > p", c.universeIntro);
  $$("#univers .universe-card").forEach((el,i)=>{
    const pair=c.universeCards[i]; if(!pair) return;
    const h3=$("h3",el), p=$(".card-copy p",el);
    if(h3) h3.textContent=pair[0];
    if(p) p.textContent=pair[1];
  });

  textAll("#approche .eyebrow", c.approachEyebrow);
  htmlAll("#approche h2", c.approachTitle);
  textAll("#approche .editorial-copy > p:not(.eyebrow)", c.approachCopy);
  $$("#approche .editorial-points > div").forEach((el,i)=>{
    const pair=c.approachPoints[i]; if(!pair) return;
    const strong=$("strong",el), small=$("small",el);
    if(strong) strong.textContent=pair[0];
    if(small) small.textContent=pair[1];
  });
  htmlAll("#approche .text-link", c.briefLink);

  textAll("#about .eyebrow", c.aboutEyebrow);
  htmlAll("#about h2", c.aboutTitle);
  textAll("#about .founder-copy > p:not(.eyebrow)", c.aboutCopy);
  textAll("#about .founder-role", c.founderRole);
  textAll("#about .founder-quote", c.founderQuote);

  textAll("#yachts .eyebrow", c.yachtEyebrow);
  htmlAll("#yachts h2", c.yachtTitle);
  textAll("#yachts .yacht-copy > p:not(.eyebrow)", c.yachtCopy);
  textAll("#yachts .yacht-copy .btn", c.yachtCta);
  $$("#yachts .yacht-panel > div").forEach((el,i)=>{
    const pair=c.yachtPoints[i]; if(!pair) return;
    const strong=$("strong",el), small=$("small",el);
    if(strong) strong.textContent=pair[0];
    if(small) small.textContent=pair[1];
  });

  textAll(".gallery-section .eyebrow", c.galleryEyebrow);
  htmlAll(".gallery-section .section-head h2", c.galleryTitle);
  textAll(".gallery-section .disclaimer", c.galleryDisclaimer);
  $$(".gallery-grid figcaption").forEach((el,i)=>{ if(c.galleryCaps[i]) el.textContent=c.galleryCaps[i]; });

  textAll(".partner-section .eyebrow", c.partnerEyebrow);
  htmlAll(".partner-section h2", c.partnerTitle);
  textAll(".partner-section .partner-inner > p:not(.eyebrow)", c.partnerCopy);
  textAll(".partner-section .btn", c.partnerCta);

  textAll(".cta-section .eyebrow", c.ctaEyebrow);
  htmlAll(".cta-section h2", c.ctaTitle);
  textAll(".cta-section .cta-content > p:not(.eyebrow)", c.ctaCopy);
  textAll(".cta-section .btn", c.ctaButton);

  const footerItems=$$(".footer-nav a, .footer-nav button");
  footerItems.forEach((el,i)=>{ if(c.footerNav[i]) el.textContent=c.footerNav[i]; });
  const footerMeta=$$(".footer-meta > span");
  if(footerMeta[1]) footerMeta[1].textContent=c.footerAi;

  const closeBtn=$(".modal-close");
  if(closeBtn) closeBtn.setAttribute("aria-label",c.modalClose);
  textAll(".quote-intro .eyebrow",c.modalEyebrow);
  htmlAll("#quoteTitle",c.modalTitle);
  textAll(".quote-intro > p:not(.eyebrow)",c.modalIntro);

  Object.entries(c.labels).forEach(([name,value])=>fieldLabel(name,value));
  Object.entries(c.placeholders).forEach(([name,value])=>{
    const field=form?.elements?.[name];
    if(field) field.placeholder=value;
  });
  const options=$$("#quoteForm select[name='service'] option");
  options.forEach((el,i)=>{ if(c.options[i]) el.textContent=c.options[i]; });
  const consentText=$(".consent span");
  if(consentText) consentText.textContent=c.consent;
  textAll(".submit-label",c.submit);

  $$(".lang-btn").forEach(btn=>{
    const active=btn.dataset.lang===lang;
    btn.classList.toggle("active",active);
    btn.setAttribute("aria-pressed",String(active));
  });
  $$(".lang-switch").forEach(el=>el.setAttribute("aria-label",lang==="fr"?"Langue":"Language"));
  localStorage.setItem("maisonPriveeLang",lang);
}

$$(".lang-btn").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang)));
const savedLang=localStorage.getItem("maisonPriveeLang");
const browserLang=(navigator.language||"").toLowerCase().startsWith("fr")?"fr":"en";
applyLanguage(savedLang==="fr"||savedLang==="en"?savedLang:browserLang);

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
    if (!res.ok) throw new Error(payload.error || SITE_COPY[currentLang].genericError);

    status.textContent = SITE_COPY[currentLang].success;
    status.classList.add('success');
    form.reset();
  } catch (err) {
    status.textContent = err.message || SITE_COPY[currentLang].error;
    status.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
  }
});

$('#year').textContent = new Date().getFullYear();
