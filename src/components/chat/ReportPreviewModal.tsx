import { X, Download, Copy, Check, Printer } from 'lucide-react';
import { useState } from 'react';
import type { ChatMessage } from '../../types';
import { AutoChart } from '../charts/AutoChart';
import { Button } from '../common/Button';

interface ReportPreviewModalProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export function ReportPreviewModal({ open, onClose, messages }: ReportPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const dataMessages = messages.filter(m => m.role === 'assistant' && !m.isError && !m.isClarification);

  const buildReportText = () => {
    const parts: string[] = [];
    parts.push('# ChatBI 分析报告\n');
    parts.push(`生成时间：${new Date().toLocaleString('zh-CN')}\n`);
    dataMessages.forEach((m, i) => {
      if (m.content) {
        parts.push(`## ${i + 1}. ${m.content.slice(0, 50)}...\n`);
        parts.push(m.content + '\n');
      }
      if (m.strategy) {
        parts.push('### AI洞察\n');
        parts.push(m.strategy + '\n');
      }
      if (m.attribution) {
        parts.push('### 归因分析\n');
        parts.push(m.attribution.summary + '\n');
        m.attribution.factors.forEach((f, j) => {
          parts.push(`- ${f.description} (贡献度 ${f.contribution}%)\n`);
        });
        parts.push('\n### 改进建议\n');
        m.attribution.suggestions.forEach(s => parts.push(`- ${s}\n`));
      }
    });
    return parts.join('\n');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buildReportHTML = () => {
    const parts: string[] = [];
    parts.push(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>ChatBI 分析报告</title>`);
    parts.push(`<style>body{font-family:'PingFang SC',sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#333;line-height:1.8}h1{font-size:24px;border-bottom:2px solid #6366f1;padding-bottom:12px}h2{font-size:18px;color:#6366f1;margin-top:32px}h3{font-size:15px;color:#666}ul{list-style:disc;padding-left:20px}@media print{body{max-width:100%;padding:20px}@page{size:A4;margin:15mm}}</style>`);
    parts.push(`</head><body>`);
    parts.push(`<h1>ChatBI 分析报告</h1><p>生成时间：${new Date().toLocaleString('zh-CN')}</p>`);
    dataMessages.forEach((m, i) => {
      if (m.content) {
        parts.push(`<h2>${i + 1}. ${m.content.slice(0, 50)}...</h2>`);
        parts.push(`<p>${m.content.replace(/\n/g, '<br>')}</p>`);
      }
      if (m.strategy) {
        parts.push(`<h3>AI洞察</h3><p>${m.strategy.replace(/\n/g, '<br>')}</p>`);
      }
      if (m.attribution) {
        parts.push(`<h3>归因分析</h3><p>${m.attribution.summary}</p><ul>${m.attribution.factors.map(f => `<li>${f.description} (贡献度 ${f.contribution}%)</li>`).join('')}</ul>`);
        parts.push(`<h3>改进建议</h3><ul>${m.attribution.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>`);
      }
    });
    parts.push(`</body></html>`);
    return parts.join('');
  };

  const handleExportHTML = () => {
    const html = buildReportHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChatBI报告_${new Date().toLocaleDateString('zh-CN')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const html = buildReportHTML();
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => printWindow.print();
      // fallback if onload doesn't fire
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8 px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-800">分析报告预览</h2>
            <p className="text-xs text-slate-400 mt-0.5">基于当前对话生成的分析报告</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleCopy}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? '已复制' : '复制'}
            </Button>
            <Button size="sm" variant="secondary" onClick={handleExportHTML}>
              <Download className="w-3.5 h-3.5 mr-1" />
              导出HTML
            </Button>
            <Button size="sm" onClick={handleExportPDF}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              导出PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Report header */}
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">ChatBI 分析报告</h1>
            <p className="text-sm text-slate-400 mt-1">
              生成时间：{new Date().toLocaleString('zh-CN')} · 共 {dataMessages.length} 条分析
            </p>
          </div>

          {dataMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>当前对话暂无数据分析内容。</p>
              <p className="text-sm mt-1">请先通过智能问答进行数据查询。</p>
            </div>
          ) : (
            dataMessages.map((m, idx) => (
              <div key={m.id} className="space-y-4">
                {/* Section header */}
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-semibold text-gray-800">
                    {m.content.length > 60 ? m.content.slice(0, 60) + '...' : m.content}
                  </h3>
                </div>

                {/* Content */}
                <div className="pl-8 space-y-4">
                  <div className="text-sm text-gray-600 leading-relaxed bg-slate-50 rounded-xl p-4">
                    {m.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    ))}
                  </div>

                  {/* Chart */}
                  {m.chartData && m.chartType && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-5 pt-4 pb-2">
                        <AutoChart data={m.chartData} type={m.chartType} height={280} />
                      </div>
                    </div>
                  )}

                  {/* Strategy */}
                  {m.strategy && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-indigo-600 mb-2">AI洞察</h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{m.strategy}</p>
                    </div>
                  )}

                  {/* Attribution */}
                  {m.attribution && (
                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                      <h4 className="text-xs font-semibold text-amber-700 mb-2">归因分析</h4>
                      <p className="text-sm text-amber-800 leading-relaxed">{m.attribution.summary}</p>
                      <div className="mt-3 space-y-2">
                        {m.attribution.factors.map((f, j) => (
                          <div key={j} className="bg-white/60 rounded-lg p-2.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{f.description}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                                贡献度 {f.contribution}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-amber-100/50">
                        <h4 className="text-xs font-semibold text-amber-700 mb-1.5">改进建议</h4>
                        {m.attribution.suggestions.map((s, j) => (
                          <p key={j} className="text-xs text-gray-600 mt-0.5">{j + 1}. {s}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SQL */}
                  {m.sql && (
                    <details className="bg-slate-50 rounded-lg p-3">
                      <summary className="text-xs text-slate-500 cursor-pointer font-medium">查看SQL查询</summary>
                      <pre className="mt-2 text-xs font-mono text-slate-600 overflow-x-auto">{m.sql}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 shrink-0 flex items-center justify-between">
          <p className="text-xs text-slate-400">支持导出为HTML文件或打印为PDF</p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>关闭预览</Button>
            <Button variant="secondary" size="sm" onClick={handleExportHTML}>
              <Download className="w-3.5 h-3.5 mr-1" />
              导出HTML
            </Button>
            <Button size="sm" onClick={handleExportPDF}>
              <Printer className="w-3.5 h-3.5 mr-1" />
              导出PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
