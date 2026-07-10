import ReactECharts from 'echarts-for-react';
import type { ChartData } from '../../types';
import { buildLineOptions } from '../../hooks/useChartOptions';

interface LineChartProps {
  data: ChartData;
  title?: string;
  height?: number;
}

export function LineChart({ data, title, height = 300 }: LineChartProps) {
  return (
    <ReactECharts
      option={buildLineOptions(data, title)}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
