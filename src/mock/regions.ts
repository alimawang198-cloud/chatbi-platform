import type { Dimension } from '../types';

export const regionDimension: Dimension = {
  id: 'region',
  label: '区域',
  values: [
    {
      id: 'east',
      label: '华东',
      children: [
        { id: 'shanghai', label: '上海' },
        { id: 'hangzhou', label: '杭州' },
        { id: 'nanjing', label: '南京' },
        { id: 'suzhou', label: '苏州' },
      ],
    },
    {
      id: 'north',
      label: '华北',
      children: [
        { id: 'beijing', label: '北京' },
        { id: 'tianjin', label: '天津' },
        { id: 'shijiazhuang', label: '石家庄' },
      ],
    },
    {
      id: 'south',
      label: '华南',
      children: [
        { id: 'shenzhen', label: '深圳' },
        { id: 'guangzhou', label: '广州' },
        { id: 'dongguan', label: '东莞' },
      ],
    },
    {
      id: 'southwest',
      label: '西南',
      children: [
        { id: 'chengdu', label: '成都' },
        { id: 'chongqing', label: '重庆' },
        { id: 'kunming', label: '昆明' },
      ],
    },
    {
      id: 'central',
      label: '华中',
      children: [
        { id: 'wuhan', label: '武汉' },
        { id: 'changsha', label: '长沙' },
        { id: 'zhengzhou', label: '郑州' },
      ],
    },
  ],
};

export const tierDimension: Dimension = {
  id: 'tier',
  label: '客户层级',
  values: [
    { id: 'enterprise', label: '企业版' },
    { id: 'professional', label: '专业版' },
    { id: 'mid', label: '中端版' },
    { id: 'basic', label: '基础版' },
  ],
};

export const channelDimension: Dimension = {
  id: 'channel',
  label: '渠道',
  values: [
    { id: 'organic', label: '自然流量' },
    { id: 'paid_search', label: '付费搜索' },
    { id: 'referral', label: '推荐渠道' },
    { id: 'social', label: '社交媒体' },
    { id: 'direct', label: '直接访问' },
  ],
};

export const productDimension: Dimension = {
  id: 'product',
  label: '产品线',
  values: [
    { id: 'analytics', label: '数据分析平台' },
    { id: 'marketing', label: '营销自动化' },
    { id: 'crm', label: '客户管理' },
    { id: 'api', label: 'API服务' },
  ],
};

export const dimensions: Dimension[] = [regionDimension, tierDimension, channelDimension, productDimension];
