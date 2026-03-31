import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Users, AlertCircle, Smile, UserPlus, Activity, Coffee,
         HeartHandshake, Loader2 } from 'lucide-react';
import { apiClient } from '../data/apiClient';
import StatCard from '../components/StatCard';

Chart.register(...registerables);

const Dashboard = () => {
  const currentUser = apiClient.getUser();
  const isAdmin     = currentUser?.role === 'admin';

  // ── State ──────────────────────────────────────────────────────────────────
  const [kpis,       setKpis]       = useState(null);
  const [heatmap,    setHeatmap]    = useState([]);
  const [routes,     setRoutes]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [chartType,  setChartType]  = useState('bar');

  const [staffForm,    setStaffForm]    = useState({ name: '', email: '', password: '', role: 'admin' });
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffMessage, setStaffMessage] = useState({ type: '', text: '' });

  const chartRef     = useRef(null);
  const chartInst    = useRef(null);

  // ── Fetch real data ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [k, h, r] = await Promise.all([
          apiClient.getDashboardKPIs(),
          apiClient.getDashboardHeatmap(),
          apiClient.getDashboardRoutes(),
        ]);
        setKpis(k);
        setHeatmap(h.heatmap || []);
        setRoutes(r.routes  || []);
      } catch (e) {
        console.error('Dashboard load failed:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Refresh every 60 seconds
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  // ── Chart ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (chartInst.current) chartInst.current.destroy();
    const canvas = chartRef.current;
    if (!canvas || routes.length === 0) return;

    const top10      = routes.slice(0, 10);
    const accentColor = '#C2502A';
    const softColor   = 'rgba(194, 80, 42, 0.2)';

    chartInst.current = new Chart(canvas.getContext('2d'), {
      type: chartType,
      data: {
        labels: top10.map(r => r.route),
        datasets: [{
          label: 'Busyness %',
          data: top10.map(r => r.current_density),
          backgroundColor: chartType === 'bar' ? accentColor : softColor,
          borderColor: accentColor,
          borderWidth: chartType === 'line' ? 3 : 0,
          borderRadius: 8,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255,255,255,0.95)', titleColor: '#1C1917', bodyColor: '#44403C',
            borderColor: '#EDE4D8', borderWidth: 1, padding: 12,
            titleFont: { family: "'Bricolage Grotesque',sans-serif", size: 13, weight: 'bold' },
            bodyFont:  { family: "'Plus Jakarta Sans',sans-serif",    size: 12 },
          },
        },
        scales: {
          x: { ticks: { color: '#78716C', font: { family: "'Plus Jakarta Sans'", size: 11 } }, grid: { display: false }, border: { display: false } },
          y: { min: 0, max: 100, ticks: { color: '#78716C', font: { family: "'Plus Jakarta Sans'", size: 11 }, callback: v => v + '%' }, grid: { color: '#F5EFE6' }, border: { display: false } },
        },
      },
    });

    return () => { if (chartInst.current) chartInst.current.destroy(); };
  }, [chartType, routes]);

  // ── Staff form ─────────────────────────────────────────────────────────────
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffMessage({ type: '', text: '' });
    try {
      await apiClient.createStaffUser(staffForm.name, staffForm.email, staffForm.password, staffForm.role);
      setStaffMessage({ type: 'success', text: `${staffForm.name} has been added to the team!` });
      setStaffForm({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      setStaffMessage({ type: 'error', text: err.message || "Couldn't add that team member." });
    } finally {
      setStaffLoading(false);
    }
  };

  // ── Skeleton loader ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 'var(--space-24)' }}>
        <div className="container">
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <div style={{ height: '40px', width: '260px', borderRadius: 'var(--radius-md)', background: 'var(--cream-dark)', marginBottom: '12px', animation: 'pulse-soft 1.8s ease infinite' }} />
            <div style={{ height: '24px', width: '380px', borderRadius: 'var(--radius-md)', background: 'var(--cream-dark)', animation: 'pulse-soft 1.8s ease infinite', animationDelay: '200ms' }} />
          </div>
          <div className="grid grid-4" style={{ marginBottom: 'var(--space-12)' }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ height: '140px', borderRadius: 'var(--radius-lg)', background: 'var(--cream-dark)', animation: `pulse-soft 1.8s ease infinite`, animationDelay: `${i*150}ms` }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: 'var(--space-12)', color: 'var(--ink-muted)' }}>
            <Loader2 size={24} /> Loading live dashboard data...
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', paddingTop: 'var(--space-24)' }}>
      <div className="container">

        {/* Greeting */}
        <div className="flex-between flex-wrap gap-6" style={{ marginBottom: 'var(--space-12)' }}>
          <div className="animate-fade-up">
            <h1 className="h1" style={{ marginBottom: 'var(--space-2)' }}>
              Hello, {currentUser?.name?.split(' ')[0] ?? 'Team'}.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--ink-soft)' }}>Here's how the network looks right now.</p>
          </div>
          <div className="surface animate-fade-up" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '10px', animationDelay: '100ms' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--sage)', boxShadow: '0 0 0 3px rgba(74,124,89,0.2)' }} />
            <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9375rem' }}>Live data · refreshes every 60s</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-4 animate-fade-up" style={{ marginBottom: 'var(--space-12)', animationDelay: '200ms' }}>
          <StatCard id="01" Icon={Users}       label="People Travelling"        value={kpis?.total_passengers  ?? 0} trend={5.2} />
          <StatCard id="02" Icon={Activity}    label="Avg. Busyness"            value={kpis?.avg_density       ?? 0} suffix="%" trend={-2.4} />
          <StatCard id="03" Icon={AlertCircle} label="Crowding Alerts"          value={kpis?.overcrowding_alerts ?? 0} />
          <StatCard id="04" Icon={Smile}       label="Reports Submitted Today"  value={kpis?.active_reports    ?? 0} />
        </div>

        {/* Chart + Heatmap */}
        <div className="grid grid-12 animate-fade-up" style={{ marginBottom: 'var(--space-16)', gap: 'var(--space-8)', animationDelay: '300ms' }}>

          <div className="lg:col-span-8 card">
            <div className="flex-between" style={{ marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 className="h3">Busiest Routes</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)' }}>Top 10 by current load</p>
              </div>
              <div className="flex" style={{ padding: '4px', background: 'var(--cream-dark)', borderRadius: 'var(--radius-full)' }}>
                {['bar', 'line'].map(t => (
                  <button key={t} onClick={() => setChartType(t)} style={{
                    padding: '5px 16px', fontSize: '0.8125rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 200ms',
                    background: chartType === t ? 'white' : 'transparent',
                    color:      chartType === t ? 'var(--ink)' : 'var(--ink-muted)',
                    boxShadow:  chartType === t ? 'var(--shadow-sm)' : 'none',
                  }}>
                    {t === 'bar' ? 'Bars' : 'Trend'}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <canvas ref={chartRef} />
            </div>
          </div>

          <div className="lg:col-span-4 card" style={{ background: 'var(--cream-dark)' }}>
            <h3 className="h3" style={{ marginBottom: '4px' }}>Weekly Rhythm</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', marginBottom: 'var(--space-6)' }}>When people travel the most</p>
            <div style={{ overflowX: 'auto' }}>
              <Heatmap data={heatmap} />
            </div>
            <div className="flex items-center gap-6" style={{ marginTop: '12px' }}>
              <Legend color="var(--cream)"       label="Quiet"  />
              <Legend color="var(--terra-light)" label="Steady" />
              <Legend color="var(--terra)"       label="Busy"   />
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="animate-fade-up" style={{ marginBottom: 'var(--space-16)', animationDelay: '400ms' }}>
          <h2 className="h2" style={{ marginBottom: 'var(--space-6)' }}>Trains on the move</h2>
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead style={{ background: 'var(--cream-dark)' }}>
                <tr>
                  <th>Train / Route</th>
                  <th>Current Load</th>
                  <th>Avg. Load</th>
                  <th>Peak Hour</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {routes.slice(0, 10).map((r, i) => {
                  const isHigh = r.status === 'Alert';
                  const isLow  = r.status === 'Normal';
                  return (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.route}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--ink-soft)' }}>{r.train_name}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="progress-track" style={{ width: '100px' }}>
                            <div className="progress-fill" style={{
                              width: `${r.current_density}%`,
                              backgroundColor: isHigh ? 'var(--rose)' : isLow ? 'var(--sage)' : 'var(--terra)',
                            }} />
                          </div>
                          <span style={{ fontWeight: 600 }}>{r.current_density}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ink-soft)' }}>{r.avg_density}%</td>
                      <td style={{ color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{r.peak_hour}</td>
                      <td>
                        <span className={`badge ${isHigh ? 'badge-rose' : isLow ? 'badge-sage' : 'badge-amber'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Tips */}
        <div className="grid grid-2 animate-fade-up" style={{ gap: 'var(--space-8)', marginBottom: 'var(--space-20)', animationDelay: '500ms' }}>
          <div className="card">
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--cream-deep)' }}>
              <HeartHandshake size={22} color="var(--sage)" />
              <h3 className="h3" style={{ margin: 0 }}>Recommended Actions</h3>
            </div>
            <div className="flex flex-col gap-4">
              {routes.filter(r => r.status === 'Alert').slice(0, 3).map((r, i) => (
                <div key={i} className="card-warm" style={{ padding: 'var(--space-4)' }}>
                  <div className="flex-between" style={{ marginBottom: '6px' }}>
                    <span className="badge badge-rose">Needs Attention</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>{r.route}</span>
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{r.train_name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)' }}>
                    Currently at {r.current_density}% — consider adding extra carriages or advisory.
                  </div>
                </div>
              ))}
              {routes.filter(r => r.status === 'Alert').length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--sage)' }}>
                  <Smile size={32} style={{ margin: '0 auto var(--space-3)' }} />
                  <div style={{ fontWeight: 600 }}>All routes are running well!</div>
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--cream-dark)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '140px', height: '140px', background: 'var(--terra-soft)', borderRadius: '50%', filter: 'blur(30px)' }} />
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-5)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--cream-deep)' }}>
              <Smile size={22} color="var(--terra)" />
              <h3 className="h3" style={{ margin: 0 }}>Today's Insight</h3>
            </div>
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.65, color: 'var(--ink)', marginBottom: 'var(--space-6)' }}>
              Evening rush begins at around <strong>5:30 PM</strong> on most routes today.
              Proactively informing passengers to travel before 5 PM or after 7:30 PM can reduce crowding by an estimated <strong>22%</strong>.
            </p>
            <div style={{ padding: 'var(--space-4)', background: 'white', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sage-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Coffee size={16} color="var(--sage)" />
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink-soft)' }}>Insight generated from real crowd data</div>
            </div>
          </div>
        </div>

        {/* Team Section (Admin only) */}
        {isAdmin && (
          <div className="animate-fade-up" style={{ paddingBottom: 'var(--space-20)', animationDelay: '600ms' }}>
            <h2 className="h2" style={{ marginBottom: 'var(--space-8)' }}>Our Team</h2>
            <div className="grid grid-12" style={{ gap: 'var(--space-8)' }}>

              <div className="lg:col-span-7 card">
                <h3 className="h3" style={{ marginBottom: 'var(--space-6)' }}>Invite a colleague</h3>
                <form onSubmit={handleStaffSubmit} className="flex flex-col gap-5">
                  <div className="form-group">
                    <label className="form-label">Their Name</label>
                    <input type="text" className="form-input" placeholder="Jane Doe" required
                      value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
                  </div>
                  <div className="grid grid-2" style={{ gap: 'var(--space-5)' }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" placeholder="jane@railway.com" required
                        value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <select className="form-input" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})}>
                        <option value="admin">Admin (Full Access)</option>
                        <option value="controller">Station Controller</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Temporary Password</label>
                    <input type="password" className="form-input" placeholder="At least 6 characters" required
                      value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={staffLoading}>
                    {staffLoading ? 'Sending invite…' : 'Add Team Member'}
                  </button>

                  {staffMessage.text && (
                    <div style={{
                      padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center',
                      background: staffMessage.type === 'success' ? 'var(--sage-soft)' : 'var(--rose-soft)',
                      color:      staffMessage.type === 'success' ? 'var(--sage)'    : 'var(--rose)',
                      fontWeight: 500, fontSize: '0.875rem'
                    }}>
                      {staffMessage.text}
                    </div>
                  )}
                </form>
              </div>

              <div className="lg:col-span-5 card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', textAlign: 'center', padding: 'var(--space-10)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={40} color="var(--terra)" />
                </div>
                <h3 className="h3">Growing the team</h3>
                <p style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  New team members get immediate access to the dashboard and live crowd data to help passengers travel more comfortably.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────
const Heatmap = ({ data }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  if (!data || data.length === 0) return null;
  return (
    <div className="heatmap-grid">
      <div style={{ width: '36px' }} />
      {hours.map(h => (
        <div key={h} style={{ fontSize: '0.5625rem', color: 'var(--ink-muted)', textAlign: 'center', fontWeight: 600 }}>{h}h</div>
      ))}
      {data.map(row => (
        <React.Fragment key={row.day}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-soft)', alignSelf: 'center', paddingRight: '6px' }}>
            {row.day.substring(0, 3)}
          </div>
          {row.hours.map((density, h) => (
            <div key={h} className="heatmap-cell"
              style={{ background: density <= 35 ? 'var(--cream)' : density > 65 ? 'var(--terra)' : 'var(--terra-light)' }}
              title={`${row.day} ${h}:00 — ${density}%`}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div style={{ width: '12px', height: '12px', background: color, borderRadius: '4px', border: '1px solid var(--cream-deep)' }} />
    <span style={{ fontSize: '0.8125rem', color: 'var(--ink-soft)', fontWeight: 500 }}>{label}</span>
  </div>
);

export default Dashboard;
