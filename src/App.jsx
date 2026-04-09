// src/App.jsx
// Root component — renders Auth or Dashboard based on auth state.

import { useAuth }          from './context/AuthContext';
import Auth                 from './pages/Auth';
import Dashboard            from './pages/Dashboard';
import { firebaseConfigError } from './firebase/config';

// Config error screen — shown when Vercel env vars are missing
function ConfigError({ message }) {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: 24,
    }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--red)',
        borderRadius: 16, padding: '32px 28px', maxWidth: 520, width: '100%',
      }}>
        <div style={{ color: 'var(--red)', fontWeight: 700, fontSize: 17, marginBottom: 12 }}>
          Firebase Not Configured
        </div>
        <pre style={{
          background: 'var(--bg)', borderRadius: 8, padding: 16,
          fontSize: 12, color: 'var(--text-2)', whiteSpace: 'pre-wrap',
          lineHeight: 1.7, fontFamily: 'monospace',
        }}>{message}</pre>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 16, lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--text-1)' }}>Fix:</strong> Go to{' '}
          <strong style={{ color: 'var(--accent)' }}>Vercel → Your Project → Settings → Environment Variables</strong>
          {' '}and add all 6 <code style={{ color:'var(--amber)' }}>VITE_FIREBASE_*</code> keys, then redeploy.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Show config error before trying to use Firebase
  if (firebaseConfigError) {
    return <ConfigError message={firebaseConfigError} />;
  }

  return <AuthGate />;
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
        <div style={{ textAlign:'center' }}>
          <div className="spinner" style={{ marginBottom:16 }} />
          <p style={{ color:'var(--text-3)', fontSize:13 }}>Loading FlowFin…</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}
