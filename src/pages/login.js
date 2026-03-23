// ============================================
// RailVision — Login & Registration Page
// Premium glassmorphism auth interface
// ============================================

import { showToast, initParticles } from '../components/components.js';
import { apiClient } from '../data/apiClient.js';

export function renderLogin() {
  const page = document.getElementById('page-content');

  // Remove any existing navbar
  const nav = document.getElementById('main-navbar');
  if (nav) nav.remove();

  page.innerHTML = `
    <div class="login-page">
      <canvas id="login-particles" class="login-particles"></canvas>

      <div class="login-container">
        <!-- Brand -->
        <div class="login-brand">
          <span class="login-logo">🚆</span>
          <h1 class="login-title">Rail<span class="text-gradient">Vision</span></h1>
          <p class="login-subtitle">AI-Powered Crowd Intelligence Platform</p>
        </div>

        <!-- Tab Bar -->
        <div class="login-tabs">
          <button class="login-tab active" data-tab="login" id="tab-login">Sign In</button>
          <button class="login-tab" data-tab="register" id="tab-register">Create Account</button>
          <div class="tab-indicator" id="tab-indicator"></div>
        </div>

        <!-- Sign In Form -->
        <div id="login-form" class="login-form-container active">
          <form id="signin-form" autocomplete="on">
            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input type="email" id="login-email" class="glass-input" placeholder="your@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="login-password" class="glass-input" placeholder="••••••••" required autocomplete="current-password">
                <button type="button" class="password-toggle" data-target="login-password" aria-label="Toggle password visibility">👁</button>
              </div>
            </div>
            <button type="submit" class="login-submit" id="btn-signin">
              <span class="btn-text">Sign In</span>
              <span class="btn-arrow">→</span>
              <span class="btn-loader"></span>
            </button>
          </form>

          <div class="login-demo-hint">
            <p>Demo: <code>admin@railvision.in</code> / <code>admin123</code></p>
            <p>Or: <code>passenger@railvision.in</code> / <code>pass123</code></p>
          </div>
        </div>

        <!-- Register Form -->
        <div id="register-form" class="login-form-container">
          <form id="signup-form" autocomplete="on">
            <div class="form-group">
              <label for="reg-name">Full Name</label>
              <input type="text" id="reg-name" class="glass-input" placeholder="Your full name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="reg-email">Email Address</label>
              <input type="email" id="reg-email" class="glass-input" placeholder="your@email.com" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="reg-password">Password</label>
              <div class="password-wrapper">
                <input type="password" id="reg-password" class="glass-input" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password">
                <button type="button" class="password-toggle" data-target="reg-password" aria-label="Toggle password visibility">👁</button>
              </div>
            </div>
            <div class="form-group">
              <label>Select Your Role</label>
              <div class="role-selector">
                <label class="role-card active" id="role-passenger">
                  <input type="radio" name="role" value="passenger" checked>
                  <div class="role-check">✓</div>
                  <span class="role-icon">🧑‍💼</span>
                  <span class="role-name">Passenger</span>
                  <span class="role-desc">Search trains & predict crowds</span>
                </label>
                <label class="role-card" id="role-admin">
                  <input type="radio" name="role" value="admin">
                  <div class="role-check">✓</div>
                  <span class="role-icon">🏛️</span>
                  <span class="role-name">Authority</span>
                  <span class="role-desc">Analytics & management</span>
                </label>
              </div>
            </div>
            <button type="submit" class="login-submit" id="btn-signup">
              <span class="btn-text">Create Account</span>
              <span class="btn-arrow">→</span>
              <span class="btn-loader"></span>
            </button>
          </form>
        </div>

        <!-- Back Link -->
        <a href="#/" class="login-back">← Back to Home</a>
      </div>
    </div>
  `;

  // ── Tab Switching ──
  const tabs = document.querySelectorAll('.login-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const indicator = document.getElementById('tab-indicator');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.dataset.tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        indicator.style.transform = 'translateX(0)';
      } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        indicator.style.transform = 'translateX(100%)';
      }
    });
  });

  // ── Role Card Selection ──
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // ── Password Toggle ──
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁';
      }
    });
  });

  // ── Sign In Handler ──
  document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('btn-signin');

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const data = await apiClient.login(email, password);
      showToast('success', `Welcome back, ${data.user.name}!`);

      // Store auth data
      localStorage.setItem('railVisionToken', data.token);
      localStorage.setItem('railVisionUser', JSON.stringify(data.user));
      const uiRole = data.user.role === 'admin' ? 'authority' : 'passenger';
      sessionStorage.setItem('railVisionRole', uiRole);

      // Navigate after brief delay for toast visibility
      setTimeout(() => {
        window.location.hash = data.user.role === 'admin' ? '#/dashboard' : '#/passenger';
      }, 600);
    } catch (err) {
      showToast('error', err.message || 'Login failed. Please check your credentials.');
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ── Register Handler ──
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const btn = document.getElementById('btn-signup');

    if (password.length < 6) {
      showToast('warning', 'Password must be at least 6 characters.');
      return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const data = await apiClient.register(name, email, password, role);
      showToast('success', `Welcome to RailVision, ${data.user.name}!`);

      localStorage.setItem('railVisionToken', data.token);
      localStorage.setItem('railVisionUser', JSON.stringify(data.user));
      const uiRole = data.user.role === 'admin' ? 'authority' : 'passenger';
      sessionStorage.setItem('railVisionRole', uiRole);

      setTimeout(() => {
        window.location.hash = data.user.role === 'admin' ? '#/dashboard' : '#/passenger';
      }, 600);
    } catch (err) {
      showToast('error', err.message || 'Registration failed. Please try again.');
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ── Particle Background ──
  try {
    const canvas = document.getElementById('login-particles');
    if (canvas) {
      initParticles(canvas);
    }
  } catch (e) {
    // Particles are decorative, don't block the page
  }
}
