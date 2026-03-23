// ============================================
// RailVision Authority Dashboard
// Analytics, heatmaps, tables, decision support
// ============================================

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { allTrains, getDashboardKPIs, getHeatmapData, getHighDensityRoutes, getCrowdLevel, getCrowdDensity } from '../data/mockData.js';
import { getDeploymentRecommendations } from '../data/predictionEngine.js';
import { createNavbar, createStatCard, animateCounters } from '../components/components.js';

let analyticsChart = null;

export function renderDashboard() {
  const app = document.getElementById('app');
  const page = document.getElementById('page-content');

  // Add navbar
  const existingNav = document.getElementById('main-navbar');
  if (existingNav) existingNav.remove();
  app.insertBefore(createNavbar('authority', 'dashboard'), page);

  const kpis = getDashboardKPIs(allTrains);
  const heatmapData = getHeatmapData(allTrains.slice(0, 15));
  const highDensityRoutes = getHighDensityRoutes(allTrains.slice(0, 20));
  const deploymentRecs = getDeploymentRecommendations(allTrains);

  page.innerHTML = `
    <div class="container page-enter" style="padding-top:var(--space-8);padding-bottom:var(--space-16);">

      <!-- Dashboard Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-8);flex-wrap:wrap;gap:var(--space-4);">
        <div>
          <h1 class="heading-display" style="font-size:var(--fs-3xl);margin-bottom:var(--space-2);">
            Authority <span class="text-gradient-warm">Dashboard</span>
          </h1>
          <p style="color:var(--color-text-secondary);">Real-time crowd analytics and decision support</p>
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <span class="badge badge-green" style="font-size:var(--fs-xs);">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;animation:dotPulse 1.5s infinite;"></span>
            System Online
          </span>
          <span style="font-size:var(--fs-sm);color:var(--color-text-muted);">
            Last updated: ${new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-4" id="kpi-grid" style="margin-bottom:var(--space-8);">
        ${createStatCard({ id: 'passengers', icon: '👥', label: 'Total Passengers Today', value: kpis.totalPassengers, color: 'teal' })}
        ${createStatCard({ id: 'density', icon: '📊', label: 'Avg Crowd Density', value: kpis.avgDensity, suffix: '%', color: 'amber' })}
        ${createStatCard({ id: 'alerts', icon: '⚠️', label: 'Overcrowding Alerts', value: kpis.overcrowdingAlerts, color: 'red' })}
        ${createStatCard({ id: 'reports', icon: '📝', label: 'Active Reports', value: kpis.activeReports, color: 'purple' })}
      </div>

      <!-- Charts Row -->
      <div class="grid grid-2" style="margin-bottom:var(--space-8);">
        <!-- Analytics Chart -->
        <div class="card" style="padding:var(--space-6);" id="analytics-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">
            <h3 style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">Crowd Analytics by Route</h3>
            <div style="display:flex;gap:var(--space-2);">
              <button class="btn btn-sm btn-ghost chart-toggle active" data-type="bar" id="chart-bar-btn">Bar</button>
              <button class="btn btn-sm btn-ghost chart-toggle" data-type="line" id="chart-line-btn">Line</button>
            </div>
          </div>
          <div style="height:300px;">
            <canvas id="analytics-chart"></canvas>
          </div>
        </div>

        <!-- Peak Hours Heatmap -->
        <div class="card" style="padding:var(--space-6);" id="heatmap-card">
          <h3 style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);margin-bottom:var(--space-4);">Peak Hours Heatmap</h3>
          <div style="overflow-x:auto;">
            ${renderHeatmap(heatmapData)}
          </div>
          <div style="display:flex;align-items:center;gap:var(--space-4);margin-top:var(--space-4);justify-content:center;">
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-xs);color:var(--color-text-muted);">
              <div style="width:14px;height:14px;border-radius:3px;background:rgba(16,185,129,0.4);"></div> Low
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-xs);color:var(--color-text-muted);">
              <div style="width:14px;height:14px;border-radius:3px;background:rgba(245,158,11,0.6);"></div> Moderate
            </div>
            <div style="display:flex;align-items:center;gap:var(--space-2);font-size:var(--fs-xs);color:var(--color-text-muted);">
              <div style="width:14px;height:14px;border-radius:3px;background:rgba(239,68,68,0.7);"></div> High
            </div>
          </div>
        </div>
      </div>

      <!-- High-Density Routes Table -->
      <div class="card" style="padding:var(--space-6);margin-bottom:var(--space-8);" id="routes-table-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-4);">
          <h3 style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">High-Density Routes</h3>
          <span style="font-size:var(--fs-sm);color:var(--color-text-muted);">${highDensityRoutes.length} routes monitored</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table" id="density-table">
            <thead>
              <tr>
                <th data-sort="route">Route ↕</th>
                <th data-sort="train">Train ↕</th>
                <th data-sort="current">Current% ↕</th>
                <th data-sort="avg">Avg % ↕</th>
                <th data-sort="peak">Peak Hour ↕</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${highDensityRoutes.slice(0, 15).map(route => `
                <tr>
                  <td style="font-weight:600;color:var(--color-text-primary);">${route.route}</td>
                  <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${route.trainName.split(' ').slice(0, 3).join(' ')}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2);">
                      <div class="crowd-bar" style="width:60px;">
                        <div class="crowd-bar-fill ${route.level}" style="width:${route.currentDensity}%;"></div>
                      </div>
                      <span style="font-weight:600;color:${
                        route.level === 'low' ? 'var(--crowd-low)' : route.level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)'
                      };">${route.currentDensity}%</span>
                    </div>
                  </td>
                  <td>${route.avgDensity}%</td>
                  <td>${route.peakHour}</td>
                  <td>
                    <span class="badge ${route.level === 'low' ? 'badge-green' : route.level === 'moderate' ? 'badge-amber' : 'badge-red'}">
                      ${route.level === 'low' ? 'Normal' : route.level === 'moderate' ? 'Watch' : 'Alert'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Decision Support Panel -->
      <div class="card" style="padding:var(--space-6);border-color:rgba(245,158,11,0.2);" id="decision-panel">
        <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);">
          <span style="font-size:1.5rem;">🎯</span>
          <h3 style="font-family:var(--font-display);font-weight:700;font-size:var(--fs-lg);">Decision Support — Coach Deployment</h3>
        </div>
        ${deploymentRecs.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${deploymentRecs.slice(0, 6).map(rec => `
              <div style="display:flex;align-items:center;gap:var(--space-4);padding:var(--space-4);background:rgba(255,255,255,0.02);border-radius:var(--radius-md);border:1px solid var(--color-border);flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:var(--space-2);min-width:60px;">
                  <span class="badge ${rec.priority === 'Critical' ? 'badge-red' : rec.priority === 'High' ? 'badge-amber' : 'badge-teal'}">${rec.priority}</span>
                </div>
                <div style="flex:1;min-width:200px;">
                  <div style="font-weight:600;font-size:var(--fs-sm);">${rec.trainName.split(' ').slice(0, 4).join(' ')}</div>
                  <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">${rec.route} • Current: ${rec.currentDensity}%</div>
                </div>
                <div style="font-size:var(--fs-sm);color:var(--color-accent-teal);font-weight:500;">${rec.recommendation}</div>
                <div style="font-size:var(--fs-xs);color:var(--color-text-muted);">${rec.estimatedImpact}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="text-align:center;padding:var(--space-8);color:var(--color-text-muted);">
            <p style="font-size:var(--fs-lg);margin-bottom:var(--space-2);">✅ All Clear</p>
            <p style="font-size:var(--fs-sm);">No additional coaches needed at this time.</p>
          </div>
        `}
      </div>
    </div>
  `;

  // Initialize components
  setTimeout(() => {
    animateCounters(document.getElementById('kpi-grid'));
    renderAnalyticsChart('bar', highDensityRoutes);
    setupChartToggle(highDensityRoutes);
    setupTableSort();
  }, 100);
}

function renderHeatmap(data) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  let html = '<div class="heatmap-grid">';

  // Hour labels row
  html += '<div class="heatmap-label"></div>';
  hours.forEach(h => {
    html += `<div class="heatmap-hour-label">${h % 3 === 0 ? String(h).padStart(2, '0') : ''}</div>`;
  });

  // Data rows
  data.forEach(row => {
    html += `<div class="heatmap-label">${row.day}</div>`;
    row.hours.forEach((density, h) => {
      const color = density <= 35
        ? `rgba(16,185,129,${0.2 + (density / 35) * 0.5})`
        : density <= 65
        ? `rgba(245,158,11,${0.2 + ((density - 35) / 30) * 0.5})`
        : `rgba(239,68,68,${0.3 + ((density - 65) / 35) * 0.5})`;

      html += `<div class="heatmap-cell" style="background:${color};" title="${row.day} ${String(h).padStart(2, '0')}:00 — ${density}% density"></div>`;
    });
  });

  html += '</div>';
  return html;
}

function renderAnalyticsChart(type, routes) {
  const canvas = document.getElementById('analytics-chart');
  if (!canvas) return;

  if (analyticsChart) {
    analyticsChart.destroy();
    analyticsChart = null;
  }

  const top10 = routes.slice(0, 10);

  const colors = top10.map(r => {
    const level = getCrowdLevel(r.currentDensity);
    return level === 'low' ? '#10b981' : level === 'moderate' ? '#f59e0b' : '#ef4444';
  });

  const bgColors = top10.map(r => {
    const level = getCrowdLevel(r.currentDensity);
    return level === 'low' ? 'rgba(16,185,129,0.6)' : level === 'moderate' ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)';
  });

  analyticsChart = new Chart(canvas.getContext('2d'), {
    type: type,
    data: {
      labels: top10.map(r => r.route),
      datasets: [{
        label: 'Current Density %',
        data: top10.map(r => r.currentDensity),
        backgroundColor: bgColors,
        borderColor: colors,
        borderWidth: type === 'line' ? 2 : 1,
        borderRadius: type === 'bar' ? 6 : 0,
        tension: 0.4,
        fill: type === 'line',
        pointBackgroundColor: colors,
        pointRadius: type === 'line' ? 4 : 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 14, 26, 0.95)',
          borderColor: 'rgba(148, 163, 184, 0.2)',
          borderWidth: 1,
          titleFont: { family: 'Inter' },
          bodyFont: { family: 'Inter' },
          padding: 12,
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b',
            font: { size: 10 },
            maxRotation: 45,
          },
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

function setupChartToggle(routes) {
  const toggleBtns = document.querySelectorAll('.chart-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAnalyticsChart(btn.dataset.type, routes);
    });
  });
}

function setupTableSort() {
  const headers = document.querySelectorAll('#density-table th[data-sort]');
  let sortDir = {};

  headers.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      sortDir[key] = !sortDir[key];

      const tbody = document.querySelector('#density-table tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      const colIndex = Array.from(th.parentElement.children).indexOf(th);

      rows.sort((a, b) => {
        const aVal = a.children[colIndex].textContent.trim();
        const bVal = b.children[colIndex].textContent.trim();

        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir[key] ? aNum - bNum : bNum - aNum;
        }
        return sortDir[key] ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(row => tbody.appendChild(row));
    });
  });
}
