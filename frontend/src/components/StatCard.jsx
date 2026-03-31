import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ id, Icon, label, value, suffix = '', trend = null }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const duration = 1200;
    const targetValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

    if (isNaN(targetValue)) {
      setDisplayValue(value);
      return;
    }

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * targetValue));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="card animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'var(--space-4)',
      padding: 'var(--space-6)',
    }}>
      <div className="flex-between">
        <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', fontWeight: 600 }}>
          {label}
        </div>
        <div style={{ color: 'var(--terra)', background: 'var(--terra-soft)', padding: '6px', borderRadius: '50%' }}>
          {Icon && <Icon size={18} strokeWidth={2.5} />}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          {displayValue.toLocaleString()}
        </span>
        {suffix && (
          <span style={{ fontSize: '1rem', color: 'var(--ink-muted)', fontWeight: 500 }}>
            {suffix}
          </span>
        )}
      </div>

      <div className="flex-between items-center" style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--cream-deep)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--ink-faint)', fontWeight: 500 }}>Live summary</div>
        {trend !== null && (
          <div className="flex items-center gap-1" style={{ 
            color: trend > 0 ? 'var(--sage)' : 'var(--ink-muted)', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            background: trend > 0 ? 'var(--sage-soft)' : 'var(--cream-dark)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {trend > 0 ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
