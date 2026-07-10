export const tierMetrics: Record<string, { customers: number; revenue: number; avgRevenue: number; churnRate: number; expansionRate: number }> = {
  enterprise: { customers: 320, revenue: 1520000, avgRevenue: 4750, churnRate: 1.2, expansionRate: 18.5 },
  professional: { customers: 850, revenue: 890000, avgRevenue: 1047, churnRate: 2.4, expansionRate: 12.3 },
  mid: { customers: 2100, revenue: 340000, avgRevenue: 162, churnRate: 3.5, expansionRate: 8.2 },
  basic: { customers: 5800, revenue: 100000, avgRevenue: 17, churnRate: 5.8, expansionRate: 3.1 },
};
