// src/pages/CalendarView.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval,
         startOfWeek, endOfWeek, isSameMonth, isSameDay, parseISO, isToday } from 'date-fns';
import { fmt } from '../utils/categories';

export default function CalendarView({ transactions }) {
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd,     { weekStartsOn: 1 });
  const days       = eachDayOfInterval({ start: calStart, end: calEnd });

  const prev = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Group transactions by date string
  const byDate = {};
  transactions.forEach(t => {
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push(t);
  });

  // Monthly totals for selected month
  const monthTxns   = transactions.filter(t => {
    if (!t.date) return false;
    const d = parseISO(t.date);
    return isSameMonth(d, current);
  });
  const monthIncome  = monthTxns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const monthExpense = monthTxns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  const [selected, setSelected] = useState(null);
  const selectedTxns = selected ? (byDate[selected] || []) : [];

  const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Header + month summary */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <button className="btn btn-ghost btn-icon" onClick={prev}><ChevronLeft size={18}/></button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:17, fontWeight:700, color:'var(--text-1)' }}>
              {format(current, 'MMMM yyyy')}
            </div>
            <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>
              <span style={{ color:'var(--green)', fontWeight:600 }}>{fmt(monthIncome)}</span>
              {' in · '}
              <span style={{ color:'var(--red)', fontWeight:600 }}>{fmt(monthExpense)}</span>
              {' out'}
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={next}><ChevronRight size={18}/></button>
        </div>

        {/* Weekday headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:11, fontWeight:600, color:'var(--text-3)', padding:'4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
          {days.map(day => {
            const key       = format(day, 'yyyy-MM-dd');
            const dayTxns   = byDate[key] || [];
            const income    = dayTxns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
            const expense   = dayTxns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
            const inMonth   = isSameMonth(day, current);
            const today     = isToday(day);
            const isSelected = selected === key;

            return (
              <div
                key={key}
                onClick={() => setSelected(isSelected ? null : key)}
                style={{
                  minHeight: 52,
                  borderRadius: 8,
                  padding: '5px 4px',
                  cursor: dayTxns.length > 0 ? 'pointer' : 'default',
                  background: isSelected
                    ? 'var(--accent-dim)'
                    : today
                    ? 'rgba(108,99,255,0.08)'
                    : 'transparent',
                  border: today
                    ? '1px solid var(--accent)'
                    : isSelected
                    ? '1px solid var(--accent)'
                    : '1px solid transparent',
                  opacity: inMonth ? 1 : 0.3,
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  fontSize: 12, fontWeight: today ? 700 : 500,
                  color: today ? 'var(--accent)' : 'var(--text-2)',
                  textAlign: 'center', marginBottom: 3,
                }}>
                  {format(day, 'd')}
                </div>
                {income > 0 && (
                  <div style={{ fontSize:9, color:'var(--green)', fontWeight:600, textAlign:'center', lineHeight:1.2 }}>
                    +{income >= 1000 ? (income/1000).toFixed(1)+'k' : income}
                  </div>
                )}
                {expense > 0 && (
                  <div style={{ fontSize:9, color:'var(--red)', fontWeight:600, textAlign:'center', lineHeight:1.2 }}>
                    -{expense >= 1000 ? (expense/1000).toFixed(1)+'k' : expense}
                  </div>
                )}
                {dayTxns.length > 0 && (
                  <div style={{ display:'flex', justifyContent:'center', gap:2, marginTop:3 }}>
                    {dayTxns.slice(0,3).map((_,i) => (
                      <div key={i} style={{ width:4, height:4, borderRadius:'50%', background:'var(--accent)' }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="card">
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <CalendarDays size={15} color="var(--accent)" />
            <span style={{ fontSize:14, fontWeight:600, color:'var(--text-1)' }}>
              {format(parseISO(selected), 'EEEE, MMMM d')}
            </span>
          </div>
          {selectedTxns.length === 0 ? (
            <p style={{ color:'var(--text-3)', fontSize:13 }}>No transactions on this day.</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {selectedTxns.map(t => (
                <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg)', borderRadius:8 }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--text-1)' }}>{t.description}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{t.category}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: t.type==='income' ? 'var(--green)' : 'var(--red)' }}>
                    {t.type==='income' ? '+' : '-'}{fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {transactions.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 24px', color:'var(--text-3)' }}>
          <CalendarDays size={40} style={{ marginBottom:12, opacity:0.3 }} />
          <p style={{ fontSize:14 }}>Add transactions to see them on the calendar.</p>
        </div>
      )}
    </div>
  );
}
