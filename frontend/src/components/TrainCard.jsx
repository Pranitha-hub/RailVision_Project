import React from 'react';
import { getCrowdDensity, getCrowdLevel } from '../data/mockData';
import CrowdBadge from './CrowdBadge';

const TrainCard = ({ train, onClick }) => {
  const now = new Date();
  const density = getCrowdDensity(train.id, now.getHours(), now.getDay());
  const level = getCrowdLevel(density);

  return (
    <div 
      className="card train-card animate-fade-in-up" 
      onClick={() => onClick(train)}
      style={{ cursor: 'pointer', padding: 'var(--space-5)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: level === 'low' ? 'var(--crowd-low)' : level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)', borderRadius: '4px 0 0 4px' }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-base)', marginBottom: 'var(--space-1)' }}>
            {train.trainName}
          </div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
            #{train.trainNumber} • {train.daysOfWeek.join(', ')}
          </div>
        </div>
        <CrowdBadge density={density} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>{train.departure}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>{train.from.code}</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ flex: 1, height: '2px', background: 'var(--color-border)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0, top: '-3px', width: '8px', height: '8px', background: 'var(--color-accent-teal)', borderRadius: '50%' }}></div>
          </div>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>{train.duration}</span>
          <div style={{ flex: 1, height: '2px', background: 'var(--color-border)' }}></div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-lg)' }}>{train.arrival}</div>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>{train.to.code}</div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Crowd Level</span>
          <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, color: level === 'low' ? 'var(--crowd-low)' : level === 'moderate' ? 'var(--crowd-moderate)' : 'var(--crowd-high)' }}>{density}%</span>
        </div>
        <div className="crowd-bar">
          <div className={`crowd-bar-fill ${level}`} style={{ width: `${density}%` }}></div>
        </div>
      </div>

      <button className="btn btn-sm btn-secondary view-details-btn" style={{ width: '100%' }}>
        View Details & AI Prediction →
      </button>
    </div>
  );
};

export default TrainCard;
