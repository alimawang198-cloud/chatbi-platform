import type { ChartData, ChartType } from '../types';

const fontFamily = 'PingFang SC, Microsoft YaHei, sans-serif';
const gridColor = '#f1f5f9';
const textColor = '#94a3b8';
const tooltipBg = '#ffffff';
const tooltipBorder = '#e2e8f0';

// Modern color palette
const palette = [
  '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6', '#f97316',
];

const gradientMap: Record<string, [string, string]> = {
  '#7c3aed': ['rgba(124,58,237,0.25)', 'rgba(124,58,237,0.02)'],
  '#3b82f6': ['rgba(59,130,246,0.25)', 'rgba(59,130,246,0.02)'],
  '#10b981': ['rgba(16,185,129,0.25)', 'rgba(16,185,129,0.02)'],
  '#f59e0b': ['rgba(245,158,11,0.25)', 'rgba(245,158,11,0.02)'],
  '#ef4444': ['rgba(239,68,68,0.25)', 'rgba(239,68,68,0.02)'],
  '#8b5cf6': ['rgba(139,92,246,0.25)', 'rgba(139,92,246,0.02)'],
  '#06b6d4': ['rgba(6,182,212,0.25)', 'rgba(6,182,212,0.02)'],
  '#ec4899': ['rgba(236,72,153,0.25)', 'rgba(236,72,153,0.02)'],
  '#14b8a6': ['rgba(20,184,166,0.25)', 'rgba(20,184,166,0.02)'],
  '#f97316': ['rgba(249,115,22,0.25)', 'rgba(249,115,22,0.02)'],
};

function getGradient(color: string): [string, string] {
  return gradientMap[color] || ['rgba(99,102,241,0.2)', 'rgba(99,102,241,0.02)'];
}

function shadow(color: string, blur = 12): string {
  return `rgba(${hexToRgb(color)},0.35)`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function baseGrid() {
  return {
    top: 16, right: 16, bottom: 40, left: 16,
    containLabel: true,
  };
}

function baseTooltip() {
  return {
    trigger: 'axis' as const,
    backgroundColor: tooltipBg,
    borderColor: tooltipBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: [10, 14],
    shadowBlur: 16,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffsetY: 4,
    textStyle: { color: '#334155', fontSize: 12, fontFamily },
    axisPointer: {
      type: 'shadow' as const,
      shadowStyle: { color: 'rgba(0,0,0,0.03)' },
    },
  };
}

export function buildLineOptions(data: ChartData, title?: string) {
  return {
    title: title ? {
      text: title,
      textStyle: { color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily },
      left: 'center',
    } : undefined,
    tooltip: baseTooltip(),
    legend: data.series.length > 1 ? {
      data: data.series.map(s => s.name),
      bottom: 0,
      icon: 'roundRect' as const,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: textColor, fontSize: 11, fontFamily },
    } : undefined,
    grid: { top: 16, right: 16, bottom: 24, left: 16, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: data.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 11, fontFamily, margin: 12 },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' as const } },
      axisLabel: { color: textColor, fontSize: 11, fontFamily, margin: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: data.series.map((s, i) => {
      const c = s.color || palette[i % palette.length];
      const [topGrad, bottomGrad] = getGradient(c);
      return {
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: true,
        symbol: 'circle' as const,
        symbolSize: 6,
        showSymbol: false,
        emphasis: { symbolSize: 8, focus: 'series' as const },
        lineStyle: { color: c, width: 2.5, cap: 'round' as const, shadowBlur: 8, shadowColor: shadow(c) },
        itemStyle: { color: c, borderColor: '#fff', borderWidth: 2 },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: topGrad },
              { offset: 1, color: bottomGrad },
            ],
          },
        },
      };
    }),
  };
}

export function buildBarOptions(data: ChartData, horizontal: boolean = false, title?: string) {
  const barColors = data.series.map((s, i) => s.color || palette[i % palette.length]);

  const baseSeries = data.series.map((s, i) => {
    const c = barColors[i];
    return {
      name: s.name,
      type: 'bar' as const,
      data: s.data.map(v => ({
        value: v,
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: c },
              { offset: 1, color: adjustBrightness(c, -0.08) },
            ],
          },
          borderRadius: horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0],
          shadowBlur: 8,
          shadowColor: shadow(c, 8),
          shadowOffsetY: 2,
        },
      })),
      barWidth: data.series.length > 1 ? '40%' : '35%',
      barGap: '30%',
      emphasis: {
        itemStyle: { shadowBlur: 16, shadowColor: shadow(c, 16) },
      },
    };
  });

  if (horizontal) {
    return {
      title: title ? {
        text: title,
        textStyle: { color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily },
        left: 'center',
      } : undefined,
      tooltip: { ...baseTooltip(), trigger: 'axis' as const },
      legend: data.series.length > 1 ? {
        data: data.series.map(s => s.name),
        bottom: 0,
        icon: 'roundRect' as const,
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { color: textColor, fontSize: 11, fontFamily },
      } : undefined,
      grid: { top: 16, right: 30, bottom: 24, left: 16, containLabel: true },
      xAxis: {
        type: 'value' as const,
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' as const } },
        axisLabel: { color: textColor, fontSize: 11, fontFamily, margin: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category' as const,
        data: data.labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#475569', fontSize: 12, fontFamily, margin: 12 },
      },
      series: baseSeries,
    };
  }

  return {
    title: title ? {
      text: title,
      textStyle: { color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily },
      left: 'center',
    } : undefined,
    tooltip: baseTooltip(),
    legend: data.series.length > 1 ? {
      data: data.series.map(s => s.name),
      bottom: 0,
      icon: 'roundRect' as const,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: textColor, fontSize: 11, fontFamily },
    } : undefined,
    grid: { top: 16, right: 16, bottom: 24, left: 16, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: data.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 11, fontFamily, margin: 12 },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: gridColor, type: 'dashed' as const } },
      axisLabel: { color: textColor, fontSize: 11, fontFamily, margin: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: baseSeries,
  };
}

export function buildPieOptions(data: ChartData, title?: string) {
  const values = data.series[0]?.data || [];

  return {
    title: title ? {
      text: title,
      textStyle: { color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily },
      left: 'center',
    } : undefined,
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      borderRadius: 8,
      padding: [10, 14],
      shadowBlur: 16,
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffsetY: 4,
      textStyle: { color: '#334155', fontSize: 12, fontFamily },
      formatter: '{b}: {c} ({d}%)' as const,
    },
    legend: {
      data: data.labels,
      bottom: 0,
      icon: 'roundRect' as const,
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: textColor, fontSize: 11, fontFamily },
    },
    series: [{
      type: 'pie' as const,
      radius: ['50%', '78%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 3,
        shadowBlur: 12,
        shadowColor: 'rgba(0,0,0,0.06)',
        shadowOffsetY: 2,
      },
      label: { show: false },
      emphasis: {
        scaleSize: 8,
        label: { show: true, fontSize: 14, fontFamily, fontWeight: 'bold' as const },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.12)' },
      },
      data: data.labels.map((name, i) => ({
        name,
        value: values[i],
        itemStyle: { color: palette[i % palette.length] },
      })),
    }],
  };
}

export function buildFunnelOptions(data: ChartData, title?: string) {
  const values = data.series[0]?.data || [];

  return {
    title: title ? {
      text: title,
      textStyle: { color: '#1e293b', fontSize: 14, fontWeight: 600, fontFamily },
      left: 'center',
    } : undefined,
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      borderRadius: 8,
      padding: [10, 14],
      shadowBlur: 16,
      shadowColor: 'rgba(0,0,0,0.08)',
      shadowOffsetY: 4,
      textStyle: { color: '#334155', fontSize: 12, fontFamily },
      formatter: '{b}: {c}' as const,
    },
    series: [{
      type: 'funnel' as const,
      left: '15%',
      right: '15%',
      top: 40,
      bottom: 40,
      minSize: '18%',
      maxSize: '100%',
      sort: 'descending' as const,
      gap: 6,
      label: {
        show: true,
        position: 'inside' as const,
        fontSize: 13,
        fontFamily,
        fontWeight: 500,
        color: '#fff',
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 3,
        borderRadius: 4,
      },
      data: data.labels.map((name, i) => ({
        name,
        value: values[i],
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: palette[i % palette.length] },
              { offset: 1, color: adjustBrightness(palette[i % palette.length], -0.1) },
            ],
          },
        },
      })),
    }],
  };
}

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + Math.round(amount * 255)));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + Math.round(amount * 255)));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + Math.round(amount * 255)));
  return `rgb(${r},${g},${b})`;
}

export function buildChartOptions(data: ChartData, type: ChartType, title?: string) {
  switch (type) {
    case 'line': return buildLineOptions(data, title);
    case 'bar': return buildBarOptions(data, false, title);
    case 'horizontal-bar': return buildBarOptions(data, true, title);
    case 'pie': return buildPieOptions(data, title);
    case 'funnel': return buildFunnelOptions(data, title);
    default: return buildBarOptions(data, false, title);
  }
}
