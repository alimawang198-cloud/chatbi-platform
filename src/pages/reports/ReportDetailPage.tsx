import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useReportStore } from '../../store/reportStore';
import { ReportPreview } from '../../components/report/ReportPreview';
import { Button } from '../../components/common/Button';

export function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = useReportStore(s => s.reports.find(r => r.id === id));

  if (!report) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">报告未找到</p>
        <Button variant="ghost" onClick={() => navigate('/reports')} className="mt-4">
          返回报告列表
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 px-3 py-1.5 -ml-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        返回报告列表
      </button>
      <ReportPreview report={report} />
    </div>
  );
}
