import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import type { KpiCardData } from '../../types';
import { Card } from '../common/Card';
import { formatCurrency, formatNumber, formatChange } from '../../utils/format';

interface KpiCardProps {
  data: KpiCardData;
  onAIAnalysis?: (kpi: KpiCardData) => void;
}

export function KpiCard({ data, onAIAnalysis }: KpiCardProps) {
  const formatValue = (v: number) => {
    if (data.prefix === '¥') return formatCurrency(v);
    if (data.suffix === '%') return v.toFixed(1);
    if (data.suffix === '人') return formatNumber(v);
    return formatNumber(v);
  };

  const trendIcon = data.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> :
    data.trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-500" /> :
    <Minus className="w-4 h-4 text-gray-400" />;

  const changeColor = data.change > 0 ? 'text-emerald-600' : data.change < 0 ? 'text-red-600' : 'text-gray-400';

  return (
    <Card className="hover:shadow-md transition-shadow cursor-default animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-400 font-medium truncate">{data.title}</p>
        {trendIcon}
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        {data.prefix && <span className="text-sm text-gray-400">{data.prefix}</span>}
        <span className="text-2xl font-bold text-gray-800">{formatValue(data.value)}</span>
        {data.suffix && <span className="text-sm text-gray-400">{data.suffix}</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${changeColor}`}>
          {formatChange(data.change)}
        </span>
        <span className="text-xs text-gray-400">{data.changeLabel}</span>
      </div>
      {/* Mini sparkline */}
      <div className="mt-3 flex items-end gap-0.5 h-8">
        {data.sparklineData.map((v, i) => {
          const max = Math.max(...data.sparklineData);
          const h = (v / max) * 100;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: `${Math.max(h, 8)}%`,
                backgroundColor: data.trend === 'up' ? '#10b981' : data.trend === 'down' ? '#ef4444' : '#94a3b8',
                opacity: 0.4 + (i / data.sparklineData.length) * 0.6,
              }}
            />
          );
        })}
      </div>

      {/* AI Analysis button */}
      <button
        onClick={(e) => { e.stopPropagation(); onAIAnalysis?.(data); }}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-indigo-500 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors cursor-pointer"
      >
        <Sparkles className="w-3 h-3" />
        AI 分析
      </button>
    </Card>
  );
}
