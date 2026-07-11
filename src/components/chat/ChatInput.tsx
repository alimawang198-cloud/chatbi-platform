import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入您的问题，例如：这个月收入怎么样？..."
        rows={2}
        className="flex-1 resize-none text-[15px] outline-none text-gray-700 placeholder-slate-400 max-h-[120px]"
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || loading}
        className={cn(
          'p-2.5 rounded-lg transition-all shrink-0 cursor-pointer',
          input.trim() && !loading
            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
            : 'bg-slate-100 text-slate-400'
        )}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </div>
  );
}
