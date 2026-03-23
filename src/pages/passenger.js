// ============================================
// RailVision Passenger Interface
// Search, results, crowd details, report
// ============================================

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { stations, allTrains, allAlerts, searchTrains, getCrowdDensity, getCrowdLevel, getCrowdLabel } from '../data/mockData.js';
import { predictCrowdDensity, getRecommendations, getCompartmentBreakdown } from '../data/predictionEngine.js';
import { createNavbar, createTrainCard, createCrowdBadge, createAlertBanner, openModal, closeModal, showToast } from '../components/components.js';

let predictionChart = null;

export function renderPassenger() {
  const app = document.getElementById('app');
  const page = document.getElementById('page-content');

  // Add navbar
  const existingNav = document.getElementById('main-navbar');
  if (existingNav) existingNav.remove();
  app.insertBefore(createNavbar('passenger', 'passenger'), page);

  page.innerHTML = `
    <div class="container page-enter" style="padding-top:var(--space-8);padding-bottom:var(--space-16);">

      <!-- Page Header -->
      <div style="margin-bottom:var(--space-8);">
        <h1 class="heading-display" style="font-size:var(--fs-3xl);margin-bottom:var(--space-2);">
          Find Your <span class="text-gradient">Train</span>
        </h1>
        <p style="color:var(--color-text-secondary);">Search trains and check real-time crowd levels with AI predictions</p>
      </div>

      <!-- Search Panel -->
      <div class="card" id="search-panel" style="margin-bottom:var(--space-8);padding:var(--space-6);">
        <div style="display:flex;gap:var(--space-4);flex-wrap:wrap;align-items:flex-end;">
          <div class="form-group" style="flex:1;min-width:200px;">
            <label class="form-label" for="search-from">From Station</label>
            <select class="form-select" id="search-from">
              <option value="">Select Source</option>
              ${stations.map(s => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('')}
            </select>
          </div>

          <button id="swap-stations-btn" type="button" class="btn btn-ghost" style="margin-bottom:2px;font-size:1.2rem;" title="Swap stations">⇄</button>

          <div class="form-group" style="flex:1;min-width:200px;">
            <label class="form-label" for="search-to">To Station</label>
            <select class="form-select" id="search-to">
              <option value="">Select Destination</option>
              ${stations.map(s => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('')}
            </select>
          </div>

          <div class="form-group" style="min-width:160px;">
            <label class="form-label" for="search-date">Travel Date</label>
            <input type="date" class="form-input" id="search-date" value="${new Date().toISOString().split('T')[0]}">
          </div>

          <button class="btn btn-primary btn-lg" id="search-btn" style="margin-bottom:2px;">
            🔍 Search Trains
          </button>
        </div>
      </div>

      <!-- Alerts Ticker -->
      <div id="alerts-section" style="margin-bottom:var(--space-6);">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
          <span style="font-size:var(--fs-sm);font-weight:600;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Live Alerts</span>
          <span class="badge badge-red" style="font-size:10px;">LIVE</span>
        </div>
        <div id="alerts-ticker" style="display:flex;flex-direction:column;gap:var(--space-2);max-height:120px;overflow-y:auto;">
          ${allAlerts.slice(0, 3).map(a => createAlertBanner(a)).join('')}
        </div>
      </div>

      <!-- Train Results -->
      <div id="results-section" style="display:none;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">
          <h2 class="heading-section" style="font-size:var(--fs-xl);">
            Available Trains
          </h2>
          <span id="results-count" style="font-size:var(--fs-sm);color:var(--color-text-muted);"></span>
        </div>
        <div class="grid grid-2" id="train-results" style="gap:var(--space-4);"></div>
      </div>

      <!-- Recommendations Section -->
      <div id="recommendations-section" style="display:none;margin-top:var(--space-8);">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
          <span style="font-size:1.25rem;">💡</span>
          <h2 class="heading-section" style="font-size:var(--fs-xl);">
            AI Recommendations
          </h2>
        </div>
        <div id="recommendations-list" style="display:flex;flex-direction:column;gap:var(--space-3);"></div>
      </div>
    </div>
  `;

  // Event listeners
  setupSearchEvents();
  setupReportCrowdModal();

  // Auto-show some trains
  showInitialTrains();
}

function setupSearchEvents() {
  const searchBtn = document.getElementById('search-btn');
  const swapBtn = document.getElementById('swap-stations-btn');

  searchBtn.addEventListener('click', performSearch);
  swapBtn.addEventListener('click', () => {
    const from = document.getElementById('search-from');
    const to = document.getElementById('search-to');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
  });

  // Enter key
  document.getElementById('search-from').addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });
  document.getElementById('search-to').addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(); });
}

function performSearch() {
  const from = document.getElementById('search-from').value;
  const to = document.getElementById('search-to').value;
  const results = searchTrains(from, to);

  showResults(results);
}

function showInitialTrains() {
  const results = allTrains.slice(0, 6);
  showResults(results);
}

function showResults(trains) {
  const section = document.getElementById('results-section');
  const grid = document.getElementById('train-results');
  const count = document.getElementById('results-count');

  section.style.display = 'block';
  count.textContent = `${trains.length} train${trains.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = trains.map(train => createTrainCard(train)).join('');

  // Add click listeners to detail buttons
  grid.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trainId = btn.dataset.trainId;
      const train = allTrains.find(t => t.id === trainId);
      if (train) showCrowdDetailModal(train);
    });
  });

  // Also make train cards clickable
  grid.querySelectorAll('.train-card').forEach(card => {
    card.addEventListener('click', () => {
      const trainId = card.dataset.trainId;
      const train = allTrains.find(t => t.id === trainId);
      if (train) showCrowdDetailModal(train);
    });
  });
}

function showCrowdDetailModal(train) {
  const now = new Date();
  const density = getCrowdDensity(train.id, now.getHours(), now.getDay());
  const level = getCrowdLevel(density);
  const compartments = getCompartmentBreakdown(train.id);
  const predictions = predictCrowdDensity(train.id, 8);
  const recommendations = getRecommendations(allTrains, train.id);

  const content = `
    <div style="display:flex;flex-direction:column;gap:var(--space-6);">
      <!-- Train Info Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3);">
        <div>
          <div style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">${train.trainName}</div>
          <div style="font-size:var(--fs-sm);color:var(--color-text-muted);">#${train.trainNumber} • ${train.from.name} → ${train.to.name}</div>
        </div>
        ${createCrowdBadge(density)}
      </div>

      <!-- Compartment Breakdown -->
      <div>
        <h4 style="font-family:var(--font-display);font-weight:600;margin-bottom:var(--space-3);font-size:var(--fs-sm);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">Compartment Breakdown</h4>
        <div style="display:flex;flex-direction:column;gap:var(--space-2);">
          ${compartments.map(comp => `
            <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-3);background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);">
              <span style="font-size:var(--fs-sm);min-width:100px;font-weight:500;">${comp.name}</span>
              <div style="flex:1;">
                <div class="crowd-bar">
                  <div class="crowd-bar-fill ${comp.level}" style="width:${comp.density}%;"></div>
                </div>
              </div>
              <span style="font-size:var(--fs-xs);font-weight:600;min-width:60px;text-align:right;color:${
                comp.level === 'low' ? 'var(--crowd-low)' : comp.level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)'
              };">${comp.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- AI Prediction Chart -->
      <div>
        <h4 style="font-family:var(--font-display);font-weight:600;margin-bottom:var(--space-3);font-size:var(--fs-sm);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">AI Crowd Prediction (Next 8 Hours)</h4>
        <div style="background:rgba(0,0,0,0.2);border-radius:var(--radius-md);padding:var(--space-4);height:220px;">
          <canvas id="prediction-chart"></canvas>
        </div>
        <div style="display:flex;justify-content:center;gap:var(--space-4);margin-top:var(--space-3);">
          <span style="font-size:var(--fs-xs);color:var(--color-text-muted);display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:10px;height:3px;background:var(--color-accent-teal);border-radius:2px;"></span> Predicted
          </span>
          <span style="font-size:var(--fs-xs);color:var(--color-text-muted);display:flex;align-items:center;gap:4px;">
            <span style="display:inline-block;width:10px;height:10px;background:rgba(6,182,212,0.15);border-radius:2px;"></span> Confidence Band
          </span>
        </div>
      </div>

      <!-- Recommendations -->
      ${recommendations.length > 0 ? `
        <div>
          <h4 style="font-family:var(--font-display);font-weight:600;margin-bottom:var(--space-3);font-size:var(--fs-sm);color:var(--color-text-muted);text-transform:uppercase;letter-spacing:0.05em;">💡 Less Crowded Alternatives</h4>
          <div style="display:flex;flex-direction:column;gap:var(--space-2);">
            ${recommendations.slice(0, 3).map(rec => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);background:rgba(255,255,255,0.02);border-radius:var(--radius-sm);border:1px solid var(--color-border);">
                <div>
                  <div style="font-size:var(--fs-sm);font-weight:600;">${rec.trainName.split(' ').slice(0, 4).join(' ')}</div>
                  <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">Best time: ${rec.bestTimeToTravel.label}</div>
                </div>
                ${createCrowdBadge(rec.currentDensity)}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  openModal(`Train Details — #${train.trainNumber}`, content);

  // Render prediction chart
  setTimeout(() => {
    renderPredictionChart(predictions);
  }, 100);
}

function renderPredictionChart(predictions) {
  const canvas = document.getElementById('prediction-chart');
  if (!canvas) return;

  if (predictionChart) {
    predictionChart.destroy();
    predictionChart = null;
  }

  const ctx = canvas.getContext('2d');

  predictionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: predictions.map(p => p.hourLabel),
      datasets: [
        {
          label: 'Upper Bound',
          data: predictions.map(p => p.upper),
          borderColor: 'transparent',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          fill: '+1',
          pointRadius: 0,
          tension: 0.4,
        },
        {
          label: 'Predicted Crowd',
          data: predictions.map(p => p.predicted),
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: predictions.map(p =>
            p.isCurrentHour ? '#22d3ee' : 'rgba(6, 182, 212, 0.6)'
          ),
          pointBorderColor: predictions.map(p =>
            p.isCurrentHour ? '#fff' : 'transparent'
          ),
          pointBorderWidth: predictions.map(p => p.isCurrentHour ? 2 : 0),
          tension: 0.4,
          fill: false,
        },
        {
          label: 'Lower Bound',
          data: predictions.map(p => p.lower),
          borderColor: 'transparent',
          backgroundColor: 'rgba(6, 182, 212, 0.08)',
          fill: false,
          pointRadius: 0,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 14, 26, 0.95)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          borderWidth: 1,
          titleFont: { family: 'Inter' },
          bodyFont: { family: 'Inter' },
          padding: 12,
          callbacks: {
            label: (ctx) => {
              if (ctx.datasetIndex === 1) {
                const pred = predictions[ctx.dataIndex];
                return `Predicted: ${pred.predicted}% (Confidence: ${pred.confidence}%)`;
              }
              return null;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 11 } },
          grid: { color: 'rgba(148,163,184,0.06)' },
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: '#64748b',
            font: { size: 11 },
            callback: v => v + '%',
          },
          grid: { color: 'rgba(148,163,184,0.06)' },
        },
      },
    },
  });
}

function setupReportCrowdModal() {
  window.reportCrowdModal = () => {
    const content = `
      <form id="report-form" style="display:flex;flex-direction:column;gap:var(--space-4);">
        <div class="form-group">
          <label class="form-label" for="report-station">Station</label>
          <select class="form-select" id="report-station" required>
            <option value="">Select Station</option>
            ${stations.map(s => `<option value="${s.code}">${s.name} (${s.code})</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="report-train">Train (Optional)</label>
          <input type="text" class="form-input" id="report-train" placeholder="e.g., Rajdhani Express">
        </div>

        <div class="form-group">
          <label class="form-label">Crowd Density</label>
          <div style="display:flex;gap:var(--space-3);">
            <label class="crowd-radio-label" style="flex:1;cursor:pointer;">
              <input type="radio" name="report-density" value="low" style="display:none;" required>
              <div class="crowd-radio-card" id="density-low" style="padding:var(--space-3);border-radius:var(--radius-md);border:2px solid var(--color-border);text-align:center;transition:all var(--transition-fast);">
                <div style="font-size:1.5rem;margin-bottom:var(--space-1);">🟢</div>
                <div style="font-size:var(--fs-sm);font-weight:600;">Low</div>
              </div>
            </label>
            <label class="crowd-radio-label" style="flex:1;cursor:pointer;">
              <input type="radio" name="report-density" value="moderate" style="display:none;">
              <div class="crowd-radio-card" id="density-moderate" style="padding:var(--space-3);border-radius:var(--radius-md);border:2px solid var(--color-border);text-align:center;transition:all var(--transition-fast);">
                <div style="font-size:1.5rem;margin-bottom:var(--space-1);">🟡</div>
                <div style="font-size:var(--fs-sm);font-weight:600;">Moderate</div>
              </div>
            </label>
            <label class="crowd-radio-label" style="flex:1;cursor:pointer;">
              <input type="radio" name="report-density" value="high" style="display:none;">
              <div class="crowd-radio-card" id="density-high" style="padding:var(--space-3);border-radius:var(--radius-md);border:2px solid var(--color-border);text-align:center;transition:all var(--transition-fast);">
                <div style="font-size:1.5rem;margin-bottom:var(--space-1);">🔴</div>
                <div style="font-size:var(--fs-sm);font-weight:600;">High</div>
              </div>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="report-notes">Notes</label>
          <textarea class="form-textarea" id="report-notes" placeholder="Describe the crowd situation..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary" id="report-submit" style="width:100%;">
          Submit Report 📤
        </button>
      </form>
    `;

    openModal('Report Crowd Level', content);

    // Style radio buttons
    setTimeout(() => {
      const radios = document.querySelectorAll('input[name="report-density"]');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          document.querySelectorAll('.crowd-radio-card').forEach(card => {
            card.style.borderColor = 'var(--color-border)';
            card.style.background = 'transparent';
          });
          const card = radio.parentElement.querySelector('.crowd-radio-card');
          const colors = {
            low: { border: 'var(--crowd-low)', bg: 'var(--crowd-low-bg)' },
            moderate: { border: 'var(--crowd-moderate)', bg: 'var(--crowd-moderate-bg)' },
            high: { border: 'var(--crowd-high)', bg: 'var(--crowd-high-bg)' },
          };
          const c = colors[radio.value];
          card.style.borderColor = c.border;
          card.style.background = c.bg;
        });
      });

      // Handle form submission
      const form = document.getElementById('report-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        showToast('Crowd report submitted successfully! Thank you for contributing.', 'success');
      });
    }, 100);
  };
}
