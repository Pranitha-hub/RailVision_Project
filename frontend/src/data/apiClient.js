// ============================================
// RailVision API Client
// Handles all backend communication with auth
// ============================================

const API_BASE = 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // ── Auth State ──

  getToken() {
    return localStorage.getItem('railVisionToken');
  }

  getUser() {
    const user = localStorage.getItem('railVisionUser');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('railVisionToken');
    localStorage.removeItem('railVisionUser');
    sessionStorage.removeItem('railVisionRole');
    window.location.hash = '#/';
  }

  // ── Core Request Method ──

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || `Request failed (${response.status})`);
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Is the backend running?');
      }
      throw err;
    }
  }

  // ── Auth Endpoints ──

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password, role) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // ── Train Endpoints ──

  async getTrains(source, destination) {
    let endpoint = '/trains';
    const params = [];
    if (source) params.push(`source=${encodeURIComponent(source)}`);
    if (destination) params.push(`destination=${encodeURIComponent(destination)}`);
    if (params.length) endpoint += `?${params.join('&')}`;
    return this.request(endpoint);
  }

  // ── Crowd Endpoints ──

  async getCrowdData(trainId) {
    return this.request(`/crowd/${trainId}`);
  }

  async submitReport(report) {
    return this.request('/report', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  // ── Prediction Endpoints ──

  async getPrediction(trainId) {
    return this.request(`/predict/${trainId}`);
  }

  // ── Dashboard Endpoints ──

  async getDashboardKPIs() {
    return this.request('/dashboard/kpis');
  }

  async getDashboardHeatmap() {
    return this.request('/dashboard/heatmap');
  }

  async getDashboardRoutes() {
    return this.request('/dashboard/routes');
  }
}

export const apiClient = new ApiClient();
