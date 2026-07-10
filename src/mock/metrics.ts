import type { KpiCardData, Role } from '../types';

export const kpiData: KpiCardData[] = [
  {
    id: 'mrr',
    title: '月度经常性收入(MRR)',
    value: 2850000,
    prefix: '¥',
    change: 12.5,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [210, 220, 215, 230, 240, 235, 250, 245, 260, 255, 275, 285],
  },
  {
    id: 'arr',
    title: '年度经常性收入(ARR)',
    value: 34200000,
    prefix: '¥',
    change: 15.8,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 34.2],
  },
  {
    id: 'activeUsers',
    title: '月活跃用户(MAU)',
    value: 128500,
    suffix: '人',
    change: 8.3,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [90, 95, 98, 100, 105, 108, 110, 115, 118, 120, 125, 128.5],
  },
  {
    id: 'churnRate',
    title: '月流失率',
    value: 3.2,
    suffix: '%',
    change: -0.5,
    changeLabel: '较上月',
    trend: 'down',
    sparklineData: [4.5, 4.3, 4.1, 4.0, 3.8, 3.9, 3.7, 3.5, 3.4, 3.6, 3.7, 3.2],
  },
  {
    id: 'ltv',
    title: '客户生命周期价值(LTV)',
    value: 86000,
    prefix: '¥',
    change: 5.2,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [62, 65, 67, 70, 72, 74, 76, 78, 80, 82, 84, 86],
  },
  {
    id: 'cac',
    title: '客户获取成本(CAC)',
    value: 12800,
    prefix: '¥',
    change: -3.1,
    changeLabel: '较上月',
    trend: 'down',
    sparklineData: [15, 14.8, 14.5, 14.2, 13.9, 13.6, 13.4, 13.2, 13.0, 12.9, 13.1, 12.8],
  },
];

// Role-specific KPI data
export const pmKpiData: KpiCardData[] = [
  {
    id: 'mau',
    title: '月活跃用户(MAU)',
    value: 128500,
    suffix: '人',
    change: 8.3,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [90, 95, 98, 100, 105, 108, 110, 115, 118, 120, 125, 128.5],
  },
  {
    id: 'featureAdoption',
    title: '功能采用率',
    value: 67.8,
    suffix: '%',
    change: 4.2,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67.8],
  },
  {
    id: 'nps',
    title: '净推荐值(NPS)',
    value: 48,
    change: 2.1,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 47, 48],
  },
  {
    id: 'retention',
    title: '用户留存率',
    value: 85.3,
    suffix: '%',
    change: 1.5,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [78, 79, 79, 80, 81, 81, 82, 83, 83, 84, 84, 85.3],
  },
  {
    id: 'bugRate',
    title: '线上缺陷密度',
    value: 0.8,
    suffix: '/千行',
    change: -0.3,
    changeLabel: '较上月',
    trend: 'down',
    sparklineData: [1.5, 1.4, 1.3, 1.3, 1.2, 1.1, 1.0, 1.0, 0.9, 0.9, 0.9, 0.8],
  },
  {
    id: 'iterationVelocity',
    title: '迭代交付速率',
    value: 94,
    suffix: '%',
    change: 3.1,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [82, 83, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94],
  },
];

export const analystKpiData: KpiCardData[] = [
  {
    id: 'dataAccuracy',
    title: '数据准确率',
    value: 99.2,
    suffix: '%',
    change: 0.3,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [98, 98.2, 98.3, 98.5, 98.5, 98.6, 98.7, 98.8, 98.8, 99, 99.1, 99.2],
  },
  {
    id: 'reportCount',
    title: '本月报表产出',
    value: 156,
    suffix: '份',
    change: 12.4,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [110, 112, 115, 118, 120, 125, 128, 130, 135, 140, 148, 156],
  },
  {
    id: 'queryTime',
    title: '平均查询耗时',
    value: 1.8,
    suffix: 's',
    change: -0.5,
    changeLabel: '较上月',
    trend: 'down',
    sparklineData: [3.2, 3.0, 2.9, 2.8, 2.6, 2.5, 2.3, 2.1, 2.0, 1.9, 1.9, 1.8],
  },
  {
    id: 'anomalyCount',
    title: '异常数据检出',
    value: 23,
    suffix: '条',
    change: -15.2,
    changeLabel: '较上月',
    trend: 'down',
    sparklineData: [35, 33, 32, 30, 31, 29, 28, 26, 25, 24, 25, 23],
  },
  {
    id: 'dataSourceCoverage',
    title: '数据源覆盖率',
    value: 92.5,
    suffix: '%',
    change: 2.3,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 92.5],
  },
  {
    id: 'etlSuccessRate',
    title: 'ETL成功率',
    value: 99.8,
    suffix: '%',
    change: 0.1,
    changeLabel: '较上月',
    trend: 'up',
    sparklineData: [99.1, 99.2, 99.3, 99.3, 99.4, 99.4, 99.5, 99.5, 99.6, 99.7, 99.7, 99.8],
  },
];

export function getKpiByRole(role: Role): KpiCardData[] {
  switch (role) {
    case 'pm':
      return pmKpiData;
    case 'analyst':
      return analystKpiData;
    default:
      return kpiData;
  }
}
