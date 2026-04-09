// src/pages/Analytics.jsx
import { BarChart2, TrendingUp, TrendingDown, PieChart, DollarSign } from 'lucide-react';
import Charts from '../components/Charts';
import { fmt } from '../utils/categories';
import { CATEGORY_COLORS } from '../utils/categories';

export default function Analytics({ transactions, getMonthlyData, getCategoryData, totalIncome, totalExpense, balance }) {
  const monthlyData  = getMonthlyData();
  const categoryData = getCategoryData();

  // Top spending categories
  const topCategories = categoryData.labels
    .map((label, i) => ({ label, amount: categoryData.data[i] }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const totalCatSpend = topCategories.reduce((s, c) => s + c.amount, 0);

  // Monthly net
  const monthlyNet = monthlyData.income.map((inc, i) => inc - monthlyData.expense[i]);
  const bestMonth  = monthlyData.labels[monthlyNet.indexOf(Math.max(...monthlyNet))];
  const worstMonth = monthlyData.labels[monthlyNet.indexOf(Math.min(...monthlyNet))];

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'64px 24px', color:'var(--text-3)' }}>
        <BarChart2 size={48} style={{ marginBottom:16, opacity:0.3 }} />
        <p style={{ fontSize:15 }}>No data yet — add some transactions to see analytics.</p>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          { label:'Savings Rate',   value:`${savingsRate}%`,    icon:TrendingUp,   color:'var(--green)', bg:'var(--green-dim)' },
          { label:'Best Month',     value: bestMonth || '—',    icon:BarChart2,    color:'var(--accent)', bg:'var(--accent-dim)' },
          { label:'Worst Month',    value: worstMonth || '—',   icon:TrendingDown, color:'var(--red)',   bg:'var(--red-dim)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card" style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
              <div style={{ fontSize:20, fontWeight:800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <Charts monthlyData={monthlyData} categoryData={categoryData} />

      {/* Top spending categories */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <PieChart size={16} color="var(--accent)" />
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--text-1)' }}>Top Spending Categories</h3>
        </div>
        {topCategories.length === 0 ? (
          <p style={{ color:'var(--text-3)', fontSize:13 }}>No expense data yet.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {topCategories.map(({ label, amount }) => {
              const pct   = totalCatSpend > 0 ? (amount / totalCatSpend) * 100 : 0;
              const color = CATEGORY_COLORS[label] || '#94a3b8';
              return (
                <div key={label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <span style={{ fontSize:13, color:'var(--text-2)', fontWeight:500 }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>
                      {fmt(amount)} <span style={{ fontSize:11, color:'var(--text-3)', fontWeight:400 }}>({pct.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div style={{ height:6, background:'var(--border)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income vs Expense summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <TrendingUp size={15} color="var(--green)" />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>Income Breakdown</span>
          </div>
          {transactions.filter(t=>t.type==='income').length === 0
            ? <p style={{ color:'var(--text-3)', fontSize:12 }}>No income recorded.</p>
            : [...new Set(transactions.filter(t=>t.type==='income').map(t=>t.category))].map(cat => {
                const total = transactions.filter(t=>t.type==='income'&&t.category===cat).reduce((s,t)=>s+t.amount,0);
                return (
                  <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border-light)' }}>
                    <span style={{ fontSize:12, color:'var(--text-2)' }}>{cat}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--green)' }}>{fmt(total)}</span>
                  </div>
                );
              })
          }
        </div>

        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <DollarSign size={15} color="var(--accent)" />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--text-2)' }}>Quick Stats</span>
          </div>
          {[
            { label:'Total Transactions', value: transactions.length },
            { label:'Avg Income/txn',     value: transactions.filter(t=>t.type==='income').length > 0 ? fmt(totalIncome / transactions.filter(t=>t.type==='income').length) : '—' },
            { label:'Avg Expense/txn',    value: transactions.filter(t=>t.type==='expense').length > 0 ? fmt(totalExpense / transactions.filter(t=>t.type==='expense').length) : '—' },
            { label:'Net Balance',        value: fmt(balance) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--border-light)' }}>
              <span style={{ fontSize:12, color:'var(--text-2)' }}>{label}</span>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--text-1)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
