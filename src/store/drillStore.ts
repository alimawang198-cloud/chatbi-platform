import { create } from 'zustand';
import type { DrillPathStep, Dimension } from '../types';
import { dimensions } from '../mock/regions';
import { revenueByRegion, revenueByTier } from '../mock/revenue';

interface DrillState {
  isOpen: boolean;
  dimensions: Dimension[];
  activeDimension: string;
  drillPath: DrillPathStep[];
  chartData: { labels: string[]; series: { name: string; data: number[]; color?: string }[] } | null;
  isLoading: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  setDimension: (dim: string) => void;
  drillDown: (dimension: string, value: string, label: string) => void;
  rollUp: (steps?: number) => void;
  reset: () => void;
}

export const useDrillStore = create<DrillState>((set, get) => ({
  isOpen: false,
  dimensions,
  activeDimension: 'region',
  drillPath: [],
  chartData: {
    labels: revenueByRegion.map(d => d.name),
    series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000) }],
  },
  isLoading: false,

  togglePanel: () => set(s => ({ isOpen: !s.isOpen })),
  closePanel: () => set({ isOpen: false }),

  setDimension: (dim) => {
    set({ activeDimension: dim, drillPath: [] });
    if (dim === 'tier') {
      set({
        chartData: {
          labels: revenueByTier.map(d => d.name),
          series: [{ name: '收入(万)', data: revenueByTier.map(d => d.value / 10000) }],
        },
      });
    } else {
      set({
        chartData: {
          labels: revenueByRegion.map(d => d.name),
          series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000) }],
        },
      });
    }
  },

  drillDown: (dimension, value, label) => {
    set(s => ({
      drillPath: [...s.drillPath, { dimension, value, label }],
    }));
    // Simulate drill data
    set({
      chartData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        series: [{
          name: `${label}收入`,
          data: Array.from({ length: 7 }, () => Math.round(30 + Math.random() * 50)),
        }],
      },
    });
  },

  rollUp: (steps = 1) => {
    const newPath = get().drillPath.slice(0, -steps);
    set({ drillPath: newPath });
    if (newPath.length === 0) {
      set({
        chartData: {
          labels: revenueByRegion.map(d => d.name),
          series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000) }],
        },
      });
    }
  },

  reset: () => set({
    drillPath: [],
    chartData: {
      labels: revenueByRegion.map(d => d.name),
      series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000) }],
    },
  }),
}));
