// src/pages/Dashboard.jsx
// Main dashboard — wires together all components.

import { useState, useMemo } from 'react';
import { useAuth }           from '../context/AuthContext';
import { useTransactions }   from '../hooks/useTransactions';
import Layout                from '../components/Layout';
import StatCard               from '../components/StatCard';
import Charts                from '../components/Charts';
import TransactionList        from '../components/TransactionList';
import AddModal               from '../components/AddModal';
import { fmt }               from '../utils/categories';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    transactions, loading, addTransaction, deleteTransaction, exportCSV,
    totalIncome, totalExpense, balance,
    getMonthlyData, getCategoryData,
  } = useTransactions(user?.uid);

  // ── UI state ─────────────────────────────────────────────────
  const [showModal,  setShowModal]  = useState(false);
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');   // all | income | expense
  const [filterCat,  setFilterCat]  = useState('all');
  const [activeTab,  setActiveTab]  = useState('home');  // home | analytics | history | profile

  // ── Filtered transactions ─────────────────────────────────────
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat  = filterCat  === 'all' || t.category === filterCat;
      const matchSearch = !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      return matchType && matchCat && matchSearch;
    });
  }, [transactions, filterType, filterCat, search]);

  // ── Unique categories for filter dropdown ──────────────────────
  const categories = useMemo(() => {
    return [...new Set(transactions.map((t) => t.category))];
  }, [transactions]);

  const monthlyData  = getMonthlyData();
  const categoryData = getCategoryData();

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onAddClick={() => setShowModal(true)}
    >
      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="stats-grid">
        <StatCard
          accent
          label="Total Balance"
          value={fmt(balance)}
          icon="Wallet"
          change={`${balance >= 0 ? '↑' : '↓'} Savings rate ${totalIncome > 0 ? Math.round(((balance) / totalIncome) * 100) : 0}%`}
        />
        <StatCard
          label="Total Income"
          value={fmt(totalIncome)}
          icon="TrendingUp"
          color="var(--green)"
          bgColor="var(--green-dim)"
          change={`${transactions.filter(t => t.type === 'income').length} transactions`}
        />
        <StatCard
          label="Total Expenses"
          value={fmt(totalExpense)}
          icon="TrendingDown"
          color="var(--red)"
          bgColor="var(--red-dim)"
          change={`${transactions.filter(t => t.type === 'expense').length} transactions`}
        />
      </div>

      {/* ── Charts ─────────────────────────────────────────── */}
      {transactions.length > 0 && (
        <Charts monthlyData={monthlyData} categoryData={categoryData} />
      )}

      {/* ── Transaction list ────────────────────────────────── */}
      <TransactionList
        transactions={filtered}
        loading={loading}
        search={search}
        setSearch={setSearch}
        filterType={filterType}
        setFilterType={setFilterType}
        filterCat={filterCat}
        setFilterCat={setFilterCat}
        categories={categories}
        onDelete={deleteTransaction}
        onExport={() => exportCSV(filtered)}
        onAdd={() => setShowModal(true)}
      />

      {/* ── Add transaction modal ────────────────────────────── */}
      {showModal && (
        <AddModal
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
}
