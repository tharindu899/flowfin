// src/components/TransactionList.jsx
// Filterable, searchable transaction history with delete + CSV export.

import {
  Search, Filter, Download, Trash2, TrendingUp, TrendingDown,
  Briefcase, Laptop, Gift, RotateCcw, Utensils, Car, ShoppingBag,
  FileText, Tv, Heart, BookOpen, Home, MoreHorizontal, PlusCircle, Plus,
} from 'lucide-react';
import { CATEGORY_COLORS, fmt } from '../utils/categories';
import { format, parseISO } from 'date-fns';

// Map category label → Lucide icon component
const CAT_ICONS = {
  Salary: Briefcase, Freelance: Laptop, Investment: TrendingUp,
  Gift, Refund: RotateCcw, Food: Utensils, Transport: Car,
  Shopping: ShoppingBag, Bills: FileText, Entertainment: Tv,
  Health: Heart, Education: BookOpen, Housing: Home,
  Other: MoreHorizontal, default: PlusCircle,
};

function TxRow({ tx, onDelete }) {
  const Icon  = CAT_ICONS[tx.category] || CAT_ICONS.default;
  const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
  const isInc = tx.type === 'income';

  return (
    <div className="tx-row">
      {/* Category icon */}
      <div
        className="tx-type-icon"
        style={{ background: color + '20' }}  // 20 = ~12% opacity
      >
        <Icon size={17} color={color} />
      </div>

      {/* Info */}
      <div className="tx-info">
        <div className="tx-desc">{tx.description}</div>
        <div className="tx-meta">
          <span className="cat-pill" style={{ background: color + '18', color }}>
            {tx.category}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div
        className="tx-amount"
        style={{ color: isInc ? 'var(--green)' : 'var(--red)' }}
      >
        {isInc ? '+' : '-'}{fmt(tx.amount)}
      </div>

      {/* Date */}
      <div className="tx-date-col">
        {tx.date ? format(parseISO(tx.date), 'MMM d') : '—'}
      </div>

      {/* Delete */}
      <button
        className="delete-btn"
        onClick={() => onDelete(tx.id)}
        title="Delete transaction"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function TransactionList({
  transactions, loading,
  search, setSearch,
  filterType, setFilterType,
  filterCat, setFilterCat,
  categories,
  onDelete, onExport, onAdd,
}) {
  return (
    <div className="card">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-1)', display:'flex', alignItems:'center', gap:8 }}>
          <TrendingUp size={17} color="var(--accent)" />
          Transactions
          {transactions.length > 0 && (
            <span style={{ fontSize:12, color:'var(--text-3)', fontWeight:400 }}>
              ({transactions.length})
            </span>
          )}
        </h3>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost" style={{ fontSize:12, padding:'7px 12px' }} onClick={onExport} title="Export to CSV">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary btn-icon" onClick={onAdd} title="Add transaction">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="tx-controls" style={{ marginBottom:16 }}>
        {/* Search */}
        <div className="search-wrap">
          <Search size={14} />
          <input
            className="search-input"
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            className="filter-select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding:'32px 0', textAlign:'center' }}>
          <div className="spinner" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <TrendingUp size={40} />
          <p style={{ marginBottom:12 }}>No transactions yet.</p>
          <button className="btn btn-primary" onClick={onAdd}>
            <Plus size={15} /> Add your first transaction
          </button>
        </div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <TxRow key={tx.id} tx={tx} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
