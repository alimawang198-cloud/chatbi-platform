import ReactECharts from 'echarts-for-react';
import type { ChartData } from '../../types';
import { buildPieOptions } from '../../hooks/useChartOptions';

interface PieChartProps {
  data: ChartData;
  title?: string;
  height?: number;
}

export function PieChart({ data, title, height = 300 }: PieChartProps) {
  return (
    <ReactECharts
      option={buildPieOptions(data, title)}
      style={{ height: `${height}px`, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
