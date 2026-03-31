// ============================================
// RailVision API Client
// Single source of truth for all backend calls
// ============================================

const API_BASE = 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // ── Auth State ──
  getToken()        { return localStorage.getItem('railVisionToken'); }
  getUser()         { const u = localStorage.getItem('railVisionUser'); return u ? JSON.parse(u) : null; }
  isAuthenticated() { return !!this.getToken(); }

  logout() {
    localStorage.removeItem('railVisionToken');
    localStorage.removeItem('railVisionUser');
    sessionStorage.removeItem('railVisionRole');
    window.location.hash = '#/';
  }

  saveAuth(data) {
    if (data.token) localStorage.setItem('railVisionToken', data.token);
    if (data.user)  localStorage.setItem('railVisionUser', JSON.stringify(data.user));
    return data;
  }

  // ── Core Request ──
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || data.message || `Request failed (${response.status})`);
    }
    return data;
  }

  // ── Auth ──
  async login(email, password) {
    return this.saveAuth(await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }));
  }
  async register(name, email, password, role) {
    return this.saveAuth(await this.request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }));
  }
  async createStaffUser(name, email, password, role) {
    return this.request('/auth/staff/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
  }

  // ── Trains ──
  async getTrains(source = '', destination = '') {
    const params = new URLSearchParams();
    if (source)      params.append('source', source);
    if (destination) params.append('destination', destination);
    const qs = params.toString();
    return this.request(`/trains${qs ? '?' + qs : ''}`);
  }
  async getTrain(trainId) {
    return this.request(`/trains/${trainId}`);
  }

  // ── Crowd ──
  async getCrowdData(trainId) {
    return this.request(`/crowd/${trainId}`);
  }
  async submitReport(report) {
    return this.request('/report', { method: 'POST', body: JSON.stringify(report) });
  }

  // ── Predictions ──
  async getPrediction(trainId) {
    return this.request(`/predict/${trainId}`);
  }

  // ── Dashboard ──
  async getDashboardKPIs()    { return this.request('/dashboard/kpis'); }
  async getDashboardHeatmap() { return this.request('/dashboard/heatmap'); }
  async getDashboardRoutes()  { return this.request('/dashboard/routes'); }
}

export const apiClient = new ApiClient();
