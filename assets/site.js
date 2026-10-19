// LabOps.AI thesis page: nav state, scroll motion (GSAP + ScrollTrigger + Lenis), desktop-only Vanta hero.
// Everything renders in its final state when reduced motion is set or the CDN libraries fail to load.
(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  if (reduceMotion) return;
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js-motion');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll. Lenis leaves native touch scrolling alone by default.
  if (window.Lenis) {
    const lenis = new Lenis({ anchors: { offset: -72 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Hero: the mark builds like a sprite loading, then the copy follows.
  const mark = document.getElementById('hero-mark');
  const hero = gsap.timeline();
  hero
    .fromTo(mark, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'steps(12)' })
    .fromTo('[data-hero]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, '-=0.1')
    .add(() => gsap.to(mark, { y: -4, duration: 1.6, ease: 'steps(4)', yoyo: true, repeat: -1 }));

  // Section heads: the number steps up from 00, the heading rises, the rule draws.
  document.querySelectorAll('.s-head').forEach((head) => {
    const num = head.querySelector('.s-num');
    const target = Number(num.dataset.num);
    const counter = { v: 0 };
    num.textContent = '00';
    const tl = gsap.timeline({ scrollTrigger: { trigger: head, start: 'top 85%', once: true } });
    tl.to(counter, {
      v: target, duration: 0.4, ease: `steps(${target})`,
      onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(2, '0'); },
    })
      .from(head.querySelector('h2'), { opacity: 0, y: 12, duration: 0.5, ease: 'power3.out' }, 0)
      .from(head.querySelector('.s-rule'), { width: 0, duration: 0.6, ease: 'power2.out' }, 0.1);
  });

  // Cards, blocks, and paragraphs fade up in small batches.
  gsap.set('[data-reveal]', { y: 16 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }),
  });

  // Stat counters.
  document.querySelectorAll('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count);
    const counter = { v: 0 };
    el.textContent = '0';
    gsap.to(counter, {
      v: to, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = String(Math.round(counter.v)); },
    });
  });

  // Vein-to-vein strip: the track draws with scroll and stages appear as it reaches them.
  const strip = document.getElementById('v2v');
  const svg = strip && [...strip.querySelectorAll('svg')].find((s) => s.getBoundingClientRect().width > 0);
  if (svg) {
    const path = svg.querySelector('.v2v-path');
    const stages = [...svg.querySelectorAll('.stage')];
    const length = path.getTotalLength();
    const draw = (progress) => {
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length * (1 - progress));
      stages.forEach((g, i) => {
        g.style.opacity = progress >= i / (stages.length - 1) - 0.02 ? '1' : '0';
      });
    };
    const trigger = ScrollTrigger.create({
      trigger: strip,
      start: 'top 80%',
      end: 'bottom 85%',
      scrub: true,
      onUpdate: ({ progress }) => draw(progress),
    });
    // Covers deep links that land below the strip, where no scroll update ever fires.
    draw(trigger.progress);
  }
  // The other breakpoint's strip stays fully drawn in case the window is resized.
  if (strip) {
    strip.querySelectorAll('svg').forEach((s) => {
      if (s !== svg) s.querySelectorAll('.stage').forEach((g) => { g.style.opacity = '1'; });
    });
  }

  // Vanta CELLS behind the hero: desktop only, never downloaded on mobile, paused off-screen.
  const fx = document.getElementById('hero-fx');
  if (!fx || !matchMedia('(min-width: 768px)').matches) return;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });

  let effect = null;
  const start = () => {
    if (effect || !window.VANTA) return;
    effect = VANTA.CELLS({
      el: fx,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      color1: 0x0a0a09,
      color2: 0x5a2206,
      size: 2.2,
      speed: 0.6,
    });
  };
  const stop = () => {
    if (effect) { effect.destroy(); effect = null; }
  };

  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
    .then(() => loadScript('https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.cells.min.js'))
    .then(() => {
      new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(fx);
    })
    .catch(() => { /* static grid background stays as the fallback */ });
})();
