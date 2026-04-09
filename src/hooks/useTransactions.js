// src/hooks/useTransactions.js
// Real-time Firestore hook for the current user's transactions.
// Falls back to localStorage when offline.

import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);

  // ── Real-time listener ───────────────────────────────────────
  useEffect(() => {
    if (!userId) { setTransactions([]); setLoading(false); return; }

    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTransactions(data);
      // Mirror to localStorage for offline use
      localStorage.setItem(`txns_${userId}`, JSON.stringify(data));
      setLoading(false);
    }, () => {
      // Offline fallback
      const cached = localStorage.getItem(`txns_${userId}`);
      if (cached) setTransactions(JSON.parse(cached));
      setLoading(false);
    });

    return unsub;
  }, [userId]);

  // ── Add ─────────────────────────────────────────────────────
  const addTransaction = async ({ description, amount, type, category, date }) => {
    await addDoc(collection(db, 'transactions'), {
      uid: userId,
      description,
      amount: parseFloat(amount),
      type,        // 'income' | 'expense'
      category,
      date,        // 'YYYY-MM-DD' string
      createdAt: serverTimestamp(),
    });
  };

  // ── Delete ───────────────────────────────────────────────────
  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, 'transactions', id));
  };

  // ── Aggregates ───────────────────────────────────────────────
  const totalIncome  = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // ── CSV Export ───────────────────────────────────────────────
  const exportCSV = (filtered = transactions) => {
    const header = 'Date,Description,Category,Type,Amount\n';
    const rows   = filtered.map((t) =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `flowfin-export-${format(new Date(), 'yyyy-MM-dd')}.csv`,
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

    const income  = months.map((m) =>
      transactions
        .filter((t) => t.type === 'income' && format(new Date(t.date), 'MMM yyyy') === m)
        .reduce((s, t) => s + t.amount, 0)
    );
    const expense = months.map((m) =>
      transactions
        .filter((t) => t.type === 'expense' && format(new Date(t.date), 'MMM yyyy') === m)
        .reduce((s, t) => s + t.amount, 0)
    );

    return { labels: months.map((m) => m.split(' ')[0]), income, expense };
  };

  // ── Category pie data (expenses only) ───────────────────────
  const getCategoryData = () => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });

    return {
      labels: Object.keys(map),
      data:   Object.values(map),
    };
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    exportCSV,
    totalIncome,
    totalExpense,
    balance,
    getMonthlyData,
    getCategoryData,
  };
}
