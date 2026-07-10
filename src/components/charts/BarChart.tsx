import { useState, useEffect } from 'react';
import type { ChartData } from '../../types';

interface BarChartProps {
  data: ChartData;
  horizontal?: boolean;
  title?: string;
  height?: number;
  onBarClick?: (label: string, index: number) => void;
}

const palette = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function formatVal(v: number): string {
  if (v >= 10000) return (v / 10000).toFixed(1) + '万';
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return v.toLocaleString();
}

export function BarChart({ data, horizontal = false, title, height = 300, onBarClick }: BarChartProps) {
  if (horizontal) {
    return <HorizontalBarChart data={data} title={title} height={height} onBarClick={onBarClick} />;
  }

  return <VerticalBarChart data={data} title={title} height={height} onBarClick={onBarClick} />;
}

function VerticalBarChart({ data, title, height, onBarClick }: { data: ChartData; title?: string; height: number; onBarClick?: (label: string, index: number) => void }) {
  const [hoveredBar, setHoveredBar] = useState<{ series: number; index: number } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const { labels, series } = data;
  const allValues = series.flatMap(s => s.data);
  const maxVal = Math.max(...allValues, 1);
  const yMax = Math.ceil(maxVal * 1.15);
  const gridLines = 4;
  const step = yMax / gridLines;

  const barGroupWidth = Math.max(36, Math.min(56, (series.length > 1 ? 48 : 52)));

  // Truncate long labels
  const truncate = (s: string, max = 5) => s.length > max ? s.slice(0, max) + '…' : s;

  return (
    <div className="w-full select-none" style={{ height }}>
      <div className="flex flex-col h-full">
        {/* Legend */}
        {series.length > 1 && (
          <div className="flex items-center justify-center gap-6 mb-2">
            {series.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: s.color || palette[i % palette.length] }}
                />
                <span className="text-[11px] text-slate-500">{s.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="flex-1 relative flex">
          {/* Grid + Y labels */}
          <div className="absolute inset-0 flex">
            {/* Y axis labels */}
            <div className="w-10 shrink-0 flex flex-col justify-between pb-5 pointer-events-none">
              {Array.from({ length: gridLines + 1 }).map((_, i) => (
                <span key={i} className="text-[10px] text-slate-400 leading-none">
                  {formatVal(Math.round(yMax - i * step))}
                </span>
              ))}
            </div>
            {/* Grid lines */}
            <div className="flex-1 flex flex-col justify-between pb-5">
              {Array.from({ length: gridLines + 1 }).map((_, i) => (
                <div key={i} className="border-t border-slate-100 w-full" />
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="flex-1 flex items-end justify-around pb-5 ml-10">
            {labels.map((label, colIdx) => (
              <div
                key={label}
                className="flex items-end justify-center gap-[3px] relative h-full"
                style={{ width: series.length > 1 ? series.length * 30 + (series.length - 1) * 3 : barGroupWidth }}
              >
                {series.map((s, seriesIdx) => {
                  const val = s.data[colIdx] ?? 0;
                  const barH = Math.max((val / yMax) * 100, val > 0 ? 1.5 : 0);
                  const color = s.color || palette[seriesIdx % palette.length];
                  const isHovered = hoveredBar?.series === seriesIdx && hoveredBar?.index === colIdx;

                  return (
                    <div
                      key={s.name}
                      className="relative flex flex-col items-center justify-end cursor-pointer"
                      style={{ height: '100%', width: series.length > 1 ? 28 : barGroupWidth - 6 }}
                      onMouseEnter={() => setHoveredBar({ series: seriesIdx, index: colIdx })}
                      onMouseLeave={() => setHoveredBar(null)}
                      onClick={() => onBarClick?.(label, colIdx)}
                    >
                      {/* Value label */}
                      <span
                        className="text-[10px] font-semibold text-slate-700 mb-0.5 transition-all duration-150 pointer-events-none whitespace-nowrap"
                        style={{
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
                        }}
                      >
                        {formatVal(val)}
                      </span>

                      {/* Bar */}
                      <div
                        className="w-full rounded-t-sm transition-all duration-300 ease-out"
                        style={{
                          height: visible ? `${barH}%` : '0%',
                          minHeight: val > 0 ? 3 : 0,
                          backgroundColor: color,
                          opacity: hoveredBar && !isHovered ? 0.35 : 1,
                          boxShadow: isHovered
                            ? `0 0 16px ${color}44, 0 4px 8px ${color}33`
                            : 'none',
                          transform: isHovered ? 'scaleX(1.06)' : 'scaleX(1)',
                          filter: isHovered ? 'brightness(1.05)' : 'none',
                        }}
                      />
                    </div>
                  );
                })}

                {/* X label */}
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-full flex justify-center">
                  <span className="text-[10px] text-slate-400 whitespace-nowrap leading-none" title={label}>
                    {truncate(label, 6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBarChart({ data, title, height, onBarClick }: { data: ChartData; title?: string; height: number; onBarClick?: (label: string, index: number) => void }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => { if (!cancelled) setVisible(true); }, 50);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  const { labels, series } = data;
  const s = series[0];
  const maxVal = Math.max(...s.data, 1);
  const barH = Math.max(24, Math.min(40, (height - 50) / labels.length - 6));

  return (
    <div className="w-full select-none" style={{ height }}>
      <div className="flex flex-col h-full justify-center gap-[6px]">
        {labels.map((label, i) => {
          const val = s.data[i] ?? 0;
          const pct = (val / maxVal) * 100;
          const color = s.color || palette[i % palette.length];
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={label}
              className="flex items-center gap-3 group cursor-pointer transition-opacity duration-200"
              style={{ height: barH, opacity: hoveredIdx !== null && !isHovered ? 0.4 : 1 }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onBarClick?.(label, i)}
            >
              {/* Label */}
              <span className="text-[11px] text-slate-500 w-16 shrink-0 text-right truncate leading-tight" title={label}>
                {label}
              </span>

              {/* Bar track */}
              <div className="flex-1 h-full bg-slate-100 rounded-r-sm relative overflow-hidden">
                <div
                  className="h-full rounded-r-sm transition-all duration-500 ease-out"
                  style={{
                    width: visible ? `${Math.max(pct, 0.5)}%` : '0%',
                    backgroundColor: color,
                    boxShadow: isHovered ? `0 0 12px ${color}55` : undefined,
                    filter: isHovered ? 'brightness(1.08)' : undefined,
                  }}
                />
              </div>

              {/* Value */}
              <span
                className="text-[11px] font-semibold text-slate-600 w-14 shrink-0 tabular-nums transition-opacity duration-150"
                style={{ opacity: isHovered ? 1 : 0.5 }}
              >
                {val.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
