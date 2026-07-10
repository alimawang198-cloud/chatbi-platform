import ReactECharts from 'echarts-for-react';
import type { ChartData } from '../../types';
import { buildFunnelOptions } from '../../hooks/useChartOptions';

interface FunnelChartProps {
  data: ChartData;
  title?: string;
  height?: number;
}

export function FunnelChart({ data, title, height = 350 }: FunnelChartProps) {
  return (
    <ReactECharts
      option={buildFunnelOptions(data, title)}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
