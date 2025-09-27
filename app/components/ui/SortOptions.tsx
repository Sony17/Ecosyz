import React from 'react';

export type SortOption = 'relevance' | 'date' | 'citations';

interface SortOptionsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  disabled?: boolean;
}

export function SortOptions({ currentSort, onSortChange, disabled }: SortOptionsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        disabled={disabled}
        className="bg-transparent text-emerald-300 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      >
        <option value="relevance">Relevance</option>
        <option value="date">Date</option>
        <option value="citations">Citations</option>
      </select>
    </div>
  );
}