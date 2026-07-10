import { Sparkles } from 'lucide-react';

interface ChatGreetingProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export function ChatGreeting({ suggestions, onSelect }: ChatGreetingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-2xl mx-auto text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-indigo-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">智能数据问答</h2>
      <p className="text-base text-gray-400 mb-10 max-w-md">
        用自然语言查询您的业务数据，系统将自动生成图表和分析建议
      </p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {suggestions.slice(0, 6).map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-4 py-3 rounded-xl text-sm bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer shadow-sm text-left"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
