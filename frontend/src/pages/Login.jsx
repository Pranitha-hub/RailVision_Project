import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../data/apiClient';
import { Train, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Smile } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login'); // login, register, forgot
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await apiClient.login(email, password);
      onLoginSuccess(data.user);
      const privileged = data.user.role === 'admin' || data.user.role === 'controller';
      navigate(privileged ? '/dashboard' : '/passenger');
    } catch (err) {
      setMessage(err.message || "We couldn't recognize those details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) return setMessage("Please use at least 6 characters for your password.");
    setLoading(true);
    setMessage('');
    try {
      const data = await apiClient.register(name, email, password, 'passenger');
      onLoginSuccess(data.user);
      navigate('/passenger');
    } catch (err) {
      setMessage(err.message || 'Something went wrong creating your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--space-6)'
    }}>

      {/* Organic Background shapes */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'var(--terra-soft)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', zIndex: 0, animation: 'rotate 30s linear infinite' }}></div>
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'rgba(237, 228, 216, 0.4)', borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', zIndex: 0, animation: 'rotate 40s linear infinite reverse' }}></div>

      <style>
        {`
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="surface animate-fade-up" style={{ width: '100%', maxWidth: '440px', zIndex: 1, padding: 'var(--space-10)' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: 'var(--space-6)' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Train size={20} />
             </div>
          </Link>
          <h1 className="h2" style={{ marginBottom: 'var(--space-2)' }}>
            {activeTab === 'login' ? 'Welcome back.' : 'Join RailVision.'}
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.9375rem' }}>
            {activeTab === 'login' ? 'Sign in to find your perfect commute.' : 'Create an account for a calmer journey.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex" style={{ background: 'var(--cream-dark)', padding: '6px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-8)' }}>
          <button 
            onClick={() => { setActiveTab('login'); setMessage(''); }}
            className="btn-ghost"
            style={{ 
              flex: 1, 
              padding: '0.625rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'login' ? 'white' : 'transparent',
              boxShadow: activeTab === 'login' ? 'var(--shadow-sm)' : 'none',
              color: activeTab === 'login' ? 'var(--ink)' : 'var(--ink-muted)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setActiveTab('register'); setMessage(''); }}
            className="btn-ghost"
            style={{ 
              flex: 1, 
              padding: '0.625rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'register' ? 'white' : 'transparent',
              boxShadow: activeTab === 'register' ? 'var(--shadow-sm)' : 'none',
              color: activeTab === 'register' ? 'var(--ink)' : 'var(--ink-muted)',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        <div>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="relative">
                  <Mail size={18} color="var(--ink-faint)" className="absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '2.75rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="flex-between">
                   <label className="form-label">Password</label>
                   <button type="button" style={{ fontSize: '0.8125rem', color: 'var(--terra)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }} onClick={() => setActiveTab('forgot')}>Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock size={18} color="var(--ink-faint)" className="absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute"
                    style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-2)', padding: '0.875rem' }}>
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <User size={18} color="var(--ink-faint)" className="absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '2.75rem' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="relative">
                  <Mail size={18} color="var(--ink-faint)" className="absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    className="form-input" 
                    style={{ paddingLeft: '2.75rem' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Create a password</label>
                <div className="relative">
                  <Lock size={18} color="var(--ink-faint)" className="absolute" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    className="form-input" 
                    style={{ paddingLeft: '2.75rem' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters" 
                    required 
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 'var(--space-2)', padding: '0.875rem' }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {message && (
             <div style={{ 
                marginTop: 'var(--space-6)', 
                padding: 'var(--space-3)', 
                borderRadius: 'var(--radius-md)',
                background: message.includes('success') ? 'var(--sage-soft)' : 'var(--rose-soft)',
                color: message.includes('success') ? 'var(--sage)' : 'var(--rose)',
                textAlign: 'center',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
             }}>
               {message.includes('success') && <Smile size={16} />}
               {message}
             </div>
          )}
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)', borderTop: '1px solid var(--cream-deep)', paddingTop: 'var(--space-6)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--ink-muted)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 500 }}>
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
