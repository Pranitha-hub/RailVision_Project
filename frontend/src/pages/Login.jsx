import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../data/apiClient';
import ParticleBackground from '../components/ParticleBackground';

const Login = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('passenger');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiClient.login(loginEmail, loginPassword);
      onLoginSuccess(data.user);
      navigate(data.user.role === 'admin' ? '/dashboard' : '/passenger');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword.length < 6) return alert('Password too short');
    setLoading(true);
    try {
      const data = await apiClient.register(regName, regEmail, regPassword, regRole);
      onLoginSuccess(data.user);
      navigate(data.user.role === 'admin' ? '/dashboard' : '/passenger');
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ParticleBackground />

      <div className="login-container">
        <div className="login-brand">
          <span className="login-logo">🚆</span>
          <h1 className="login-title">Rail<span className="text-gradient">Vision</span></h1>
          <p className="login-subtitle">AI-Powered Crowd Intelligence Platform</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`login-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button 
            className={`login-tab ${activeTab === 'register' ? 'active' : ''}`} 
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
          <div className="tab-indicator" style={{ transform: activeTab === 'login' ? 'translateX(0)' : 'translateX(100%)' }}></div>
        </div>

        {activeTab === 'login' ? (
          <div className="login-form-container active">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="glass-input" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="glass-input" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="btn-text">Sign In</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
            <div className="login-demo-hint">
              <p>Demo: <code>admin@railvision.in</code> / <code>admin123</code></p>
              <p>Or: <code>passenger@railvision.in</code> / <code>pass123</code></p>
            </div>
          </div>
        ) : (
          <div className="login-form-container active">
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="glass-input" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your full name" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="glass-input" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your@email.com" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="glass-input" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters" 
                    required 
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Select Your Role</label>
                <div className="role-selector">
                  <label className={`role-card ${regRole === 'passenger' ? 'active' : ''}`} onClick={() => setRegRole('passenger')}>
                    <input type="radio" name="role" value="passenger" checked={regRole === 'passenger'} readOnly />
                    <div className="role-check">✓</div>
                    <span className="role-icon">🧑‍💼</span>
                    <span className="role-name">Passenger</span>
                  </label>
                  <label className={`role-card ${regRole === 'admin' ? 'active' : ''}`} onClick={() => setRegRole('admin')}>
                    <input type="radio" name="role" value="admin" checked={regRole === 'admin'} readOnly />
                    <div className="role-check">✓</div>
                    <span className="role-icon">🏛️</span>
                    <span className="role-name">Authority</span>
                  </label>
                </div>
              </div>
              <button type="submit" className={`login-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="btn-text">Create Account</span>
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>
        )}

        <Link to="/" className="login-back">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
