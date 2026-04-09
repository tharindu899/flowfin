// src/App.jsx
// Root component — renders Auth or Dashboard based on auth state.

import { useAuth } from './context/AuthContext';
import Auth        from './pages/Auth';
import Dashboard   from './pages/Dashboard';

export default function App() {
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
