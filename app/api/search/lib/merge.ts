/* SPDX-License-Identifier: MIT
 * Resource merge policy for federated search deduplication.
 */
import type { Resource } from '../../../../src/types/resource';

function unionCI(arr1: string[] = [], arr2: string[] = []): string[] {
  const set = new Set([...arr1.map(s => s.toLowerCase()), ...arr2.map(s => s.toLowerCase())]);
  return Array.from(set);
}

export function mergeResources(a: Resource, b: Resource): Resource {
  const description = (a.description?.length || 0) >= (b.description?.length || 0) ? a.description : b.description;
  const license = a.license && a.license !== 'NOASSERTION' ? a.license : b.license;
  const authors = unionCI(a.authors, b.authors);
  const tags = unionCI(a.tags, b.tags);
  const meta = { ...a.meta, ...b.meta };
  const aSources = Array.isArray(a.meta?.sources) ? a.meta.sources : [{ source: a.source, url: a.url }];
  const bSources = Array.isArray(b.meta?.sources) ? b.meta.sources : [{ source: b.source, url: b.url }];
  meta.sources = [
    ...aSources,
    ...bSources
  ].filter((v, i, arr) => arr.findIndex(x => x.source === v.source && x.url === v.url) === i);
  // Always keep canonical/earliest url
  const url = a.url;
  return {
    ...a,
    ...b,
    description,
    license,
    authors,
    tags,
    meta,
    url,
  };
}
