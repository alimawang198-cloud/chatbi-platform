import { X, TrendingUp, TrendingDown, Minus, BarChart3, Lightbulb, Target } from 'lucide-react';
import type { KpiCardData } from '../../types';
import { aiAnalysisMap, type AIAnalysisData } from '../../mock/aiAnalysis';
import { formatCurrency, formatNumber } from '../../utils/format';
import { AutoChart } from '../charts/AutoChart';

interface AIAnalysisDrawerProps {
  open: boolean;
  onClose: () => void;
  kpi: KpiCardData | null;
}

export function AIAnalysisDrawer({ open, onClose, kpi }: AIAnalysisDrawerProps) {
  if (!open || !kpi) return null;

  const analysis = aiAnalysisMap[kpi.id];
  if (!analysis) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-[480px] bg-white h-full shadow-2xl animate-slide-up overflow-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <h3 className="font-semibold text-gray-800">AI 深度分析</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 text-center text-slate-400 text-sm">暂无该指标的深度分析数据</div>
        </div>
      </div>
    );
  }

  const formatValue = (v: number) => {
    if (kpi.prefix === '¥') return formatCurrency(v);
    if (kpi.suffix === '%') return v.toFixed(1);
    if (kpi.suffix === '人') return formatNumber(v);
    return formatNumber(v);
  };

  const trendIcon = kpi.trend === 'up' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> :
    kpi.trend === 'down' ? <TrendingDown className="w-5 h-5 text-red-500" /> :
    <Minus className="w-5 h-5 text-slate-400" />;

  const changeColor = kpi.change > 0 ? 'text-emerald-600' : kpi.change < 0 ? 'text-red-600' : 'text-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[480px] bg-white h-full shadow-2xl animate-slide-up overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-slate-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">AI 深度分析</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* KPI summary */}
          <div className="px-6 pb-5">
            <p className="text-xs text-slate-400 mb-1">{kpi.title}</p>
            <div className="flex items-baseline gap-2">
              {kpi.prefix && <span className="text-lg text-slate-400">{kpi.prefix}</span>}
              <span className="text-3xl font-bold text-gray-800">{formatValue(kpi.value)}</span>
              {kpi.suffix && <span className="text-lg text-slate-400">{kpi.suffix}</span>}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              {trendIcon}
              <span className={`text-sm font-medium ${changeColor}`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </span>
              <span className="text-xs text-slate-400">{kpi.changeLabel}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Trend Chart */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              趋势分析
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <AutoChart
                data={{
                  labels: analysis.trend.labels,
                  series: [{
                    name: kpi.title,
                    data: analysis.trend.data,
                    color: kpi.trend === 'up' ? '#10b981' : kpi.trend === 'down' ? '#ef4444' : '#6366f1',
                  }],
                }}
                type="line"
                height={240}
              />
            </div>
          </section>

          {/* Breakdown Chart */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              构成分析
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <AutoChart
                data={{
                  labels: analysis.breakdown.labels,
                  series: [{
                    name: `${analysis.breakdown.unit}`,
                    data: analysis.breakdown.values,
                  }],
                }}
                type="bar"
                height={240}
              />
            </div>
          </section>

          <div className="h-12" />

          {/* AI Insights */}
          <section>
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              AI 洞察
            </h4>
            <div className="space-y-2.5">
              {analysis.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 bg-amber-50/60 rounded-lg border border-amber-100">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendation */}
          <section className="pb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              行动建议
            </h4>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <p className="text-xs text-emerald-800 leading-relaxed">{analysis.recommendation}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
