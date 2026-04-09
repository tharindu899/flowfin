// src/pages/Profile.jsx
import { UserCircle, Mail, LogOut, Wallet, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fmt } from '../utils/categories';
import { format } from 'date-fns';

export default function Profile({ transactions, totalIncome, totalExpense, balance }) {
  const { user, logOut } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  const joinDate = user?.metadata?.creationTime
    ? format(new Date(user.metadata.creationTime), 'MMMM yyyy')
    : '—';

  const stats = [
    { label:'Total Balance',  value: fmt(balance),       icon: Wallet,       color:'var(--accent)',  bg:'var(--accent-dim)'  },
    { label:'Total Income',   value: fmt(totalIncome),   icon: TrendingUp,   color:'var(--green)',   bg:'var(--green-dim)'   },
    { label:'Total Expenses', value: fmt(totalExpense),  icon: TrendingDown, color:'var(--red)',     bg:'var(--red-dim)'     },
    { label:'Transactions',   value: transactions.length, icon: BarChart2,   color:'var(--amber)',   bg:'var(--amber-dim)'   },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:600, margin:'0 auto' }}>

      {/* Profile card */}
      <div className="card" style={{ textAlign:'center', padding:'32px 24px' }}>
        <div style={{
          width:72, height:72, borderRadius:'50%',
          background:'var(--accent)', color:'#fff',
          fontSize:26, fontWeight:800,
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 16px',
        }}>
          {initials}
        </div>
        <div style={{ fontSize:20, fontWeight:700, color:'var(--text-1)', marginBottom:4 }}>
          {user?.displayName || 'User'}
        </div>
        <div style={{ fontSize:13, color:'var(--text-3)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Mail size={13} /> {user?.email}
        </div>
        <div style={{ fontSize:12, color:'var(--text-3)', marginTop:8 }}>
          Member since {joinDate}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {stats.map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} className="card" style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={16} color={color} />
            </div>
            <div>
              <div style={{ fontSize:10, color:'var(--text-3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
              <div style={{ fontSize:16, fontWeight:800, color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Account info */}
      <div className="card">
        <div style={{ fontSize:13, fontWeight:600, color:'var(--text-2)', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
          <UserCircle size={15} color="var(--accent)" /> Account
        </div>
        {[
          { label:'Display Name', value: user?.displayName || '—' },
          { label:'Email',        value: user?.email        || '—' },
          { label:'User ID',      value: user?.uid?.slice(0,16)+'…' || '—' },
          { label:'Provider',     value: user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email / Password' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border-light)' }}>
            <span style={{ fontSize:13, color:'var(--text-3)' }}>{label}</span>
            <span style={{ fontSize:13, color:'var(--text-1)', fontWeight:500, textAlign:'right', maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button
        className="btn"
        onClick={logOut}
        style={{ background:'var(--red-dim)', color:'var(--red)', border:'1px solid var(--red)', justifyContent:'center', padding:'13px', fontSize:14 }}
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
