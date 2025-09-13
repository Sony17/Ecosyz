/* SPDX-License-Identifier: MIT
 * Zenodo provider client for Open Idea federated search.
 */
import type { Resource } from '../../../../src/types/resource';

const ZENODO_ENDPOINT = 'https://zenodo.org/api/records';

/**
 * Search Zenodo for records matching the query.
 * @param q Query string
 * @returns Promise of Resource[]
 */
export async function searchZenodo(q: string): Promise<Resource[]> {
  const url = `${ZENODO_ENDPOINT}?q=${encodeURIComponent(q)}&size=30`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Zenodo error: ${res.status}`);
    const data = await res.json();
    return (data.hits?.hits || []).map((item: any) => ({
      id: item.doi || item.id,
      type: item.metadata.resource_type?.type === 'dataset' ? 'dataset' : 'paper',
      title: item.metadata.title,
      authors: item.metadata.creators?.map((a: any) => a.name) || [],
      year: item.metadata.publication_date ? parseInt(item.metadata.publication_date.slice(0,4)) : undefined,
      source: 'Zenodo',
      url: item.links.html,
      license: item.metadata.license?.id || 'NOASSERTION',
      description: item.metadata.description,
    }));
  } catch (e) {
    // Fail gracefully
    return [];
  } finally {
    clearTimeout(timeout);
  }
}
