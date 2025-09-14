/* SPDX-License-Identifier: MIT
 * OpenAlex provider client for Open Idea federated search.
 */
import type { Resource } from '../../../../src/types/resource';

const OPENALEX_ENDPOINT = 'https://api.openalex.org/works';

/**
 * Search OpenAlex for works matching the query.
 * @param q Query string
 * @returns Promise of Resource[]
 */
export async function searchOpenAlex(q: string): Promise<Resource[]> {
  const url = `${OPENALEX_ENDPOINT}?search=${encodeURIComponent(q)}&per-page=30`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`OpenAlex error: ${res.status}`);
    const data = await res.json();
    return (data.results || []).map((item: any) => ({
      id: item.doi || item.id,
      type: 'paper',
      title: item.title,
      authors: item.authors?.map((a: any) => a.author.display_name) || [],
      year: item.publication_year,
      source: 'openalex',
      url: item.id,
      license: item.license || 'NOASSERTION',
      description: item.abstract_inverted_index ? Object.keys(item.abstract_inverted_index).join(' ') : undefined,
    }));
  } catch (e) {
    // Fail gracefully
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
