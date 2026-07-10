import { X, ArrowLeft, Layers } from 'lucide-react';
import { useDrillStore } from '../../store/drillStore';
import { AutoChart } from '../charts/AutoChart';
import { ChartContainer } from '../charts/ChartContainer';
import { cn } from '../../utils/cn';

export function DrillPanel() {
  const { isOpen, closePanel, dimensions, activeDimension, drillPath, chartData, setDimension, drillDown, rollUp, reset } = useDrillStore();
  const dim = dimensions.find(d => d.id === activeDimension);

  if (!isOpen) return null;

  return (
    <div className="w-[420px] border-l border-gray-200 bg-white flex flex-col h-full shrink-0 animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
        <h3 className="font-semibold text-gray-800 text-sm">多维下钻分析</h3>
        <button onClick={closePanel} className="p-1 rounded hover:bg-gray-100 text-gray-400 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dimension Selector */}
      <div className="p-4 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500">分析维度</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dimensions.map(d => (
            <button
              key={d.id}
              onClick={() => setDimension(d.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer',
                activeDimension === d.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      {drillPath.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-50 flex items-center gap-1 text-xs shrink-0">
          <button onClick={() => reset()} className="text-indigo-500 hover:underline cursor-pointer">全国</button>
          {drillPath.map((step, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-gray-300">&gt;</span>
              <button
                onClick={() => rollUp(drillPath.length - i)}
                className="text-indigo-500 hover:underline cursor-pointer"
              >
                {step.label}
              </button>
            </span>
          ))}
          <button onClick={() => rollUp()} className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Drill Values */}
      <div className="p-4 border-b border-gray-50 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {dim?.values.map(v => (
            <button
              key={v.id}
              onClick={() => v.children ? null : drillDown(activeDimension, v.id, v.label)}
              className={cn(
                'px-2 py-1 rounded text-xs transition-all cursor-pointer',
                drillPath.some(p => p.value === v.id)
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:text-indigo-500'
              )}
            >
              {v.label}
              {v.children && <span className="text-gray-300 ml-1">&gt;</span>}
            </button>
          ))}
        </div>
        {/* Child values if any active */}
        {dim?.values.find(v => drillPath.some(p => p.value === v.id))?.children && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {dim?.values.find(v => drillPath.some(p => p.value === v.id))?.children?.map(child => (
              <button
                key={child.id}
                onClick={() => drillDown(activeDimension, child.id, child.label)}
                className="px-2 py-1 rounded text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all cursor-pointer"
              >
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 overflow-auto p-4">
        {chartData && (
          <ChartContainer title={drillPath.length > 0 ? drillPath[drillPath.length - 1].label : '总体概览'}>
            <AutoChart data={chartData} type="bar" height={300} />
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
