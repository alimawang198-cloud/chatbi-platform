import { useState } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessageList } from '../../components/chat/ChatMessageList';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatGreeting } from '../../components/chat/ChatGreeting';
import { ReportPreviewModal } from '../../components/chat/ReportPreviewModal';
import { Sparkles, Trash2 } from 'lucide-react';

export function ChatBIPage() {
  const { messages, suggestions, isProcessing, currentPhase, sendQuery, handleClarification, handleFeedback, clearHistory } = useChatStore();
  const [reportOpen, setReportOpen] = useState(false);

  const handleSuggestionClick = (text: string) => {
    clearHistory();
    sendQuery(text);
  };

  const phaseLabels: Record<string, string> = {
    followup_detection: '检测追问上下文...',
    intent_classification: '识别查询意图...',
    knowledge_retrieval: '检索知识库...',
    clarification: '判断信息完整度...',
    sql_generation: '生成查询与图表...',
    attribution: '执行归因分析...',
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      {/* Phase indicator */}
      {isProcessing && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-2.5 flex items-center gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span className="text-xs text-indigo-600 font-medium">
            {phaseLabels[currentPhase] || '处理中...'}
          </span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <ChatGreeting suggestions={suggestions} onSelect={sendQuery} />
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            isProcessing={isProcessing}
            onClarification={handleClarification}
            onFeedback={handleFeedback}
            onGenerateReport={() => setReportOpen(true)}
          />
        )}
      </div>

      {/* Report modal */}
      <ReportPreviewModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        messages={messages}
      />

      {/* Input area */}
      <div className="px-8 pt-5 pb-12 bg-white border-t border-slate-200 shrink-0">
        <div className="max-w-3xl mx-auto">
          {messages.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.slice(0, 5).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={clearHistory}
                className="text-slate-300 hover:text-slate-500 cursor-pointer shrink-0 ml-3 transition-colors"
                title="清空对话"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <ChatInput onSend={sendQuery} loading={isProcessing} />
        </div>
      </div>
    </div>
  );
}
