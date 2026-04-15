/* ============================================================
   NEURAL CANVAS — animated background
   ============================================================ */
(function () {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], edges = [], animId;
  const NODE_COUNT = 60;
  const MAX_DIST = 160;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(79,142,247,${0.18 * (1 - d / MAX_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    // nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(79,142,247,0.6)';
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();

/* ============================================================
   NAVBAR — scroll effect
   ============================================================ */
(function () {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ============================================================
   SCROLL REVEAL (AOS-like, no library)
   ============================================================ */
(function () {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('aos-visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
(function () {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1200;
          const step = Math.ceil(target / (duration / 16));
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = current;
            if (current >= target) clearInterval(timer);
          }, 16);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   SMOOTH ACTIVE NAV LINK
   ============================================================ */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 100;
      if (window.scrollY >= top) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--text)' : '';
    });
  }, { passive: true });
})();
