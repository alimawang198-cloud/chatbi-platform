import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Filter, ChevronDown } from 'lucide-react';
import { useDrillStore } from '../../store/drillStore';
import { DrillPanel } from '../../components/drill/DrillPanel';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { LineChart } from '../../components/charts/LineChart';
import { Button } from '../../components/common/Button';
import { revenueByChannel, revenueByRegion, revenueByTier } from '../../mock/revenue';
import { churnData } from '../../mock/churn';
import { trendData } from '../../mock/trends';
import { kpiData } from '../../mock/metrics';

export function AnalyzePage() {
  const { togglePanel, isOpen, drillDown, setDimension } = useDrillStore();
  const [activeFilter, setActiveFilter] = useState('全部');

  const handleRegionClick = (label: string) => {
    if (!isOpen) togglePanel();
    setDimension('region');
    drillDown('region', label, label);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main */}
      <div className="flex-1 overflow-auto animate-fade-in">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">多维分析</h1>
              <p className="text-sm text-slate-400 mt-1">交互式探索数据，支持逐层下钻分析</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                {['全部', '近6月', '上月', '本月'].map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeFilter === f
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Button onClick={togglePanel} size="sm" variant="secondary">
                <BarChart3 className="w-4 h-4 mr-1.5" />
                下钻面板
              </Button>
            </div>
          </div>

          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.slice(0, 4).map(kpi => (
              <div key={kpi.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                <p className="text-xs text-slate-400 mb-1">{kpi.title.replace('(MRR)', '').replace('(ARR)', '').replace('(MAU)', '')}</p>
                <div className="flex items-baseline gap-1.5 mb-1.5">
                  <span className="text-2xl font-bold text-gray-800">
                    {kpi.prefix}{typeof kpi.value === 'number' && kpi.value >= 10000
                      ? (kpi.value / 10000).toFixed(1) + '万'
                      : kpi.value}{kpi.suffix}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">{kpi.changeLabel}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <ChartContainer title="核心指标趋势" subtitle="近12个月 MRR / MAU / 流失率 变化">
                <LineChart
                  data={{
                    labels: trendData[0].data.map(d => d.date),
                    series: trendData.slice(0, 3).map(s => ({
                      name: s.name,
                      data: s.name.includes('%') ? s.data.map(d => d.value) : s.data.map(d => Math.round(d.value)),
                      color: s.color,
                    })),
                  }}
                  height={320}
                />
              </ChartContainer>
            </div>
            <div>
              <ChartContainer title="客户层级收入占比" subtitle="按企业版/专业版/基础版">
                <PieChart
                  data={{
                    labels: revenueByTier.map(d => d.name),
                    series: [{ name: '收入(万)', data: revenueByTier.map(d => Math.round(d.value / 10000)) }],
                  }}
                  height={320}
                />
              </ChartContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartContainer
              title="区域收入分布"
              subtitle="点击图表可下钻至城市级数据"
              action={
                <button
                  onClick={togglePanel}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  <Filter className="w-3 h-3" />
                  筛选
                  <ChevronDown className="w-3 h-3" />
                </button>
              }
            >
              <BarChart
                data={{
                  labels: revenueByRegion.map(d => d.name),
                  series: [{ name: '收入(万)', data: revenueByRegion.map(d => d.value / 10000), color: '#7c3aed' }],
                }}
                height={300}
                onBarClick={handleRegionClick}
              />
            </ChartContainer>
            <ChartContainer
              title="渠道流失率对比"
              subtitle="自然流量渠道流失率最低，直接访问最高"
            >
              <BarChart
                horizontal
                data={{
                  labels: churnData.byChannel.map(d => d.name),
                  series: [{ name: '流失率(%)', data: churnData.byChannel.map(d => d.rate), color: '#ef4444' }],
                }}
                height={300}
              />
            </ChartContainer>
          </div>

          {/* Charts Row 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartContainer title="渠道收入分布" subtitle="各获客渠道贡献的收入占比">
              <BarChart
                data={{
                  labels: revenueByChannel.map(d => d.name),
                  series: [{ name: '收入(万)', data: revenueByChannel.map(d => Math.round(d.value / 10000)), color: '#3b82f6' }],
                }}
                height={300}
              />
            </ChartContainer>
            <ChartContainer title="流失原因分析" subtitle="按流失原因分类统计">
              <PieChart
                data={{
                  labels: churnData.byReason.map(d => d.name),
                  series: [{ name: '占比(%)', data: churnData.byReason.map(d => d.value) }],
                }}
                height={300}
              />
            </ChartContainer>
          </div>
        </div>
      </div>

      {/* Drill Panel (slide-in) */}
      <DrillPanel />
    </div>
  );
}
