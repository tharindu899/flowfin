// src/components/Charts.jsx
// Bar chart (monthly income vs expense) + Pie chart (expense categories).

import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { BarChart2, PieChart } from 'lucide-react';

// Register Chart.js modules once
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const PIE_COLORS = [
  '#6c63ff', '#22c55e', '#ef4444', '#f59e0b',
  '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6', '#94a3b8',
];

export default function Charts({ monthlyData, categoryData }) {
  // ── Shared chart defaults ────────────────────────────────────
  const font = { family: "'Inter', sans-serif", size: 12 };
  const gridColor = 'rgba(255,255,255,0.05)';
  const textColor = '#94a3b8';

  // ── Bar chart config ─────────────────────────────────────────
  const barData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label:           'Income',
        data:            monthlyData.income,
        backgroundColor: 'rgba(108, 99, 255, 0.75)',
        borderRadius:    6,
        borderSkipped:   false,
      },
      {
        label:           'Expense',
        data:            monthlyData.expense,
        backgroundColor: 'rgba(239, 68, 68, 0.65)',
        borderRadius:    6,
        borderSkipped:   false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor, font, boxWidth: 12, boxHeight: 12 },
      },
      tooltip: {
        backgroundColor: '#1a1e2a',
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        borderColor:     '#252a38',
        borderWidth:     1,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid:  { color: gridColor },
        ticks: { color: textColor, font },
      },
      y: {
        grid:  { color: gridColor },
        ticks: {
          color: textColor, font,
          callback: (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v),
        },
      },
    },
  };

  // ── Pie chart config ─────────────────────────────────────────
  const hasCategories = categoryData.labels.length > 0;

  const pieData = {
    labels: categoryData.labels,
    datasets: [{
      data:            categoryData.data,
      backgroundColor: PIE_COLORS.slice(0, categoryData.labels.length),
      borderColor:     '#1a1e2a',
      borderWidth:     3,
      hoverOffset:     8,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position:  'bottom',
        labels:    { color: textColor, font, padding: 12, boxWidth: 12, boxHeight: 12 },
      },
      tooltip: {
        backgroundColor: '#1a1e2a',
        titleColor:      '#f1f5f9',
        bodyColor:       '#94a3b8',
        borderColor:     '#252a38',
        borderWidth:     1,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
            return ` $${ctx.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="charts-grid">
      {/* Bar chart */}
      <div className="card">
        <div className="chart-header">
          <div className="chart-title">
            <BarChart2 size={16} color="var(--accent)" />
            Monthly Overview
          </div>
        </div>
        <div style={{ height: 220 }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Pie chart */}
      <div className="card">
        <div className="chart-header">
          <div className="chart-title">
            <PieChart size={16} color="var(--accent)" />
            Expense Breakdown
          </div>
        </div>
        {hasCategories ? (
          <div style={{ height: 220 }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-3)', fontSize:13 }}>
            Add expenses to see breakdown
          </div>
        )}
      </div>
    </div>
  );
}
