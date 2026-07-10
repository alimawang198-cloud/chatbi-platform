export const metricMeta: Record<string, { label: string; unit: string; color: string }> = {
  mrr: { label: '月度经常性收入(MRR)', unit: '¥', color: '#6366f1' },
  arr: { label: '年度经常性收入(ARR)', unit: '¥', color: '#8b5cf6' },
  activeUsers: { label: '月活跃用户(MAU)', unit: '人', color: '#10b981' },
  churnRate: { label: '月流失率', unit: '%', color: '#ef4444' },
  ltv: { label: '客户生命周期价值(LTV)', unit: '¥', color: '#f59e0b' },
  cac: { label: '客户获取成本(CAC)', unit: '¥', color: '#3b82f6' },
  retention: { label: '月留存率', unit: '%', color: '#06b6d4' },
  revenue: { label: '总收入', unit: '¥', color: '#6366f1' },
  customers: { label: '总付费客户数', unit: '个', color: '#10b981' },
  expansionRevenue: { label: '增购收入', unit: '¥', color: '#8b5cf6' },
  nrr: { label: '净收入留存率(NRR)', unit: '%', color: '#06b6d4' },
};

export const roleMeta: Record<string, { label: string; description: string }> = {
  manager: { label: '副总裁', description: '全局视角，关注核心经营指标与趋势' },
  pm: { label: '产品经理', description: '产品视角，关注用户增长与功能使用' },
  analyst: { label: '数据分析师', description: '分析视角，关注数据明细与多维下钻' },
};

export const dimensionMeta: Record<string, string> = {
  region: '区域',
  channel: '渠道',
  tier: '客户层级',
  product: '产品线',
  industry: '行业',
};
