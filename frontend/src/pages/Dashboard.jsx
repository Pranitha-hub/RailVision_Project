import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { allTrains, getDashboardKPIs, getHeatmapData, getHighDensityRoutes, getCrowdLevel } from '../data/mockData';
import { getDeploymentRecommendations } from '../data/predictionEngine';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [chartType, setChartType] = useState('bar');
  const [sortKey, setSortKey] = useState('route');
  const [sortAsc, setSortAsc] = useState(true);

  const kpis = getDashboardKPIs(allTrains);
  const heatmapData = getHeatmapData(allTrains.slice(0, 15));
  const highDensityRoutes = getHighDensityRoutes(allTrains.slice(0, 20));
  const deploymentRecs = getDeploymentRecommendations(allTrains);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const canvas = chartRef.current;
    if (!canvas) return;

    const top10 = highDensityRoutes.slice(0, 10);
    const colors = top10.map(r => {
      const level = getCrowdLevel(r.currentDensity);
      return level === 'low' ? '#10b981' : level === 'moderate' ? '#f59e0b' : '#ef4444';
    });
    const bgColors = top10.map(r => {
      const level = getCrowdLevel(r.currentDensity);
      return level === 'low' ? 'rgba(16,185,129,0.6)' : level === 'moderate' ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)';
    });

    chartInstance.current = new Chart(canvas.getContext('2d'), {
      type: chartType,
      data: {
        labels: top10.map(r => r.route),
        datasets: [{
          label: 'Current Density %',
          data: top10.map(r => r.currentDensity),
          backgroundColor: bgColors,
          borderColor: colors,
          borderWidth: chartType === 'line' ? 2 : 1,
          borderRadius: chartType === 'bar' ? 6 : 0,
          tension: 0.4,
          fill: chartType === 'line',
          pointBackgroundColor: colors,
          pointRadius: chartType === 'line' ? 4 : 0,
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
            padding: 12,
          },
        },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(148,163,184,0.06)' } },
          y: { min: 0, max: 100, ticks: { color: '#64748b', font: { size: 11 }, callback: v => v + '%' }, grid: { color: 'rgba(148,163,184,0.06)' } },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [chartType, highDensityRoutes]);

  return (
    <div className="container page-enter" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="heading-display" style={{ fontSize: 'var(--fs-3xl)', marginBottom: 'var(--space-2)' }}>
            Authority <span className="text-gradient-warm">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Real-time crowd analytics and decision support</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span className="badge badge-green" style={{ fontSize: 'var(--fs-xs)' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', animation: 'dotPulse 1.5s infinite', marginRight: '6px' }}></span>
            System Online
          </span>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        <StatCard id="passengers" icon="👥" label="Total Passengers Today" value={kpis.totalPassengers} color="teal" />
        <StatCard id="density" icon="📊" label="Avg Crowd Density" value={kpis.avgDensity} suffix="%" color="amber" />
        <StatCard id="alerts" icon="⚠️" label="Overcrowding Alerts" value={kpis.overcrowdingAlerts} color="red" />
        <StatCard id="reports" icon="📝" label="Active Reports" value={kpis.activeReports} color="purple" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>Crowd Analytics by Route</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className={`btn btn-sm btn-ghost ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>Bar</button>
              <button className={`btn btn-sm btn-ghost ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')}>Line</button>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-4)' }}>Peak Hours Heatmap</h3>
          <div style={{ overflowX: 'auto' }}>
            <Heatmap data={heatmapData} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', justifyContent: 'center' }}>
            <Legend color="rgba(16,185,129,0.4)" label="Low" />
            <Legend color="rgba(245,158,11,0.6)" label="Moderate" />
            <Legend color="rgba(239,68,68,0.7)" label="High" />
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-4)' }}>High-Density Routes</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Train</th>
                <th>Current%</th>
                <th>Avg %</th>
                <th>Peak Hour</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {highDensityRoutes.slice(0, 15).map(route => (
                <tr key={route.id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{route.route}</td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{route.trainName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div className="crowd-bar" style={{ width: '60px' }}>
                        <div className={`crowd-bar-fill ${route.level}`} style={{ width: `${route.currentDensity}%` }}></div>
                      </div>
                      <span style={{ fontWeight: 600, color: `var(--crowd-${route.level})` }}>{route.currentDensity}%</span>
                    </div>
                  </td>
                  <td>{route.avgDensity}%</td>
                  <td>{route.peakHour}</td>
                  <td>
                    <span className={`badge badge-${route.level === 'low' ? 'green' : route.level === 'moderate' ? 'amber' : 'red'}`}>
                      {route.level === 'low' ? 'Normal' : route.level === 'moderate' ? 'Watch' : 'Alert'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Support */}
      <div className="card" style={{ padding: 'var(--space-6)', borderColor: 'rgba(245,158,11,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '1.5rem' }}>🎯</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>Decision Support — Coach Deployment</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {deploymentRecs.slice(0, 6).map(rec => (
            <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <span className={`badge ${rec.priority === 'Critical' ? 'badge-red' : rec.priority === 'High' ? 'badge-amber' : 'badge-teal'}`}>{rec.priority}</span>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{rec.trainName}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>{rec.route} • Current: {rec.currentDensity}%</div>
              </div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent-teal)', fontWeight: 500 }}>{rec.recommendation}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>{rec.estimatedImpact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Heatmap = ({ data }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="heatmap-grid">
      <div className="heatmap-label"></div>
      {hours.map(h => (
        <div key={h} className="heatmap-hour-label">{h % 3 === 0 ? String(h).padStart(2, '0') : ''}</div>
      ))}
      {data.map(row => (
        <React.Fragment key={row.day}>
          <div className="heatmap-label">{row.day}</div>
          {row.hours.map((density, h) => {
            const color = density <= 35 
              ? `rgba(16,185,129,${0.2 + (density / 35) * 0.5})`
              : density <= 65
              ? `rgba(245,158,11,${0.2 + ((density - 35) / 30) * 0.5})`
              : `rgba(239,68,68,${0.3 + ((density - 65) / 35) * 0.5})`;
            return (
              <div 
                key={h} 
                className="heatmap-cell" 
                style={{ background: color }} 
                title={`${row.day} ${String(h).padStart(2, '0')}:00 — ${density}% density`}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
    <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: color }}></div> {label}
  </div>
);

export default Dashboard;
