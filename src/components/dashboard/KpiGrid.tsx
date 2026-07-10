import type { KpiCardData } from '../../types';
import { KpiCard } from './KpiCard';

interface KpiGridProps {
  data: KpiCardData[];
}

export function KpiGrid({ data }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {data.map(kpi => (
        <KpiCard key={kpi.id} data={kpi} />
      ))}
    </div>
  );
}
