import { useEffect, useRef } from 'react';
import type { ChatMessage as ChatMessageType, ClarificationOption } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isProcessing: boolean;
  onClarification?: (messageId: string, option: ClarificationOption) => void;
  onFeedback?: (messageId: string, type: 'positive' | 'negative') => void;
  onGenerateReport?: () => void;
}

export function ChatMessageList({ messages, isProcessing, onClarification, onFeedback, onGenerateReport }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            message={msg}
            chartData={msg.role === 'assistant' && !msg.isClarification ? msg.chartData : undefined}
            chartType={msg.role === 'assistant' && !msg.isClarification ? msg.chartType : undefined}
            onClarification={onClarification ? (opt) => onClarification(msg.id, opt) : undefined}
            onFeedback={onFeedback}
            onGenerateReport={onGenerateReport}
          />
        ))}
        {isProcessing && <ThinkingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
