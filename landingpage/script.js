/* ============================================
   AI TASKER - Cyberpunk Landing Page
   Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initCounterAnimation();
  initTerminalTyping();
  initSmoothScroll();
  initGlitchEffect();
});

/* ============================================
   Particle System
   ============================================ */
function initParticles() {
  const container = document.querySelector('.particles-container');
  if (!container) return;

  const particleCount = 40;
  const colors = ['#00f0ff', '#b026ff', '#ff006e', '#39ff14'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 3 + 1;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;

    particle.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(particle);
  }
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

/* ============================================
   Counter Animation
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-count'));
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

/* ============================================
   Terminal Typing Effect
   ============================================ */
function initTerminalTyping() {
  const terminalLines = document.querySelectorAll('.terminal-line.typing');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeTerminalLines(entry.target.closest('.terminal-body'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  terminalLines.forEach(line => observer.observe(line));
}

function typeTerminalLines(container) {
  if (!container) return;
  const lines = container.querySelectorAll('.terminal-line');
  let delay = 0;

  lines.forEach((line, index) => {
    const cmd = line.querySelector('.terminal-cmd, .terminal-output');
    if (!cmd) return;

    const text = cmd.getAttribute('data-text');
    if (!text) return;

    cmd.textContent = '';
    
    setTimeout(() => {
      let charIndex = 0;
      const typing = setInterval(() => {
        if (charIndex < text.length) {
          cmd.textContent += text[charIndex];
          charIndex++;
        } else {
          clearInterval(typing);
        }
      }, 30);
    }, delay);

    delay += text.length * 30 + 500;
  });
}

/* ============================================
   Smooth Scroll
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ============================================
   Glitch Effect on Hover
   ============================================ */
function initGlitchEffect() {
  const glitchElements = document.querySelectorAll('.glitch-hover');
  
  glitchElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add('glitching');
      setTimeout(() => el.classList.remove('glitching'), 500);
    });
  });
}

/* ============================================
   Mouse Parallax Effect for Hero
   ============================================ */
document.addEventListener('mousemove', (e) => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (e.clientY > rect.bottom) return;

  const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
  const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

  const orb = document.querySelector('.hero-orb');
  if (orb) {
    orb.style.transform = `translate(${xPercent * 15}px, ${yPercent * 15}px)`;
  }

  const particles = document.querySelectorAll('.orbit-ring');
  particles.forEach((ring, i) => {
    const speed = (i + 1) * 5;
    ring.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
  });
});

/* ============================================
   Intersection Observer for Stat Cards
   ============================================ */
const statCards = document.querySelectorAll('.stat-card');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 150);
    }
  });
}, { threshold: 0.3 });

statCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  statObserver.observe(card);
});
