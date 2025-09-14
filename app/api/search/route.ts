/* SPDX-License-Identifier: MIT
 * Federated search API route for Open Idea.
 */
import { NextRequest, NextResponse } from 'next/server';
export const revalidate = 0;
import { searchOpenAlex } from './providers/openalex';
import { searchArxiv } from './providers/arxiv';
import { searchZenodo } from './providers/zenodo';
import { searchSoftwareHeritage } from './providers/swh';
import { searchGithubCode } from './providers/github';
import { searchHuggingFaceModels } from './providers/huggingface';
import { searchYouTubeVideos } from './providers/youtube';
import { searchHardware } from './providers/hardware';
import { searchOshwaHardware } from './providers/oshwa';
import { searchWikifactoryDesigns } from './providers/wikifactory';
import type { Resource, ResourceType } from '../../../src/types/resource';
import { dedupeConservative } from './lib/dedupe';

// Optimized in-memory LRU cache for search results
// - Avoids rate limits by caching recent queries
// - TTL (time-to-live) and max size are configurable
// - Uses Map for O(1) access and LRU eviction
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX = 100; // Max number of cached queries
const cache = new Map<string, { ts: number; data: any }>();

function getCache(key: string): any | undefined {
  // Move accessed entry to the end (most recently used)
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }
  cache.delete(key);
  cache.set(key, entry);
  return entry.data;
}

function setCache(key: string, data: any) {
  // Insert or update, then move to end (most recently used)
  if (cache.has(key)) cache.delete(key);
  cache.set(key, { ts: Date.now(), data });
  // Evict least recently used if over max size
  if (cache.size > CACHE_MAX) {
    const lruKey = cache.keys().next().value;
    if (typeof lruKey === 'string') cache.delete(lruKey);
  }
}

// Scoring helpers
function scoreResource(r: Resource, q: string): number {
  const text = (r.title + ' ' + (r.description || '')).toLowerCase();
  const match = text.includes(q.toLowerCase()) ? 1 : 0;
  const recency = r.year ? Math.max(0, (new Date().getFullYear() - r.year) < 5 ? 1 : 0) : 0;
  const quality = (r.license && r.license !== 'NOASSERTION' ? 1 : 0);
  return 0.5 * match + 0.3 * recency + 0.2 * quality;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') as ResourceType | 'all' | null;
  // Accept new type values: model, hardware, video (even if no providers yet)
  const debug = searchParams.get('debug') === '1';
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });

  // Pagination params must be part of the cache key
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '30', 10);
  const cacheKey = `${q}:${type}:${page}:${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  // Fan-out to providers in parallel
  // Add new providers here as needed (see docs/specs/providers.md)
  const providerFns = [
    { name: 'openalex', fn: () => searchOpenAlex(q) },
    { name: 'arxiv', fn: () => searchArxiv(q) },
    { name: 'zenodo', fn: () => searchZenodo(q) },
    { name: 'swh', fn: () => searchSoftwareHeritage(q) },
    { name: 'github', fn: () => searchGithubCode(q) },
    { name: 'huggingface', fn: () => searchHuggingFaceModels(q) },
    { name: 'youtube', fn: () => searchYouTubeVideos(q) },
    { name: 'hardware', fn: () => searchHardware(q) },
    { name: 'oshwa', fn: () => searchOshwaHardware(q) },
    { name: 'wikifactory', fn: () => searchWikifactoryDesigns(q) },
  ];
  const results: Record<string, Resource[]> = {};
  await Promise.all(
    providerFns.map(async ({ name, fn }) => {
      try {
        results[name] = await fn();
      } catch {
        results[name] = [];
      }
    })
  );
  let all = Object.values(results).flat();
  if (type && type !== 'all') all = all.filter(r => r.type === type);
  all.forEach(r => (r.score = scoreResource(r, q)));
  const dedupeResult = dedupeConservative(all);
  const deduped = dedupeResult.items.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = deduped.slice(start, end);
  const hasMore = end < deduped.length;

  // Build response before caching so we cache the entire payload
  const resp: any = {
    results: paginated,
    total: deduped.length,
    page,
    limit,
    hasMore,
    coverage: {
      requestedProviders: providerFns.map(p => p.name),
      receivedCounts: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v.length])),
      uniqueBefore: all.length,
      uniqueAfter: dedupeResult.items.length,
      merged: dedupeResult.merged,
      // Documented in docs/specs/providers.md
    }
  };
  setCache(cacheKey, resp);
  // See docs/specs/dedupe-pipeline.md and docs/specs/providers.md for details
  if (debug) resp.decisions = dedupeResult.decisions;
  return NextResponse.json(resp);
}
