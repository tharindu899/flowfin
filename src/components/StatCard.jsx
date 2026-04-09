// src/components/StatCard.jsx

import {
  Wallet, TrendingUp, TrendingDown, DollarSign,
  BarChart2, PiggyBank, CreditCard,
} from 'lucide-react';

const ICONS = { Wallet, TrendingUp, TrendingDown, DollarSign, BarChart2, PiggyBank, CreditCard };

export default function StatCard({ accent, label, value, icon, color, bgColor, change }) {
  const Icon = ICONS[icon] || Wallet;

  return (
    <div className={`stat-card ${accent ? 'accent' : ''}`}>
      <div
        className="stat-icon-wrap"
        style={{ background: accent ? 'rgba(255,255,255,0.15)' : bgColor }}
      >
        <Icon size={18} color={accent ? '#fff' : color} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {change && <div className="stat-change">{change}</div>}
    </div>
  );
}
