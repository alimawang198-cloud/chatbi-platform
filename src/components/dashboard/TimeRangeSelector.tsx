import { cn } from '../../utils/cn';
import type { TimeRange } from '../../types';

const ranges: { value: TimeRange; label: string }[] = [
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季' },
  { value: 'year', label: '本年' },
];

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
      {ranges.map(r => (
        <button
          key={r.value}
          onClick={() => onChange(r.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
            value === r.value
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
