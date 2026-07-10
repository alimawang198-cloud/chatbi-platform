import type { AttributionResult } from '../types';

export function analyzeAttribution(
  query: string,
  metricName: string
): AttributionResult | null {
  // Only trigger attribution for "why"/"reason" queries or when data shows significant change
  const isWhyQuery = /(为什么|原因|归因|根因|怎么).*(上升|下降|变化|增长|减少|波动|异常)/.test(query);

  if (!isWhyQuery) return null;

  // Generate mock attribution based on metric
  if (/缺陷|bug/.test(metricName)) {
    return {
      summary: '本月线上缺陷数环比上升25%，经归因分析，主要原因如下：',
      factors: [
        {
          description: 'A项目高频发版',
          contribution: 60,
          details: [
            '本月A项目发布了4个版本(v2.3.1-v2.3.4)',
            'v2.3.1引入12个新缺陷，其中3个为P0级别',
            'v2.3.2修复了5个但新增了3个回归缺陷',
          ],
        },
        {
          description: 'B项目大规模重构',
          contribution: 25,
          details: [
            'B项目重构了核心支付模块(涉及代码行12,000+)',
            '重构后单元测试覆盖率从72%降至58%',
            '支付模块相关缺陷占本月总缺陷的18%',
          ],
        },
        {
          description: '第三方依赖升级',
          contribution: 15,
          details: [
            '升级了payment-sdk v3.1.1 → v3.2.0',
            '新版本在特定并发场景下存在兼容性问题',
          ],
        },
      ],
      suggestions: [
        '建议A项目加强发版前的自动化测试覆盖，将千行缺陷率控制在2.0以内',
        '建议B项目采用渐进式重构策略，分模块逐步上线',
        '建立第三方依赖升级的灰度验证机制，先在staging环境验证至少48小时',
      ],
    };
  }

  if (/流失|churn/.test(metricName)) {
    return {
      summary: '本月客户流失率环比上升0.5个百分点(3.2%→3.7%)，经分析主要归因于：',
      factors: [
        {
          description: '基础版价格调整影响',
          contribution: 45,
          details: [
            '上月基础版价格上调15%，部分价格敏感客户选择不续费',
            '基础版流失率从5.2%上升至5.8%',
            '受影响的客户主要集中在SMB(中小企业)群体',
          ],
        },
        {
          description: '竞品促销活动',
          contribution: 30,
          details: [
            '主要竞品在本月推出了"买一年送三个月"活动',
            '流失客户中有23%明确表示转向了竞品',
            '受冲击最大的区域是华南市场',
          ],
        },
        {
          description: '产品体验问题',
          contribution: 25,
          details: [
            '本月核心功能出现2次P0级别故障，累计影响12小时',
            '相关客户NPS评分下降8个百分点',
            '客服工单量环比上升35%',
          ],
        },
      ],
      suggestions: [
        '针对基础版客户推出"忠诚计划"，6个月以上客户续费享9折优惠',
        '加强华南区域客户成功团队配置，建立重点客户一对一维护机制',
        '将核心功能可用率SLA从99.5%提升到99.9%',
      ],
    };
  }

  // Default attribution
  return {
    summary: `"${metricName}"的变化趋势分析如下：`,
    factors: [
      {
        description: '业务季节性波动',
        contribution: 40,
        details: [
          '当前处于行业传统旺季/淡季转换期',
          '历史同期数据显示类似波动模式',
        ],
      },
      {
        description: '产品迭代影响',
        contribution: 35,
        details: [
          '最近一次大版本更新引入了新的使用路径',
          '用户对新功能的适应期约为2-3周',
        ],
      },
      {
        description: '市场环境变化',
        contribution: 25,
        details: [
          '行业整体趋势出现调整',
          '竞争对手推出了新的定价策略',
        ],
      },
    ],
    suggestions: [
      '持续监测未来4周数据变化，确认是否为短期波动',
      '加强对核心用户的NPS调研，及时获取用户反馈',
      '建立异常指标自动预警机制，第一时间响应数据变化',
    ],
  };
}
