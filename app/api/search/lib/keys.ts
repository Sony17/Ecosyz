/* SPDX-License-Identifier: MIT
 * Identity key derivation for federated search deduplication.
 */
import type { Resource } from '../../../../src/types/resource';
import { stripDoi, normUrl, normTitle } from './normalize';

export function deriveKeys(r: Resource): string[] {
  const keys: string[] = [];
  if (r.meta?.doi) keys.push('doi:' + stripDoi(r.meta.doi));
  if (r.meta?.swhid) keys.push('swh:' + r.meta.swhid.toLowerCase());
  if (r.url) keys.push('url:' + normUrl(r.url));
  if (r.source && r.title) keys.push('srctitle:' + r.source + ':' + normTitle(r.title));
  return keys.filter(Boolean);
}
