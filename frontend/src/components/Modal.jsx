import React from 'react';
import { X, Smile } from 'lucide-react';

const Modal = ({ title, children, onClose }) => {
  return (
    <>
      {/* Full-screen wrapper to handle centering without positioning hacks that break transforms */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
        }}
      >
        {/* Soft overlay background */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundColor: 'rgba(28,25,23,0.3)', 
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            animation: 'fade-in 300ms ease'
          }} 
          onClick={onClose}
        ></div>
        
        {/* Warm, rounded modal container */}
        <div 
          className="animate-fade-up"
          style={{ 
            position: 'relative',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            backgroundColor: 'var(--cream)',
            border: '1px solid var(--cream-deep)',
            borderRadius: 'var(--radius-2xl)',
            overflowY: 'auto',
            padding: 'var(--space-10)',
            boxShadow: 'var(--shadow-xl)',
            animationDuration: '400ms'
          }}
        >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="flex items-center gap-3">
             <div style={{ width: '40px', height: '40px', background: 'var(--terra-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--terra)' }}>
                <Smile size={20} strokeWidth={2} />
             </div>
             <div>
                <h1 className="h3" style={{ margin: 0 }}>{title}</h1>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-muted)' }}>Journey details</div>
             </div>
          </div>
          
          <button 
            onClick={onClose} 
            aria-label="Close details"
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              border: 'none',
              background: 'var(--cream-dark)', 
              color: 'var(--ink-soft)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream-deep)'; e.currentTarget.style.transform = 'scale(0.95)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--cream-dark)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          {children}
        </div>
      </div>
      </div>
    </>
  );
};

export default Modal;
