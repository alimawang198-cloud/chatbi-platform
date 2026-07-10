import type { ClarificationOption } from '../../types';
import { HelpCircle, TrendingUp, Clock, Filter, Layers } from 'lucide-react';

interface ClarificationCardProps {
  options: ClarificationOption[];
  onSelect: (option: ClarificationOption) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  metric: <TrendingUp className="w-4 h-4" />,
  time_range: <Clock className="w-4 h-4" />,
  dimension: <Layers className="w-4 h-4" />,
  filter: <Filter className="w-4 h-4" />,
};

export function ClarificationCard({ options, onSelect }: ClarificationCardProps) {
  const type = options[0]?.type || 'metric';
  const labelMap: Record<string, string> = {
    metric: '您是指以下哪个指标？',
    time_range: '您想查看哪个时间范围？',
    dimension: '您想按哪个维度查看？',
    filter: '请选择筛选条件',
  };

  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 animate-slide-up">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-indigo-500" />
        <span className="text-sm font-medium text-indigo-700">{labelMap[type] || '请补充以下信息'}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm text-indigo-700 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all cursor-pointer shadow-sm group"
          >
            <span className="group-hover:text-white text-indigo-400">{iconMap[opt.type] || iconMap.metric}</span>
            <div className="text-left">
              <div className="font-medium">{opt.label}</div>
              <div className="text-[10px] text-gray-400 group-hover:text-indigo-200">{opt.description}</div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">或者您可以补充更具体的问题，重新输入即可</p>
    </div>
  );
}
