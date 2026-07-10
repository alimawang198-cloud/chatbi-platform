export const funnelStages = [
  { stage: '官网访问', value: 125000, color: '#6366f1' },
  { stage: '注册试用', value: 48000, color: '#8b5cf6' },
  { stage: '激活使用', value: 22000, color: '#10b981' },
  { stage: '关键功能体验', value: 12000, color: '#f59e0b' },
  { stage: '付费转化', value: 3800, color: '#ef4444' },
];

export const funnelConversion = [
  { from: '访问→注册', rate: 38.4 },
  { from: '注册→激活', rate: 45.8 },
  { from: '激活→关键功能', rate: 54.5 },
  { from: '关键功能→付费', rate: 31.7 },
];

export const monthlyFunnel = [
  { month: '2026-01', visit: 85000, signup: 32000, active: 14500, keyFeature: 7800, pay: 2400 },
  { month: '2026-02', visit: 92000, signup: 35000, active: 15800, keyFeature: 8500, pay: 2600 },
  { month: '2026-03', visit: 98000, signup: 38000, active: 17200, keyFeature: 9200, pay: 2800 },
  { month: '2026-04', visit: 105000, signup: 41000, active: 18600, keyFeature: 10000, pay: 3100 },
  { month: '2026-05', visit: 112000, signup: 44000, active: 20000, keyFeature: 10800, pay: 3400 },
  { month: '2026-06', visit: 118000, signup: 46000, active: 21000, keyFeature: 11400, pay: 3600 },
  { month: '2026-07', visit: 125000, signup: 48000, active: 22000, keyFeature: 12000, pay: 3800 },
];
