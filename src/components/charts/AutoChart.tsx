import type { ChartData, ChartType } from '../../types';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { FunnelChart } from './FunnelChart';

interface AutoChartProps {
  data: ChartData;
  type: ChartType;
  title?: string;
  height?: number;
}

export function AutoChart({ data, type, title, height }: AutoChartProps) {
  switch (type) {
    case 'line': return <LineChart data={data} title={title} height={height} />;
    case 'bar': return <BarChart data={data} title={title} height={height} />;
    case 'horizontal-bar': return <BarChart data={data} horizontal title={title} height={height} />;
    case 'pie': return <PieChart data={data} title={title} height={height} />;
    case 'funnel': return <FunnelChart data={data} title={title} height={height} />;
    default: return <BarChart data={data} title={title} height={height} />;
  }
}
