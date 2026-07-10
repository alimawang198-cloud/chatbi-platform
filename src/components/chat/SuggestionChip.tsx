interface SuggestionChipProps {
  text: string;
  onClick: (text: string) => void;
}

export function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <button
      onClick={() => onClick(text)}
      className="px-3 py-1.5 rounded-full text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer whitespace-nowrap"
    >
      {text}
    </button>
  );
}
