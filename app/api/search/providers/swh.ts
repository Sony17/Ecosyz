/* SPDX-License-Identifier: MIT
 * Software Heritage provider client for Open Idea federated search.
 */
import type { Resource } from '../../../../src/types/resource';

const SWH_ENDPOINT = 'https://archive.softwareheritage.org/api/1/search/';

/**
 * Search Software Heritage for code artifacts matching the query.
 * @param q Query string
 * @returns Promise of Resource[]
 */
export async function searchSoftwareHeritage(q: string): Promise<Resource[]> {
  const url = `${SWH_ENDPOINT}origin/?q=${encodeURIComponent(q)}&limit=30`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`SWH error: ${res.status}`);
    const data = await res.json();
    return (data.results || []).map((item: any) => ({
      id: item.swhid || item.url,
      type: 'code',
      title: item.title || item.url,
      authors: item.authors || [],
      year: item.date ? parseInt(item.date.slice(0,4)) : undefined,
      source: 'Software Heritage',
      url: item.url,
      license: item.license || 'NOASSERTION',
      description: item.summary,
    }));
  } catch (e) {
    // Fail gracefully
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
