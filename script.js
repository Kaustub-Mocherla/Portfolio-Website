const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal content as it enters the viewport.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('in'));
}

// Lightweight ambient network animation.
const canvas = document.getElementById('pageCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let width = 0;
let height = 0;
let nodes = [];
function resizeCanvas() {
  if (!canvas || !ctx) return;
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  nodes = Array.from({ length: width < 600 ? 10 : 18 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: 0.05 + Math.random() * 0.1,
    vy: (Math.random() - 0.5) * 0.04,
    r: 1 + Math.random() * 1.5
  }));
}
function drawNetwork() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  nodes.forEach((node, index) => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x > width + 10) node.x = -10;
    if (node.y < -10 || node.y > height + 10) node.vy *= -1;
    for (let next = index + 1; next < nodes.length; next += 1) {
      const other = nodes[next];
      const distance = Math.hypot(node.x - other.x, node.y - other.y);
      if (distance < 150) {
        ctx.strokeStyle = `rgba(228,166,47,${0.06 * (1 - distance / 150)})`;
        ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
      }
    }
    ctx.fillStyle = 'rgba(228,166,47,0.12)';
    ctx.beginPath(); ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2); ctx.fill();
  });
  if (!reducedMotion) window.requestAnimationFrame(drawNetwork);
}
resizeCanvas();
if (!reducedMotion) window.requestAnimationFrame(drawNetwork);
window.addEventListener('resize', resizeCanvas);

// Mobile navigation with Escape and focus-friendly labels.
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-links');
function closeNav() {
  if (!nav || !navToggle) return;
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation');
}
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
}

// Persist the selected color theme.
const themeToggle = document.querySelector('.theme-toggle');
const preferredTheme = localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
function setTheme(theme) {
  const light = theme === 'light';
  document.documentElement.classList.toggle('light', light);
  if (themeToggle) {
    themeToggle.textContent = light ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('aria-pressed', String(light));
  }
}
setTheme(preferredTheme);
if (themeToggle) themeToggle.addEventListener('click', () => { const next = document.documentElement.classList.contains('light') ? 'dark' : 'light'; localStorage.setItem('portfolio-theme', next); setTheme(next); });
