import React from 'react';
import { Leaf, Users, Route, Info } from 'lucide-react';

const AlertBanner = ({ type = 'info', message }) => {
  const configs = {
    info: {
      icon: Info,
      bg: 'var(--cream-dark)',
      border: 'var(--cream-deep)',
      color: 'var(--ink-soft)'
    },
    success: {
      icon: Leaf,
      bg: 'var(--sage-soft)',
      border: 'rgba(74, 124, 89, 0.2)',
      color: 'var(--sage)'
    },
    warning: {
      icon: Route,
      bg: 'var(--amber-soft)',
      border: 'rgba(180, 83, 9, 0.2)',
      color: 'var(--amber)'
    },
    danger: {
      icon: Users,
      bg: 'var(--rose-soft)',
      border: 'rgba(190, 18, 60, 0.2)',
      color: 'var(--rose)'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 animate-fade-in" style={{
      padding: 'var(--space-4) var(--space-5)',
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: 'var(--radius-lg)',
      color: config.color,
      marginBottom: 'var(--space-4)',
    }}>
      <div style={{ flexShrink: 0, opacity: 0.9 }}>
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.5 }}>
        {message}
      </p>
    </div>
  );
};

export default AlertBanner;
