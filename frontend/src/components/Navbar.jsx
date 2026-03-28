import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
  const location = useLocation();
  const userData = localStorage.getItem('railVisionUser');
  const user = userData ? JSON.parse(userData) : null;
  const userName = user ? user.name.split(' ')[0] : '';

  const isPassenger = role === 'passenger';
  const isAuthority = role === 'authority';

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">🚆</div>
          <span className="text-gradient">RailVision</span>
        </Link>
        <div className="navbar-links">
          {isPassenger && (
            <>
              <Link to="/passenger" className={location.pathname === '/passenger' ? 'active' : ''}>Search Trains</Link>
              <button onClick={() => window.reportCrowdModal && window.reportCrowdModal()} className="btn btn-sm btn-secondary">Report Crowd</button>
            </>
          )}
          {isAuthority && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
              <a href="#analytics" className="">Analytics</a>
            </>
          )}
          
          <div className="navbar-role-badge">
            <span>●</span>
            {userName ? `${userName} · ` : ''}{isPassenger ? 'Passenger' : 'Authority'}
          </div>
          <button onClick={onLogout} className="btn btn-ghost btn-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
