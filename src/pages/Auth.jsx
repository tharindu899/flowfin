// src/pages/Auth.jsx
// Login / Sign-up page. Tabs switch between modes.

import { useState } from 'react';
import { Wallet, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Google "G" SVG icon (not Lucide — no official one in the free set)
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.7 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.4-4z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8.1 2.9l5.7-5.7C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 45c5.2 0 9.9-1.9 13.5-5L31 34.1C29.1 35.3 26.6 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.8 40.6 16.4 45 24 45z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.4-2.3 4.4-4.3 5.8l6.5 5c3.8-3.5 6-8.7 6-14.8 0-1.4-.1-2.7-.4-4z"/>
  </svg>
);

export default function Auth() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [tab,     setTab]     = useState('login');   // 'login' | 'signup'
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const clearError = () => setError('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await signIn(email, pass);
      } else {
        if (!name.trim()) throw new Error('Please enter your name.');
        if (pass.length < 6) throw new Error('Password must be at least 6 characters.');
        await signUp(email, pass, name.trim());
      }
    } catch (err) {
      // Map Firebase error codes to friendly messages
      const msg = {
        'auth/invalid-credential':       'Invalid email or password.',
        'auth/email-already-in-use':     'An account with this email already exists.',
        'auth/user-not-found':           'No account found with this email.',
        'auth/wrong-password':           'Incorrect password.',
        'auth/invalid-email':            'Please enter a valid email address.',
        'auth/too-many-requests':        'Too many attempts. Please try again later.',
        'auth/network-request-failed':   'Network error. Check your connection.',
        'auth/configuration-not-found':  'Firebase Authentication is not enabled. Go to Firebase Console → Authentication → Get started and enable Email/Password sign-in.',
        'auth/unauthorized-domain':      'This domain is not authorized. Go to Firebase Console → Authentication → Settings → Authorized domains and add your Vercel URL.',
        'auth/popup-blocked':            'Popup blocked by browser. Please allow popups for this site and try again.',
        'auth/popup-closed-by-user':     'Sign-in window was closed. Please try again.',
        'auth/cancelled-popup-request':  'Sign-in was cancelled. Please try again.',
      }[err.code] || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = {
        'auth/configuration-not-found': 'Firebase Authentication is not enabled. Go to Firebase Console → Authentication → Get started and enable Google sign-in.',
        'auth/unauthorized-domain':     'This domain is not authorized. Go to Firebase Console → Authentication → Settings → Authorized domains and add your Vercel URL.',
        'auth/popup-blocked':           'Popup blocked by browser. Please allow popups for this site.',
        'auth/popup-closed-by-user': 'Redirecting to Google sign-in...',
        'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
      }[err.code] || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Wallet size={24} color="#fff" />
          </div>
          <div>
            <div className="auth-logo-text">FlowFin</div>
            <div className="auth-logo-sub">Personal Money Manager</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); clearError(); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); clearError(); }}
          >
            Sign Up
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-grid">
          {tab === 'signup' && (
            <div>
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  type="text"
                  placeholder="Tharindu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: 36 }}
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)' }} />
              <input
                className="form-input"
                style={{ paddingLeft: 36 }}
                type="password"
                placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'12px' }} disabled={loading}>
            {loading
              ? <div className="spinner" style={{ width:18, height:18, borderWidth:2 }} />
              : tab === 'login'
                ? <><LogIn size={16} /> Sign In</>
                : <><UserPlus size={16} /> Create Account</>
            }
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">or continue with</div>

        {/* Google */}
        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Google
        </button>
      </div>
    </div>
  );
}
