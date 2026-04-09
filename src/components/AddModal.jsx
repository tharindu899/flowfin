// src/components/AddModal.jsx
// Modal for adding a new transaction.

import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';

export default function AddModal({ onAdd, onClose }) {
  const [type,     setType]     = useState('expense');
  const [desc,     setDesc]     = useState('');
  const [amount,   setAmount]   = useState('');
  const [category, setCategory] = useState('');
  const [date,     setDate]     = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim())          return setError('Please enter a description.');
    if (!amount || +amount <= 0) return setError('Please enter a valid amount.');
    if (!category)             return setError('Please select a category.');
    setLoading(true);
    try {
      await onAdd({ description: desc.trim(), amount: +amount, type, category, date });
      onClose();
    } catch (err) {
      console.error('AddModal error:', err);
      if (err?.code === 'permission-denied' || String(err?.message).includes('permissions')) {
        setError('Firestore permission denied. Set security rules in Firebase Console → Firestore → Rules.');
      } else {
        setError(err?.message || 'Failed to save. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add Transaction</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {/* Type toggle */}
          <div>
            <label className="form-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn income ${type === 'income' ? 'active' : ''}`}
                onClick={() => { setType('income'); setCategory(''); }}
              >
                <TrendingUp size={15} /> Income
              </button>
              <button
                type="button"
                className={`type-btn expense ${type === 'expense' ? 'active' : ''}`}
                onClick={() => { setType('expense'); setCategory(''); }}
              >
                <TrendingDown size={15} /> Expense
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <input
              className="form-input"
              type="text"
              placeholder={type === 'income' ? 'e.g. Monthly salary' : 'e.g. Grocery shopping'}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          {/* Amount + Date */}
          <div className="form-row">
            <div>
              <label className="form-label">Amount (USD)</label>
              <input
                className="form-input"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category…</option>
              {cats.map((c) => (
                <option key={c.label} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error" style={{ marginBottom: 0 }}>{error}</div>
          )}

          {/* Submit */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:4 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? <div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />
                : <><Plus size={15} /> Add Transaction</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
