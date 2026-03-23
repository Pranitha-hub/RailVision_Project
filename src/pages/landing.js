// ============================================
// RailVision Landing Page
// Hero section, features, role selector
// ============================================

import { initParticles } from '../components/components.js';

export function renderLanding() {
  const page = document.getElementById('page-content');

  page.innerHTML = `
    <canvas id="particle-canvas"></canvas>

    <!-- Hero Section -->
    <section class="hero-section" id="hero" style="min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;">
      <div class="container" style="position:relative;z-index:1;">
        <div style="max-width:800px;margin:0 auto;text-align:center;">

          <!-- Floating Badge -->
          <div class="animate-fade-in-down" style="margin-bottom:var(--space-6);">
            <span class="badge badge-teal" style="font-size:var(--fs-sm);padding:var(--space-2) var(--space-5);">
              🚆 AI-Powered Railway Intelligence
            </span>
          </div>

          <!-- Hero Title -->
          <h1 class="heading-display animate-fade-in-up" style="font-size:var(--fs-hero);margin-bottom:var(--space-6);">
            Travel Smarter with
            <span class="text-gradient" style="display:block;">Real-Time Crowd Intelligence</span>
          </h1>

          <!-- Subtitle -->
          <p class="animate-fade-in-up delay-2" style="font-size:var(--fs-lg);color:var(--color-text-secondary);max-width:600px;margin:0 auto var(--space-8);line-height:1.7;">
            Predict crowd levels, find the best time to travel, and receive AI-powered recommendations for a seamless unreserved railway experience.
          </p>

          <!-- CTA Buttons -->
          <div class="animate-fade-in-up delay-3 flex-center gap-4" style="flex-wrap:wrap;">
            <button class="btn btn-primary btn-lg" id="cta-get-started" onclick="window.location.hash = '#/login'">
              Sign In / Register →
            </button>
            <button class="btn btn-secondary btn-lg" id="cta-learn-more" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">
              Learn More
            </button>
          </div>

          <!-- Platform Stats -->
          <div class="animate-fade-in-up delay-5" style="margin-top:var(--space-12);display:flex;justify-content:center;gap:var(--space-10);flex-wrap:wrap;">
            <div style="text-align:center;">
              <div class="stat-counter" data-target="50" style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:800;color:var(--color-accent-teal);">0</div>
              <div style="font-size:var(--fs-sm);color:var(--color-text-muted);">Stations Covered</div>
            </div>
            <div style="text-align:center;">
              <div class="stat-counter" data-target="200" style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:800;color:var(--color-accent-amber);">0</div>
              <div style="font-size:var(--fs-sm);color:var(--color-text-muted);">Daily Trains</div>
            </div>
            <div style="text-align:center;">
              <div class="stat-counter" data-target="95" style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:800;color:var(--color-accent-purple);">0</div>
              <div style="font-size:var(--fs-sm);color:var(--color-text-muted);">Prediction Accuracy %</div>
            </div>
          </div>
        </div>

        <!-- Train SVG Animation -->
        <div style="position:absolute;bottom:-60px;left:0;width:100%;overflow:hidden;pointer-events:none;">
          <div style="animation:trainMove 12s linear infinite;display:flex;align-items:center;">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
              <rect x="10" y="5" width="100" height="25" rx="8" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.3)" stroke-width="1"/>
              <rect x="15" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
              <rect x="38" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
              <rect x="61" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
              <rect x="84" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
              <circle cx="25" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
              <circle cx="50" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
              <circle cx="75" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
              <circle cx="100" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <div class="section-subtitle">Platform Features</div>
          <h2 class="heading-section" style="font-size:var(--fs-4xl);">
            Everything You Need for<br>
            <span class="text-gradient">Smarter Railway Travel</span>
          </h2>
        </div>

        <div class="grid grid-4" id="features-grid">
          ${renderFeatureCard('📡', 'Real-Time Tracking', 'Live crowd density monitoring across all major stations with passenger-reported data.', 'teal', 1)}
          ${renderFeatureCard('🤖', 'AI Predictions', 'Machine learning powered forecasts predict crowd levels up to 6 hours ahead.', 'purple', 2)}
          ${renderFeatureCard('🔔', 'Safety Alerts', 'Instant notifications when overcrowding is detected, keeping you safe.', 'amber', 3)}
          ${renderFeatureCard('💡', 'Smart Tips', 'AI recommends the best trains and times to avoid crowds.', 'coral', 4)}
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section" style="background:rgba(17,24,39,0.4);">
      <div class="container">
        <div class="section-header animate-fade-in-up">
          <div class="section-subtitle">How It Works</div>
          <h2 class="heading-section" style="font-size:var(--fs-3xl);">Simple Steps to Smarter Travel</h2>
        </div>

        <div style="display:flex;justify-content:center;gap:var(--space-8);flex-wrap:wrap;max-width:900px;margin:0 auto;">
          ${renderStep(1, 'Search', 'Enter your source & destination station', 'teal')}
          ${renderStep(2, 'Analyze', 'View real-time crowd levels and AI predictions', 'amber')}
          ${renderStep(3, 'Decide', 'Choose the best train with lowest crowd density', 'purple')}
        </div>
      </div>
    </section>



    <!-- Footer -->
    <footer style="border-top:1px solid var(--color-border);padding:var(--space-8) 0;text-align:center;">
      <div class="container">
        <div style="display:flex;align-items:center;justify-content:center;gap:var(--space-3);margin-bottom:var(--space-4);">
          <div style="width:28px;height:28px;background:linear-gradient(135deg,var(--color-accent-teal),var(--color-accent-purple));border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:0.875rem;">🚆</div>
          <span style="font-family:var(--font-display);font-weight:700;">RailVision</span>
        </div>
        <p style="font-size:var(--fs-sm);color:var(--color-text-muted);">
          © 2026 RailVision — AI-Powered Crowd Intelligence Platform for Indian Railways
        </p>
      </div>
    </footer>
  `;

  // Initialize animations
  initParticles();
  initScrollAnimations();
  animateHeroCounters();
}

function renderFeatureCard(icon, title, description, color, delay) {
  const colors = {
    teal: { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', text: 'var(--color-accent-teal)' },
    purple: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: 'var(--color-accent-purple)' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: 'var(--color-accent-amber)' },
    coral: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', text: 'var(--color-accent-coral)' },
  };
  const c = colors[color];

  return `
    <div class="glass-card scroll-animate" style="padding:var(--space-6);opacity:0;animation-delay:${delay * 0.1}s;">
      <div style="width:56px;height:56px;border-radius:var(--radius-lg);background:${c.bg};border:1px solid ${c.border};display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:var(--space-4);">
        ${icon}
      </div>
      <h3 style="font-family:var(--font-display);font-size:var(--fs-lg);font-weight:700;margin-bottom:var(--space-2);">${title}</h3>
      <p style="color:var(--color-text-secondary);font-size:var(--fs-sm);line-height:1.6;">${description}</p>
    </div>
  `;
}

function renderStep(num, title, description, color) {
  return `
    <div class="scroll-animate" style="text-align:center;max-width:240px;opacity:0;">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--color-accent-${color}),rgba(255,255,255,0.1));display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:var(--fs-2xl);font-weight:800;margin:0 auto var(--space-4);border:2px solid rgba(255,255,255,0.1);">
        ${num}
      </div>
      <h3 style="font-family:var(--font-display);font-size:var(--fs-lg);font-weight:700;margin-bottom:var(--space-2);">${title}</h3>
      <p style="color:var(--color-text-secondary);font-size:var(--fs-sm);line-height:1.6;">${description}</p>
    </div>
  `;
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
}

function animateHeroCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(eased * target);

      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target + '+';
    }

    setTimeout(() => requestAnimationFrame(update), 800);
  });
}
