// ============================================
// RailVision Shared Components
// Reusable UI components
// ============================================

import { getCrowdLevel, getCrowdLabel, getCrowdDensity } from '../data/mockData.js';

// ─── Navbar Component ───
export function createNavbar(role, currentPage) {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  const passengerLinks = `
    <a href="#/passenger" class="${currentPage === 'passenger' ? 'active' : ''}" id="nav-search">Search Trains</a>
    <button onclick="window.reportCrowdModal && window.reportCrowdModal()" class="btn btn-sm btn-secondary" id="nav-report">Report Crowd</button>
  `;

  const authorityLinks = `
    <a href="#/dashboard" class="${currentPage === 'dashboard' ? 'active' : ''}" id="nav-dashboard">Dashboard</a>
    <a href="#/dashboard#analytics" class="" id="nav-analytics">Analytics</a>
  `;

  // Get user info for display
  const userData = localStorage.getItem('railVisionUser');
  const user = userData ? JSON.parse(userData) : null;
  const userName = user ? user.name.split(' ')[0] : '';

  nav.innerHTML = `
    <div class="navbar-inner">
      <a href="#/" class="navbar-brand" id="nav-brand">
        <div class="logo-icon">🚆</div>
        <span class="text-gradient">RailVision</span>
      </a>
      <div class="navbar-links" id="navbar-links">
        ${role === 'passenger' ? passengerLinks : role === 'authority' ? authorityLinks : ''}
        ${role ? `
          <div class="navbar-role-badge" id="navbar-role">
            <span>●</span>
            ${userName ? userName + ' · ' : ''}${role === 'passenger' ? 'Passenger' : 'Authority'}
          </div>
          <button onclick="localStorage.removeItem('railVisionToken'); localStorage.removeItem('railVisionUser'); sessionStorage.removeItem('railVisionRole'); window.location.hash = '#/';" class="btn btn-ghost btn-sm" id="nav-logout">Logout</button>
        ` : ''}
      </div>
    </div>
  `;

  return nav;
}

// ─── Crowd Badge Component ───
export function createCrowdBadge(density) {
  const level = getCrowdLevel(density);
  const label = getCrowdLabel(level);
  const badgeClass = level === 'low' ? 'badge-green' : level === 'moderate' ? 'badge-amber' : 'badge-red';

  return `<span class="badge ${badgeClass}" id="crowd-badge-${density}">
    <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;animation:dotPulse 1.5s infinite;"></span>
    ${label} (${density}%)
  </span>`;
}

// ─── Stat Card Component ───
export function createStatCard({ id, icon, label, value, suffix = '', trend = null, color = 'teal' }) {
  const trendHtml = trend
    ? `<div class="stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}">
         ${trend > 0 ? '↑' : '↓'} ${Math.abs(trend)}%
       </div>`
    : '';

  return `
    <div class="card stat-card" id="stat-${id}" style="position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;right:0;width:80px;height:80px;background:${
        color === 'teal' ? 'rgba(6,182,212,0.06)' :
        color === 'amber' ? 'rgba(245,158,11,0.06)' :
        color === 'red' ? 'rgba(239,68,68,0.06)' :
        'rgba(139,92,246,0.06)'
      };border-radius:0 0 0 80px;"></div>
      <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
        <div style="width:40px;height:40px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:1.25rem;background:${
          color === 'teal' ? 'rgba(6,182,212,0.12)' :
          color === 'amber' ? 'rgba(245,158,11,0.12)' :
          color === 'red' ? 'rgba(239,68,68,0.12)' :
          'rgba(139,92,246,0.12)'
        };">${icon}</div>
        <span style="font-size:var(--fs-sm);color:var(--color-text-muted);">${label}</span>
      </div>
      <div style="display:flex;align-items:flex-end;gap:var(--space-2);">
        <span class="stat-value" data-target="${value}" style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:800;color:var(--color-text-primary);">0</span>
        ${suffix ? `<span style="font-size:var(--fs-sm);color:var(--color-text-muted);margin-bottom:4px;">${suffix}</span>` : ''}
        ${trendHtml}
      </div>
    </div>
  `;
}

// ─── Animated Counter ───
export function animateCounters(container) {
  const counters = container.querySelectorAll('.stat-value');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);

      counter.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

// ─── Train Card Component ───
export function createTrainCard(train, onViewDetails) {
  const now = new Date();
  const density = getCrowdDensity(train.id, now.getHours(), now.getDay());
  const level = getCrowdLevel(density);

  return `
    <div class="card train-card animate-fade-in-up" id="train-card-${train.id}"
         style="cursor:pointer;padding:var(--space-5);position:relative;overflow:hidden;"
         data-train-id="${train.id}">
      <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${
        level === 'low' ? 'var(--crowd-low)' : level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)'
      };border-radius:4px 0 0 4px;"></div>

      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-3);">
        <div>
          <div style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-base);margin-bottom:var(--space-1);">
            ${train.trainName}
          </div>
          <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">
            #${train.trainNumber} • ${train.daysOfWeek.join(', ')}
          </div>
        </div>
        ${createCrowdBadge(density)}
      </div>

      <div style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-4);">
        <div style="text-align:center;">
          <div style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">${train.departure}</div>
          <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">${train.from.code}</div>
        </div>
        <div style="flex:1;display:flex;align-items:center;gap:var(--space-2);">
          <div style="flex:1;height:2px;background:var(--color-border);position:relative;">
            <div style="position:absolute;right:0;top:-3px;width:8px;height:8px;background:var(--color-accent-teal);border-radius:50%;"></div>
          </div>
          <span style="font-size:var(--fs-xs);color:var(--color-text-muted);white-space:nowrap;">${train.duration}</span>
          <div style="flex:1;height:2px;background:var(--color-border);"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">${train.arrival}</div>
          <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">${train.to.code}</div>
        </div>
      </div>

      <div style="margin-bottom:var(--space-3);">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);">
          <span style="font-size:var(--fs-xs);color:var(--color-text-muted);">Crowd Level</span>
          <span style="font-size:var(--fs-xs);font-weight:600;color:${
            level === 'low' ? 'var(--crowd-low)' : level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)'
          };">${density}%</span>
        </div>
        <div class="crowd-bar">
          <div class="crowd-bar-fill ${level}" style="width:${density}%;"></div>
        </div>
      </div>

      <button class="btn btn-sm btn-secondary view-details-btn" style="width:100%;"
              data-train-id="${train.id}">
        View Details & AI Prediction →
      </button>
    </div>
  `;
}

// ─── Alert Banner Component ───
export function createAlertBanner(alert) {
  const severityClass = alert.severity === 'danger' ? 'alert-banner-danger'
    : alert.severity === 'warning' ? 'alert-banner-warning'
    : 'alert-banner-info';

  const icon = alert.severity === 'danger' ? '⚠️'
    : alert.severity === 'warning' ? '⏰'
    : 'ℹ️';

  return `
    <div class="alert-banner ${severityClass}" id="alert-${alert.id}">
      <span>${icon}</span>
      <span style="flex:1;">${alert.message}</span>
      <span style="font-size:var(--fs-xs);color:inherit;opacity:0.7;white-space:nowrap;">${alert.timeAgo}</span>
    </div>
  `;
}

// ─── Modal Component ───
export function openModal(title, content) {
  // Remove existing modals
  closeModal();

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop active';
  backdrop.id = 'modal-backdrop';
  backdrop.addEventListener('click', closeModal);

  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'modal-dialog';
  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" onclick="window.closeModal()" id="modal-close-btn">✕</button>
    </div>
    <div class="modal-body" id="modal-body">
      ${content}
    </div>
  `;

  modal.addEventListener('click', e => e.stopPropagation());

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);
}

export function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-dialog');
  if (backdrop) backdrop.remove();
  if (modal) modal.remove();
}

// Make closeModal globally available
window.closeModal = closeModal;

// ─── Toast Notification ───
export function showToast(typeOrMessage, messageOrType = '') {
  // Support both showToast('success', 'msg') and showToast('msg', 'success')
  let type, message;
  if (['success', 'warning', 'error'].includes(typeOrMessage)) {
    type = typeOrMessage;
    message = messageOrType;
  } else {
    message = typeOrMessage;
    type = messageOrType || 'success';
  }

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Particle Background ───
export function initParticles(canvasEl) {
  const canvas = canvasEl || document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, createParticle);
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}
