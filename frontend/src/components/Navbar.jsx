import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Train, LogOut, ChevronDown, LayoutDashboard, Search } from 'lucide-react';

const Navbar = ({ role, onLogout }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const userData = localStorage.getItem('railVisionUser');
  const user = userData ? JSON.parse(userData) : null;
  const userName = user ? user.name : 'Traveller';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const isPassenger = role === 'passenger';
  const isAuthority = role === 'authority' || role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 3rem)',
        maxWidth: '1100px',
        zIndex: 9000,
      }}
    >
      <div style={{
        background: scrolled ? 'rgba(251,248,243,0.92)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid var(--cream-deep)',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: scrolled ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        padding: '0.625rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        transition: 'box-shadow 300ms ease, background 300ms ease',
      }}>

        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, var(--terra) 0%, #E86C3A 100%)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px var(--terra-glow)',
          }}>
            <Train size={18} color="white" strokeWidth={2.2} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}>
            Rail<span style={{ color: 'var(--terra)' }}>Vision</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {isPassenger && (
            <NavLink to="/passenger" active={location.pathname === '/passenger'} icon={<Search size={15} />}>
              Find Trains
            </NavLink>
          )}
          {isAuthority && (
            <NavLink to="/dashboard" active={location.pathname === '/dashboard'} icon={<LayoutDashboard size={15} />}>
              Dashboard
            </NavLink>
          )}
        </div>

        {/* User + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Avatar Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--cream-dark)',
            border: '1.5px solid var(--cream-deep)',
            borderRadius: 'var(--radius-full)',
            padding: '0.375rem 0.875rem 0.375rem 0.375rem',
          }}>
            <div style={{
              width: '28px', height: '28px',
              background: 'linear-gradient(135deg, var(--terra-light) 0%, var(--terra) 100%)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'white' }}>
                {initials}
              </span>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink-soft)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              width: '36px', height: '36px',
              background: 'var(--cream-dark)',
              border: '1.5px solid var(--cream-deep)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--ink-muted)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--rose-soft)'; e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--cream-dark)'; e.currentTarget.style.borderColor = 'var(--cream-deep)'; e.currentTarget.style.color = 'var(--ink-muted)'; }}
          >
            <LogOut size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, active, icon, children }) => (
  <Link
    to={to}
    style={{
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.5rem 1rem',
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '0.875rem',
      color: active ? 'var(--terra)' : 'var(--ink-soft)',
      background: active ? 'var(--terra-soft)' : 'transparent',
      border: active ? '1.5px solid rgba(194,80,42,0.2)' : '1.5px solid transparent',
      transition: 'all 200ms ease',
    }}
    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--cream-dark)'; e.currentTarget.style.color = 'var(--ink)'; }}}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ink-soft)'; }}}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
