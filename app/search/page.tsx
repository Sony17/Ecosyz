/* SPDX-License-Identifier: MIT
 * Federated search UI page for Open Idea.
 */
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '../components/ui/Container';
import { SearchResultSkeleton } from '../components/ui/SearchResultSkeleton';
import { SearchResultCard } from '../components/search/SearchResultCard';
import { SortOptions, type SortOption } from '../components/ui/SortOptions';
import SaveToWorkspace from '../components/workspace/SaveToWorkspace';
import type { SearchResult } from '../types/search';

// Cache structure for storing search results
const resultCache = new Map<string, {
  timestamp: number;
  results: SearchResult[];
  hasMore: boolean;
  nextCursor: string | null;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Papers', value: 'paper' },
  { label: 'Datasets', value: 'dataset' },
  { label: 'Code', value: 'code' },
  { label: 'Models', value: 'model' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Videos', value: 'video' },
] as const;

type TabValue = typeof TABS[number]['value'];

export default function SearchPage() {
  // Prevent double search when sort changes
  const isInitialMount = useRef(true);
  
  // State hooks
  const [query, setQuery] = useState('');
  const [resourceType, setResourceType] = useState<TabValue>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('relevance');
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Define the search function
  const search = useCallback(async (resetResults = true) => {
    if (!query) return;
    setIsLoading(true);
    setError('');

    const cacheKey = `${query}:${resourceType}:${sortOption}`;
    const now = Date.now();
    const cached = resultCache.get(cacheKey);

    if (cached && now - cached.timestamp < CACHE_TTL && resetResults) {
      setResults(cached.results);
      setHasMore(cached.hasMore);
      setNextCursor(cached.nextCursor);
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        q: query,
        type: resourceType,
        sort: sortOption,
        ...(resetResults ? {} : { cursor: nextCursor || '' })
      });

      const res = await fetch(`/api/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();

      const newResults = resetResults ? data.results : [...results, ...data.results];
      setResults(newResults);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);

      if (resetResults) {
        resultCache.set(cacheKey, {
          timestamp: now,
          results: data.results,
          hasMore: data.hasMore,
          nextCursor: data.nextCursor
        });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [query, resourceType, sortOption, nextCursor, results]);

  // Clear cache entries older than CACHE_TTL
  useEffect(() => {
    const now = Date.now();
    for (const [key, value] of resultCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        resultCache.delete(key);
      }
    }
  }, [query]); // Only run when query changes

  // Effect for sort changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (query && results.length > 0) {
      search(true);
    }
  }, [sortOption, search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <Container className="px-4">
        <main className="py-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-8">Federated Search</h1>
          {/* Tabs for resource types */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={`px-5 py-2 rounded-full font-bold border-2 transition text-lg ${resourceType === tab.value ? 'bg-emerald-500 text-white border-emerald-500 shadow' : 'bg-black/60 text-gray-200 border-emerald-900 hover:bg-emerald-900/20'}`}
                onClick={() => {
                  setResourceType(tab.value);
                  if (query) search(true);
                }}
                disabled={isLoading}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <section className="rounded-2xl shadow-lg p-6 mb-8 border border-emerald-900/30 bg-transparent">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <input
                  id="query"
                  className="flex-1 border border-emerald-400/40 rounded-lg px-4 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow"
                  placeholder="Search papers, datasets, code, models, videos..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search(true)}
                />
                <button 
                  className="w-full md:w-auto bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-emerald-600 transition" 
                  onClick={() => search(true)} 
                  disabled={isLoading}
                >
                  {isLoading && !hasMore ? 'Searching...' : 'Search'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <SortOptions
                  currentSort={sortOption}
                  onSortChange={(newSort) => {
                    setSortOption(newSort);
                    if (query) search(true);
                  }}
                  disabled={isLoading || !results.length}
                />
              </div>
            </div>
          </section>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-center">
              {error}
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">No results found</div>
              <div className="text-gray-600">Try adjusting your search or filters</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading && [...Array(6)].map((_, i) => (
              <SearchResultSkeleton key={i} />
            ))}
            {!isLoading && results.map((r: SearchResult, i: number) => (
              <div key={r.id || i} className="border border-emerald-900/20 rounded-2xl p-6 bg-gradient-to-br from-[#121f22] via-[#0c2321] to-[#0a1016] shadow-lg flex flex-col gap-2 relative hover:border-emerald-500/30 transition-all duration-200">
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
            ))}
          </div>

          {hasMore && !isLoading && results.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 rounded-lg hover:bg-emerald-600/30 transition"
                onClick={() => search(false)}
                disabled={isLoading}
              >
                {isLoading ? 'Loading more...' : 'Load more results'}
              </button>
            </div>
          )}
          
        </main>
      </Container>
      <Footer />
    </div>
  );
}
