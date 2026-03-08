/* ========================================
   Kristina Ryaboy Portfolio - Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navigation scroll effect ──
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav-link--active');
      const href = link.getAttribute('href');
      if (current === '' && href === '#') {
        link.classList.add('nav-link--active');
      } else if (href === '#' + current) {
        link.classList.add('nav-link--active');
      }
    });
  }, { passive: true });

  // ── Mobile menu toggle ──
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav-toggle--open');
    mobileMenu.classList.toggle('mobile-menu--open');
    document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav-toggle--open');
      mobileMenu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll reveal ──
  const revealElements = document.querySelectorAll(
    '.section-heading, .project-card, .process-step, .about-visual, .about-content, .contact-text, .contact-form, .section-card'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Contact form (mailto) ──
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:kristinaryaboy13@gmail.com?subject=${subject}&body=${body}`;

    const btn = contactForm.querySelector('.btn');
    btn.textContent = 'Opening Email Client...';
    btn.style.background = 'transparent';
    btn.style.border = '1px solid #E91E79';
    btn.style.color = '#E91E79';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.border = '';
      btn.style.color = '';
      contactForm.reset();
    }, 3000);
  });

  // ── Hero canvas ──
  initHeroCanvas();
  initLogoOrbitCanvas();

  // ── Card canvases ──
  document.querySelectorAll('.card-canvas').forEach(canvas => {
    const type = canvas.dataset.type;
    if (type === 'landscape') initLandscapeCanvas(canvas);
    else if (type === 'about-target') initAboutTargetCanvas(canvas);
    else if (type === 'orbits') initOrbitsCanvas(canvas);
    else if (type === 'screens') initScreensCanvas(canvas);
    else if (type === 'portfolio-orbit') initPortfolioOrbitCanvas(canvas);
  });

  // ── About canvas ──
  initAboutCanvas();

  // ── Arcus orbit canvas ──
  initArcusOrbitCanvas();

  // ── Featured gallery canvas ──
  initFeaturedGalleryCanvas();
});


/* ========================================
   Hero Canvas - Waves, dots, particles
   ======================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  // Particles
  const particles = [];
  const pCount = 50;
  for (let i = 0; i < pCount; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.5,
      mag: Math.random() < 0.25
    });
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    // Flowing wave lines (right side, magenta)
    for (let i = 0; i < 5; i++) {
      const yBase = h * (0.25 + i * 0.14);
      const xStart = w * 0.35;
      ctx.beginPath();
      for (let x = xStart; x <= w; x += 2) {
        const progress = (x - xStart) / (w - xStart);
        const y = yBase
          + Math.sin(x * 0.005 + time * 0.0007 + i * 1.2) * (18 + i * 6) * progress
          + Math.sin(x * 0.012 + time * 0.001 + i * 0.8) * 8 * progress;
        if (x === xStart) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const alpha = (0.06 + i * 0.03) * 0.8;
      ctx.strokeStyle = i < 2
        ? `rgba(217, 225, 232, ${alpha * 0.5})`
        : `rgba(233, 30, 121, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Dot grid (subtle, right side)
    const spacing = 40;
    const gridStartX = w * 0.5;
    for (let gx = gridStartX; gx < w; gx += spacing) {
      for (let gy = spacing; gy < h; gy += spacing) {
        const dist = Math.sqrt((gx - w * 0.8) ** 2 + (gy - h * 0.3) ** 2);
        const maxDist = w * 0.4;
        if (dist < maxDist) {
          const a = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(233, 30, 121, ${a})`;
          ctx.fill();
        }
      }
    }

    // Geometric accent lines (subtle)
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.06)';
    ctx.lineWidth = 0.5;
    // Diagonal line top-right
    ctx.beginPath();
    ctx.moveTo(w * 0.7, 0);
    ctx.lineTo(w, h * 0.4);
    ctx.stroke();
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.15);
    ctx.lineTo(w * 0.95, h * 0.15);
    ctx.stroke();

    // Particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.mag
        ? 'rgba(233, 30, 121, 0.4)'
        : 'rgba(217, 225, 232, 0.15)';
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const a = (1 - dist / 100) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = (particles[i].mag || particles[j].mag)
            ? `rgba(233, 30, 121, ${a})`
            : `rgba(217, 225, 232, ${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Magenta glow, top-right corner
    const grad = ctx.createRadialGradient(w * 0.92, h * 0.1, 0, w * 0.92, h * 0.1, w * 0.35);
    grad.addColorStop(0, 'rgba(233, 30, 121, 0.07)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   Logo Orbit Canvas
   Orbit circles, dot ring, orbiting nodes behind KR logo
   ======================================== */
function initLogoOrbitCanvas() {
  const canvas = document.getElementById('logoOrbitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw(time) {
    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    const cx = w * 0.5, cy = h * 0.5;

    ctx.clearRect(0, 0, w, h);

    // === Orbit circles ===
    const oRadii = [w * 0.14, w * 0.26, w * 0.38];
    oRadii.forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(233, 30, 121, 0.18)' : 'rgba(217, 225, 232, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // === Looping dot ring ===
    const oDotCount = 36;
    const oDotR = w * 0.2;
    for (let d = 0; d < oDotCount; d++) {
      const angle = (d / oDotCount) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * oDotR;
      const dy = cy + Math.sin(angle) * oDotR * 0.85;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 30, 121, 0.12)';
      ctx.fill();
    }

    // === Orbiting nodes with glows ===
    const oNodes = [
      { r: oRadii[0], speed: 0.0008, size: 4, color: 'rgba(217, 225, 232, 0.5)' },
      { r: oRadii[1], speed: -0.0005, size: 5, color: 'rgba(233, 30, 121, 0.6)' },
      { r: oRadii[2], speed: 0.0003, size: 3.5, color: 'rgba(217, 225, 232, 0.35)' },
    ];

    oNodes.forEach(n => {
      const angle = time * n.speed;
      const nx = cx + Math.cos(angle) * n.r;
      const ny = cy + Math.sin(angle) * n.r * 0.85;
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(nx, ny, n.size * 3, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3);
      ng.addColorStop(0, n.color.replace(/[\d.]+\)/, '0.15)'));
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fill();
    });

    // === Connection line between first two nodes ===
    const oN0a = time * oNodes[0].speed;
    const oN1a = time * oNodes[1].speed;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(oN0a) * oNodes[0].r, cy + Math.sin(oN0a) * oNodes[0].r * 0.85);
    ctx.lineTo(cx + Math.cos(oN1a) * oNodes[1].r, cy + Math.sin(oN1a) * oNodes[1].r * 0.85);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   Card Canvas: Archery Target (About card)
   Target with two stuck arrows + one flying in
   ======================================== */

function initAboutTargetCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    const r = window.devicePixelRatio || 1;
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * r;
    canvas.height = h * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const rings = [
    { r: 0.38, speed: 0.0015 },
    { r: 0.28, speed: -0.0012 },
    { r: 0.18, speed: 0.0018 },
    { r: 0.10, speed: -0.0022 }
  ];

  const nodes = rings.map((ring, i) => ({
    ring: i,
    angle: Math.random() * Math.PI * 2,
    speed: ring.speed * (0.8 + Math.random() * 0.4),
    size: 2 + Math.random() * 2,
    color: i < 2 ? 'rgba(233, 30, 140, 0.2)' : 'rgba(217, 225, 232, 0.12)'
  }));

  // 36 tiny background dots
  const dots = Array.from({ length: 36 }, () => ({
    angle: Math.random() * Math.PI * 2,
    r: 0.1 + Math.random() * 0.42,
    speed: (Math.random() - 0.5) * 0.0008,
    size: 0.5 + Math.random() * 1,
    alpha: 0.04 + Math.random() * 0.06
  }));

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    // Draw orbit rings
    rings.forEach(ring => {
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r * w, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(233, 30, 140, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw tiny dots
    dots.forEach(d => {
      d.angle += d.speed;
      const x = cx + Math.cos(d.angle) * d.r * w;
      const y = cy + Math.sin(d.angle) * d.r * w;
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${d.alpha})`;
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach(n => {
      n.angle += n.speed;
      const ring = rings[n.ring];
      const x = cx + Math.cos(n.angle) * ring.r * w;
      const y = cy + Math.sin(n.angle) * ring.r * w;
      ctx.beginPath();
      ctx.arc(x, y, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
    });

    // Center magenta glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.08);
    grd.addColorStop(0, 'rgba(233, 30, 140, 0.06)');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

/* ========================================
   Card Canvas: Portfolio Orbit Background
   Orbit rings + drifting nodes behind workspace SVG
   ======================================== */
function initPortfolioOrbitCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    const r = window.devicePixelRatio || 1;
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * r;
    canvas.height = h * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const rings = [
    { r: 0.40, speed: 0.0012 },
    { r: 0.30, speed: -0.0016 },
    { r: 0.20, speed: 0.0010 },
    { r: 0.12, speed: -0.0020 }
  ];

  const nodes = rings.map((ring, i) => ({
    ring: i,
    angle: Math.random() * Math.PI * 2,
    speed: ring.speed * (0.8 + Math.random() * 0.4),
    size: 2 + Math.random() * 2,
    color: i < 2 ? 'rgba(233, 30, 140, 0.15)' : 'rgba(217, 225, 232, 0.1)'
  }));

  const dots = Array.from({ length: 30 }, () => ({
    angle: Math.random() * Math.PI * 2,
    r: 0.08 + Math.random() * 0.44,
    speed: (Math.random() - 0.5) * 0.0006,
    size: 0.5 + Math.random() * 1,
    alpha: 0.03 + Math.random() * 0.05
  }));

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    // Draw orbit rings
    rings.forEach((ring, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, ring.r * w, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(233, 30, 140, 0.05)' : 'rgba(217, 225, 232, 0.03)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw tiny drifting dots
    dots.forEach(d => {
      d.angle += d.speed;
      const x = cx + Math.cos(d.angle) * d.r * w;
      const y = cy + Math.sin(d.angle) * d.r * w;
      ctx.beginPath();
      ctx.arc(x, y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${d.alpha})`;
      ctx.fill();
    });

    // Draw orbiting nodes
    nodes.forEach(n => {
      n.angle += n.speed;
      const ring = rings[n.ring];
      const x = cx + Math.cos(n.angle) * ring.r * w;
      const y = cy + Math.sin(n.angle) * ring.r * w;
      ctx.beginPath();
      ctx.arc(x, y, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
    });

    // Center glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.07);
    grd.addColorStop(0, 'rgba(233, 30, 140, 0.04)');
    grd.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.07, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}


function initLandscapeCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;

  // Random stars
  const stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.2,
      twinkleSpeed: 0.001 + Math.random() * 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  // Hover state for arrow looping
  let isHovered = false;
  let arrowTime = 0;
  let hasLanded = false;
  canvas.addEventListener('mouseenter', () => { isHovered = true; });
  canvas.addEventListener('mouseleave', () => { isHovered = false; });

  function draw(time) {
    w = canvas.width = canvas.offsetWidth * 2;
    h = canvas.height = canvas.offsetHeight * 2;
    const cx = w * 0.52, cy = h * 0.48;

    // Background
    ctx.fillStyle = '#16222B';
    ctx.fillRect(0, 0, w, h);

    // Stars
    stars.forEach(s => {
      const alpha = 0.15 + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.1;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${alpha})`;
      ctx.fill();
    });

    // Ambient glow behind target
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
    glow.addColorStop(0, 'rgba(233, 30, 121, 0.07)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // === Orbit circles & dots (background layer — subtle) ===
    const oRadii = [w * 0.12, w * 0.22, w * 0.33];
    oRadii.forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(233, 30, 121, 0.09)' : 'rgba(217, 225, 232, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const oDotCount = 36;
    const oDotR = w * 0.17;
    for (let d = 0; d < oDotCount; d++) {
      const angle = (d / oDotCount) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * oDotR;
      const dy = cy + Math.sin(angle) * oDotR * 0.85;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 30, 121, 0.06)';
      ctx.fill();
    }

    const oNodes = [
      { r: oRadii[0], speed: 0.0005, size: 3.5, color: 'rgba(217, 225, 232, 0.25)' },
      { r: oRadii[1], speed: -0.0003, size: 4, color: 'rgba(233, 30, 121, 0.3)' },
      { r: oRadii[2], speed: 0.0002, size: 3, color: 'rgba(217, 225, 232, 0.18)' },
    ];

    oNodes.forEach(n => {
      const angle = time * n.speed;
      const nx = cx + Math.cos(angle) * n.r;
      const ny = cy + Math.sin(angle) * n.r * 0.85;
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny, n.size * 3, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3);
      ng.addColorStop(0, n.color.replace(/[\d.]+\)/, '0.08)'));
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fill();
    });

    const oN0a = time * oNodes[0].speed;
    const oN1a = time * oNodes[1].speed;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(oN0a) * oNodes[0].r, cy + Math.sin(oN0a) * oNodes[0].r * 0.85);
    ctx.lineTo(cx + Math.cos(oN1a) * oNodes[1].r, cy + Math.sin(oN1a) * oNodes[1].r * 0.85);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // === Target ===
    const targetR = Math.min(w, h) * 0.32;
    const rings = [
      { r: 1.0,  fill: 'rgba(217, 225, 232, 0.06)', stroke: 'rgba(217, 225, 232, 0.1)' },
      { r: 0.78, fill: 'rgba(217, 225, 232, 0.04)', stroke: 'rgba(217, 225, 232, 0.08)' },
      { r: 0.56, fill: 'rgba(233, 30, 121, 0.04)', stroke: 'rgba(233, 30, 121, 0.12)' },
      { r: 0.35, fill: 'rgba(233, 30, 121, 0.06)', stroke: 'rgba(233, 30, 121, 0.18)' },
      { r: 0.15, fill: 'rgba(233, 30, 121, 0.12)', stroke: 'rgba(233, 30, 121, 0.3)' },
    ];

    rings.forEach(ring => {
      const r = targetR * ring.r;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = ring.fill;
      ctx.fill();
      ctx.strokeStyle = ring.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Crosshair lines
    const chLen = targetR * 0.12;
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - chLen, cy); ctx.lineTo(cx + chLen, cy);
    ctx.moveTo(cx, cy - chLen); ctx.lineTo(cx, cy + chLen);
    ctx.stroke();

    // === Arrow flying toward target ===
    // First flight plays automatically, then pauses at target; loops on hover
    if (!hasLanded || isHovered) {
      arrowTime += 16;
    }
    let arrowCycle;
    if (hasLanded && !isHovered) {
      arrowCycle = 0.88; // pinned at target
    } else {
      arrowCycle = (arrowTime * 0.0004) % 1;
      if (!hasLanded && arrowTime * 0.0004 >= 1) {
        hasLanded = true;
        arrowCycle = 0.88;
      }
    }
    const eased = 1 - Math.pow(1 - arrowCycle, 3);

    const startX = -w * 0.15;
    const startY = cy + h * 0.3;
    const endX = cx + targetR * 0.01;
    const endY = cy - targetR * 0.02;

    const aX = startX + (endX - startX) * eased;
    const aY = startY + (endY - startY) * eased;
    const flyAngle = Math.atan2(endY - startY, endX - startX);
    const flyLen = w * 0.16;

    const tailX = aX - Math.cos(flyAngle) * flyLen;
    const tailY = aY - Math.sin(flyAngle) * flyLen;

    // Shaft
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(aX, aY);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrowhead
    const fhx = Math.cos(flyAngle), fhy = Math.sin(flyAngle);
    ctx.beginPath();
    ctx.moveTo(aX + fhx * 2, aY + fhy * 2);
    ctx.lineTo(aX - fhx * 6 + fhy * 4, aY - fhy * 6 - fhx * 4);
    ctx.lineTo(aX - fhx * 6 - fhy * 4, aY - fhy * 6 + fhx * 4);
    ctx.closePath();
    ctx.fillStyle = 'rgba(233, 30, 121, 0.7)';
    ctx.fill();

    // Feather at tail end
    const perpX = -Math.sin(flyAngle);
    const perpY = Math.cos(flyAngle);
    const featherLen = w * 0.04;
    const featherWobble = Math.sin(time * 0.003 + arrowCycle * 10) * 2;

    // Left feather vane
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 + (perpX * 8 + featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 + (perpY * 8 + featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Left vane fill
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 + (perpX * 8 + featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 + (perpY * 8 + featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.lineTo(tailX, tailY);
    ctx.fillStyle = 'rgba(233, 30, 121, 0.08)';
    ctx.fill();

    // Right feather vane
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 - (perpX * 7 - featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 - (perpY * 7 - featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right vane fill
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 - (perpX * 7 - featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 - (perpY * 7 - featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.lineTo(tailX, tailY);
    ctx.fillStyle = 'rgba(233, 30, 121, 0.05)';
    ctx.fill();

    // Feather spine (center line)
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX - fhx * featherLen, tailY - fhy * featherLen);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Motion trail
    for (let i = 1; i <= 5; i++) {
      const tx = tailX - fhx * featherLen - fhx * i * 12;
      const ty = tailY - fhy * featherLen - fhy * i * 12;
      const alpha = 0.15 - i * 0.028;
      if (alpha > 0) {
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + fhx * 8, ty + fhy * 8);
        ctx.strokeStyle = `rgba(233, 30, 121, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Impact ring when arrow arrives
    if (arrowCycle > 0.9) {
      const ringP = (arrowCycle - 0.9) / 0.1;
      const ringR = ringP * targetR * 0.15;
      ctx.beginPath();
      ctx.arc(endX, endY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(233, 30, 121, ${0.35 * (1 - ringP)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Floating particles
    for (let i = 0; i < 10; i++) {
      const px = cx + Math.sin(i * 2.3 + time * 0.0005) * w * 0.38;
      const py = cy + Math.cos(i * 1.7 + time * 0.0004) * h * 0.38;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 30, 121, ${0.1 + Math.sin(i + time * 0.002) * 0.07})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   Card Canvas: Cogs (Process card)
   Interlocking rotating gears
   ======================================== */
function initOrbitsCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;

  // Random stars
  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1,
      twinkleSpeed: 0.001 + Math.random() * 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  // Draw a single gear/cog
  function drawGear(cx, cy, outerR, innerR, teeth, rotation, strokeColor, fillColor, holeR) {
    const toothDepth = outerR - innerR;
    const anglePerTooth = (Math.PI * 2) / teeth;
    const halfTooth = anglePerTooth * 0.3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    // Gear outline
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const baseAngle = i * anglePerTooth;

      // Bottom of valley
      const v1a = baseAngle - halfTooth * 1.1;
      const v2a = baseAngle + halfTooth * 1.1;
      // Top of tooth
      const t1a = baseAngle + anglePerTooth * 0.5 - halfTooth;
      const t2a = baseAngle + anglePerTooth * 0.5 + halfTooth;

      if (i === 0) {
        ctx.moveTo(Math.cos(v1a) * innerR, Math.sin(v1a) * innerR);
      }
      // Rise to tooth
      ctx.lineTo(Math.cos(v2a) * innerR, Math.sin(v2a) * innerR);
      ctx.lineTo(Math.cos(t1a) * outerR, Math.sin(t1a) * outerR);
      ctx.lineTo(Math.cos(t2a) * outerR, Math.sin(t2a) * outerR);
      // Next valley
      const nextV1a = (i + 1) * anglePerTooth - halfTooth * 1.1;
      ctx.lineTo(Math.cos(nextV1a) * innerR, Math.sin(nextV1a) * innerR);
    }
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, holeR, 0, Math.PI * 2);
    ctx.fillStyle = '#16222B';
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Hub spokes
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + rotation * 0.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * holeR * 0.4, Math.sin(a) * holeR * 0.4);
      ctx.lineTo(Math.cos(a) * (innerR * 0.6), Math.sin(a) * (innerR * 0.6));
      ctx.strokeStyle = strokeColor.replace(/[\d.]+\)$/, '0.3)');
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(0, 0, holeR * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = strokeColor;
    ctx.fill();

    ctx.restore();
  }

  function draw(time) {
    w = canvas.width = canvas.offsetWidth * 2;
    h = canvas.height = canvas.offsetHeight * 2;
    const cx = w * 0.5, cy = h * 0.5;

    // Background
    ctx.fillStyle = '#16222B';
    ctx.fillRect(0, 0, w, h);

    // Stars
    stars.forEach(s => {
      const alpha = 0.12 + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.08;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${alpha})`;
      ctx.fill();
    });

    // Center glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
    glow.addColorStop(0, 'rgba(233, 30, 121, 0.07)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // === Orbit circles & dots (background layer — subtle) ===
    const oRadii = [w * 0.12, w * 0.22, w * 0.33];
    oRadii.forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(233, 30, 121, 0.09)' : 'rgba(217, 225, 232, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const oDotCount = 36;
    const oDotR = w * 0.17;
    for (let d = 0; d < oDotCount; d++) {
      const angle = (d / oDotCount) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * oDotR;
      const dy = cy + Math.sin(angle) * oDotR * 0.85;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 30, 121, 0.06)';
      ctx.fill();
    }

    const oNodes = [
      { r: oRadii[0], speed: 0.0005, size: 3.5, color: 'rgba(217, 225, 232, 0.25)' },
      { r: oRadii[1], speed: -0.0003, size: 4, color: 'rgba(233, 30, 121, 0.3)' },
      { r: oRadii[2], speed: 0.0002, size: 3, color: 'rgba(217, 225, 232, 0.18)' },
    ];

    oNodes.forEach(n => {
      const angle = time * n.speed;
      const nx = cx + Math.cos(angle) * n.r;
      const ny = cy + Math.sin(angle) * n.r * 0.85;
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, ny, n.size * 3, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3);
      ng.addColorStop(0, n.color.replace(/[\d.]+\)/, '0.08)'));
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fill();
    });

    const oN0a = time * oNodes[0].speed;
    const oN1a = time * oNodes[1].speed;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(oN0a) * oNodes[0].r, cy + Math.sin(oN0a) * oNodes[0].r * 0.85);
    ctx.lineTo(cx + Math.cos(oN1a) * oNodes[1].r, cy + Math.sin(oN1a) * oNodes[1].r * 0.85);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Base rotation speed
    const baseRot = time * 0.0004;

    // Gear definitions: interlocking cogs
    const unit = Math.min(w, h);

    // Large main gear (center-left)
    const g1R = unit * 0.22;
    const g1Teeth = 12;
    const g1x = cx - unit * 0.08;
    const g1y = cy + unit * 0.02;

    // Medium gear (upper-right, meshes with large)
    const g2R = unit * 0.14;
    const g2Teeth = 8;
    // Position so teeth mesh: distance = g1innerR + g2innerR (approx)
    const g2x = g1x + (g1R * 0.85 + g2R * 0.85) * Math.cos(-0.6);
    const g2y = g1y + (g1R * 0.85 + g2R * 0.85) * Math.sin(-0.6);

    // Small gear (lower-right, meshes with large)
    const g3R = unit * 0.1;
    const g3Teeth = 6;
    const g3x = g1x + (g1R * 0.85 + g3R * 0.85) * Math.cos(1.2);
    const g3y = g1y + (g1R * 0.85 + g3R * 0.85) * Math.sin(1.2);

    // Gear rotations: meshing gears rotate opposite, ratio by tooth count
    const g1Rot = baseRot;
    const g2Rot = -baseRot * (g1Teeth / g2Teeth) + Math.PI / g2Teeth; // offset for mesh alignment
    const g3Rot = -baseRot * (g1Teeth / g3Teeth) + Math.PI / g3Teeth;

    // Draw gears (back to front)
    // Small gear
    drawGear(
      g3x, g3y,
      g3R, g3R * 0.78, g3Teeth, g3Rot,
      'rgba(217, 225, 232, 0.25)',
      'rgba(217, 225, 232, 0.03)',
      g3R * 0.3
    );

    // Medium gear
    drawGear(
      g2x, g2y,
      g2R, g2R * 0.78, g2Teeth, g2Rot,
      'rgba(233, 30, 121, 0.4)',
      'rgba(233, 30, 121, 0.04)',
      g2R * 0.28
    );

    // Large main gear
    drawGear(
      g1x, g1y,
      g1R, g1R * 0.8, g1Teeth, g1Rot,
      'rgba(217, 225, 232, 0.3)',
      'rgba(217, 225, 232, 0.02)',
      g1R * 0.22
    );

    // Floating particles
    for (let i = 0; i < 10; i++) {
      const px = cx + Math.sin(i * 2.3 + time * 0.0005) * w * 0.38;
      const py = cy + Math.cos(i * 1.7 + time * 0.0004) * h * 0.38;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 30, 121, ${0.1 + Math.sin(i + time * 0.002) * 0.07})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   Card Canvas: Gallery (Portfolio card)
   Abstract art gallery with easel and frames
   ======================================== */
function initScreensCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let w, h;

  // Random stars
  const stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1,
      twinkleSpeed: 0.001 + Math.random() * 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  // Gallery frames (relative positions & sizes)
  const frames = [
    { x: 0.12, y: 0.25, w: 0.18, h: 0.28, accent: true },
    { x: 0.42, y: 0.2, w: 0.22, h: 0.35, accent: false },
    { x: 0.75, y: 0.28, w: 0.15, h: 0.22, accent: false },
  ];

  // Hover state for notebook animation
  let isNbHovered = false;
  let nbAnimTime = 0;
  canvas.addEventListener('mouseenter', () => { isNbHovered = true; });
  canvas.addEventListener('mouseleave', () => { isNbHovered = false; });

  function draw(time) {
    w = canvas.width = canvas.offsetWidth * 2;
    h = canvas.height = canvas.offsetHeight * 2;
    const cx = w * 0.5, cy = h * 0.5;

    // Background
    ctx.fillStyle = '#16222B';
    ctx.fillRect(0, 0, w, h);

    // Stars
    stars.forEach(s => {
      const alpha = 0.12 + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.08;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${alpha})`;
      ctx.fill();
    });

    // === Orbit circles & dots (background layer — subtle) ===
    // Center glow
    const orbitGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.35);
    orbitGlow.addColorStop(0, 'rgba(233, 30, 121, 0.03)');
    orbitGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = orbitGlow;
    ctx.fillRect(0, 0, w, h);

    // Orbit rings
    const radii = [w * 0.12, w * 0.22, w * 0.33];
    radii.forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(233, 30, 121, 0.09)' : 'rgba(217, 225, 232, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Dot ring (inner)
    const dotCount = 36;
    const dotR = w * 0.17;
    for (let d = 0; d < dotCount; d++) {
      const angle = (d / dotCount) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * dotR;
      const dy = cy + Math.sin(angle) * dotR * 0.85;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 30, 121, 0.06)';
      ctx.fill();
    }

    // Orbiting nodes
    const orbitNodes = [
      { r: radii[0], speed: 0.0005, size: 3.5, color: 'rgba(217, 225, 232, 0.25)' },
      { r: radii[1], speed: -0.0003, size: 4, color: 'rgba(233, 30, 121, 0.3)' },
      { r: radii[2], speed: 0.0002, size: 3, color: 'rgba(217, 225, 232, 0.18)' },
    ];

    orbitNodes.forEach(n => {
      const angle = time * n.speed;
      const nx = cx + Math.cos(angle) * n.r;
      const ny = cy + Math.sin(angle) * n.r * 0.85;
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(nx, ny, n.size * 3, 0, Math.PI * 2);
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3);
      ng.addColorStop(0, n.color.replace(/[\d.]+\)/, '0.08)'));
      ng.addColorStop(1, 'transparent');
      ctx.fillStyle = ng;
      ctx.fill();
    });

    // Connection line between inner nodes
    const n0a = time * orbitNodes[0].speed;
    const n1a = time * orbitNodes[1].speed;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(n0a) * orbitNodes[0].r, cy + Math.sin(n0a) * orbitNodes[0].r * 0.85);
    ctx.lineTo(cx + Math.cos(n1a) * orbitNodes[1].r, cy + Math.sin(n1a) * orbitNodes[1].r * 0.85);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.04)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Gallery wall line (subtle horizon)
    const wallY = h * 0.7;
    ctx.beginPath();
    ctx.moveTo(w * 0.05, wallY);
    ctx.lineTo(w * 0.95, wallY);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw gallery frames
    frames.forEach((f, i) => {
      const fx = f.x * w;
      const fy = f.y * h;
      const fw = f.w * w;
      const fh = f.h * h;
      const bob = Math.sin(time * 0.0006 + i * 2) * 3;

      // Frame shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(fx + 3, fy + 3 + bob, fw, fh);

      // Frame background (canvas)
      const canvasGrad = ctx.createLinearGradient(fx, fy + bob, fx + fw, fy + fh + bob);
      canvasGrad.addColorStop(0, 'rgba(26, 40, 54, 0.9)');
      canvasGrad.addColorStop(1, 'rgba(22, 34, 43, 0.95)');
      ctx.fillStyle = canvasGrad;
      ctx.fillRect(fx, fy + bob, fw, fh);

      // Frame border
      ctx.strokeStyle = f.accent
        ? 'rgba(233, 30, 121, 0.3)'
        : 'rgba(217, 225, 232, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx, fy + bob, fw, fh);

      // Inner mat border
      const mat = 6;
      ctx.strokeStyle = 'rgba(217, 225, 232, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(fx + mat, fy + mat + bob, fw - mat * 2, fh - mat * 2);

      // Abstract art inside each frame
      if (i === 0) {
        // Brushstroke curves
        for (let s = 0; s < 3; s++) {
          ctx.beginPath();
          const sy1 = fy + fh * 0.3 + s * fh * 0.15 + bob;
          const sy2 = fy + fh * 0.5 + s * fh * 0.1 + bob;
          ctx.moveTo(fx + mat + 4, sy1);
          ctx.quadraticCurveTo(fx + fw * 0.5, sy2 + Math.sin(time * 0.001 + s) * 4, fx + fw - mat - 4, sy1);
          ctx.strokeStyle = s === 1
            ? `rgba(233, 30, 121, ${0.25 + Math.sin(time * 0.001) * 0.08})`
            : `rgba(217, 225, 232, ${0.08 + s * 0.03})`;
          ctx.lineWidth = 1.5 - s * 0.3;
          ctx.stroke();
        }
      } else if (i === 1) {
        // Abstract shapes — circle and lines
        const shapeCx = fx + fw * 0.5;
        const shapeCy = fy + fh * 0.45 + bob;
        const shapeR = Math.min(fw, fh) * 0.2;
        const breathe = Math.sin(time * 0.0008) * shapeR * 0.08;

        ctx.beginPath();
        ctx.arc(shapeCx, shapeCy, shapeR + breathe, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(233, 30, 121, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Cross lines through circle
        ctx.beginPath();
        ctx.moveTo(shapeCx - shapeR * 1.3, shapeCy);
        ctx.lineTo(shapeCx + shapeR * 1.3, shapeCy);
        ctx.moveTo(shapeCx, shapeCy - shapeR * 1.3);
        ctx.lineTo(shapeCx, shapeCy + shapeR * 1.3);
        ctx.strokeStyle = 'rgba(217, 225, 232, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Corner accent dots
        const dotOff = 10;
        [[fx + mat + dotOff, fy + mat + dotOff + bob], [fx + fw - mat - dotOff, fy + fh - mat - dotOff + bob]].forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(dx, dy, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(233, 30, 121, 0.35)';
          ctx.fill();
        });
      } else {
        // Abstract triangles
        const triCx = fx + fw * 0.5;
        const triTop = fy + mat + 8 + bob;
        const triBot = fy + fh - mat - 8 + bob;

        ctx.beginPath();
        ctx.moveTo(triCx, triTop);
        ctx.lineTo(fx + mat + 6, triBot);
        ctx.lineTo(fx + fw - mat - 6, triBot);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(217, 225, 232, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner smaller triangle
        ctx.beginPath();
        ctx.moveTo(triCx, triTop + (triBot - triTop) * 0.3);
        ctx.lineTo(triCx - fw * 0.15, triBot - 4);
        ctx.lineTo(triCx + fw * 0.15, triBot - 4);
        ctx.closePath();
        ctx.strokeStyle = `rgba(233, 30, 121, ${0.2 + Math.sin(time * 0.001) * 0.08})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Hanging wire from frame
      ctx.beginPath();
      ctx.moveTo(fx + fw * 0.35, fy + bob);
      ctx.quadraticCurveTo(fx + fw * 0.5, fy - 12 + bob, fx + fw * 0.65, fy + bob);
      ctx.strokeStyle = 'rgba(217, 225, 232, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Easel (right-center area)
    const easelX = w * 0.62;
    const easelBot = h * 0.88;
    const easelTop = h * 0.18;
    const easelSpread = w * 0.06;
    const easelSway = Math.sin(time * 0.0005) * 1.5;

    // Back leg
    ctx.beginPath();
    ctx.moveTo(easelX - easelSpread * 0.3 + easelSway, easelTop + h * 0.15);
    ctx.lineTo(easelX - easelSpread * 1.2, easelBot);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Front left leg
    ctx.beginPath();
    ctx.moveTo(easelX - easelSpread * 0.5 + easelSway, easelTop);
    ctx.lineTo(easelX - easelSpread, easelBot);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Front right leg
    ctx.beginPath();
    ctx.moveTo(easelX + easelSpread * 0.5 + easelSway, easelTop);
    ctx.lineTo(easelX + easelSpread, easelBot);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shelf/ledge
    const shelfY = easelTop + h * 0.45;
    ctx.beginPath();
    ctx.moveTo(easelX - easelSpread * 0.7 + easelSway * 0.5, shelfY);
    ctx.lineTo(easelX + easelSpread * 0.7 + easelSway * 0.5, shelfY);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Small canvas on easel
    const ecW = easelSpread * 1.6;
    const ecH = ecW * 0.75;
    const ecX = easelX - ecW * 0.5 + easelSway * 0.5;
    const ecY = shelfY - ecH - 4;

    ctx.fillStyle = 'rgba(26, 40, 54, 0.8)';
    ctx.fillRect(ecX, ecY, ecW, ecH);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(ecX, ecY, ecW, ecH);

    // Paint stroke on easel canvas
    ctx.beginPath();
    ctx.moveTo(ecX + ecW * 0.15, ecY + ecH * 0.5);
    ctx.quadraticCurveTo(ecX + ecW * 0.5, ecY + ecH * 0.3 + Math.sin(time * 0.001) * 3, ecX + ecW * 0.85, ecY + ecH * 0.55);
    ctx.strokeStyle = `rgba(233, 30, 121, ${0.3 + Math.sin(time * 0.0012) * 0.1})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // === Notebook falling open animation (hover only) ===
    if (isNbHovered) nbAnimTime += 16;
    let openAmt = 0;
    if (isNbHovered) {
      const nbCycle = (nbAnimTime * 0.00025) % 1;
      if (nbCycle < 0.4) {
        openAmt = 0;
      } else if (nbCycle < 0.7) {
        openAmt = (nbCycle - 0.4) / 0.3;
        openAmt = openAmt * openAmt * (3 - 2 * openAmt);
      } else if (nbCycle < 0.85) {
        openAmt = 1;
      } else {
        openAmt = 1 - (nbCycle - 0.85) / 0.15;
        openAmt = openAmt * openAmt * (3 - 2 * openAmt);
      }
    }

    const nbX = w * 0.15;
    const nbY = h * 0.72;
    const nbW = w * 0.14;
    const nbH = nbW * 0.7;
    const coverAngle = openAmt * Math.PI * 0.45; // max ~80 degrees open

    ctx.save();
    ctx.translate(nbX + nbW * 0.5, nbY + nbH * 0.5);
    ctx.rotate(-0.15); // slight angle
    ctx.translate(-nbW * 0.5, -nbH * 0.5);

    // Back cover (always flat)
    ctx.fillStyle = 'rgba(26, 40, 54, 0.8)';
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.12)';
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, nbW, nbH);
    ctx.strokeRect(0, 0, nbW, nbH);

    // Pages (visible when opening)
    if (openAmt > 0.05) {
      const pageW = nbW * 0.95;
      const pageH = nbH * 0.9;
      const pageX = nbW * 0.025;
      const pageY = nbH * 0.05;

      ctx.fillStyle = 'rgba(217, 225, 232, 0.06)';
      ctx.fillRect(pageX, pageY, pageW, pageH);

      // Page lines (sketch marks)
      for (let l = 0; l < 4; l++) {
        const ly = pageY + 6 + l * (pageH * 0.2);
        const lw = pageW * (0.4 + Math.random() * 0.4);
        ctx.beginPath();
        ctx.moveTo(pageX + 5, ly);
        ctx.lineTo(pageX + 5 + lw * openAmt, ly);
        ctx.strokeStyle = `rgba(217, 225, 232, ${0.06 * openAmt})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Small magenta sketch circle on page
      if (openAmt > 0.5) {
        const skAlpha = (openAmt - 0.5) * 2 * 0.3;
        ctx.beginPath();
        ctx.arc(pageX + pageW * 0.6, pageY + pageH * 0.55, pageW * 0.1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(233, 30, 121, ${skAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    // Front cover (pivots from left spine)
    ctx.save();
    ctx.translate(0, 0); // spine is at left edge
    ctx.transform(Math.cos(coverAngle), -Math.sin(coverAngle) * 0.15, 0, 1, 0, 0);

    // Cover with perspective squish
    const coverW = nbW * (1 - openAmt * 0.15);
    ctx.fillStyle = 'rgba(31, 46, 58, 0.9)';
    ctx.strokeStyle = openAmt > 0.5
      ? `rgba(233, 30, 121, ${0.15 + openAmt * 0.1})`
      : 'rgba(217, 225, 232, 0.15)';
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, coverW, nbH);
    ctx.strokeRect(0, 0, coverW, nbH);

    // Cover "K" monogram
    if (openAmt < 0.7) {
      const kAlpha = 0.5 * (1 - openAmt / 0.7);
      const kSize = nbH * 0.35;
      const kX = coverW * 0.5;
      const kY = nbH * 0.48;
      ctx.font = `600 ${kSize}px 'Josefin Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = `rgba(233, 30, 121, ${kAlpha})`;
      ctx.fillText('K', kX, kY);
    }

    ctx.restore();

    // Spine accent
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, nbH);
    ctx.strokeStyle = `rgba(233, 30, 121, ${0.2 + openAmt * 0.15})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Floating particles
    for (let i = 0; i < 10; i++) {
      const px = cx + Math.sin(i * 2.5 + time * 0.0005) * w * 0.35;
      const py = cy + Math.cos(i * 1.9 + time * 0.0004) * h * 0.3;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 30, 121, ${0.1 + Math.sin(i + time * 0.002) * 0.07})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   About Canvas - Archery Target
   Matches card icon, arrow flies on hover only
   ======================================== */
function initAboutCanvas() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.closest('.about-visual__landscape') || canvas.parentElement;

  // Hover state
  let hoverAmount = 0;
  let arrowTime = 0;
  let hasLanded = false;
  parent.addEventListener('mouseenter', () => { parent._hovered = true; });
  parent.addEventListener('mouseleave', () => { parent._hovered = false; });

  const stars = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      twinkleSpeed: 0.001 + Math.random() * 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }

  function draw(time) {
    const w = canvas.width = canvas.offsetWidth * 1.5;
    const h = canvas.height = canvas.offsetHeight * 1.5;

    const target = parent._hovered ? 1 : 0;
    hoverAmount += (target - hoverAmount) * 0.04;

    // Only advance arrow time when hovered
    if (hoverAmount > 0.1) arrowTime += 16;

    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1a2836');
    sky.addColorStop(0.6, '#1F2E3A');
    sky.addColorStop(1, '#16222B');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const cx = w * 0.5, cy = h * 0.48;

    // Stars
    stars.forEach(s => {
      const alpha = 0.15 + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.1;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${alpha})`;
      ctx.fill();
    });

    // Ambient glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.4);
    glow.addColorStop(0, 'rgba(233, 30, 121, 0.07)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // === Target ===
    const targetR = Math.min(w, h) * 0.32;
    const rings = [
      { r: 1.0,  fill: 'rgba(217, 225, 232, 0.06)', stroke: 'rgba(217, 225, 232, 0.1)' },
      { r: 0.78, fill: 'rgba(217, 225, 232, 0.04)', stroke: 'rgba(217, 225, 232, 0.08)' },
      { r: 0.56, fill: 'rgba(233, 30, 121, 0.04)', stroke: 'rgba(233, 30, 121, 0.12)' },
      { r: 0.35, fill: 'rgba(233, 30, 121, 0.06)', stroke: 'rgba(233, 30, 121, 0.18)' },
      { r: 0.15, fill: 'rgba(233, 30, 121, 0.12)', stroke: 'rgba(233, 30, 121, 0.3)' },
    ];

    rings.forEach(ring => {
      const r = targetR * ring.r;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = ring.fill;
      ctx.fill();
      ctx.strokeStyle = ring.stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Crosshair
    const chLen = targetR * 0.12;
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.2)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(cx - chLen, cy); ctx.lineTo(cx + chLen, cy);
    ctx.moveTo(cx, cy - chLen); ctx.lineTo(cx, cy + chLen);
    ctx.stroke();

    // === Arrow (flies once on load, pauses at target, loops on hover) ===
    if (!hasLanded || hoverAmount > 0.1) {
      arrowTime += 16;
    }
    let arrowCycle;
    if (hasLanded && hoverAmount < 0.1) {
      arrowCycle = 0.88; // pinned at target
    } else {
      arrowCycle = (arrowTime * 0.0004) % 1;
      if (!hasLanded && arrowTime * 0.0004 >= 1) {
        hasLanded = true;
        arrowCycle = 0.88;
      }
    }
    const eased = 1 - Math.pow(1 - arrowCycle, 3);

    const startX = -w * 0.15;
    const startY = cy + h * 0.3;
    const endX = cx + targetR * 0.01;
    const endY = cy - targetR * 0.02;

    const aX = startX + (endX - startX) * eased;
    const aY = startY + (endY - startY) * eased;
    const flyAngle = Math.atan2(endY - startY, endX - startX);
    const flyLen = w * 0.16;
    const fhx = Math.cos(flyAngle), fhy = Math.sin(flyAngle);

    const tailX = aX - fhx * flyLen;
    const tailY = aY - fhy * flyLen;

    // Shaft
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(aX, aY);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(aX + fhx * 2, aY + fhy * 2);
    ctx.lineTo(aX - fhx * 7 + fhy * 5, aY - fhy * 7 - fhx * 5);
    ctx.lineTo(aX - fhx * 7 - fhy * 5, aY - fhy * 7 + fhx * 5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(233, 30, 121, 0.7)';
    ctx.fill();

    // Feather at tail
    const perpX = -Math.sin(flyAngle);
    const perpY = Math.cos(flyAngle);
    const featherLen = w * 0.04;
    const featherWobble = Math.sin(arrowTime * 0.003 + arrowCycle * 10) * 2;

    // Left vane
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 + (perpX * 10 + featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 + (perpY * 10 + featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.lineTo(tailX, tailY);
    ctx.fillStyle = 'rgba(233, 30, 121, 0.08)';
    ctx.fill();

    // Right vane
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.quadraticCurveTo(
      tailX - fhx * featherLen * 0.5 - (perpX * 9 - featherWobble * perpX),
      tailY - fhy * featherLen * 0.5 - (perpY * 9 - featherWobble * perpY),
      tailX - fhx * featherLen, tailY - fhy * featherLen
    );
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.lineTo(tailX, tailY);
    ctx.fillStyle = 'rgba(233, 30, 121, 0.05)';
    ctx.fill();

    // Feather spine
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tailX - fhx * featherLen, tailY - fhy * featherLen);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Motion trail (only during flight, not when pinned)
    if (!(hasLanded && hoverAmount < 0.1)) {
      for (let i = 1; i <= 5; i++) {
        const tx = tailX - fhx * featherLen - fhx * i * 14;
        const ty = tailY - fhy * featherLen - fhy * i * 14;
        const alpha = 0.15 - i * 0.028;
        if (alpha > 0) {
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + fhx * 10, ty + fhy * 10);
          ctx.strokeStyle = `rgba(233, 30, 121, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Impact ring
    if (arrowCycle > 0.9) {
      const ringP = (arrowCycle - 0.9) / 0.1;
      const ringR = ringP * targetR * 0.15;
      ctx.beginPath();
      ctx.arc(endX, endY, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(233, 30, 121, ${0.35 * (1 - ringP)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Floating particles
    for (let i = 0; i < 12; i++) {
      const baseX = cx + Math.sin(i * 2.1) * w * 0.38;
      const baseY = cy + Math.cos(i * 1.8) * h * 0.38;
      const drift = 0.3 + hoverAmount * 0.7;
      const px = baseX + Math.sin(i * 2.1 + time * 0.0004) * w * 0.03 * drift;
      const py = baseY + Math.cos(i * 1.8 + time * 0.0003) * h * 0.03 * drift;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 30, 121, ${0.08 + Math.sin(i + time * 0.002) * 0.04})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw(0);
}


/* ========================================
   Arcus Orbit Canvas (Portfolio card background)
   Subtle rotating orbits behind the Arcus logo
   ======================================== */
function initArcusOrbitCanvas() {
  const canvas = document.getElementById('arcusOrbitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function draw(time) {
    w = canvas.width = canvas.offsetWidth * 2;
    h = canvas.height = canvas.offsetHeight * 2;
    const cx = w * 0.5, cy = h * 0.5;

    ctx.clearRect(0, 0, w, h);

    // Soft center glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.38);
    glow.addColorStop(0, 'rgba(233, 30, 121, 0.06)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Orbit circles
    const radii = [w * 0.1, w * 0.19, w * 0.29, w * 0.4];
    radii.forEach((r, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.85, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 || i === 3
        ? 'rgba(233, 30, 121, 0.07)'
        : 'rgba(217, 225, 232, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Dot ring
    const dotCount = 48;
    const dotR = w * 0.24;
    for (let d = 0; d < dotCount; d++) {
      const angle = (d / dotCount) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * dotR;
      const dy = cy + Math.sin(angle) * dotR * 0.85;
      ctx.beginPath();
      ctx.arc(dx, dy, 1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233, 30, 121, 0.05)';
      ctx.fill();
    }

    // Orbiting nodes
    const nodes = [
      { r: radii[0], speed:  0.0004, size: 3,   color: 'rgba(217, 225, 232, 0.2)' },
      { r: radii[1], speed: -0.00025, size: 3.5, color: 'rgba(233, 30, 121, 0.25)' },
      { r: radii[2], speed:  0.00015, size: 2.5, color: 'rgba(217, 225, 232, 0.15)' },
      { r: radii[3], speed: -0.0001, size: 2,   color: 'rgba(41, 211, 239, 0.18)' },
    ];

    nodes.forEach(n => {
      const angle = time * n.speed;
      const nx = cx + Math.cos(angle) * n.r;
      const ny = cy + Math.sin(angle) * n.r * 0.85;
      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      // Glow
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3);
      ng.addColorStop(0, n.color.replace(/[\d.]+\)/, '0.06)'));
      ng.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(nx, ny, n.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = ng;
      ctx.fill();
    });

    // Connection lines between adjacent nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      const a1 = time * nodes[i].speed;
      const a2 = time * nodes[i + 1].speed;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * nodes[i].r, cy + Math.sin(a1) * nodes[i].r * 0.85);
      ctx.lineTo(cx + Math.cos(a2) * nodes[i + 1].r, cy + Math.sin(a2) * nodes[i + 1].r * 0.85);
      ctx.strokeStyle = 'rgba(233, 30, 121, 0.03)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}


/* ========================================
   Featured Gallery Canvas (Portfolio section)
   Static art gallery matching card icon
   ======================================== */
function initFeaturedGalleryCanvas() {
  const canvas = document.getElementById('featuredGalleryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      ts: 0.001 + Math.random() * 0.003,
      to: Math.random() * Math.PI * 2,
    });
  }

  const frames = [
    { x: 0.05, y: 0.18, w: 0.2, h: 0.32, accent: true },
    { x: 0.3, y: 0.12, w: 0.25, h: 0.4, accent: false },
    { x: 0.6, y: 0.2, w: 0.18, h: 0.28, accent: false },
    { x: 0.82, y: 0.15, w: 0.14, h: 0.35, accent: true },
  ];

  function draw(time) {
    const w = canvas.width = canvas.offsetWidth * 1.5;
    const h = canvas.height = canvas.offsetHeight * 1.5;
    const cx = w * 0.5, cy = h * 0.5;

    ctx.fillStyle = '#16222B';
    ctx.fillRect(0, 0, w, h);

    // Stars
    stars.forEach(s => {
      const a = 0.12 + Math.sin(time * s.ts + s.to) * 0.08;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217, 225, 232, ${a})`;
      ctx.fill();
    });

    // Gallery wall
    ctx.beginPath();
    ctx.moveTo(w * 0.03, h * 0.68);
    ctx.lineTo(w * 0.97, h * 0.68);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Ambient glow
    const glow = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy * 0.8, w * 0.4);
    glow.addColorStop(0, 'rgba(233, 30, 121, 0.04)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Frames
    frames.forEach((f, i) => {
      const fx = f.x * w, fy = f.y * h, fw = f.w * w, fh = f.h * h;
      const mat = 6;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(fx + 3, fy + 3, fw, fh);

      const cg = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
      cg.addColorStop(0, 'rgba(26, 40, 54, 0.9)');
      cg.addColorStop(1, 'rgba(22, 34, 43, 0.95)');
      ctx.fillStyle = cg;
      ctx.fillRect(fx, fy, fw, fh);

      ctx.strokeStyle = f.accent ? 'rgba(233, 30, 121, 0.3)' : 'rgba(217, 225, 232, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx, fy, fw, fh);

      ctx.strokeStyle = 'rgba(217, 225, 232, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(fx + mat, fy + mat, fw - mat * 2, fh - mat * 2);

      if (i === 0) {
        for (let s = 0; s < 3; s++) {
          ctx.beginPath();
          ctx.moveTo(fx + mat + 4, fy + fh * 0.3 + s * fh * 0.15);
          ctx.quadraticCurveTo(fx + fw * 0.5, fy + fh * 0.5 + s * fh * 0.1, fx + fw - mat - 4, fy + fh * 0.3 + s * fh * 0.15);
          ctx.strokeStyle = s === 1 ? 'rgba(233, 30, 121, 0.25)' : `rgba(217, 225, 232, ${0.08 + s * 0.03})`;
          ctx.lineWidth = 1.5 - s * 0.3;
          ctx.stroke();
        }
      } else if (i === 1) {
        const scx = fx + fw * 0.5, scy = fy + fh * 0.45, sr = Math.min(fw, fh) * 0.2;
        ctx.beginPath(); ctx.arc(scx, scy, sr, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(233, 30, 121, 0.25)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(scx - sr * 1.3, scy); ctx.lineTo(scx + sr * 1.3, scy);
        ctx.moveTo(scx, scy - sr * 1.3); ctx.lineTo(scx, scy + sr * 1.3);
        ctx.strokeStyle = 'rgba(217, 225, 232, 0.08)'; ctx.lineWidth = 0.5; ctx.stroke();
        [[fx + mat + 10, fy + mat + 10], [fx + fw - mat - 10, fy + fh - mat - 10]].forEach(([dx, dy]) => {
          ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(233, 30, 121, 0.35)'; ctx.fill();
        });
      } else if (i === 2) {
        const tcx = fx + fw * 0.5, tt = fy + mat + 8, tb = fy + fh - mat - 8;
        ctx.beginPath(); ctx.moveTo(tcx, tt); ctx.lineTo(fx + mat + 6, tb); ctx.lineTo(fx + fw - mat - 6, tb); ctx.closePath();
        ctx.strokeStyle = 'rgba(217, 225, 232, 0.1)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tcx, tt + (tb - tt) * 0.3); ctx.lineTo(tcx - fw * 0.15, tb - 4); ctx.lineTo(tcx + fw * 0.15, tb - 4); ctx.closePath();
        ctx.strokeStyle = 'rgba(233, 30, 121, 0.2)'; ctx.lineWidth = 0.8; ctx.stroke();
      } else {
        for (let s = 0; s < 4; s++) {
          ctx.beginPath();
          const by = fy + mat + 10 + s * (fh - mat * 2 - 20) / 3;
          for (let x = fx + mat; x <= fx + fw - mat; x += 2) {
            const rx = (x - fx - mat) / (fw - mat * 2);
            const y = by + Math.sin(rx * Math.PI * 2 + s * 1.5) * 6;
            if (x === fx + mat) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = s === 2 ? 'rgba(233, 30, 121, 0.2)' : `rgba(217, 225, 232, ${0.06 + s * 0.02})`;
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      }

      // Hanging wire
      ctx.beginPath();
      ctx.moveTo(fx + fw * 0.35, fy);
      ctx.quadraticCurveTo(fx + fw * 0.5, fy - 14, fx + fw * 0.65, fy);
      ctx.strokeStyle = 'rgba(217, 225, 232, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Easel
    const ex = w * 0.52, eBot = h * 0.9, eTop = h * 0.2, es = w * 0.05;
    ctx.beginPath(); ctx.moveTo(ex - es * 0.3, eTop + h * 0.15); ctx.lineTo(ex - es * 1.2, eBot);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.1)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex - es * 0.5, eTop); ctx.lineTo(ex - es, eBot);
    ctx.moveTo(ex + es * 0.5, eTop); ctx.lineTo(ex + es, eBot);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.18)'; ctx.lineWidth = 1.5; ctx.stroke();

    const sY = eTop + h * 0.42;
    ctx.beginPath(); ctx.moveTo(ex - es * 0.7, sY); ctx.lineTo(ex + es * 0.7, sY);
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.14)'; ctx.lineWidth = 2; ctx.stroke();

    const ew = es * 1.8, eh = ew * 0.75, exx = ex - ew * 0.5, ey = sY - eh - 4;
    ctx.fillStyle = 'rgba(26, 40, 54, 0.8)';
    ctx.fillRect(exx, ey, ew, eh);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.2)'; ctx.lineWidth = 1;
    ctx.strokeRect(exx, ey, ew, eh);
    ctx.beginPath();
    ctx.moveTo(exx + ew * 0.15, ey + eh * 0.5);
    ctx.quadraticCurveTo(exx + ew * 0.5, ey + eh * 0.3, exx + ew * 0.85, ey + eh * 0.55);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.3)'; ctx.lineWidth = 2; ctx.stroke();

    // Notebook with K
    const nw = w * 0.1, nh = nw * 0.7, nx = w * 0.12, ny = h * 0.76;
    ctx.save();
    ctx.translate(nx + nw * 0.5, ny + nh * 0.5);
    ctx.rotate(-0.15);
    ctx.translate(-nw * 0.5, -nh * 0.5);

    ctx.fillStyle = 'rgba(31, 46, 58, 0.9)';
    ctx.strokeStyle = 'rgba(217, 225, 232, 0.15)'; ctx.lineWidth = 1;
    ctx.fillRect(0, 0, nw, nh); ctx.strokeRect(0, 0, nw, nh);

    const ks = nh * 0.35;
    ctx.font = `600 ${ks}px 'Josefin Sans', sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(233, 30, 121, 0.45)';
    ctx.fillText('K', nw * 0.5, nh * 0.48);

    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, nh);
    ctx.strokeStyle = 'rgba(233, 30, 121, 0.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();

    // Floating particles
    for (let i = 0; i < 12; i++) {
      const px = cx + Math.sin(i * 2.3 + time * 0.0005) * w * 0.4;
      const py = cy + Math.cos(i * 1.8 + time * 0.0004) * h * 0.35;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(233, 30, 121, ${0.08 + Math.sin(i + time * 0.002) * 0.05})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw(0);
}
