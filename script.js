// ==========================================
//  RITHIKA NK — Dark Academia Portfolio JS
//  Interactive Animations & Micro-interactions
// ==========================================

/* ── Custom Cursor ── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let ringX  = mouseX, ringY = mouseY;
let isMouseActive = false;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isMouseActive = true;
  if (cursorDot) {
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  }
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .skill-tag, .filter-btn, .contact-card, .timeline-card, .stat-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('hovered'));
});

/* ── Click Sparkles Animation ── */
function createClickSparkles(x, y) {
  const sparkCount = 8;
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'click-spark';
    const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 45 + 20;
    const dx = Math.cos(angle) * distance + 'px';
    const dy = Math.sin(angle) * distance + 'px';
    const size = Math.random() * 5 + 3;

    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.setProperty('--dx', dx);
    spark.style.setProperty('--dy', dy);
    
    // Random gold / amber hue
    const colors = ['#e2c97e', '#c8a84b', '#ffdf88', '#b84060'];
    spark.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 650);
  }
}

document.addEventListener('click', e => {
  createClickSparkles(e.clientX, e.clientY);
});

/* ── Particle Canvas — Dark Academia Dynamic Constellation ── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const DA_COLORS = [
  'rgba(200, 168, 75,',   // antique gold
  'rgba(226, 201, 126,',  // light gold
  'rgba(138, 110, 40,',   // dark gold
  'rgba(122, 30, 46,',    // burgundy
  'rgba(58, 82, 64,',     // forest green
  'rgba(160, 120, 80,',   // sepia
];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 1.5 + 0.4;
    this.sx    = (Math.random() - 0.5) * 0.25;
    this.sy    = (Math.random() - 0.5) * 0.25 - 0.1; // Gentle upward drift
    this.alpha = Math.random() * 0.45 + 0.15;
    this.baseAlpha = this.alpha;
    this.color = DA_COLORS[Math.floor(Math.random() * DA_COLORS.length)];
  }
  update() {
    this.x += this.sx;
    this.y += this.sy;

    // Repel slightly from cursor
    if (isMouseActive) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        const force = (100 - dist) / 100 * 0.6;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
    }

    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    // Inter-particle connections
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(200,168,75,${0.08 * (1 - dist / 110)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Mouse connection
    if (isMouseActive) {
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 140) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(226,201,126,${0.18 * (1 - mdist / 140)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ── Navbar Scroll ── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Mobile Menu ── */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('mobile-open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('mobile-open');
    });
  });
}

/* ── Scroll Reveal with Stagger ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ── Skill Bar Animation ── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.skill-bars').forEach(el => barObserver.observe(el));

/* ── Dynamic Typewriter (Hero Role) ── */
const typeTarget = document.getElementById('typewriter');
if (typeTarget) {
  const roles = [
    'Tech Enthusiast',
    'Hardware & IoT Tinkerer',
    'Embedded Systems Explorer',
    'C++ & Python Coder',
    'Creative Problem Solver'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;
  function typeWrite() {
    const current = roles[roleIdx];
    typeTarget.textContent = isDeleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    if (!isDeleting && charIdx > current.length) {
      setTimeout(() => { isDeleting = true; typeWrite(); }, 2200);
      return;
    }
    if (isDeleting && charIdx < 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      charIdx = 0;
      setTimeout(typeWrite, 300);
      return;
    }
    setTimeout(typeWrite, isDeleting ? 45 : 85);
  }
  typeWrite();
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const step     = target / (duration / 16);
  let count = 0;
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = Math.floor(count) + suffix;
    if (count >= target) clearInterval(timer);
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-value[data-target]').forEach(el => counterObserver.observe(el));

/* ── Interactive 3D Tilt Effect on Cards ── */
const tiltElements = document.querySelectorAll('.project-card, .skill-category, .about-portrait, .timeline-card, .contact-card, .hero-frame');
tiltElements.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
});

/* ── Magnetic Effect for Buttons ── */
const magneticButtons = document.querySelectorAll('.magnetic-btn, .btn, .filter-btn');
magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px)';
  });
});

/* ── Project Filter ── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (show) {
        card.style.opacity   = '1';
        card.style.transform = 'scale(1)';
        card.style.display   = 'flex';
      } else {
        card.style.opacity   = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => {
          if (card.dataset.category !== btn.dataset.filter && filter !== 'all')
            card.style.display = 'none';
        }, 400);
      }
    });
  });
});

/* ── Contact Form ── */
const form  = document.getElementById('contact-form');
const toast = document.getElementById('toast');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.disabled = true;
    btn.textContent = 'Dispatching…';
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = `<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> Dispatch Letter`;
      form.reset();
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }, 1600);
  });
}

/* ── Active Nav Highlight ── */
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let currentId = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 140) currentId = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${currentId}` ? 'var(--gold-light)' : '';
  });
});
