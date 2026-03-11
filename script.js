/* ============================================================
   WOMEN'S FASHION MART — script.js
   Handles: Navbar scroll, mobile menu, scroll animations
   ============================================================ */

/* ── 1. DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initSmoothScroll();
});

/* ============================================================
   NAVBAR — Add 'scrolled' class on scroll for shadow/border
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Listen for scroll events (throttled with requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  onScroll(); // run once on page load
}

/* ============================================================
   MOBILE MENU — Toggle nav links on hamburger click
   ============================================================ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    // Update icon
    toggle.querySelector('i').className = isOpen
      ? 'fas fa-times'
      : 'fas fa-bars';
    // Accessibility
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.querySelector('i').className = 'fas fa-bars';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.querySelector('i').className = 'fas fa-bars';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   SCROLL REVEAL — Animate product cards into view
   Uses IntersectionObserver for performance
   ============================================================ */
function initScrollReveal() {
  const cards = document.querySelectorAll('.product-card');
  if (!cards.length) return;

  // Check for IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show all cards immediately
    cards.forEach(card => card.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,   // trigger when 12% of card is visible
      rootMargin: '0px 0px -40px 0px'  // slight offset from bottom
    }
  );

  cards.forEach(card => observer.observe(card));
}

/* ============================================================
   SMOOTH SCROLL — Polyfill for browsers without native support
   (also accounts for fixed navbar height)
   ============================================================ */
function initSmoothScroll() {
  const navHeight = document.querySelector('.navbar')?.offsetHeight || 70;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });
}

/* ============================================================
   HERO ENTRANCE — Staggered fade-in for hero text elements
   ============================================================ */
(function heroEntrance() {
  const elements = [
    document.querySelector('.hero-eyebrow'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-tagline'),
    document.querySelector('.hero-cta'),
  ];

  elements.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;

    // Trigger after a brief delay to ensure CSS is loaded
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });
})();

/* ============================================================
   STRIP ITEMS — Animate intro strip on load
   ============================================================ */
(function stripEntrance() {
  const items = document.querySelectorAll('.strip-item');
  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(10px)';
    item.style.transition = `opacity 0.5s ease ${0.5 + i * 0.1}s, transform 0.5s ease ${0.5 + i * 0.1}s`;
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100);
  });
})();

/* ============================================================
   WHATSAPP LINK HELPER
   Opens WhatsApp with a pre-filled message for product enquiry
   ============================================================ */
function openWhatsApp(productName) {
  const phone   = '94755646479';
  const message = encodeURIComponent(`Hi! I'm interested in "${productName}". Can you provide more details?`);
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

/* Attach custom WhatsApp openers to each card if product name exists */
document.querySelectorAll('.product-card').forEach(card => {
  const whatsappLinks = card.querySelectorAll('.card-whatsapp, .whatsapp-btn');
  const productName   = card.querySelector('.card-title')?.textContent || 'your product';

  whatsappLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp(productName);
    });
  });
});

/* Floating WhatsApp button — generic greeting */
document.querySelector('.floating-whatsapp')?.addEventListener('click', (e) => {
  e.preventDefault();
  const phone   = '94755646479';
  const message = encodeURIComponent("Hello! I'd like to enquire about your fashion collection.");
  window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
});

/* ============================================================
   TESTIMONIAL AUTO SLIDER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const track     = document.getElementById('testimonialTrack');
  const dotsWrap  = document.getElementById('sliderDots');
  const btnPrev   = document.getElementById('sliderPrev');
  const btnNext   = document.getElementById('sliderNext');
  if (!track) return;

  const slides       = track.querySelectorAll('.testimonial-slide');
  let current        = 0;
  let autoSlideTimer = null;

  /* How many cards visible at once — matches CSS breakpoints */
  function visibleCount() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  /* Total number of "steps" we can slide */
  function maxIndex() {
    return slides.length - visibleCount();
  }

  /* Build dot buttons */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  /* Update active dot */
  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  /* Move the track */
  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex()));
    const slideWidth = slides[0].offsetWidth + 24; // 24 = gap (1.5rem)
    track.style.transform = `translateX(-${current * slideWidth}px)`;
    updateDots();
  }

  /* Next / Prev */
  function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

  /* Auto slide every 3.5 seconds */
  function startAuto() {
    stopAuto();
    autoSlideTimer = setInterval(next, 3500);
  }
  function stopAuto() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  /* Arrow buttons */
  btnNext?.addEventListener('click', () => { next(); startAuto(); });
  btnPrev?.addEventListener('click', () => { prev(); startAuto(); });

  /* Pause on hover */
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  /* Touch / swipe support for mobile */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    startAuto();
  }, { passive: true });

  /* Rebuild on resize */
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  /* Init */
  buildDots();
  goTo(0);
  startAuto();
});