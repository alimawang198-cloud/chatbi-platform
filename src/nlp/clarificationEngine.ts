import type { KnowledgeEntry, ClarificationOption } from '../types';

interface ClarificationResult {
  needsClarification: boolean;
  completeness: number;
  options: ClarificationOption[];
}

export function checkClarity(
  query: string,
  matchedMetrics: KnowledgeEntry[],
  isFollowUp: boolean
): ClarificationResult {
  let score = 0;

  // Time reference (25 pts) — nice to have but not required
  const hasTime = /(今天|昨天|本月|这个月|上月|上个月|今年|去年|近\d|最近|过去|202\d|Q[1-4]|周|月|季|年)/.test(query);
  if (hasTime) score += 25;

  // Metric match (35 pts) — the most important signal
  if (matchedMetrics.length === 1) score += 35;
  else if (matchedMetrics.length >= 2 && matchedMetrics.length <= 3) score += 20;
  else if (matchedMetrics.length > 3) score += 10;
  else score += 0; // no match at all

  // Dimension or grouping (20 pts)
  const hasDimension = /(按|按照|每个|各个|区域|渠道|版本|层级|团队|项目|产品|分|拆分)/.test(query);
  if (hasDimension) score += 20;

  // Follow-up bonus (15 pts) — context already established
  if (isFollowUp) score += 15;

  // Specific data question patterns (15 pts) — clear intent to see data
  const hasDataIntent = /(多少|怎么样|什么|情况|如何|查看|展示|显示|给出|拉|查|数据|指标|分析|报告|趋势|变化|分布|对比|排名)/.test(query);
  if (hasDataIntent) score += 15;

  // Score is 0-110. Only clarify when truly ambiguous.
  const needsClarification = matchedMetrics.length === 0 || (score < 35 && matchedMetrics.length === 0);
  const completeness = Math.min(score, 100);

  let options: ClarificationOption[] = [];

  if (needsClarification) {
    // Only trigger for truly ambiguous: zero matches, or completely generic query
    if (matchedMetrics.length > 3) {
      options = matchedMetrics.slice(0, 4).map((m, i) => ({
        id: `metric-${i}`,
        label: m.name,
        description: m.definition,
        type: 'metric' as const,
        value: m.id,
      }));
    } else if (matchedMetrics.length === 0) {
      // No metrics matched at all — show category picker
      options = [
        { id: 'gen-1', label: '核心经营指标', description: 'MRR、MAU、流失率等', type: 'metric', value: 'metrics_business' },
        { id: 'gen-2', label: '研发效能指标', description: '代码提交、缺陷率、DORA等', type: 'metric', value: 'metrics_dev' },
        { id: 'gen-3', label: '产品质量指标', description: '线上缺陷、可用率等', type: 'metric', value: 'metrics_quality' },
        { id: 'gen-4', label: '销售与市场指标', description: '漏斗、ROI、转化率等', type: 'metric', value: 'metrics_sales' },
      ];
    }
  }

  return { needsClarification, completeness, options };
}
