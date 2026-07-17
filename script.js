// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-triggered section reveal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!reduceMotion) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
        );
      } else {
        entry.target.style.opacity = '1';
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.section,.project-card,.skill-card').forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});

// Scroll progress bar
const scrollBar = document.getElementById('scrollBar');
function updateScrollProgress() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  const pct = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
  if (scrollBar) scrollBar.style.width = pct + '%';
}
document.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// Active nav link highlighting
const navLinks = document.querySelectorAll('[data-nav-link]');
const sections = Array.from(navLinks)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`[data-nav-link][href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach(section => navObserver.observe(section));

// Cursor spotlight glow on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

// Copy email to clipboard
const emailLink = document.getElementById('emailLink');
if (emailLink) {
  emailLink.addEventListener('click', e => {
    const email = emailLink.getAttribute('data-copy');
    if (!email || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      const original = emailLink.textContent;
      emailLink.textContent = 'Copied!';
      emailLink.classList.add('copied');
      setTimeout(() => {
        emailLink.textContent = original;
        emailLink.classList.remove('copied');
      }, 1500);
    }).catch(() => {
      window.location.href = 'mailto:' + email;
    });
  });
}
