import React from 'react';

export function SearchResultSkeleton() {
  return (
    <div className="border border-emerald-900/20 rounded-2xl p-6 bg-gradient-to-br from-[#121f22] via-[#0c2321] to-[#0a1016] shadow-lg animate-pulse">
      <div className="flex gap-2 items-center mb-3">
        <div className="w-20 h-6 bg-gray-800/80 rounded"></div>
        <div className="w-24 h-6 bg-gray-800/80 rounded"></div>
        <div className="w-32 h-6 bg-gray-800/80 rounded ml-auto"></div>
      </div>
      <div className="w-3/4 h-8 bg-gray-800/80 rounded mb-4"></div>
      <div className="w-full h-4 bg-gray-800/80 rounded mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-800/80 rounded mb-4"></div>
      <div className="flex gap-2">
        <div className="w-20 h-8 bg-gray-800/80 rounded"></div>
        <div className="w-20 h-8 bg-gray-800/80 rounded"></div>
        <div className="w-20 h-8 bg-gray-800/80 rounded"></div>
      </div>
    </div>
  );
}