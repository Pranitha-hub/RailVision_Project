import React from 'react';
import { getCrowdLevel, getCrowdLabel } from '../data/mockData';

const CrowdBadge = ({ density }) => {
  const level = getCrowdLevel(density);
  const label = getCrowdLabel(level);
  const badgeClass = level === 'low' ? 'badge-green' : level === 'moderate' ? 'badge-amber' : 'badge-red';

  return (
    <span className={`badge ${badgeClass}`} id={`crowd-badge-${density}`}>
      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', animation: 'dotPulse 1.5s infinite', marginRight: '6px' }}></span>
      {label} ({density}%)
    </span>
  );
};

export default CrowdBadge;
