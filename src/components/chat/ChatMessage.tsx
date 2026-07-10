import { Bot, User, AlertCircle, HelpCircle, ChevronDown, ChevronUp, BarChart3, Lightbulb, ChevronRight, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import type { ChatMessage as ChatMessageType, ChartData, ChartType } from '../../types';
import { AutoChart } from '../charts/AutoChart';
import { ClarificationCard } from './ClarificationCard';
import { FeedbackButtons } from './FeedbackButtons';

interface ChatMessageProps {
  message: ChatMessageType;
  chartData?: ChartData;
  chartType?: ChartType;
  onClarification?: (option: NonNullable<ChatMessageType['clarificationOptions']>[number]) => void;
  onFeedback?: (messageId: string, type: 'positive' | 'negative') => void;
  onGenerateReport?: () => void;
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>');
    return (
      <p
        key={i}
        className={line ? 'mt-1' : 'mt-4'}
        dangerouslySetInnerHTML={{ __html: bolded }}
      />
    );
  });
}

export function ChatMessage({ message, chartData, chartType, onClarification, onFeedback, onGenerateReport }: ChatMessageProps) {
  const [sqlExpanded, setSqlExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isClarification = message.isClarification;
  const hasData = !isUser && !isClarification && !message.isError && (chartData || message.strategy || message.attribution);

  const handleCopy = async () => {
    let text = message.content;
    if (message.strategy) text += '\n\n【AI洞察】\n' + message.strategy;
    if (message.attribution) {
      text += '\n\n【归因分析】\n' + message.attribution.summary;
      message.attribution.factors.forEach(f => text += `\n- ${f.description} (贡献度 ${f.contribution}%)`);
      text += '\n\n【改进建议】\n' + message.attribution.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n');
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex gap-3 py-4 animate-slide-up', isUser ? 'flex-row-reverse' : '')}>
      {/* Avatar */}
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        isUser ? 'bg-indigo-500' :
        isClarification ? 'bg-amber-100' :
        message.isError ? 'bg-red-100' : 'bg-emerald-100'
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isClarification ? (
          <HelpCircle className="w-4 h-4 text-amber-600" />
        ) : message.isError ? (
          <AlertCircle className="w-4 h-4 text-red-500" />
        ) : (
          <Bot className="w-4 h-4 text-emerald-600" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 min-w-0', isUser ? 'flex flex-col items-end max-w-[70%]' : 'max-w-[85%]')}>
        {/* User bubble */}
        {isUser && (
          <div className="rounded-xl px-4 py-2.5 text-sm bg-indigo-500 text-white shadow-sm">
            <p>{message.content}</p>
          </div>
        )}

        {/* Clarification */}
        {isClarification && message.clarificationOptions && onClarification && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
            <p className="text-gray-700 mb-2">{message.content}</p>
            <ClarificationCard options={message.clarificationOptions} onSelect={onClarification} />
          </div>
        )}

        {/* Error */}
        {message.isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            <p>{message.content}</p>
          </div>
        )}

        {/* Text-only assistant message (no data - e.g. greeting) */}
        {!isUser && !isClarification && !message.isError && !hasData && (
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm text-gray-600 leading-relaxed shadow-sm">
            {renderContent(message.content)}
          </div>
        )}

        {/* Data-rich assistant message: brief chat bubble + spacious insight card */}
        {hasData && (
          <div className="space-y-4">
            {/* Brief response bubble */}
            <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm text-gray-600 shadow-sm">
              {message.intent && message.intent !== 'CLARIFICATION' && (
                <span className="inline-block text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium mb-1.5">
                  {message.intent}
                </span>
              )}
              {renderContent(message.content)}
            </div>

            {/* Chart card */}
            {chartData && chartType && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-2">
                  <AutoChart data={chartData} type={chartType} height={320} />
                </div>
              </div>
            )}

            {/* Strategy analysis card */}
            {message.strategy && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  AI洞察
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {renderContent(message.strategy)}
                </div>
              </div>
            )}

            {/* Attribution card */}
            {message.attribution && (
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-amber-100/60 px-5 py-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">归因分析</span>
                </div>
                <div className="px-5 py-3">
                  <p className="text-sm text-amber-800 leading-relaxed">{message.attribution.summary}</p>
                </div>
                <div className="px-5 py-2 space-y-2.5">
                  {message.attribution.factors.map((factor, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-amber-400" />
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">{factor.description}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                          贡献度 {factor.contribution}%
                        </span>
                      </div>
                      {factor.details.map((detail, j) => (
                        <div key={j} className="flex items-start gap-1.5 ml-2 mt-1">
                          <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-gray-500 leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="bg-white/60 px-5 py-3 border-t border-amber-100/50">
                  <p className="text-xs font-medium text-amber-700 mb-2">改进建议</p>
                  {message.attribution.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 mt-1">
                      <span className="text-xs text-amber-500 font-bold shrink-0">{i + 1}.</span>
                      <span className="text-xs text-gray-600 leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SQL card */}
            {message.sql && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setSqlExpanded(!sqlExpanded)}
                  className="w-full px-5 py-3 flex items-center justify-between text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-mono text-xs font-medium">SQL 查询</span>
                  {sqlExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {sqlExpanded && (
                  <pre className="px-5 pb-4 text-xs font-mono text-slate-600 bg-slate-50 leading-relaxed overflow-x-auto border-t border-slate-100">
                    {message.sql}
                  </pre>
                )}
              </div>
            )}

            {/* Feedback */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onGenerateReport && (
                  <button
                    onClick={onGenerateReport}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    生成报告
                  </button>
                )}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '已复制' : '复制内容'}
                </button>
              </div>
              {onFeedback && (
                <FeedbackButtons
                  messageId={message.id}
                  currentFeedback={message.feedback}
                  onFeedback={onFeedback}
                />
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-[10px] text-gray-300 mt-1.5 px-1">
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
