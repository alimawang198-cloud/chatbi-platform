import { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { FeedbackType } from '../../types';

interface FeedbackButtonsProps {
  messageId: string;
  currentFeedback?: 'positive' | 'negative';
  onFeedback: (messageId: string, type: 'positive' | 'negative', negativeType?: FeedbackType) => void;
}

const negativeTypes: { value: FeedbackType; label: string }[] = [
  { value: 'knowledge_missing', label: '知识缺失' },
  { value: 'wrong_calculation', label: '计算逻辑不正确' },
  { value: 'content_incomplete', label: '内容不满足' },
  { value: 'data_fabrication', label: '捏造数据' },
  { value: 'other', label: '其他' },
];

export function FeedbackButtons({ messageId, currentFeedback, onFeedback }: FeedbackButtonsProps) {
  const [showNegativeOptions, setShowNegativeOptions] = useState(false);

  return (
    <div className="flex items-center gap-1 mt-2 relative">
      <span className="text-[10px] text-gray-300 mr-1">有帮助吗？</span>
      <button
        onClick={() => onFeedback(messageId, 'positive')}
        className={cn(
          'p-1 rounded transition-colors cursor-pointer',
          currentFeedback === 'positive' ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'
        )}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => {
          if (currentFeedback === 'negative') {
            setShowNegativeOptions(false);
            return;
          }
          setShowNegativeOptions(!showNegativeOptions);
        }}
        className={cn(
          'p-1 rounded transition-colors cursor-pointer',
          currentFeedback === 'negative' ? 'text-red-500 bg-red-50' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
        )}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>

      {/* Negative feedback options */}
      {showNegativeOptions && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[180px] animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">问题分类</span>
            <button onClick={() => setShowNegativeOptions(false)} className="text-gray-300 hover:text-gray-500 cursor-pointer">
              <X className="w-3 h-3" />
            </button>
          </div>
          {negativeTypes.map(nt => (
            <button
              key={nt.value}
              onClick={() => {
                onFeedback(messageId, 'negative', nt.value);
                setShowNegativeOptions(false);
              }}
              className="block w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors cursor-pointer"
            >
              {nt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
