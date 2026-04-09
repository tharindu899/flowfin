// src/components/StatCard.jsx

import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  BarChart2, PiggyBank, CreditCard,
} from 'lucide-react';

const ICONS = { Wallet, TrendingUp, TrendingDown, DollarSign, BarChart2, PiggyBank, CreditCard };

export default function StatCard({ accent, label, value, icon, color, bgColor, change, horizontal }) {
  const Icon = ICONS[icon] || Wallet;

  if (horizontal) {
    return (
      <div className={`stat-card stat-card-h ${accent ? 'accent' : ''}`}>
        <div
          className="stat-icon-wrap"
          style={{ background: accent ? 'rgba(255,255,255,0.18)' : bgColor, flexShrink: 0 }}
        >
          <Icon size={20} color={accent ? '#fff' : color} />
        </div>
        <div className="stat-card-h-body">
          <div className="stat-label">{label}</div>
          <div className="stat-value" style={{ fontSize: 22 }}>{value}</div>
          {change && <div className="stat-change">{change}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div
        className="stat-icon-wrap"
        style={{ background: accent ? 'rgba(255,255,255,0.18)' : bgColor }}
      >
        <Icon size={18} color={accent ? '#fff' : color} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && <div className="stat-change">{change}</div>}
    </div>
  );
}
