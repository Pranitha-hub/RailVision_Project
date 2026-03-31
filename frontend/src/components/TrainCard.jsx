import React from 'react';
import { Clock, MapPin, ArrowRight, Smile, AlertCircle, Coffee } from 'lucide-react';
import CrowdBadge from './CrowdBadge';

// train shape expected:
// { train_id, train_name, source, destination, departure_time, current_crowd_level, crowd_status }

const TrainCard = ({ train, onClick }) => {
  const density   = train.current_crowd_level ?? 50;
  const departure = train.departure_time
    ? new Date(train.departure_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const statusIcon =
    density < 40  ? <><Coffee size={14} /> Quiet commute</> :
    density > 75  ? <><AlertCircle size={14} /> Very busy now</> :
                    <><Smile size={14} /> Moderate</>;

  return (
    <div
      className="card animate-fade-up"
      onClick={() => onClick(train)}
      style={{ cursor: 'pointer', padding: '0', overflow: 'hidden' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 2fr' }}>

        {/* Left — Identity */}
        <div style={{ padding: 'var(--space-6)', background: 'var(--cream-dark)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {train.train_id}
          </div>
          <h3 className="h3" style={{ lineHeight: 1.2, fontSize: '1rem' }}>{train.train_name}</h3>
          <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', fontWeight: 500, marginTop: 'auto' }}>
            <MapPin size={14} color="var(--terra)" />
            {train.source} → {train.destination}
          </div>
        </div>

        {/* Divider */}
        <div style={{ background: 'var(--cream-deep)' }} />

        {/* Right — Live Details */}
        <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="flex-between flex-wrap gap-2">
            <span style={{ fontSize: '0.875rem', color: 'var(--ink-muted)', fontWeight: 500 }}>Right now</span>
            <CrowdBadge density={density} />
          </div>

          <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>{departure}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Departs</div>
            </div>
            <div style={{ flex: 1, height: '2px', background: 'var(--cream-deep)', position: 'relative', margin: '0 var(--space-3)' }}>
              <ArrowRight size={14} color="var(--terra-light)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', backgroundColor: 'white' }} strokeWidth={3} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', opacity: 0.5 }}>–</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Arrives</div>
            </div>
          </div>

          <div className="flex-between items-center" style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--cream-deep)' }}>
            <div className="flex items-center gap-2" style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 600 }}>
              {statusIcon}
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--terra)', fontWeight: 600, fontSize: '0.875rem' }}>
              View details <ArrowRight size={14} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainCard;
