/* SPDX-License-Identifier: MIT
 * Conservative, no-loss deduplication for federated search results.
 */
import type { Resource } from '../../../../src/types/resource';
import { deriveKeys } from './keys';
import { mergeResources } from './merge';
import { normTitle, normAuthors } from './normalize';

function titleSimilarity(a: string, b: string): number {
  const tokensA = normTitle(a).split(' ').filter(t => t.length > 2);
  const tokensB = normTitle(b).split(' ').filter(t => t.length > 2);
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  const overlap = tokensA.filter(t => setB.has(t)).length;
  return Math.min(1, overlap / Math.max(tokensA.length, tokensB.length, 1));
}

function authorsOverlap(a: string[] = [], b: string[] = []): boolean {
  const setA = new Set(normAuthors(a));
  const setB = new Set(normAuthors(b));
  for (const name of setA) if (setB.has(name)) return true;
  return false;
}

export function dedupeConservative(items: Resource[]): {
  items: Resource[];
  clusters: number;
  merged: number;
  decisions: Array<{ winnerId: string; loserId: string; reason: string }>;
} {
  const clusters = new Map<string, Resource>();
  const decisions: Array<{ winnerId: string; loserId: string; reason: string }> = [];
  const used = new Set<Resource>();
  // 1. Strong key merge
  for (const item of items) {
    const keys = deriveKeys(item);
    let merged = false;
    for (const key of keys) {
      if (clusters.has(key)) {
        const winner = clusters.get(key)!;
        const mergedRes = mergeResources(winner, item);
        clusters.set(key, mergedRes);
        used.add(item);
        decisions.push({ winnerId: winner.id, loserId: item.id, reason: key.split(':')[0] });
        merged = true;
        break;
      }
    }
    if (!merged) {
      clusters.set(keys[0] || 'uid:' + item.id, item);
    }
  }
  // 2. Heuristic merge (title+year+authors)
  const clusterArr = Array.from(clusters.values());
  for (let i = 0; i < clusterArr.length; ++i) {
    for (let j = i + 1; j < clusterArr.length; ++j) {
      const a = clusterArr[i], b = clusterArr[j];
      if (used.has(a) || used.has(b)) continue;
      if (a.type !== b.type) continue;
      const yearA = a.year, yearB = b.year;
      if (yearA && yearB && Math.abs(yearA - yearB) > 1) continue;
      if (titleSimilarity(a.title, b.title) < 0.92) continue;
      if (!authorsOverlap(a.authors, b.authors)) continue;
      // Do not merge generic titles
      if ([a.title, b.title].some(t => /^(dataset|introduction|readme)$/i.test(t.trim()))) continue;
      // Merge
      const mergedRes = mergeResources(a, b);
      clusters.set('uid:' + mergedRes.id, mergedRes);
      used.add(a); used.add(b);
      decisions.push({ winnerId: a.id, loserId: b.id, reason: 'tya' });
    }
  }
  // 3. Collect results
  const out: Resource[] = [];
  for (const v of clusters.values()) {
    if (!used.has(v)) out.push(v);
  }
  return {
    items: out,
    clusters: clusters.size,
    merged: decisions.length,
    decisions,
  };
}
