(() => {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const year = document.querySelector('#year');
  const form = document.querySelector('#quote-form');
  const status = document.querySelector('#form-status');

  year.textContent = new Date().getFullYear();

  const setHeaderState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > window.innerHeight * .9);
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
  if (reduceMotion) {
    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => el.classList.add('is-visible'));
  }
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

    if (window.matchMedia('(hover:hover)').matches) {
      document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('pointermove', event => {
          const bounds = card.getBoundingClientRect();
          const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
          const vertical = (event.clientY - bounds.top) / bounds.height - .5;
          card.style.setProperty('--tilt-x', `${(-vertical * 3).toFixed(2)}deg`);
          card.style.setProperty('--tilt-y', `${(horizontal * 3).toFixed(2)}deg`);
        });
        card.addEventListener('pointerleave', () => {
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
        });
      });
    }
    window.addEventListener('pagehide', () => cancelAnimationFrame(raf));
  }

  const timeline = document.querySelector('.timeline');
  const timelineLine = document.querySelector('.timeline-line');
  const projectImages = [...document.querySelectorAll('.project-media img')];
  let scrollAnimationFrame = 0;

  const updateScrollAnimations = () => {
    scrollAnimationFrame = 0;
    if (timeline && timelineLine) {
      const timelineBox = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight * .72 - timelineBox.top) / timelineBox.height));
      timelineLine.style.setProperty('--timeline-progress', progress.toFixed(3));
    }
    projectImages.forEach(image => {
      const box = image.parentElement.getBoundingClientRect();
      const distance = (window.innerHeight * .5 - (box.top + box.height * .5)) / window.innerHeight;
      const offset = Math.max(-14, Math.min(14, distance * 14));
      image.style.setProperty('--parallax-y', `${offset.toFixed(1)}px`);
    });
  };

  if (!reduceMotion) {
    const requestScrollAnimation = () => {
      if (!scrollAnimationFrame) scrollAnimationFrame = requestAnimationFrame(updateScrollAnimations);
    };
    window.addEventListener('scroll', requestScrollAnimation, { passive:true });
    window.addEventListener('resize', requestScrollAnimation, { passive:true });
    updateScrollAnimations();
    requestScrollAnimation();
  }

  const particleCanvas = document.querySelector('.statement-particles');
  const particleSection = document.querySelector('.statement');
  if (particleCanvas && particleSection && !reduceMotion) {
    (async () => {
      try {
        const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
          import('three'),
          import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js'),
          import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js'),
          import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js')
        ]);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, .1, 1000);
        camera.position.z = 80;
        const renderer = new THREE.WebGLRenderer({ canvas:particleCanvas, alpha:true, antialias:true, powerPreference:'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), .8, .1, 1));

        const particleCount = 15000;
        const original = new Float32Array(particleCount * 3);
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const white = new THREE.Color('#ffffff');
        const lime = new THREE.Color('#ccff00');
        for (let index = 0; index < particleCount; index += 1) {
          const offset = index * 3;
          original[offset] = (Math.random() - .5) * 130;
          original[offset + 1] = (Math.random() - .5) * 60;
          original[offset + 2] = (Math.random() - .5) * 55;
          positions[offset] = original[offset];
          positions[offset + 1] = original[offset + 1];
          positions[offset + 2] = original[offset + 2];
          colors[offset] = white.r;
          colors[offset + 1] = white.g;
          colors[offset + 2] = white.b;
        }
        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const pointMaterial = new THREE.PointsMaterial({ size:.5, vertexColors:true, transparent:true, opacity:.2, blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true });
        const points = new THREE.Points(pointGeometry, pointMaterial);
        scene.add(points);

        const linePositions = new Float32Array(530 * 6);
        for (let index = 0; index < 530; index += 1) {
          const offset = index * 6;
          const x = (Math.random() - .5) * 130;
          const y = (Math.random() - .5) * 60;
          const z = (Math.random() - .5) * 55;
          linePositions[offset] = x;
          linePositions[offset + 1] = y;
          linePositions[offset + 2] = z;
          linePositions[offset + 3] = x;
          linePositions[offset + 4] = y;
          linePositions[offset + 5] = z - (Math.random() * 8 + 3);
        }
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color:'#88aaff', transparent:true, opacity:.2, blending:THREE.AdditiveBlending, depthWrite:false });
        const energyLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(energyLines);

        const pointer = new THREE.Vector3(0, 0, 0);
        const pointerTarget = new THREE.Vector3(0, 0, 0);
        const pointerState = { active:false };
        let frame = 0;
        const resize = () => {
          const bounds = particleSection.getBoundingClientRect();
          renderer.setSize(bounds.width, bounds.height, false);
          composer.setSize(bounds.width, bounds.height);
          camera.aspect = bounds.width / Math.max(bounds.height, 1);
          camera.updateProjectionMatrix();
        };
        const updatePointer = event => {
          const bounds = particleSection.getBoundingClientRect();
          const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
          pointerState.active = inside;
          if (inside) {
            pointerTarget.x = ((event.clientX - bounds.left) / bounds.width - .5) * 130;
            pointerTarget.y = -((event.clientY - bounds.top) / bounds.height - .5) * 60;
          }
        };
        const animate = () => {
          frame = requestAnimationFrame(animate);
          pointer.lerp(pointerState.active ? pointerTarget : new THREE.Vector3(0, 0, 0), .08);
          const positionsAttribute = pointGeometry.attributes.position;
          const colorAttribute = pointGeometry.attributes.color;
          for (let index = 0; index < particleCount; index += 1) {
            const offset = index * 3;
            const dx = positions[offset] - pointer.x;
            const dy = positions[offset + 1] - pointer.y;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / 20);
            const force = influence * .04;
            positions[offset] += (dx / Math.max(distance, .001)) * force + (original[offset] - positions[offset]) * .012;
            positions[offset + 1] += (dy / Math.max(distance, .001)) * force + (original[offset + 1] - positions[offset + 1]) * .012;
            positions[offset + 2] += (original[offset + 2] - positions[offset + 2]) * .012;
            const color = white.clone().lerp(lime, influence * .4);
            colors[offset] = color.r;
            colors[offset + 1] = color.g;
            colors[offset + 2] = color.b;
          }
          positionsAttribute.needsUpdate = true;
          colorAttribute.needsUpdate = true;
          lineGeometry.attributes.position.needsUpdate = true;
          energyLines.position.z = (energyLines.position.z + .12) % 8;
          composer.render();
        };
        resize();
        window.addEventListener('resize', resize, { passive:true });
        window.addEventListener('pointermove', updatePointer, { passive:true });
        window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); renderer.dispose(); composer.dispose(); });
        animate();
      } catch (error) {
        particleCanvas.hidden = true;
      }
    })();
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

  const heroPin = document.querySelector('#heroPin');
  const heroStage = document.querySelector('.hero-stage');
  const video = document.querySelector('#hero-video');
  const bands = [...document.querySelectorAll('.scrub-band')].map(element => {
    const [start, end] = element.dataset.band.split(',').map(Number);
    return { element, start, end, opacity: -1 };
  });
  let scrubEnabled = false;
  let seekBusy = false;
  let pendingTime = null;
  let target = 0;
  let shown = 0;
  let frame = null;

  const heroProgress = () => {
    const total = heroPin.offsetHeight - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -heroPin.getBoundingClientRect().top / total)) : 1;
  };
  const requestSeek = time => {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = time; return; }
    seekBusy = true;
    try { video.currentTime = time; } catch { seekBusy = false; }
  };
  video.addEventListener('seeked', () => {
    seekBusy = false;
    if (pendingTime !== null) { const time = pendingTime; pendingTime = null; requestSeek(time); }
  });
  video.addEventListener('error', () => { seekBusy = false; pendingTime = null; heroStage.classList.remove('loading'); heroStage.classList.add('video-failed'); });

  const updateBands = progress => bands.forEach(band => {
    const fade = Math.min(.02, (band.end - band.start) / 3);
    const opacity = progress < band.start || progress > band.end ? 0 : Math.min(
      band.start === 0 ? 1 : Math.min(1, Math.max(0, (progress - band.start) / fade)),
      band.end === 1 ? 1 : 1 - Math.min(1, Math.max(0, (progress - band.end + fade) / fade))
    );
    if (Math.abs(opacity - band.opacity) > .004) {
      band.opacity = opacity;
      band.element.style.opacity = opacity;
    }
  });
  const tick = () => {
    shown += (target - shown) * .16;
    if (Math.abs(target - shown) < .0005) { shown = target; frame = null; }
    else frame = requestAnimationFrame(tick);
    if (video.duration) requestSeek(shown * video.duration);
    updateBands(shown);
  };
  const onScroll = () => {
    target = heroProgress();
    if (frame === null) frame = requestAnimationFrame(tick);
  };
  const loadHero = () => {
    if (video.src) return;
    heroStage.classList.add('loading');
    const markVideoReady = () => {
      video.addEventListener('canplay', () => {
        heroStage.classList.remove('loading');
        heroStage.classList.add('video-ready');
        requestSeek(heroProgress() * video.duration);
      }, { once:true });
      video.load();
    };
    if (window.location.protocol === 'file:') {
      fetch('../assets/hero-scrub.mp4').then(response => {
        if (!response.ok) throw new Error('hero-scrub introuvable');
        return response.blob();
      }).then(blob => {
        video.src = URL.createObjectURL(blob);
        markVideoReady();
      }).catch(() => {
        // Chrome bloque fetch() en file:// : repli sur le chargement direct par la balise <video>
        video.src = '../assets/hero-scrub.mp4';
        markVideoReady();
      });
    } else {
      video.src = '../assets/hero-scrub.mp4';
      markVideoReady();
    }
  };
  const applyHeroMode = () => {
    const enabled = true; // scrub vidéo forcé : actif sur desktop et mobile
    if (enabled === scrubEnabled) return;
    scrubEnabled = enabled;
    if (enabled) {
      loadHero();
      window.addEventListener('scroll', onScroll, { passive:true });
      onScroll();
    } else {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      updateBands(0);
    }
  };
  applyHeroMode();
})();
