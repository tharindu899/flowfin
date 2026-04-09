// src/utils/categories.js

export const INCOME_CATEGORIES = [
  { label: 'Salary',      icon: 'Briefcase'  },
  { label: 'Freelance',   icon: 'Laptop'     },
  { label: 'Investment',  icon: 'TrendingUp' },
  { label: 'Gift',        icon: 'Gift'       },
  { label: 'Refund',      icon: 'RotateCcw'  },
  { label: 'Other',       icon: 'PlusCircle' },
];

export const EXPENSE_CATEGORIES = [
  { label: 'Food',          icon: 'Utensils'       },
  { label: 'Transport',     icon: 'Car'            },
  { label: 'Shopping',      icon: 'ShoppingBag'    },
  { label: 'Bills',         icon: 'FileText'       },
  { label: 'Entertainment', icon: 'Tv'             },
  { label: 'Health',        icon: 'Heart'          },
  { label: 'Education',     icon: 'BookOpen'       },
  { label: 'Housing',       icon: 'Home'           },
  { label: 'Other',         icon: 'MoreHorizontal' },
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const CATEGORY_COLORS = {
  Salary:         '#6c63ff',
  Freelance:      '#6c63ff',
  Investment:     '#22c55e',
  Gift:           '#ec4899',
  Refund:         '#22c55e',
  Food:           '#f59e0b',
  Transport:      '#3b82f6',
  Shopping:       '#ec4899',
  Bills:          '#ef4444',
  Entertainment:  '#8b5cf6',
  Health:         '#ef4444',
  Education:      '#3b82f6',
  Housing:        '#f59e0b',
  Other:          '#94a3b8',
};

// ── Compact number formatter (1000 → 1k, 10000 → 10k, 1M → 1M) ──
export const fmt = (n) => {
  const num = Math.abs(Number(n));
  const sign = Number(n) < 0 ? '-' : '';
  if (num >= 1_000_000) {
    const v = (num / 1_000_000);
    return sign + 'Rs. ' + (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + 'M';
  }
  if (num >= 1_000) {
    const v = (num / 1_000);
    return sign + 'Rs. ' + (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + 'k';
  }
  return sign + 'Rs. ' + num.toFixed(2);
};

// Full precision for modals/detail views
export const fmtFull = (n) =>
  'Rs. ' + Number(n).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Short format for chart axis labels
export const fmtShort = (n) => {
  if (n >= 1_000_000) return 'Rs.' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return 'Rs.' + (n / 1_000).toFixed(1) + 'k';
  return 'Rs.' + Number(n).toFixed(0);
};
