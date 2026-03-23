// ============================================
// RailVision Router
// Hash-based SPA routing with auth guards
// ============================================

import { renderLanding } from './pages/landing.js';
import { renderPassenger } from './pages/passenger.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLogin } from './pages/login.js';
import { apiClient } from './data/apiClient.js';

const routes = {
  '/': { render: renderLanding, requiresRole: false },
  '/login': { render: renderLogin, requiresRole: false },
  '/passenger': { render: renderPassenger, requiresRole: 'passenger' },
  '/dashboard': { render: renderDashboard, requiresRole: 'authority' },
};

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.split('?')[0];
  const route = routes[path];

  if (!route) {
    window.location.hash = '#/';
    return;
  }

  // Role guard — redirect to login if auth required but not logged in
  if (route.requiresRole) {
    const currentRole = sessionStorage.getItem('railVisionRole');
    if (!currentRole) {
      // Check if we have a token in localStorage (browser refresh scenario)
      const user = apiClient.getUser();
      if (user) {
        const uiRole = user.role === 'admin' ? 'authority' : 'passenger';
        sessionStorage.setItem('railVisionRole', uiRole);
      } else {
        // Not authenticated — redirect to login
        window.location.hash = '#/login';
        return;
      }
    }
  }

  // Clear page and re-render with transition
  const page = document.getElementById('page-content');
  if (page) {
    page.classList.add('page-exit');
    setTimeout(() => {
      page.classList.remove('page-exit');
      // Remove navbar if navigating to landing or login
      if (path === '/' || path === '/login') {
        const nav = document.getElementById('main-navbar');
        if (nav) nav.remove();
      }
      route.render();
    }, 150);
  } else {
    route.render();
  }
}
