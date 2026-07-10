import { useState, useMemo } from 'react';
import { Search, X, BarChart3, Hash, Database, Tag, Layers, TrendingUp, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { knowledgeBase } from '../../mock/knowledgeBase';
import type { KnowledgeEntry } from '../../types';
import { cn } from '../../utils/cn';

const chartLabels: Record<string, string> = {
  bar: '柱状图',
  line: '折线图',
  pie: '饼图',
  funnel: '漏斗图',
  scatter: '散点图',
};

const chartIcons: Record<string, string> = {
  bar: '📊',
  line: '📈',
  pie: '🥧',
  funnel: '🔽',
  scatter: '✨',
};

const categoryConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  '研发效能': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'DORA指标': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
  '产品质量': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  '经营数据': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
};

export function SemanticLayerPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [selectedMetric, setSelectedMetric] = useState<KnowledgeEntry | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(knowledgeBase.map(e => e.category));
    return ['全部', ...Array.from(cats)];
  }, []);

  const filtered = useMemo(() => {
    let result = knowledgeBase;
    if (activeCategory !== '全部') {
      result = result.filter(e => e.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.aliases.some(a => a.toLowerCase().includes(q)) ||
        e.definition.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { '全部': knowledgeBase.length };
    knowledgeBase.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="p-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">语义层管理</h1>
        <p className="text-sm text-slate-400 mt-1">管理和维护知识库中的业务指标定义、计算口径和关联关系</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Database className="w-4 h-4" />} label="指标总数" value={knowledgeBase.length} color="indigo" />
        <StatCard icon={<Layers className="w-4 h-4" />} label="分类数" value={categories.length - 1} color="purple" />
        <StatCard icon={<Tag className="w-4 h-4" />} label="关联数据表" value={18} color="emerald" />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="可分析维度" value={12} color="amber" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索指标名称、别名或定义..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {filtered.length < knowledgeBase.length && (
          <span className="text-xs text-slate-400 shrink-0">
            显示 <strong className="text-gray-600">{filtered.length}</strong> / {knowledgeBase.length} 个指标
          </span>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {categories.map(cat => {
          const cfg = cat !== '全部' ? categoryConfig[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2',
                activeCategory === cat
                  ? cfg
                    ? `${cfg.bg} ${cfg.text} ${cfg.border} shadow-sm`
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              )}
            >
              {cfg && <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />}
              {cat}
              <span className={cn('text-xs font-normal', activeCategory === cat ? 'opacity-60' : 'text-slate-400')}>
                {categoryCounts[cat] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="text-sm text-slate-400">未找到匹配的指标</p>
          <p className="text-xs text-slate-300 mt-1">尝试调整搜索词或切换分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(entry => (
            <MetricCard
              key={entry.id}
              entry={entry}
              onClick={() => setSelectedMetric(entry)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedMetric && (
        <MetricDetailModal
          entry={selectedMetric}
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function MetricCard({ entry, onClick }: { entry: KnowledgeEntry; onClick: () => void }) {
  const cfg = categoryConfig[entry.category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer p-5 group flex flex-col h-full"
    >
      {/* Top: Category + ID */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full border', cfg.bg, cfg.text, cfg.border)}>
          {entry.category}
        </span>
        <span className="text-[10px] text-slate-300 font-mono">{entry.id}</span>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {entry.name}
      </h3>

      {/* Definition (truncated) */}
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
        {entry.definition}
      </p>

      {/* Bottom meta */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {chartLabels[entry.defaultChart] || entry.defaultChart}
          </span>
          {entry.unit && (
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3" />
              {entry.unit}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-300">{entry.aliases.length} 别名</span>
      </div>
    </div>
  );
}

function MetricDetailModal({ entry, onClose }: { entry: KnowledgeEntry; onClose: () => void }) {
  const cfg = categoryConfig[entry.category] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={cn('px-6 py-4 border-b flex items-center justify-between', cfg.bg, cfg.border)}>
          <div className="flex items-center gap-3">
            <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full border', cfg.bg, cfg.text, cfg.border)}>
              {entry.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">{entry.id}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{entry.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{entry.definition}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">默认图表</p>
              <p className="text-sm font-medium text-gray-700">{chartIcons[entry.defaultChart]} {chartLabels[entry.defaultChart]}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">单位</p>
              <p className="text-sm font-medium text-gray-700">{entry.unit || '无'}</p>
            </div>
          </div>

          {/* Aliases */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 mb-2">同义别名 ({entry.aliases.length})</h4>
            <div className="flex flex-wrap gap-1.5">
              {entry.aliases.map(a => (
                <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{a}</span>
              ))}
            </div>
          </div>

          {/* Related tables */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 mb-2">关联数据表</h4>
            <div className="flex flex-wrap gap-1.5">
              {entry.relatedTables.map(t => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono">{t}</span>
              ))}
            </div>
          </div>

          {/* Related dimensions */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 mb-2">可分析维度</h4>
            <div className="flex flex-wrap gap-1.5">
              {entry.relatedDimensions.map(d => (
                <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-400">关联指标：{entry.relatedMetrics.map(id => {
            const m = knowledgeBase.find(k => k.id === id);
            return m ? m.name : id;
          }).join('、') || '无'}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
