export const channelMetrics: Record<string, { revenue: number; users: number; churn: number; arpu: number }> = {
  organic: { revenue: 980000, users: 42500, churn: 1.9, arpu: 2306 },
  paid_search: { revenue: 720000, users: 38000, churn: 3.8, arpu: 1895 },
  referral: { revenue: 540000, users: 28500, churn: 2.4, arpu: 1895 },
  social: { revenue: 370000, users: 22000, churn: 3.1, arpu: 1682 },
  direct: { revenue: 240000, users: 15500, churn: 4.2, arpu: 1548 },
};

export const channelUserTrend = [
  { month: '2026-01', organic: 32000, paid_search: 32000, referral: 22000, social: 16000, direct: 12000 },
  { month: '2026-02', organic: 33500, paid_search: 33000, referral: 23000, social: 17000, direct: 12500 },
  { month: '2026-03', organic: 35000, paid_search: 34000, referral: 24000, social: 18000, direct: 13000 },
  { month: '2026-04', organic: 36500, paid_search: 35000, referral: 25000, social: 19000, direct: 13500 },
  { month: '2026-05', organic: 38000, paid_search: 36000, referral: 26000, social: 20000, direct: 14000 },
  { month: '2026-06', organic: 40000, paid_search: 37000, referral: 27000, social: 21000, direct: 14500 },
  { month: '2026-07', organic: 42500, paid_search: 38000, referral: 28500, social: 22000, direct: 15500 },
];
