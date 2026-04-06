/* ============================================
   SIDDHESH PATIL PORTFOLIO — main.js
   Shared scripts across all pages
   ============================================ */

// ── Custom Cursor ──────────────────────────────
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}

// ── Scroll Reveal ──────────────────────────────
const reveals = document.querySelectorAll('[data-reveal]');

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObs.observe(el));

// Also trigger skill-level bars
const skillCards = document.querySelectorAll('.skill-card');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
    }
  });
}, { threshold: 0.2 });
skillCards.forEach(c => skillObs.observe(c));

// ── Active Nav Link ───────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Mobile Hamburger ──────────────────────────
const burger  = document.querySelector('.nav-burger');
const mobileNav = document.querySelector('.nav-mobile');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    // Animate burger
    const spans = burger.querySelectorAll('span');
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      const spans = burger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── Ticker Duplicate ──────────────────────────
const ticker = document.querySelector('.ticker-inner');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}

// ── Smooth Scroll for anchor links ───────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Contact Form ──────────────────────────────
const form = document.getElementById('contact-form');
const formBody = document.getElementById('form-body');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.style.opacity = '0.7';

    // Simulate send
    setTimeout(() => {
      formBody.style.display = 'none';
      formSuccess.classList.add('show');
    }, 1200);
  });
}

// ── Lightbox (Certificates Page) ─────────────
const lightboxOverlay = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxSub   = document.getElementById('lightbox-sub');
const lightboxClose = document.getElementById('lightbox-close');

window.openLightbox = function(src, title, sub) {
  if (!lightboxOverlay) return;
  lightboxImg.src = src;
  lightboxTitle.textContent = title;
  lightboxSub.textContent   = sub;
  lightboxOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}
if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', e => {
    if (e.target === lightboxOverlay) closeLightbox();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  if (!lightboxOverlay) return;
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

function openLightbox(img, title, desc) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = img;
  document.getElementById("lightbox-title").innerText = title;
  document.getElementById("lightbox-desc").innerText = desc;
}

function closeLightbox() {
  document.getElementById("lightbox").style.display = "none";
}


// ── Counter Animation ─────────────────────────
const counters = document.querySelectorAll('.counter-val[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = el.dataset.float === 'true';
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      let start = 0;
      const dur = 1400;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const prog = Math.min((timestamp - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        const val = isFloat ? (ease * target).toFixed(1) : Math.floor(ease * target);
        el.textContent = prefix + val + suffix;
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));
