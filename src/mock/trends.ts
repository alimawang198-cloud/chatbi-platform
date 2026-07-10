import type { TrendSeries } from '../types';

const months = ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];

export const trendData: TrendSeries[] = [
  {
    name: 'MRR',
    color: '#6366f1',
    data: months.map((date, i) => ({
      date,
      value: 210 + i * 7.5 + Math.random() * 5,
    })),
  },
  {
    name: '月活跃用户',
    color: '#10b981',
    data: months.map((date, i) => ({
      date,
      value: 90000 + i * 3800 + Math.random() * 1000,
    })),
  },
  {
    name: '月流失率(%)',
    color: '#ef4444',
    data: months.map((date, i) => ({
      date,
      value: Number((4.5 - i * 0.12 + Math.random() * 0.1).toFixed(1)),
    })),
  },
  {
    name: '新客户数',
    color: '#3b82f6',
    data: months.map((date, i) => ({
      date,
      value: 280 + i * 15 + Math.random() * 30,
    })),
  },
  {
    name: 'ARPU',
    color: '#f59e0b',
    data: months.map((date, i) => ({
      date,
      value: 2100 + i * 80 + Math.random() * 50,
    })),
  },
];
