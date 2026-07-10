import type { ChatMessage } from '../types';

// Detect if the current query is a follow-up to the previous conversation
export function isFollowUp(text: string, messages: ChatMessage[]): boolean {
  if (messages.length === 0) return false;

  const lastMsg = messages[messages.length - 1];
  if (lastMsg.role !== 'assistant' || lastMsg.isError) return false;

  const t = text.trim().toLowerCase();

  // Short relative references
  const followUpPatterns = [
    /^(那|那么|那这个|这个|那个)\s*(环比|同比|呢|怎么样|如何|多少|趋势|变化)/,
    /^(环比|同比|变化|趋势)(呢|怎么样|如何)?$/,
    /^(再|继续|接着)(看看|看下|分析|查).*/,
    /^(还有|另外|此外).*/,
    /^(能|可以|帮我)(再|进一步|具体|详细|深入).*/,
    /^(为什么|原因|归因|根因).*/,
    /^(按|按照)(区域|渠道|层级|版本|地区)(看看|拆分|下钻|分析|展示).*/,
    /^(上个月|上月|去年同期|去年|同比)(呢|怎么样|如何|情况)?$/,
    /^(那)(上个月|上月|这个月|本月)(呢|呢?怎么样)/,
    /^(拆到|下钻到|细分到|具体到).*/,
    /^(\?|？)/,  // empty query just questioning
  ];

  return followUpPatterns.some(p => p.test(t));
}

// Merge follow-up with previous context to create a complete query
export function mergeFollowUp(text: string, messages: ChatMessage[]): string {
  if (messages.length === 0) return text;

  // Get the last user message as context
  const lastUserMsgs = messages.filter(m => m.role === 'user');
  if (lastUserMsgs.length === 0) return text;

  const lastUserQuery = lastUserMsgs[lastUserMsgs.length - 1].content;
  const lastAssistant = messages.filter(m => m.role === 'assistant' && !m.isError).pop();

  const t = text.trim();

  // Handle "那环比呢？"
  if (/环比/.test(t) && !/环比/.test(lastUserQuery)) {
    return `${lastUserQuery}，以及环比变化`;
  }
  // Handle "那同比呢？"
  if (/同比/.test(t) && !/同比/.test(lastUserQuery)) {
    return `${lastUserQuery}，以及同比变化`;
  }
  // Handle "按XXX拆分"
  if (/^(按|按照)/.test(t) && !/^(按|按照)/.test(lastUserQuery)) {
    return `${lastUserQuery}，${t}`;
  }
  // Handle "为什么"/归因
  if (/^(为什么|原因|归因)/.test(t)) {
    const metric = lastAssistant?.intent ? extractMetricFromIntent(lastAssistant) : '';
    return `${metric}${t}`;
  }
  // Handle "上个月呢？"
  if (/上个月|上月/.test(t) && !/上个月|上月/.test(lastUserQuery)) {
    return lastUserQuery.replace(/这个月|本月/g, '上个月');
  }

  // Default: prepend last context
  return `${lastUserQuery}，${t}`;
}

function extractMetricFromIntent(msg: ChatMessage): string {
  if (msg.intent === 'METRIC_OVERVIEW' || msg.intent === 'METRIC_TREND') {
    if (/MRR|收入|营收/.test(msg.content)) return 'MRR';
    if (/流失|churn/.test(msg.content)) return '流失率';
    if (/活跃|MAU|用户/.test(msg.content)) return '月活跃用户';
  }
  return '';
}
