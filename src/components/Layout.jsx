// src/components/Layout.jsx
// Sidebar (desktop) + topbar + mobile bottom nav shell.

import { useState } from 'react';
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  CalendarDays, UserCircle, Wallet,
  Plus, Sun, Moon, LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'home',      Icon: LayoutDashboard, label: 'Dashboard'   },
  { id: 'analytics', Icon: BarChart2,        label: 'Analytics'   },
  { id: 'history',   Icon: ArrowLeftRight,   label: 'Transactions' },
  { id: 'calendar',  Icon: CalendarDays,     label: 'Calendar'    },
  { id: 'profile',   Icon: UserCircle,       label: 'Profile'     },
];

export default function Layout({ children, activeTab, setActiveTab, onAddClick }) {
  const { user, logOut } = useAuth();
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark((d) => {
      document.documentElement.setAttribute('data-theme', d ? 'light' : 'dark');
      return !d;
    });
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-shell">
      {/* ── Desktop Sidebar ────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <Wallet size={20} color="#fff" />
        </div>

        {/* Nav */}
        {NAV_ITEMS.map(({ id, Icon, label }) => (
          <button
            key={id}
            className={`nav-btn ${activeTab === id ? 'active' : ''}`}
            title={label}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
          </button>
        ))}

        <div className="sidebar-spacer" />

        {/* Theme toggle */}
        <button className="nav-btn" onClick={toggleTheme} title="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Sign out */}
        <button className="nav-btn" onClick={logOut} title="Sign out">
          <LogOut size={18} />
        </button>
      </aside>

      {/* ── Main ──────────────────────────────────────────── */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <div>
              <div className="page-title">
                {greeting()}, {user?.displayName?.split(' ')[0] || 'there'} 👋
              </div>
              <div className="page-subtitle">
                {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })}
              </div>
            </div>
          </div>
          <div className="topbar-right">
            <span className="badge-live">Live</span>
            <button className="btn btn-primary btn-icon" onClick={onAddClick} title="Add transaction">
              <Plus size={18} />
            </button>
            {/* Theme (mobile-visible) */}
            <button className="btn btn-ghost btn-icon" onClick={toggleTheme} style={{ display:'none' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="avatar" title={user?.email} onClick={logOut}>
              {initials}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="scroll-area">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ──────────────────────────────── */}
      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 2).map(({ id, Icon, label }) => (
          <button
            key={id}
            className={`bottom-nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}

        {/* Centre FAB */}
        <button className="bottom-nav-btn add-btn-mobile" onClick={onAddClick}>
          <Plus size={22} />
        </button>

        {NAV_ITEMS.slice(2, 4).map(({ id, Icon, label }) => (
          <button
            key={id}
            className={`bottom-nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
