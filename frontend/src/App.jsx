import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Passenger from './pages/Passenger';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import { apiClient } from './data/apiClient';

const App = () => {
  const [role, setRole] = useState(sessionStorage.getItem('railVisionRole') || null);
  const [user, setUser] = useState(apiClient.getUser());

  useEffect(() => {
    // Sync role if user is found in localStorage but not in session
    if (!role && user) {
      const uiRole = user.role === 'admin' ? 'authority' : 'passenger';
      sessionStorage.setItem('railVisionRole', uiRole);
      setRole(uiRole);
    }
  }, [user, role]);

  const handleLogout = () => {
    apiClient.logout();
    sessionStorage.removeItem('railVisionRole');
    setRole(null);
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const uiRole = userData.role === 'admin' ? 'authority' : 'passenger';
    sessionStorage.setItem('railVisionRole', uiRole);
    setRole(uiRole);
  };

  return (
    <Router>
      <div className="app-container">
        <NavbarWrapper role={role} onLogout={handleLogout} />
        <main id="page-content">
          <Routes>
            <Route path="/" element={<Landing setRole={setRole} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            
            <Route 
              path="/passenger" 
              element={role === 'passenger' ? <Passenger /> : <Navigate to="/login" />} 
            />
            
            <Route 
              path="/dashboard" 
              element={role === 'authority' ? <Dashboard /> : <Navigate to="/login" />} 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Helper component to hide navbar on landing/login pages
const NavbarWrapper = ({ role, onLogout }) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/login';
  
  if (hideNavbar || !role) return null;
  
  return <Navbar role={role} onLogout={onLogout} />;
};

export default App;
