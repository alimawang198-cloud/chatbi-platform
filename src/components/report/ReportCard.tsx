import { FileText, Clock, User as UserIcon } from 'lucide-react';
import type { Report } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer hover:border-indigo-200" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{report.title}</h3>
            <Badge variant={report.status === 'draft' ? 'warning' : 'success'}>
              {report.status === 'draft' ? '草稿' : '已发布'}
            </Badge>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{report.summary}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              {report.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {report.createdAt}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
