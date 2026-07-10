import type { BreakdownItem } from '../types';

export const revenueByChannel: BreakdownItem[] = [
  { name: '自然流量', value: 980000, color: '#6366f1' },
  { name: '付费搜索', value: 720000, color: '#8b5cf6' },
  { name: '推荐渠道', value: 540000, color: '#10b981' },
  { name: '社交媒体', value: 370000, color: '#f59e0b' },
  { name: '直接访问', value: 240000, color: '#3b82f6' },
];

export const revenueByTier: BreakdownItem[] = [
  { name: '企业版', value: 1520000, color: '#6366f1' },
  { name: '专业版', value: 890000, color: '#8b5cf6' },
  { name: '中端版', value: 340000, color: '#10b981' },
  { name: '基础版', value: 100000, color: '#f59e0b' },
];

export const revenueByRegion: BreakdownItem[] = [
  { name: '华东', value: 980000, color: '#6366f1' },
  { name: '华北', value: 720000, color: '#8b5cf6' },
  { name: '华南', value: 580000, color: '#10b981' },
  { name: '西南', value: 320000, color: '#f59e0b' },
  { name: '华中', value: 250000, color: '#3b82f6' },
];

export const revenueByProduct: BreakdownItem[] = [
  { name: '数据分析平台', value: 1350000, color: '#6366f1' },
  { name: '营销自动化', value: 760000, color: '#8b5cf6' },
  { name: '客户管理', value: 520000, color: '#10b981' },
  { name: 'API服务', value: 220000, color: '#f59e0b' },
];

export const revenueTrend12m = [
  { month: '2025-08', enterprise: 98, professional: 62, mid: 22, basic: 8 },
  { month: '2025-09', enterprise: 102, professional: 65, mid: 24, basic: 9 },
  { month: '2025-10', enterprise: 108, professional: 68, mid: 25, basic: 9 },
  { month: '2025-11', enterprise: 112, professional: 72, mid: 26, basic: 10 },
  { month: '2025-12', enterprise: 118, professional: 76, mid: 28, basic: 10 },
  { month: '2026-01', enterprise: 125, professional: 78, mid: 29, basic: 10 },
  { month: '2026-02', enterprise: 130, professional: 82, mid: 30, basic: 10 },
  { month: '2026-03', enterprise: 135, professional: 85, mid: 31, basic: 10 },
  { month: '2026-04', enterprise: 140, professional: 86, mid: 32, basic: 10 },
  { month: '2026-05', enterprise: 146, professional: 88, mid: 33, basic: 10 },
  { month: '2026-06', enterprise: 150, professional: 89, mid: 34, basic: 10 },
  { month: '2026-07', enterprise: 152, professional: 89, mid: 34, basic: 10 },
];
