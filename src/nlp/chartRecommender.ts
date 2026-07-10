import type { ChartType, KnowledgeEntry } from '../types';

export function recommendChartType(
  query: string,
  matchedMetrics: KnowledgeEntry[],
  hasDimension: boolean,
  hasTime: boolean
): ChartType {
  // Use knowledge base default if available
  if (matchedMetrics.length === 1) {
    return matchedMetrics[0].defaultChart;
  }

  const q = query.toLowerCase();

  // Explicit chart mentions
  if (/饼图|占比|分布|组成|构成/.test(q)) return 'pie';
  if (/漏斗|funnel|转化/.test(q)) return 'funnel';
  if (/柱状图|柱形图|对比|比较|排名/.test(q)) return 'bar';
  if (/折线图|趋势|走势|变化|增长/.test(q)) return 'line';

  // Heuristic rules
  if (hasTime && !hasDimension) return 'line';
  if (hasDimension && !hasTime) return 'bar';
  if (hasTime && hasDimension) return 'line';
  if (/top|前\d|最高|最低|排名/.test(q)) return 'horizontal-bar';

  // Default
  return 'bar';
}
