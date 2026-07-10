import { useState } from 'react';
import { ChevronDown, ChevronRight, Database } from 'lucide-react';

interface SqlBlockProps {
  sql: string;
}

export function SqlBlock({ sql }: SqlBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sql) return null;

  return (
    <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
      >
        <Database className="w-3.5 h-3.5" />
        <span>SQL查询</span>
        {expanded ? <ChevronDown className="w-3.5 h-3.5 ml-auto" /> : <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
      </button>
      {expanded && (
        <pre className="px-4 py-3 text-xs text-green-400 font-mono border-t border-gray-800 overflow-x-auto">
          {sql}
        </pre>
      )}
    </div>
  );
}
