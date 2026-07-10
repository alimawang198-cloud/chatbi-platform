import type { KnowledgeEntry } from '../types';

export function generateSql(
  query: string,
  matchedMetrics: KnowledgeEntry[]
): string {
  const primaryMetric = matchedMetrics[0];

  // Generate realistic SQL based on matched knowledge
  if (!primaryMetric) {
    return `-- 未匹配到具体指标，请补充查询条件
SELECT * FROM metrics LIMIT 10;`;
  }

  const mainTable = (primaryMetric.relatedTables?.[0]) || 'metrics';

  // Determine time filter
  let timeFilter = '';
  if (/本月|这个月/.test(query)) {
    timeFilter = `WHERE date >= DATE_TRUNC('month', CURRENT_DATE)`;
  } else if (/上月|上个月/.test(query)) {
    timeFilter = `WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
  AND date < DATE_TRUNC('month', CURRENT_DATE)`;
  } else if (/近半年|最近6个月/.test(query)) {
    timeFilter = `WHERE date >= CURRENT_DATE - INTERVAL '6 months'`;
  } else if (/今年/.test(query)) {
    timeFilter = `WHERE date >= DATE_TRUNC('year', CURRENT_DATE)`;
  } else if (/去年/.test(query)) {
    timeFilter = `WHERE date >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '1 year')
  AND date < DATE_TRUNC('year', CURRENT_DATE)`;
  }

  // Determine dimension grouping
  let groupBy = '';
  if (/按区域/.test(query)) groupBy = 'region';
  else if (/按渠道/.test(query)) groupBy = 'channel';
  else if (/按项目/.test(query)) groupBy = 'project_id';
  else if (/按团队/.test(query)) groupBy = 'team';
  else if (/按层级|按版本/.test(query)) groupBy = 'tier';

  // Build SQL
  if (groupBy && timeFilter) {
    return `SELECT
  ${groupBy},
  DATE_TRUNC('month', date) as month,
  COUNT(*) as count,
  SUM(value) as total
FROM ${mainTable}
${timeFilter}
GROUP BY ${groupBy}, DATE_TRUNC('month', date)
ORDER BY month, total DESC;`;
  }

  if (groupBy) {
    return `SELECT
  ${groupBy},
  COUNT(*) as count,
  SUM(value) as total
FROM ${mainTable}
GROUP BY ${groupBy}
ORDER BY total DESC;`;
  }

  if (timeFilter) {
    return `SELECT
  DATE_TRUNC('month', date) as month,
  COUNT(*) as count,
  SUM(value) as total
FROM ${mainTable}
${timeFilter}
GROUP BY DATE_TRUNC('month', date)
ORDER BY month;`;
  }

  // Default
  return `SELECT
  DATE_TRUNC('month', date) as month,
  COUNT(*) as count,
  SUM(value) as total
FROM ${mainTable}
WHERE date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;`;
}
