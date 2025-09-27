import React from 'react';
import type { SearchResult } from '@/app/types/search';
import SaveToWorkspace from '../workspace/SaveToWorkspace';

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result: r }: SearchResultCardProps) {
  return (
    <div className="border border-emerald-900/20 rounded-2xl p-6 bg-gradient-to-br from-[#121f22] via-[#0c2321] to-[#0a1016] shadow-lg flex flex-col gap-2 relative hover:border-emerald-500/30 transition-all duration-200">
      <div className="flex gap-2 items-center mb-1">
        <span className="text-xs px-2 py-1 rounded bg-gray-800/80 font-mono text-gray-100 border border-gray-700">{r.source}</span>
        {r.type && (
          <span className={`text-xs px-2 py-1 rounded font-bold border ${
            r.type === 'paper' ? 'bg-blue-900/30 text-blue-200 border-blue-800' :
            r.type === 'dataset' ? 'bg-yellow-900/30 text-yellow-200 border-yellow-800' :
            r.type === 'code' ? 'bg-purple-900/30 text-purple-200 border-purple-800' :
            r.type === 'model' ? 'bg-pink-900/30 text-pink-200 border-pink-800' :
            r.type === 'video' ? 'bg-red-900/30 text-red-200 border-red-800' :
            r.type === 'hardware' ? 'bg-green-900/30 text-green-200 border-green-800' :
            'bg-gray-800/80 text-gray-200 border-gray-700'
          }`}>
            {r.type === 'model' ? 'Model'
              : r.type === 'video' ? 'Video'
              : r.type === 'hardware' ? 'Hardware'
              : r.type.charAt(0).toUpperCase() + r.type.slice(1)}
          </span>
        )}
        {r.license && <span className="text-xs px-2 py-1 rounded bg-emerald-900/30 text-emerald-200 border border-emerald-800">{r.license}</span>}
        <span className="ml-auto text-xs text-gray-400 font-semibold">{r.year || ''}</span>
      </div>
      <div className="font-extrabold text-2xl text-white leading-snug mb-1">{r.title}</div>
      {r.type === 'model' && r.meta?.pipeline && (
        <div className="text-xs text-pink-200 font-mono mb-1">Pipeline: {r.meta.pipeline}</div>
      )}
      {r.type === 'hardware' && r.meta?.cert_id && (
        <div className="text-xs text-green-200 font-mono mb-1">Cert ID: {r.meta.cert_id}</div>
      )}
      {r.type === 'video' && (r.meta?.duration || r.meta?.channel) && (
        <div className="text-xs text-red-200 font-mono mb-1">
          {r.meta?.duration && <>Duration: {r.meta.duration} </>}
          {r.meta?.channel && <>Channel: {r.meta.channel}</>}
        </div>
      )}
      <div className="text-sm text-gray-300 font-medium mb-1">{r.authors?.join(', ')}</div>
      {r.tags && r.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {r.tags.map((tag: string, idx: number) => (
            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-200 border border-cyan-800">{tag}</span>
          ))}
        </div>
      )}
      <div className="text-sm text-gray-400 line-clamp-2 mb-2">{r.description}</div>
      <div className="flex gap-2 mt-2">
        <a href={r.url} target="_blank" rel="noopener" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-emerald-700 transition">Open</a>
        <SaveToWorkspace result={r} />
        <button className="px-4 py-1.5 bg-gray-800/60 rounded-lg text-xs text-gray-300 font-semibold" disabled>Summarize</button>
      </div>
      <span className="absolute right-4 top-4 text-xs text-gray-700">{r.score !== undefined ? `Score: ${r.score.toFixed(2)}` : ''}</span>
    </div>
  );
}