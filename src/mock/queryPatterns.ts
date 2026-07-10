import type { Intent } from '../types';

export interface PatternMatch {
  intent: Intent;
  sql: string;
  chartType: 'line' | 'bar' | 'pie' | 'funnel' | 'horizontal-bar';
  dataLookup: string;
  strategy: string;
}

interface PatternRule {
  regex: RegExp;
  result: PatternMatch;
}

export const patterns: PatternRule[] = [
  {
    regex: /(这个月|本月).*(收入|营收|MRR).*(怎么样|如何|多少|情况)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, mrr FROM monthly_metrics WHERE month >= "2026-01" ORDER BY month',
      chartType: 'line',
      dataLookup: 'mrr_overview',
      strategy: '本月MRR保持增长态势，环比增长12.5%，主要驱动力来自企业版客户的增购和续费。建议关注基础版客户流失对MRR的负面影响，适时推出中端版升级激励政策。',
    },
  },
  {
    regex: /(上个?月|上月).*(收入|营收|MRR).*(怎么样|如何|多少)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, mrr FROM monthly_metrics WHERE month >= "2025-08" ORDER BY month',
      chartType: 'line',
      dataLookup: 'mrr_overview',
      strategy: '上月MRR为275万，本月增长至285万，环比增长3.6%。近12个月MRR保持稳定增长态势，年均复合增长率约2.8%。',
    },
  },
  {
    regex: /(近|过去|最近).*(半年|6个?月|六个月).*(收入|营收|MRR|趋势)/,
    result: {
      intent: { category: 'METRIC_TREND', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, mrr, mau, churn_rate FROM monthly_metrics WHERE month >= "2026-02" ORDER BY month',
      chartType: 'line',
      dataLookup: 'trend_6m',
      strategy: '近半年MRR从250万增长至285万，增幅14%。同期MAU从11万增长至12.85万。增长趋势稳定，预计Q3将突破300万。',
    },
  },
  {
    regex: /(近|过去|最近).*(一年|12个?月|十二个?月).*(收入|营收|MRR|趋势)/,
    result: {
      intent: { category: 'METRIC_TREND', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, mrr, mau, churn_rate FROM monthly_metrics WHERE month >= "2025-08" ORDER BY month',
      chartType: 'line',
      dataLookup: 'trend_12m',
      strategy: '过去一年MRR从210万增长至285万，年增长35.7%。核心增长驱动为企业版客户扩展和新客户获取效率提升。',
    },
  },
  {
    regex: /(按|按照).*(渠道|渠道维度).*(拆分|查看|展示|看).*(收入|营收|留存|用户)/,
    result: {
      intent: { category: 'METRIC_BREAKDOWN', confidence: 0.95, chartType: 'bar' },
      sql: 'SELECT channel, SUM(revenue) as total, COUNT(DISTINCT user_id) as users FROM revenue_breakdown GROUP BY channel ORDER BY total DESC',
      chartType: 'bar',
      dataLookup: 'revenue_by_channel',
      strategy: '自然流量渠道贡献收入最高(98万)，且用户留存率最佳。付费搜索虽然用户量大，但ROI需持续优化。建议将自然流量作为核心增长引擎，加大内容营销投入。',
    },
  },
  {
    regex: /(按|按照).*(区域|地区).*(拆分|查看|展示|看).*(收入|营收|用户|分布)/,
    result: {
      intent: { category: 'METRIC_BREAKDOWN', confidence: 0.95, chartType: 'bar' },
      sql: 'SELECT region, SUM(revenue) as total FROM revenue_breakdown GROUP BY region ORDER BY total DESC',
      chartType: 'bar',
      dataLookup: 'revenue_by_region',
      strategy: '华东区域收入占比34%，为最大贡献区域。整体健康但成都区域需关注，其收入增速低于全国平均水平。华北和华南保持稳定增长。',
    },
  },
  {
    regex: /(按|按照).*(客户层级|分层|版本).*(拆分|查看|展示|分析).*(收入|营收|流失)/,
    result: {
      intent: { category: 'METRIC_BREAKDOWN', confidence: 0.95, chartType: 'pie' },
      sql: 'SELECT tier, SUM(revenue) as total, AVG(churn_rate) as churn FROM tier_breakdown GROUP BY tier ORDER BY total DESC',
      chartType: 'pie',
      dataLookup: 'revenue_by_tier',
      strategy: '企业版客户贡献53%的收入但仅占客户总数的3.5%。基础版客户数量最多但收入贡献仅3.5%。建议加强中端和企业版的升级转化，提升整体ARPU。',
    },
  },
  {
    regex: /(转化漏斗|漏斗分析|从注册到付费).*(怎么样|如何|情况|哪个环节).*(流失|转化)/,
    result: {
      intent: { category: 'FUNNEL', confidence: 0.95, chartType: 'funnel' },
      sql: 'SELECT stage, user_count FROM conversion_funnel ORDER BY stage_order',
      chartType: 'funnel',
      dataLookup: 'conversion_funnel',
      strategy: '从关键功能体验到付费转化环节流失最严重(转化率31.7%)，建议加强产品价值传递和付费引导。注册到激活环节也有优化空间(45.8%)，可通过新手引导提升激活率。',
    },
  },
  {
    regex: /(用户留存|留存率|留存情况).*(怎么样|如何|多少|趋势)/,
    result: {
      intent: { category: 'RETENTION', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT week, retention_rate FROM weekly_retention WHERE week >= "W23" ORDER BY week',
      chartType: 'line',
      dataLookup: 'retention_trend',
      strategy: '用户留存率整体呈上升趋势，最近批次(W34)的首周留存率达到82%，为历史最高。产品迭代和用户体验优化效果显著，建议继续保持当前产品节奏。',
    },
  },
  {
    regex: /(流失|流失率).*(最高|最低|前\d+|前几).*(渠道|区域|层级|版本)/,
    result: {
      intent: { category: 'TOP_N', confidence: 0.9, chartType: 'horizontal-bar' },
      sql: 'SELECT dimension, churn_rate FROM churn_analysis ORDER BY churn_rate DESC LIMIT 5',
      chartType: 'horizontal-bar',
      dataLookup: 'churn_by_dimension',
      strategy: '直接访问渠道流失率最高(4.2%)，基础版客户流失率(5.8%)是大客户的近5倍。建议针对高流失渠道和层级制定专项留存策略。',
    },
  },
  {
    regex: /(活跃用户|MAU|月活).*(怎么样|如何|多少|趋势|变化)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, mau FROM monthly_metrics WHERE month >= "2026-01" ORDER BY month',
      chartType: 'line',
      dataLookup: 'mau_trend',
      strategy: '本月MAU达12.85万人，环比增长8.3%。近半年用户增长稳定，月均新增活跃用户约3500人。自然流量和推荐渠道是主要用户增长来源。',
    },
  },
  {
    regex: /(流失率|churn).*(趋势|变化|走势)/,
    result: {
      intent: { category: 'METRIC_TREND', confidence: 0.95, chartType: 'line' },
      sql: 'SELECT month, churn_rate FROM monthly_metrics WHERE month >= "2025-08" ORDER BY month',
      chartType: 'line',
      dataLookup: 'churn_trend',
      strategy: '月流失率从去年8月的4.5%下降至本月的3.2%，下降趋势显著。企业版客户流失率保持在1.2%的低位，基础版客户流失仍有优化空间。',
    },
  },
  {
    regex: /(对比|比较).*(同比|去年|上季|上个月).*(收入|MRR|用户|流失|留存)/,
    result: {
      intent: { category: 'COMPARISON', confidence: 0.9, chartType: 'bar' },
      sql: 'SELECT period, current_value, compare_value, change_pct FROM comparison WHERE metric = "mrr"',
      chartType: 'bar',
      dataLookup: 'comparison_data',
      strategy: '与去年7月相比，MRR同比增长35.7%(从210万到285万)。与上月相比，各项指标均呈正向变化，其中月活用户增长最为显著(环比+8.3%)。',
    },
  },
  {
    regex: /(收入|营收).*(构成|结构|组成|占比)/,
    result: {
      intent: { category: 'METRIC_BREAKDOWN', confidence: 0.9, chartType: 'pie' },
      sql: 'SELECT category, SUM(revenue) as total, percentage FROM revenue_composition GROUP BY category',
      chartType: 'pie',
      dataLookup: 'revenue_composition',
      strategy: '企业版收入占比53%，是收入主力。专业版贡献31%，中端和基础版合计仅16%。收入结构健康但存在对大客户的集中度风险，建议推动中端客户向专业版升级。',
    },
  },
  {
    regex: /(最近|近期).*(关键|核心).*(指标|数据|KPI)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.9, chartType: 'line' },
      sql: 'SELECT * FROM kpi_summary WHERE period = "current"',
      chartType: 'line',
      dataLookup: 'kpi_summary',
      strategy: '核心指标概览：MRR 285万(↑12.5%)，MAU 12.85万(↑8.3%)，流失率3.2%(↓0.5pp)，LTV 8.6万(↑5.2%)，CAC 1.28万(↓3.1%)。整体经营健康，增长动能充足。',
    },
  },
  {
    regex: /(客户|用户).*(增长|新增).*(怎么样|如何|趋势)/,
    result: {
      intent: { category: 'METRIC_TREND', confidence: 0.9, chartType: 'line' },
      sql: 'SELECT month, new_customers, total_customers FROM customer_growth ORDER BY month',
      chartType: 'line',
      dataLookup: 'customer_growth',
      strategy: '本月新增客户约420个，总付费客户数达9070个。新客户增长保持稳定，其中自然流量渠道贡献了40%的新客户。建议继续优化自然流量的转化路径。',
    },
  },
  {
    regex: /(哪个|什么|哪些).*(渠道|区域|版本).*(最好|最优|最高|最差|最低)/,
    result: {
      intent: { category: 'TOP_N', confidence: 0.85, chartType: 'horizontal-bar' },
      sql: 'SELECT dimension, metric_value FROM dimension_ranking ORDER BY metric_value DESC',
      chartType: 'horizontal-bar',
      dataLookup: 'dimension_ranking',
      strategy: '各维度表现：收入维度-华东最优(98万)，用户维度-自然流量最优(4.25万)，留存维度-企业版最优(98.8%)，ARPU维度-企业版最优(4750元)。建议将最优实践推广到其他维度。',
    },
  },
  {
    regex: /(预测|预估|预计).*(下个?月|下季|明年).*(收入|MRR|用户|增长)/,
    result: {
      intent: { category: 'WHAT_IF', confidence: 0.8, chartType: 'line' },
      sql: '-- 基于历史趋势和季节性因子的预测模型\nWITH forecast AS (SELECT * FROM trend_forecast) SELECT month, actual, predicted FROM forecast',
      chartType: 'line',
      dataLookup: 'forecast',
      strategy: '基于当前增长趋势，预计下月MRR将达到295-305万，月活用户有望突破13.5万。如保持当前增长态势，Q3末MRR有望突破320万。建议适当增加销售团队以捕捉增长机会。',
    },
  },
  {
    regex: /(每个|各个).*(月份|月度).*(数据|指标|表现)/,
    result: {
      intent: { category: 'METRIC_TREND', confidence: 0.85, chartType: 'line' },
      sql: 'SELECT month, mrr, mau, churn_rate, new_customers FROM monthly_metrics ORDER BY month',
      chartType: 'line',
      dataLookup: 'monthly_all',
      strategy: '各月度数据显示稳定增长趋势。Q2表现优于Q1，MRR季度环比增长8.2%。假日月份(春节)通常出现用户活跃度短暂下降，但收入保持稳定。',
    },
  },
  {
    regex: /(帮我|给我|来|要).*(分析报告|报告|总结|汇总)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.9, chartType: 'line' },
      sql: 'SELECT * FROM comprehensive_analysis',
      chartType: 'line',
      dataLookup: 'comprehensive',
      strategy: '已为您生成综合分析报告。核心发现：1)整体经营数据向好，MRR和MAU双增长；2)流失率持续改善；3)企业版客户价值突出；4)自然流量为最优渠道。详细报告已保存至草稿箱。',
    },
  },
  {
    regex: /(NRR|净收入留存|净留存).*(怎么样|如何|多少)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.9, chartType: 'line' },
      sql: 'SELECT month, nrr FROM monthly_metrics WHERE month >= "2026-01" ORDER BY month',
      chartType: 'line',
      dataLookup: 'nrr_trend',
      strategy: '本月NRR为112%，表明存量客户收入在增长(增购和扩展超过了流失的影响)。NRR超过110%被认为是健康的SaaS指标，当前状态良好。',
    },
  },
  {
    regex: /(CAC|获客成本|客户获取成本).*(怎么样|如何|多少|趋势)/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.9, chartType: 'line' },
      sql: 'SELECT month, cac, ltv, ltv_cac_ratio FROM metrics ORDER BY month',
      chartType: 'line',
      dataLookup: 'cac_ltv',
      strategy: '本月CAC为1.28万元，同比下降14.7%。LTV/CAC比率为6.7，远超行业基准(3:1为健康)。获客效率持续提升，建议将节省的获客预算投入到产品研发和客户成功。',
    },
  },
  {
    regex: /.*(帮助|怎么用|怎么操作|能做什么|功能).*/,
    result: {
      intent: { category: 'METRIC_OVERVIEW', confidence: 0.7, chartType: 'line' },
      sql: '',
      chartType: 'line',
      dataLookup: 'help',
      strategy: '您可以问我以下问题：\n1. 查看指标：如"这个月收入怎么样"、"MRR是多少"\n2. 趋势分析：如"近半年收入趋势"、"流失率变化"\n3. 维度拆分：如"按渠道拆分收入"、"各区域用户分布"\n4. 漏斗分析：如"转化漏斗哪个环节流失最严重"\n5. 对比分析：如"同比去年的收入变化"\n6. 生成报告：如"帮我生成一份分析报告"',
    },
  },
];
