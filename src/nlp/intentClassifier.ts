export type QueryIntent = 'chat' | 'query' | 'unknown';

export function classifyIntent(text: string): { intent: QueryIntent; confidence: number } {
  const t = text.trim();

  // Chat/greeting patterns
  const chatPatterns = [
    /^(你好|hi|hello|嘿|嗨|早上好|下午好|晚上好)/i,
    /^(谢谢|感谢|thank)/i,
    /^(再见|拜拜|bye)/i,
    /^(你是谁|你能做什么|你会什么|你有哪些功能)/,
    /^(帮助|help|怎么用|使用说明)/,
  ];

  if (chatPatterns.some(p => p.test(t))) {
    return { intent: 'chat', confidence: 0.95 };
  }

  // Data query patterns — contains metric/analytics keywords
  const queryPatterns = [
    /(收入|营收|MRR|ARR|LTV|CAC|MAU|DAU|NRR|ARPU|NPS|CSAT)/i,
    /(流失|churn|留存|retention|转化|funnel|漏斗)/i,
    /(代码|提交|commit|缺陷|bug|测试|test|部署|deploy|构建|build|发布)/i,
    /(项目|需求|sprint|迭代|里程碑|story)/i,
    /(多少|怎么样|如何|趋势|变化|情况|数据|指标|分析|查询|展示|查看)/,
    /(环比|同比|对比|比较|排名|最高|最低|前\d|top)/i,
    /(区域|渠道|版本|层级|项目|团队|按|按照|每个|各个)/,
    /(为什么|原因|归因|根因)/,
    /(这个月|本月|上月|上个月|今年|去年|近\d|最近|过去)/,
    /(预测|预估|展望|下个月|下季)/,
  ];

  if (queryPatterns.some(p => p.test(t))) {
    return { intent: 'query', confidence: 0.85 };
  }

  // Unknown — return unknown, will trigger clarification
  return { intent: 'unknown', confidence: 0.3 };
}
