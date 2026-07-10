import { create } from 'zustand';
import type { KpiCardData, TrendSeries, TimeRange, BreakdownItem, Role } from '../types';
import { getKpiByRole } from '../mock/metrics';
import { trendData } from '../mock/trends';
import { revenueByTier, revenueByChannel, revenueByRegion } from '../mock/revenue';

interface DashboardState {
  timeRange: TimeRange;
  kpiData: KpiCardData[];
  trendData: TrendSeries[];
  revenueByTier: BreakdownItem[];
  revenueByChannel: BreakdownItem[];
  revenueByRegion: BreakdownItem[];
  isLoading: boolean;
  setTimeRange: (range: TimeRange) => void;
  fetchDashboard: (role: Role) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  timeRange: 'month',
  kpiData: getKpiByRole('manager'),
  trendData,
  revenueByTier,
  revenueByChannel,
  revenueByRegion,
  isLoading: false,

  setTimeRange: (timeRange) => {
    set({ timeRange });
  },

  fetchDashboard: async (role: Role) => {
    set({ isLoading: true });
    await new Promise(r => setTimeout(r, 400));
    set({
      kpiData: getKpiByRole(role),
      trendData,
      revenueByTier,
      revenueByChannel,
      revenueByRegion,
      isLoading: false,
    });
  },
}));
