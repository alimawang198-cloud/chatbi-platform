import { create } from 'zustand';
import type { KpiCardData, TrendSeries, TimeRange, BreakdownItem, Role } from '../types';
import { getKpiByRole } from '../mock/metrics';
import { trendData } from '../mock/trends';
import { revenueByTier, revenueByChannel, revenueByRegion } from '../mock/revenue';

function getSliceCount(range: TimeRange): number {
  switch (range) {
    case 'month': return 1;
    case 'quarter': return 3;
    case 'year': return 12;
  }
}

function adjustKpiForRange(base: KpiCardData, range: TimeRange): KpiCardData {
  const count = getSliceCount(range);
  const spark = base.sparklineData;
  if (!spark || spark.length < count) return base;

  const sliced = spark.slice(-count);
  const value = count === 1 ? sliced[0] : sliced.reduce((a, b) => a + b, 0);

  const prevSliced = spark.slice(Math.max(0, spark.length - count * 2), spark.length - count);
  const prevValue = prevSliced.length > 0
    ? (count === 1 ? prevSliced[0] : prevSliced.reduce((a, b) => a + b, 0))
    : value * 0.9;

  const change = prevValue > 0 ? ((value - prevValue) / prevValue) * 100 : 0;

  const rangeLabel = range === 'month' ? '较上月' : range === 'quarter' ? '较上季' : '较上年';

  return {
    ...base,
    value: Math.round(value * 100) / 100,
    change: Math.round(change * 10) / 10,
    changeLabel: rangeLabel,
    sparklineData: sliced,
  };
}

interface DashboardState {
  timeRange: TimeRange;
  kpiData: KpiCardData[];
  baseKpiData: KpiCardData[];
  trendData: TrendSeries[];
  revenueByTier: BreakdownItem[];
  revenueByChannel: BreakdownItem[];
  revenueByRegion: BreakdownItem[];
  isLoading: boolean;
  setTimeRange: (range: TimeRange) => void;
  fetchDashboard: (role: Role) => Promise<void>;
}

const initialBase = getKpiByRole('manager');

export const useDashboardStore = create<DashboardState>((set, get) => ({
  timeRange: 'month',
  baseKpiData: initialBase,
  kpiData: initialBase.map(k => adjustKpiForRange(k, 'month')),
  trendData,
  revenueByTier,
  revenueByChannel,
  revenueByRegion,
  isLoading: false,

  setTimeRange: (timeRange) => {
    const { baseKpiData } = get();
    set({
      timeRange,
      kpiData: baseKpiData.map(k => adjustKpiForRange(k, timeRange)),
    });
  },

  fetchDashboard: async (role: Role) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    const { timeRange } = get();
    const fresh = getKpiByRole(role);
    set({
      baseKpiData: fresh,
      kpiData: fresh.map(k => adjustKpiForRange(k, timeRange)),
      trendData,
      revenueByTier,
      revenueByChannel,
      revenueByRegion,
      isLoading: false,
    });
  },
}));
