import type { Report } from '../../types';
import { AutoChart } from '../charts/AutoChart';
import { ChartContainer } from '../charts/ChartContainer';
import { Badge } from '../common/Badge';
import { Calendar, User as UserIcon, Clock } from 'lucide-react';

interface ReportPreviewProps {
  report: Report;
}

export function ReportPreview({ report }: ReportPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-800">{report.title}</h1>
          <Badge variant={report.status === 'draft' ? 'warning' : 'success'}>
            {report.status === 'draft' ? '草稿' : '已发布'}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{report.summary}</p>
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-gray-400">
          <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{report.author}</span>
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />创建：{report.createdAt}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />更新：{report.updatedAt}</span>
          <span className="text-slate-300">|</span>
          <span>{report.sections.length} 个章节</span>
        </div>
      </div>

      {/* Sections */}
      {report.sections.map((section, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <h3 className="font-semibold text-gray-700">{section.title}</h3>
          </div>
          {section.type === 'text' && (
            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
              {section.content.split('。').filter(Boolean).map((sentence, j) => (
                <p key={j}>{sentence}。</p>
              ))}
            </div>
          )}
          {section.type === 'strategy' && (
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5">
              <p className="text-xs text-indigo-600 font-semibold mb-3 uppercase tracking-wide">AI策略建议</p>
              <div className="space-y-2">
                {section.content.split('\n').filter(Boolean).map((line, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-indigo-400 mt-0.5 shrink-0">{j + 1}.</span>
                    <p className="text-sm text-gray-700 leading-relaxed">{line.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {section.type === 'chart' && section.chartData && section.chartType && (
            <ChartContainer>
              <AutoChart data={section.chartData} type={section.chartType} height={320} />
            </ChartContainer>
          )}
        </div>
      ))}
    </div>
  );
}
