import type { AttributionResult } from '../../types';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface AttributionBlockProps {
  attribution: AttributionResult;
}

export function AttributionBlock({ attribution }: AttributionBlockProps) {
  return (
    <div className="mt-3 bg-amber-50/50 border border-amber-100 rounded-xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-amber-100/50 px-4 py-3 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-600" />
        <span className="text-sm font-semibold text-amber-800">归因分析</span>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-amber-100/50">
        <p className="text-sm text-amber-800 leading-relaxed">{attribution.summary}</p>
      </div>

      {/* Factors */}
      <div className="px-4 py-3 space-y-3">
        {attribution.factors.map((factor, i) => (
          <div key={i} className="relative pl-4">
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-400" />
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-800">{factor.description}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                贡献度 {factor.contribution}%
              </span>
            </div>
            {factor.details.map((detail, j) => (
              <div key={j} className="flex items-start gap-1.5 ml-2 mt-1">
                <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-500 leading-relaxed">{detail}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="bg-white/60 px-4 py-3 border-t border-amber-100/50">
        <p className="text-xs font-medium text-amber-700 mb-2">改进建议</p>
        {attribution.suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-1.5 mt-1">
            <span className="text-xs text-amber-500 font-bold shrink-0">{i + 1}.</span>
            <span className="text-xs text-gray-600 leading-relaxed">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
