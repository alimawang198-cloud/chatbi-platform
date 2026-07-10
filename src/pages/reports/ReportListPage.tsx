import { useNavigate } from 'react-router-dom';
import { FileText, TrendingUp } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { ReportCard } from '../../components/report/ReportCard';
import { EmptyState } from '../../components/common/EmptyState';

export function ReportListPage() {
  const navigate = useNavigate();
  const reports = useReportStore(s => s.reports);
  const published = reports.filter(r => r.status === 'published');
  const drafts = reports.filter(r => r.status === 'draft');

  return (
    <div className="p-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">分析报告</h1>
          <p className="text-sm text-gray-400 mt-1">查看和管理所有分析报告，共 {reports.length} 份</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600 font-medium">{published.length} 已发布</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
            <FileText className="w-4 h-4 text-amber-500" />
            <span className="text-amber-600 font-medium">{drafts.length} 草稿</span>
          </div>
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-12 h-12" />}
          title="暂无报告"
          description="在智能问答页面生成报告后，报告会自动存入此处"
        />
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={() => navigate(`/reports/${report.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
