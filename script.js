// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

// Full-page canvas animation representing pipelines/agents
const canvas = document.getElementById('pageCanvas');
const ctx = canvas.getContext('2d');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvasDebug = false;
let w, h, nodes = [], packets = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  canvas.style.height = '100vh';
}

function initNodes() {
  const count = w < 680 ? 12 : 22;
  const lanes = Math.max(3, Math.floor(h / 140));
  nodes = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * w,
    y: (h * (0.12 + ((i % lanes) / lanes))) + (Math.random() * h * 0.08),
    vx: (0.08 + Math.random() * 0.08),
    vy: (Math.random() - 0.5) * 0.035,
    r: Math.random() * 2.2 + 0.9
  }));
  packets = [];
}

function spawnPacket(fromNode) {
  const target = nodes[Math.floor(Math.random() * nodes.length)];
  if (!target || target === fromNode) return;
  const angle = Math.atan2(target.y - fromNode.y, target.x - fromNode.x);
  const speed = 0.28 + Math.random() * 0.24;
  packets.push({ x: fromNode.x, y: fromNode.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, ttl: 200 + Math.random() * 200 });
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 160) {
        const base = canvasDebug ? 0.18 : 0.08;
        ctx.strokeStyle = `rgba(228,166,47,${base * (1 - dist / 160)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  if (Math.random() < (canvasDebug ? 0.12 : 0.035)) spawnPacket(nodes[Math.floor(Math.random() * nodes.length)]);
  packets = packets.filter((p) => p.life < p.ttl);
  packets.forEach((p) => { p.x += p.vx; p.y += p.vy; p.life += 1; ctx.fillStyle = `rgba(228,166,47,${(canvasDebug ? 0.28 : 0.14) * (1 - p.life / p.ttl)})`; ctx.beginPath(); ctx.arc(p.x, p.y, canvasDebug ? 3.4 : 2.4, 0, Math.PI * 2); ctx.fill(); });
  nodes.forEach((n) => { n.x += n.vx * (0.6 + 0.8 * Math.sin((n.x + n.y + Date.now() / 6000))); n.y += Math.sin(Date.now() / 2000 + n.x * 0.001) * 0.3 + n.vy; if (n.x > w + 12) n.x = -12; if (n.y < 0) n.y = 0; if (n.y > h) n.y = h; ctx.fillStyle = 'rgba(228,166,47,0.10)'; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); });
  if (!reducedMotion) requestAnimationFrame(draw);
}

resize(); initNodes();
if (!reducedMotion) requestAnimationFrame(draw); else draw();
window.addEventListener('resize', () => { resize(); initNodes(); });

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Open navigation'); }));
}

// Persist the visitor's theme preference
const themeToggle = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('portfolio-theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
function applyTheme(theme) {
  const isLight = theme === 'light';
  document.documentElement.classList.toggle('light', isLight);
  if (themeToggle) {
    themeToggle.textContent = isLight ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  }
}
applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));
if (themeToggle) themeToggle.addEventListener('click', () => { const next = document.documentElement.classList.contains('light') ? 'dark' : 'light'; localStorage.setItem('portfolio-theme', next); applyTheme(next); });

// Show greeting after load and append a small project teaser
const g = document.querySelector('.greeting');
if (g) setTimeout(() => g.classList.add('visible'), 120);
const projGrid = document.querySelector('.proj-grid');
if (projGrid && projGrid.parentElement) {
  const msg = document.createElement('p');
  msg.className = 'projects-coming mono';
  msg.textContent = '{ more projects coming soon... }';
  projGrid.parentElement.appendChild(msg);
}
