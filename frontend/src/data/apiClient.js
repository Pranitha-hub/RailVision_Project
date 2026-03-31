// ============================================
// RailVision API Client
// Single source of truth for ALL data calls:
//   • Local FastAPI backend
//   • IndianRailAPI (live train data)
//   • Open-Meteo (weather / crowd adjustment)
//   • Browser Geolocation (nearest station)
// ============================================

const API_BASE = 'http://localhost:8000';

// ── IndianRailAPI (Free tier) ──
// Register at https://indianrailapi.com to get a key
const IRAIL_BASE = 'https://indianrailapi.com/api/v1';
const IRAIL_KEY  = 'YOUR_INDIANRAIL_API_KEY';  // Replace with your real key

// ── Open-Meteo (100% free, no key) ──
const METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE;
  }

  // ═══════════════════════════════════════════
  //  AUTH STATE
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  //  CORE REQUEST (local FastAPI backend)
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  //  AUTH ENDPOINTS (local backend)
  // ═══════════════════════════════════════════
  async login(email, password) {
    return this.saveAuth(await this.request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }));
  }
  async register(name, email, password, role) {
    return this.saveAuth(await this.request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }));
  }
  async createStaffUser(name, email, password, role) {
    return this.request('/auth/staff/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
  }

  // ═══════════════════════════════════════════
  //  TRAIN ENDPOINTS (local backend)
  // ═══════════════════════════════════════════
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

  // ═══════════════════════════════════════════
  //  CROWD ENDPOINTS (local backend)
  // ═══════════════════════════════════════════
  async getCrowdData(trainId) {
    return this.request(`/crowd/${trainId}`);
  }
  async submitReport(report) {
    return this.request('/report', { method: 'POST', body: JSON.stringify(report) });
  }

  // ═══════════════════════════════════════════
  //  PREDICTION ENDPOINTS (local backend)
  // ═══════════════════════════════════════════
  async getPrediction(trainId) {
    return this.request(`/predict/${trainId}`);
  }

  // ═══════════════════════════════════════════
  //  DASHBOARD ENDPOINTS (local backend)
  // ═══════════════════════════════════════════
  async getDashboardKPIs()    { return this.request('/dashboard/kpis'); }
  async getDashboardHeatmap() { return this.request('/dashboard/heatmap'); }
  async getDashboardRoutes()  { return this.request('/dashboard/routes'); }

  // ═══════════════════════════════════════════
  //  INDIAN RAIL API — Live External Data
  //  https://indianrailapi.com
  // ═══════════════════════════════════════════

  /**
   * Get live running status of a train (current location, delay, etc.)
   * @param {string} trainNo - 5-digit train number (e.g. "12301")
   * @returns {Object} { train_name, current_station, delay, last_update, ... }
   */
  async getLiveTrainStatus(trainNo) {
    try {
      const res = await fetch(`${IRAIL_BASE}/livetrainstatus/apikey/${IRAIL_KEY}/trainno/${trainNo}/`);
      if (!res.ok) throw new Error(`IndianRailAPI error (${res.status})`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('IndianRailAPI live status failed:', e.message);
      return null;
    }
  }

  /**
   * Get full route of a train with all station stops
   * @param {string} trainNo - 5-digit train number
   * @returns {Object} { route: [{ station_name, station_code, arrival, departure, ... }] }
   */
  async getTrainRoute(trainNo) {
    try {
      const res = await fetch(`${IRAIL_BASE}/trainroute/apikey/${IRAIL_KEY}/trainno/${trainNo}/`);
      if (!res.ok) throw new Error(`IndianRailAPI error (${res.status})`);
      return await res.json();
    } catch (e) {
      console.warn('IndianRailAPI route failed:', e.message);
      return null;
    }
  }

  /**
   * Search trains between two stations using IndianRailAPI
   * @param {string} fromCode - Source station code (e.g. "NDLS")
   * @param {string} toCode   - Destination station code (e.g. "CSMT")
   * @returns {Object} { trains: [...] }
   */
  async searchTrainsExternal(fromCode, toCode) {
    try {
      const res = await fetch(`${IRAIL_BASE}/trainsbetweenstations/apikey/${IRAIL_KEY}/from/${fromCode}/to/${toCode}/`);
      if (!res.ok) throw new Error(`IndianRailAPI error (${res.status})`);
      return await res.json();
    } catch (e) {
      console.warn('IndianRailAPI search failed:', e.message);
      return null;
    }
  }

  // ═══════════════════════════════════════════
  //  OPEN-METEO — Weather Forecast (Free)
  //  https://open-meteo.com
  // ═══════════════════════════════════════════

  /**
   * Get weather for a location (precipitation probability for crowd adjustment)
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Object} { temperature, precipitation_probability, weather_description }
   */
  async getWeather(lat, lng) {
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lng,
        current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m',
        hourly: 'precipitation_probability,temperature_2m',
        timezone: 'Asia/Kolkata',
        forecast_days: 1,
      });
      const res = await fetch(`${METEO_BASE}?${params}`);
      if (!res.ok) throw new Error(`Open-Meteo error (${res.status})`);
      const data = await res.json();

      // Parse the current weather
      const current = data.current || {};
      const weatherCode = current.weather_code ?? 0;

      return {
        temperature: Math.round(current.temperature_2m ?? 0),
        humidity: current.relative_humidity_2m ?? 0,
        windSpeed: Math.round(current.wind_speed_10m ?? 0),
        weatherCode,
        description: getWeatherDescription(weatherCode),
        icon: getWeatherIcon(weatherCode),
        // Hourly precipitation probabilities for crowd adjustment
        hourlyRain: data.hourly?.precipitation_probability || [],
        hourlyTemp: data.hourly?.temperature_2m || [],
        hourlyTime: data.hourly?.time || [],
      };
    } catch (e) {
      console.warn('Open-Meteo weather failed:', e.message);
      return null;
    }
  }

  // ═══════════════════════════════════════════
  //  BROWSER GEOLOCATION (Free, native)
  // ═══════════════════════════════════════════

  /**
   * Get user's current GPS coordinates
   * @returns {Promise<{lat: number, lng: number}>}
   */
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(new Error(err.message || 'Location access denied')),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    });
  }
}

// ── Weather Code → Human Description (WMO standard) ──
function getWeatherDescription(code) {
  const map = {
    0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Heavy showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm + hail', 99: 'Severe thunderstorm',
  };
  return map[code] || 'Unknown';
}

function getWeatherIcon(code) {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export const apiClient = new ApiClient();
