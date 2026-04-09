// src/hooks/useTransactions.js
// Real-time Firestore hook. Sorts client-side to avoid composite index requirement.

import { useState, useEffect } from 'react';
import {
  collection, addDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!userId || !db) { setTransactions([]); setLoading(false); return; }

    // Simple query — only filter by uid, NO orderBy (avoids composite index requirement)
    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', userId)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          // Sort newest first client-side
          .sort((a, b) => {
            const ta = a.createdAt?.seconds ?? 0;
            const tb = b.createdAt?.seconds ?? 0;
            return tb - ta;
          });

        setTransactions(data);
        setError(null);
        // Cache for offline
        try { localStorage.setItem(`txns_${userId}`, JSON.stringify(data)); } catch {}
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setError(err.message);
        // Offline fallback from cache
        try {
          const cached = localStorage.getItem(`txns_${userId}`);
          if (cached) setTransactions(JSON.parse(cached));
        } catch {}
        setLoading(false);
      }
    );

    return unsub;
  }, [userId]);

  // ── Add ──────────────────────────────────────────────────────
  const addTransaction = async ({ description, amount, type, category, date }) => {
    if (!db) throw new Error('Firebase not initialized');
    const doc_ = await addDoc(collection(db, 'transactions'), {
      uid:         userId,
      description: description.trim(),
      amount:      parseFloat(amount),
      type,
      category,
      date,
      createdAt:   serverTimestamp(),
    });
    return doc_.id;
  };

  // ── Delete ───────────────────────────────────────────────────
  const deleteTransaction = async (id) => {
    if (!db) throw new Error('Firebase not initialized');
    await deleteDoc(doc(db, 'transactions', id));
  };

  // ── Aggregates ───────────────────────────────────────────────
  const totalIncome  = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance      = totalIncome - totalExpense;

  // ── CSV Export ───────────────────────────────────────────────
  const exportCSV = (list = transactions) => {
    const header = 'Date,Description,Category,Type,Amount (LKR)\n';
    const rows   = list.map(t =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.type === 'income' ? '' : '-'}${t.amount.toFixed(2)}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href:     url,
      download: `flowfin-${format(new Date(), 'yyyy-MM-dd')}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Monthly chart data (last 6 months) ──────────────────────
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(format(d, 'MMM yyyy'));
    }
    const income  = months.map(m => transactions.filter(t => t.type === 'income'  && t.date && format(new Date(t.date + 'T00:00:00'), 'MMM yyyy') === m).reduce((s,t) => s+t.amount, 0));
    const expense = months.map(m => transactions.filter(t => t.type === 'expense' && t.date && format(new Date(t.date + 'T00:00:00'), 'MMM yyyy') === m).reduce((s,t) => s+t.amount, 0));
    return { labels: months.map(m => m.split(' ')[0]), income, expense };
  };

  // ── Category pie data ────────────────────────────────────────
  const getCategoryData = () => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return { labels: Object.keys(map), data: Object.values(map) };
  };

  return {
    transactions, loading, error,
    addTransaction, deleteTransaction, exportCSV,
    totalIncome, totalExpense, balance,
    getMonthlyData, getCategoryData,
  };
}
