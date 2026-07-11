import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { useAuthStore } from '../../store/authStore';
import { roleMeta } from '../../utils/constants';
import { KpiGrid } from '../../components/dashboard/KpiGrid';
import { AIAnalysisDrawer } from '../../components/dashboard/AIAnalysisDrawer';
import { TimeRangeSelector } from '../../components/dashboard/TimeRangeSelector';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';
import { revenueByChannel, revenueByRegion, revenueByTier } from '../../mock/revenue';
import { trendData } from '../../mock/trends';
import type { KpiCardData } from '../../types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { timeRange, setTimeRange, kpiData: kpis, isLoading, fetchDashboard } = useDashboardStore();
  const activeRole = useAuthStore(s => s.activeRole);
  const [aiKpi, setAiKpi] = useState<KpiCardData | null>(null);

  useEffect(() => {
    fetchDashboard(activeRole);
  }, [activeRole]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-80 col-span-2 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {roleMeta[activeRole]?.label}工作台
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            最后更新于 {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <Button size="sm" onClick={() => navigate('/chatbi')}>
            智能问答
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Alert banner */}
      <Card className="bg-amber-50/60 border-amber-200 flex items-center gap-3 px-4 py-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span className="text-sm text-amber-700">
          整体经营数据平稳向好，但<span className="font-semibold">成都区域</span>收入增速低于全国平均，<span className="font-semibold">基础版客户流失率</span>偏高需关注。
        </span>
        <button
          onClick={() => navigate('/analyze')}
          className="text-xs text-amber-600 hover:text-amber-800 underline cursor-pointer ml-auto shrink-0"
        >
          查看详情
        </button>
      </Card>

      {/* KPI Grid */}
      <KpiGrid data={kpis} onAIAnalysis={setAiKpi} />

      {/* Main charts: Trends (2/3) + Radar/Summary (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ChartContainer title="核心指标趋势" subtitle="近12个月关键指标变化">
            <LineChart
              data={{
                labels: trendData[0].data.map(d => d.date),
                series: trendData.slice(0, 4).map(s => ({
                  name: s.name,
                  data: s.name.includes('%') ? s.data.map(d => d.value) : s.data.map(d => Math.round(d.value)),
                  color: s.color,
                })),
              }}
              height={340}
            />
          </ChartContainer>
        </div>
        <div>
          <ChartContainer title="收入健康度" subtitle="关键比率一览">
            <div className="space-y-4 py-2">
              <MetricRatio label="LTV/CAC比率" value={6.7} target={3} unit="倍" status="good" />
              <MetricRatio label="NRR净留存率" value={112} target={100} unit="%" status="good" />
              <MetricRatio label="毛利率" value={78} target={70} unit="%" status="good" />
              <MetricRatio label="流失率" value={3.2} target={5} unit="%" status="warn" invert />
              <MetricRatio label="增购率" value={18.5} target={15} unit="%" status="good" />
              <MetricRatio label="客户满意度" value={4.2} target={4} unit="/5" status="good" />
            </div>
          </ChartContainer>
        </div>
      </div>

      {/* Bottom breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartContainer title="收入构成" subtitle="按客户层级">
          <PieChart
            data={{
              labels: revenueByTier.map(d => d.name),
              series: [{ name: '收入(万)', data: revenueByTier.map(d => Math.round(d.value / 10000)) }],
            }}
            height={260}
          />
        </ChartContainer>
        <ChartContainer title="渠道收入分布">
          <BarChart
            data={{
              labels: revenueByChannel.map(d => d.name),
              series: [{ name: '收入(万)', data: revenueByChannel.map(d => Math.round(d.value / 10000)), color: '#6366f1' }],
            }}
            height={260}
          />
        </ChartContainer>
        <ChartContainer title="区域收入排名">
          <BarChart
            horizontal
            data={{
              labels: revenueByRegion.map(d => d.name),
              series: [{ name: '收入(万)', data: revenueByRegion.map(d => Math.round(d.value / 10000)), color: '#8b5cf6' }],
            }}
            height={260}
          />
        </ChartContainer>
      </div>

      {/* AI Analysis Drawer */}
      <AIAnalysisDrawer
        open={!!aiKpi}
        onClose={() => setAiKpi(null)}
        kpi={aiKpi}
      />
    </div>
  );
}

function MetricRatio({ label, value, target, unit, status, invert }: {
  label: string; value: number; target: number; unit: string; status: 'good' | 'warn' | 'bad'; invert?: boolean;
}) {
  const isGood = invert ? value < target : value >= target;
  const barColor = status === 'good' ? 'bg-emerald-500' : status === 'warn' ? 'bg-amber-500' : 'bg-red-500';
  const barWidth = Math.min((value / (target * 2)) * 100, 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700">
          {value}{unit}
          <Badge variant={isGood ? 'success' : 'warning'} size="sm" className="ml-1">
            {isGood ? '健康' : '关注'}
          </Badge>
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${barWidth}%` }} />
      </div>
      <p className="text-[10px] text-gray-300 mt-0.5">基准：{target}{unit}</p>
    </div>
  );
}
