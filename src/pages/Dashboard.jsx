// src/pages/Dashboard.jsx
// Main dashboard — full tab routing for Home, Analytics, Transactions, Calendar, Profile.

import { useState, useMemo } from 'react';
import { useAuth }          from '../context/AuthContext';
import { useTransactions }  from '../hooks/useTransactions';
import Layout               from '../components/Layout';
import StatCard              from '../components/StatCard';
import Charts               from '../components/Charts';
import TransactionList       from '../components/TransactionList';
import AddModal              from '../components/AddModal';
import Analytics             from './Analytics';
import CalendarView          from './CalendarView';
import Profile               from './Profile';
import { fmt }              from '../utils/categories';

export default function Dashboard() {
  const { user } = useAuth();
  const {
    transactions, loading, addTransaction, deleteTransaction, exportCSV,
    totalIncome, totalExpense, balance,
    getMonthlyData, getCategoryData,
  } = useTransactions(user?.uid);

  const [showModal,  setShowModal]  = useState(false);
  const [search,     setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat,  setFilterCat]  = useState('all');
  const [activeTab,  setActiveTab]  = useState('home');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType   = filterType === 'all' || t.type === filterType;
      const matchCat    = filterCat  === 'all' || t.category === filterCat;
      const matchSearch = !search ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());
      return matchType && matchCat && matchSearch;
    });
  }, [transactions, filterType, filterCat, search]);

  const categories = useMemo(() =>
    [...new Set(transactions.map(t => t.category))],
    [transactions]
  );

  const TAB_TITLES = {
    home:      'Dashboard',
    analytics: 'Analytics',
    history:   'Transactions',
    calendar:  'Calendar',
    profile:   'Profile',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <Analytics
            transactions={transactions}
            getMonthlyData={getMonthlyData}
            getCategoryData={getCategoryData}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        );

      case 'history':
        return (
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
        );

      case 'calendar':
        return <CalendarView transactions={transactions} />;

      case 'profile':
        return (
          <Profile
            transactions={transactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
          />
        );

      default:
        return (
          <>
            <div className="stats-grid">
              <StatCard
                accent
                label="Total Balance"
                value={fmt(balance)}
                icon="Wallet"
                change={`${balance >= 0 ? '↑' : '↓'} Savings rate ${totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%`}
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

            {transactions.length > 0 && (
              <Charts
                monthlyData={getMonthlyData()}
                categoryData={getCategoryData()}
              />
            )}

            <TransactionList
              transactions={transactions.slice(0, 8)}
              loading={loading}
              search=""
              setSearch={() => {}}
              filterType="all"
              setFilterType={() => {}}
              filterCat="all"
              setFilterCat={() => {}}
              categories={[]}
              onDelete={deleteTransaction}
              onExport={() => exportCSV(transactions)}
              onAdd={() => setShowModal(true)}
              compact
            />
          </>
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onAddClick={() => setShowModal(true)}
      pageTitle={TAB_TITLES[activeTab]}
    >
      {renderContent()}

      {showModal && (
        <AddModal
          onAdd={addTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  );
}
