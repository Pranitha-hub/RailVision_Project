import React, { useState } from 'react';
import { MapPin, ArrowRight, Smile, AlertCircle, Coffee, Train } from 'lucide-react';
import CrowdBadge from './CrowdBadge';

const TrainCard = ({ train, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const density   = train.current_crowd_level ?? 50;
  
  // Format departure safely
  const departureDate = train.departure_time ? new Date(train.departure_time) : null;
  const departureStr = departureDate 
    ? departureDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  
  // Calculate approximate arrival (assuming 4 hours for mock)
  const arrivalDate = departureDate ? new Date(departureDate.getTime() + 4 * 60 * 60 * 1000) : null;
  const arrivalStr = arrivalDate 
    ? arrivalDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const statusMap = {
    quiet: { icon: <Coffee size={15} />, text: "Quiet commute", color: "var(--sage)" },
    busy:  { icon: <AlertCircle size={15} />, text: "Very busy now", color: "var(--rose)" },
    moderate: { icon: <Smile size={15} />, text: "Moderate flow", color: "var(--amber)" },
  };

  const status = density < 40 ? statusMap.quiet : density > 75 ? statusMap.busy : statusMap.moderate;

  return (
    <div
      className="animate-fade-up"
      onClick={() => onClick(train)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        boxShadow: isHovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        border: '1px solid',
        borderColor: isHovered ? 'var(--terra-soft)' : 'var(--cream-deep)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Banner indicating urgency if highly crowded */}
      {density > 85 && (
        <div style={{ background: 'var(--rose)', color: 'white', fontSize: '0.75rem', fontWeight: 600, padding: '4px 16px', textAlign: 'center', letterSpacing: '0.02em' }}>
          High Demand Route
        </div>
      )}

      {/* Main Container */}
      <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Header: Train Name & ID */}
        <div className="flex-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Train size={24} color="var(--terra)" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)', fontWeight: 600, letterSpacing: '0.03em', marginBottom: '2px' }}>
                {train.train_id}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                {train.train_name}
              </h3>
            </div>
          </div>
          <CrowdBadge density={density} />
        </div>

        {/* Route Details with Timeline */}
        <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Departure */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
              {departureStr}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <MapPin size={14} color="var(--terra-light)" /> {train.source}
            </div>
          </div>

          {/* Connective Line */}
          <div style={{ flex: 1, padding: '0 var(--space-4)', position: 'relative' }}>
            <div style={{ height: '2px', width: '100%', background: 'linear-gradient(90deg, var(--cream-deep) 40%, var(--terra-soft) 100%)', borderRadius: '2px' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--cream)', padding: '4px', borderRadius: '50%' }}>
              <ArrowRight size={16} color="var(--terra)" />
            </div>
          </div>

          {/* Arrival */}
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--ink-muted)' }}>
              {arrivalStr}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--ink-soft)', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
              <MapPin size={14} color="var(--ink-faint)" /> {train.destination}
            </div>
          </div>
        </div>

        {/* Footer: Context & CTA */}
        <div className="flex-between items-center" style={{ paddingTop: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500, color: status.color }}>
            {status.icon} {status.text}
          </div>
          
          <div className="flex items-center gap-1" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', transition: 'color 0.2s', padding: '8px 12px', background: 'var(--cream-dark)', borderRadius: 'var(--radius-full)' }}>
            View live details
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrainCard;
