import React, { useState, useEffect } from 'react';

const StatCard = ({ id, icon, label, value, suffix = '', trend = null, color = 'teal' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1500;
    const target = parseInt(value);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  const colorStyles = {
    teal: { bg: 'rgba(6,182,212,0.06)', iconBg: 'rgba(6,182,212,0.12)' },
    amber: { bg: 'rgba(245,158,11,0.06)', iconBg: 'rgba(245,158,11,0.12)' },
    red: { bg: 'rgba(239,68,68,0.06)', iconBg: 'rgba(239,68,68,0.12)' },
    purple: { bg: 'rgba(139,92,246,0.06)', iconBg: 'rgba(139,92,246,0.12)' },
  };
  const style = colorStyles[color] || colorStyles.teal;

  return (
    <div className="card stat-card" id={`stat-${id}`} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: style.bg, borderRadius: '0 0 0 80px' }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', background: style.iconBg }}>
          {icon}
        </div>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
        <span className="stat-value" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-3xl)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {displayValue.toLocaleString()}
        </span>
        {suffix && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{suffix}</span>}
        {trend && (
          <div className={`stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
