import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="hero-section" id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Floating Badge */}
            <div className="animate-fade-in-down" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="badge badge-teal" style={{ fontSize: 'var(--fs-sm)', padding: 'var(--space-2) var(--space-5)' }}>
                🚆 AI-Powered Railway Intelligence
              </span>
            </div>

            <h1 className="heading-display animate-fade-in-up" style={{ fontSize: 'var(--fs-hero)', marginBottom: 'var(--space-6)' }}>
              Travel Smarter with
              <span className="text-gradient" style={{ display: 'block' }}>Real-Time Crowd Intelligence</span>
            </h1>

            <p className="animate-fade-in-up delay-2" style={{ fontSize: 'var(--fs-lg)', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto var(--space-8)', lineHeight: 1.7 }}>
              Predict crowd levels, find the best time to travel, and receive AI-powered recommendations for a seamless unreserved railway experience.
            </p>

            <div className="animate-fade-in-up delay-3 flex-center gap-4" style={{ flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary btn-lg">
                Sign In / Register →
              </Link>
              <button 
                className="btn btn-secondary btn-lg" 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </button>
            </div>

            <div className="animate-fade-in-up delay-5" style={{ marginTop: 'var(--space-12)', display: 'flex', justifyContent: 'center', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              <StatCounter target={50} label="Stations Covered" color="teal" />
              <StatCounter target={200} label="Daily Trains" color="amber" />
              <StatCounter target={95} label="Prediction Accuracy %" color="purple" />
            </div>
          </div>

          {/* Train Animation */}
          <div style={{ position: 'absolute', bottom: '-60px', left: 0, width: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ animation: 'trainMove 12s linear infinite', display: 'flex', alignItems: 'center' }}>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                <rect x="10" y="5" width="100" height="25" rx="8" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.3)" strokeWidth="1"/>
                <rect x="15" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
                <rect x="38" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
                <rect x="61" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
                <rect x="84" y="10" width="18" height="12" rx="3" fill="rgba(6,182,212,0.2)"/>
                <circle cx="25" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
                <circle cx="50" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
                <circle cx="75" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
                <circle cx="100" cy="35" r="5" fill="rgba(6,182,212,0.3)"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-subtitle">Platform Features</div>
            <h2 className="heading-section" style={{ fontSize: 'var(--fs-4xl)' }}>
              Everything You Need for<br />
              <span className="text-gradient">Smarter Railway Travel</span>
            </h2>
          </div>

          <div className="grid grid-4" id="features-grid">
            <FeatureCard icon="📡" title="Real-Time Tracking" description="Live crowd density monitoring across all major stations with passenger-reported data." color="teal" delay={1} />
            <FeatureCard icon="🤖" title="AI Predictions" description="Machine learning powered forecasts predict crowd levels up to 6 hours ahead." color="purple" delay={2} />
            <FeatureCard icon="🔔" title="Safety Alerts" description="Instant notifications when overcrowding is detected, keeping you safe." color="amber" delay={3} />
            <FeatureCard icon="💡" title="Smart Tips" description="AI recommends the best trains and times to avoid crowds." color="coral" delay={4} />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: 'rgba(17,24,39,0.4)' }}>
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-subtitle">How It Works</div>
            <h2 className="heading-section" style={{ fontSize: 'var(--fs-3xl)' }}>Simple Steps to Smarter Travel</h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-8)', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
            <Step num={1} title="Search" description="Enter your source & destination station" color="teal" />
            <Step num={2} title="Analyze" description="View real-time crowd levels and AI predictions" color="amber" />
            <Step num={3} title="Decide" description="Choose the best train with lowest crowd density" color="purple" />
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-8) 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,var(--color-accent-teal),var(--color-accent-purple))', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>🚆</div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>RailVision</span>
          </div>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
            © 2026 RailVision — AI-Powered Crowd Intelligence Platform for Indian Railways
          </p>
        </div>
      </footer>
    </>
  );
};

const StatCounter = ({ target, label, color }) => {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    let startTime;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) requestAnimationFrame(animate);
    };

    setTimeout(() => requestAnimationFrame(animate), 800);
  }, [target]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-3xl)', fontWeight: 800, color: `var(--color-accent-${color})` }}>
        {count}+
      </div>
      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{label}</div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color, delay }) => {
  const colors = {
    teal: { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', text: 'var(--color-accent-teal)' },
    purple: { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)', text: 'var(--color-accent-purple)' },
    amber: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', text: 'var(--color-accent-amber)' },
    coral: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', text: 'var(--color-accent-coral)' },
  };
  const c = colors[color];

  return (
    <div className="glass-card scroll-animate" style={{ padding: 'var(--space-6)', opacity: 0, animationDelay: `${delay * 0.1}s` }}>
      <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 'var(--space-4)' }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>{description}</p>
    </div>
  );
};

const Step = ({ num, title, description, color }) => (
  <div className="scroll-animate" style={{ textAlign: 'center', maxWidth: '240px', opacity: 0 }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `linear-gradient(135deg,var(--color-accent-${color}),rgba(255,255,255,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 'var(--fs-2xl)', fontWeight: 800, margin: '0 auto var(--space-4)', border: '2px solid rgba(255,255,255,0.1)' }}>
      {num}
    </div>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{title}</h3>
    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>{description}</p>
  </div>
);

export default Landing;
