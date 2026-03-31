import React from 'react';
import { Link } from 'react-router-dom';
import { Train, HeartHandshake, Leaf, Route, ArrowRight, Activity, Smile, MapPin, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page" style={{ 
      minHeight: '100vh', 
      paddingTop: 'var(--space-20)',
    }}>
      
      {/* Hero Section - Warm, Welcoming */}
      <section style={{ marginBottom: 'var(--space-24)' }}>
        <div className="container">
          <div className="flex-col items-center justify-center animate-fade-up" style={{ 
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            paddingTop: 'var(--space-10)'
          }}>
            <div className="badge badge-terra" style={{ marginBottom: 'var(--space-6)' }}>
              <Smile size={14} />
              <span>A better way to travel</span>
            </div>
            
            <h1 className="h1" style={{ marginBottom: 'var(--space-6)' }}>
              Find your <span style={{ color: 'var(--terra)', position: 'relative' }}>
                perfect space
                <svg viewBox="0 0 200 20" style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '14px', fill: 'var(--terra-light)', opacity: 0.5, zIndex: -1 }}>
                  <path d="M0,10 Q50,0 100,10 T200,10 L200,20 L0,20 Z" />
                </svg>
              </span> on the train.
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--ink-soft)', 
              marginBottom: 'var(--space-10)', 
              lineHeight: 1.6 
            }}>
              RailVision helps you avoid the crowds. See real-time capacity, get smart route suggestions, and enjoy a calmer, more comfortable commute.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
                Start your journey
                <ArrowRight size={20} />
              </Link>
              <button 
                className="btn btn-secondary" 
                onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}
                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section style={{ marginBottom: 'var(--space-24)', padding: '0 var(--space-4)' }}>
        <div className="container">
          <div className="animate-fade-up" style={{ animationDelay: '200ms', position: 'relative' }}>
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-4)',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--cream-deep)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'var(--cream-dark)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--cream-deep)',
                position: 'relative'
              }}>
                {/* Fallback pattern if image is missing */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle at center, var(--terra) 1px, transparent 1px)' }}></div>
                <img 
                  src="/crystal_rail_hero_1774860644970.png" 
                  alt="A calm, spacious train interior" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, filter: 'sepia(20%) hue-rotate(-10deg) saturate(140%) contrast(90%)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                
                {/* Overlay floating card */}
                <div className="card-warm" style={{ position: 'absolute', bottom: '10%', left: '10%', padding: 'var(--space-4)', gap: 'var(--space-2)', display: 'flex', flexDirection: 'column', width: '220px', animation: 'breathe 6s infinite ease-in-out' }}>
                  <div className="flex-between">
                    <span className="label">Next Train</span>
                    <span className="badge badge-sage">Calm</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                    <h3 className="h2" style={{ margin: 0 }}>42%</h3>
                    <span style={{ color: 'var(--ink-soft)', paddingBottom: '4px' }}>full</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{ marginBottom: 'var(--space-24)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
             <h2 className="h2" style={{ marginBottom: 'var(--space-4)' }}>Designed for peace of mind.</h2>
             <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
               We believe travel should be easy, predictable, and stress-free. Here's how we help.
             </p>
          </div>

          <div className="grid grid-3">
            <div className="card animate-fade-up" style={{ animationDelay: '300ms' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--terra-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  <Users size={24} color="var(--terra)" />
               </div>
               <h3 className="h3" style={{ marginBottom: 'var(--space-3)' }}>Live Crowd Insight</h3>
               <p style={{ color: 'var(--ink-soft)' }}>Know exactly how busy the train is before you step on the platform. We show you the quietest carriages in real-time.</p>
            </div>
            
            <div className="card animate-fade-up" style={{ animationDelay: '400ms' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--sage-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  <Leaf size={24} color="var(--sage)" />
               </div>
               <h3 className="h3" style={{ marginBottom: 'var(--space-3)' }}>Breathe Easy</h3>
               <p style={{ color: 'var(--ink-soft)' }}>By spreading passengers out, everyone gets more personal space and a much more relaxing journey home.</p>
            </div>
            
            <div className="card animate-fade-up" style={{ animationDelay: '500ms' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--amber-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                  <Route size={24} color="var(--amber)" />
               </div>
               <h3 className="h3" style={{ marginBottom: 'var(--space-3)' }}>Smart Alternatives</h3>
               <p style={{ color: 'var(--ink-soft)' }}>If your usual route is packed, we’ll suggest a slightly earlier or later option that guarantees you a seat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-12) 0', background: 'var(--cream-dark)', borderTop: '1px solid var(--cream-deep)' }}>
        <div className="container">
          <div className="flex-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
               <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Train size={16} color="white" />
               </div>
               <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)' }}>
                 RailVision
               </span>
            </div>
            <div style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>
              &copy; {new Date().getFullYear()} RailVision. Making travel human again.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
