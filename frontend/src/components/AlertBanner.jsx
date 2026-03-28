import React from 'react';

const AlertBanner = ({ alert }) => {
  const severityClass = alert.severity === 'danger' ? 'alert-banner-danger' 
    : alert.severity === 'warning' ? 'alert-banner-warning' 
    : 'alert-banner-info';

  const icon = alert.severity === 'danger' ? '⚠️' 
    : alert.severity === 'warning' ? '⏰' 
    : 'ℹ️';

  return (
    <div className={`alert-banner ${severityClass}`} id={`alert-${alert.id}`}>
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{alert.message}</span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'inherit', opacity: 0.7, whiteSpace: 'nowrap' }}>{alert.timeAgo}</span>
    </div>
  );
};

export default AlertBanner;
