import { create } from 'zustand';
import type { ChatMessage, ClarificationOption } from '../types';
import { isFollowUp, mergeFollowUp } from '../nlp/followUpDetector';
import { classifyIntent } from '../nlp/intentClassifier';
import { retrieve } from '../nlp/knowledgeRetriever';
import { checkClarity } from '../nlp/clarificationEngine';
import { generateSql } from '../nlp/sqlGenerator';
import { recommendChartType } from '../nlp/chartRecommender';
import { analyzeAttribution } from '../nlp/attributionEngine';
import { trendData } from '../mock/trends';
import { revenueByChannel, revenueByRegion, revenueByTier } from '../mock/revenue';
import { weeklyRetentionTrend } from '../mock/retention';
import { churnData } from '../mock/churn';
import { funnelStages } from '../mock/funnels';
import { kpiData } from '../mock/metrics';

interface ChatState {
  messages: ChatMessage[];
  suggestions: string[];
  isProcessing: boolean;
  currentPhase: string;
  sendQuery: (text: string) => void;
  handleClarification: (messageId: string, option: ClarificationOption) => void;
  handleFeedback: (messageId: string, type: 'positive' | 'negative') => void;
  clearHistory: () => void;
}

let msgId = 1;
const genId = () => `msg-${msgId++}`;

function buildChartData(lookup: string) {
  switch (lookup) {
    case 'trend_line':
      return {
        labels: trendData[0].data.map(d => d.date),
        series: trendData.map(s => ({
          name: s.name,
          data: s.name.includes('%') ? s.data.map(d => d.value) : s.data.map(d => Math.round(d.value)),
          color: s.color,
        })),
      };
    case 'revenue_by_channel':
      return { labels: revenueByChannel.map(d => d.name), series: [{ name: '收入(万)', data: revenueByChannel.map(d => d.value / 10000), color: '#6366f1' }] };
    case 'revenue_by_region':
      return { labels: revenueByRegion.map(d => d.name), series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000), color: '#8b5cf6' }] };
    case 'revenue_by_tier':
      return { labels: revenueByTier.map(d => d.name), series: [{ name: '收入(万)', data: revenueByTier.map(d => d.value / 10000), color: '#10b981' }] };
    case 'retention_trend':
      return { labels: weeklyRetentionTrend.map(d => d.week), series: [{ name: '12周留存率(%)', data: weeklyRetentionTrend.map(d => d.retention), color: '#06b6d4' }] };
    case 'churn_by_channel':
      return { labels: churnData.byChannel.map(d => d.name), series: [{ name: '流失率(%)', data: churnData.byChannel.map(d => d.rate), color: '#ef4444' }] };
    case 'churn_by_reason':
      return { labels: churnData.byReason.map(d => d.name), series: [{ name: '占比(%)', data: churnData.byReason.map(d => d.value), color: '#ef4444' }] };
    case 'funnel':
      return { labels: funnelStages.map(d => d.stage), series: [{ name: '用户数', data: funnelStages.map(d => d.value), color: '#6366f1' }] };
    case 'kpi_summary':
      return { labels: kpiData.map(d => d.title), series: [{ name: '值', data: kpiData.map(d => d.value), color: '#6366f1' }] };
    default:
      return {
        labels: trendData[0].data.map(d => d.date),
        series: [{ name: 'MRR(万)', data: trendData[0].data.map(d => Math.round(d.value)), color: '#6366f1' }],
      };
  }
}

function generateStrategy(query: string, matchedCount: number): string {

  if (/收入|MRR|营收/.test(query)) {
    return `📊 **MRR概览**\n\n本月MRR为285万元，环比增长12.5%，同比增长35.7%。企业版客户贡献53%的收入，增购收入占新增收入的38%。整体增长动能充足，预计Q3有望突破300万。`;
  }
  if (/流失|churn/.test(query)) {
    return `📊 **流失分析**\n\n本月流失率3.2%，较上月下降0.5个百分点。基础版流失率(5.8%)是企业版(1.2%)的4.8倍。自然流量渠道客户流失率最低(1.9%)，直接访问渠道最高(4.2%)。`;
  }
  if (/用户|MAU|DAU|活跃/.test(query)) {
    return `📊 **用户活跃分析**\n\n本月MAU达12.85万人，环比增长8.3%。日活/月活比率为28.5%，用户粘性处于健康区间。自然流量和推荐渠道贡献了62%的新增活跃用户。`;
  }
  if (/缺陷|bug|质量/.test(query)) {
    return `📊 **质量分析**\n\n本月线上缺陷数环比上升25%，主要归因于A项目高频发版(贡献60%)和B项目大规模重构(贡献25%)。P0/P1缺陷占比12%，需重点关注。`;
  }
  if (/代码|提交|commit|DORA|效能/.test(query)) {
    return `📊 **研发效能分析**\n\n本月人均代码提交次数为48次/月，代码审查覆盖率82%。DORA指标中部署频率为12次/周(Elite级)，变更失败率2.1%(High级)。`;
  }
  if (/留存|retention/.test(query)) {
    return `📊 **留存分析**\n\n最新批次用户12周留存率达82%，创历史新高。自然流量渠道用户留存率最高(85%)，付费搜索渠道最低(72%)。产品迭代对留存提升效果显著。`;
  }
  if (/漏斗|转化|funnel/.test(query)) {
    return `📊 **转化漏斗分析**\n\n从"关键功能体验"到"付费转化"是最大流失环节(转化率仅31.7%)。注册到激活环节转化率为45.8%，也有较大优化空间。`;
  }

  if (matchedCount === 0) {
    return `根据您的问题，我检索了知识库中的相关指标。请参考图表中的数据，或进一步明确您想了解的指标和时间范围。`;
  }

  return `根据您的查询，已为您匹配到${matchedCount}个相关指标。请查看下图数据，如需要更深入的分析或归因，可以继续追问。`;
}

// Map knowledge entries to data lookups
function resolveDataLookup(query: string): string {
  if (/按渠道/.test(query)) return 'revenue_by_channel';
  if (/按区域/.test(query)) return 'revenue_by_region';
  if (/按层级|按版本/.test(query)) return 'revenue_by_tier';
  if (/漏斗|转化|funnel/.test(query)) return 'funnel';
  if (/留存|retention/.test(query)) return 'retention_trend';
  if (/流失.*原因|流失.*归因/.test(query)) return 'churn_by_reason';
  if (/流失|churn/.test(query)) return 'churn_by_channel';
  if (/缺陷|bug|质量/.test(query)) return 'churn_by_channel'; // fallback
  return /(本月|这个月|趋势|变化|近|时间|走势)/.test(query) ? 'trend_line' : 'revenue_by_channel';
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  suggestions: [
    '这个月收入怎么样',
    '近半年MRR趋势',
    '用户留存情况如何',
    '按渠道拆分收入',
    '转化漏斗哪个环节流失最严重',
    '流失率最高的渠道是哪些',
    '为什么这个月流失率上升了',
    '帮我分析下DORA指标',
  ],
  isProcessing: false,
  currentPhase: 'idle',

  // === PHASE 1 + 2 + 3 + 4: Full pipeline ===
  sendQuery: (text: string) => {
    const state = get();
    const messages = state.messages;

    // Phase 1: Follow-up detection + context merging
    set({ currentPhase: 'followup_detection' });
    const followUp = isFollowUp(text, messages);
    const mergedQuery = followUp ? mergeFollowUp(text, messages) : text;

    // Intent classification
    set({ currentPhase: 'intent_classification' });
    const { intent, confidence } = classifyIntent(mergedQuery);

    if (intent === 'chat' || (intent === 'unknown' && confidence < 0.5)) {
      const userMsg: ChatMessage = { id: genId(), role: 'user', content: text, timestamp: Date.now() };
      const assistantMsg: ChatMessage = {
        id: genId(), role: 'assistant',
        content: '您好！我是ChatBI智能分析助手。您可以用自然语言问我关于业务数据的问题，例如：\n\n• "这个月收入怎么样？"\n• "按渠道拆分留存数据"\n• "近半年MRR趋势"\n• "为什么流失率上升了？"\n\n请尝试输入您想了解的数据问题。',
        timestamp: Date.now(), isError: false,
      };
      set({ messages: [...messages, userMsg, assistantMsg], isProcessing: false, currentPhase: 'done' });
      return;
    }

    const userMsg: ChatMessage = {
      id: genId(), role: 'user', content: text,
      timestamp: Date.now(),
    };
    set({ messages: [...messages, userMsg], isProcessing: true });

    // Simulate processing delay
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      // Phase 2: Knowledge retrieval
      set({ currentPhase: 'knowledge_retrieval' });
      const { matchedMetrics } = retrieve(mergedQuery);

      // Phase 3: Intent clarification
      set({ currentPhase: 'clarification' });
      const clarity = checkClarity(mergedQuery, matchedMetrics, followUp);

      if (clarity.needsClarification && clarity.options.length > 0) {
        const clarificationMsg: ChatMessage = {
          id: genId(), role: 'assistant',
          content: matchedMetrics.length > 3
            ? `您的问题涉及多个指标，请问您具体想了解哪个？`
            : matchedMetrics.length === 0
              ? `您想查看哪类数据？请选择：`
              : `需要补充一些信息，请选择：`,
          timestamp: Date.now(),
          isClarification: true,
          clarificationOptions: clarity.options,
          intent: 'CLARIFICATION',
        };
        set(s => ({ messages: [...s.messages, clarificationMsg], isProcessing: false, currentPhase: 'done' }));
        return;
      }

      // Phase 4: SQL + Chart + Attribution
      set({ currentPhase: 'sql_generation' });
      const hasTimeRef = /(本月|这个月|上月|上个月|今年|去年|近\d|最近|过去|202\d)/.test(mergedQuery);
      const hasDimRef = /(按|按照|每个|区域|渠道|层级|项目|团队)/.test(mergedQuery);
      const sql = generateSql(mergedQuery, matchedMetrics);
      const chartType = recommendChartType(mergedQuery, matchedMetrics, hasDimRef, hasTimeRef);
      const dataLookup = resolveDataLookup(mergedQuery);
      const chartData = buildChartData(dataLookup);

      const metricName = matchedMetrics[0]?.name || '指标';
      const attribution = analyzeAttribution(mergedQuery, metricName);

      const strategy = generateStrategy(mergedQuery, matchedMetrics.length);
      const intentLabel = matchedMetrics[0]?.category || '数据查询';
      const briefContent = matchedMetrics.length > 0
        ? `已为您匹配到「${matchedMetrics[0].name}」等${matchedMetrics.length}个相关指标，详细分析请查看右侧面板。`
        : '已为您查询相关数据，详细分析请查看右侧面板。';

      const assistantMsg: ChatMessage = {
        id: genId(), role: 'assistant',
        content: briefContent,
        timestamp: Date.now(),
        intent: intentLabel,
        sql,
        chartData,
        chartType,
        strategy,
        attribution: attribution || undefined,
      };

      set(s => ({ messages: [...s.messages, assistantMsg], isProcessing: false, currentPhase: 'done' }));
    }, delay);
  },

  // Handle clarification option click
  handleClarification: (messageId: string, option: ClarificationOption) => {
    const state = get();
    const enrichedQuery = `查看${option.label}的数据`;

    // Mark the clarification message as resolved by removing clarification UI
    const updatedMessages = state.messages.map(m =>
      m.id === messageId ? { ...m, isClarification: false, clarificationOptions: undefined, content: `已选择：${option.label}` } : m
    );
    set({ messages: updatedMessages });

    // Re-trigger send with enriched query
    state.sendQuery(enrichedQuery);
  },

  // Handle feedback (thumbs up/down)
  handleFeedback: (messageId: string, type: 'positive' | 'negative') => {
    set(s => ({
      messages: s.messages.map(m =>
        m.id === messageId ? { ...m, feedback: type } : m
      ),
    }));
  },

  clearHistory: () => set({ messages: [], currentPhase: 'idle' }),
}));
