import type { KnowledgeEntry, ModelTable } from '../types';
import { searchKnowledge } from '../mock/knowledgeBase';
import { modelKnowledge } from '../mock/modelKnowledge';

interface RetrievalResult {
  matchedMetrics: KnowledgeEntry[];
  matchedTables: ModelTable[];
  enrichedContext: string;
}

export function retrieve(query: string): RetrievalResult {
  const q = query.toLowerCase();

  // Search semantic knowledge base
  const matchedMetrics = searchKnowledge(q);

  // Search model knowledge base
  const matchedTables = modelKnowledge.filter(table => {
    const matchTable = table.name.toLowerCase().includes(q) || table.description.toLowerCase().includes(q);
    const matchFields = table.fields.some(f =>
      f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
    );
    return matchTable || matchFields;
  });

  // Build enriched context for downstream processing
  const metricContext = matchedMetrics.slice(0, 5).map(m =>
    `[${m.name}](${m.definition}, 单位:${m.unit})`
  ).join('; ');

  const tableContext = matchedTables.slice(0, 3).map(t => {
    const fieldStr = t.fields.filter(f => f.isMetric || f.isDimension).slice(0, 4)
      .map(f => `${f.name}(${f.description})`).join(', ');
    return `表[${t.name}](${t.description}): ${fieldStr}`;
  }).join('; ');

  const enrichedContext = [
    metricContext && `匹配指标: ${metricContext}`,
    tableContext && `匹配数据表: ${tableContext}`,
  ].filter(Boolean).join('\n');

  return { matchedMetrics, matchedTables, enrichedContext };
}
