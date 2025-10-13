/* SPDX-License-Identifier: MIT
 * Normalization helpers for federated search deduplication.
 */

export function stripDoi(s: string): string {
  return s
    .toLowerCase()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/^doi:/, '')
    .trim();
}

export function normUrl(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    url.search = url.search
      .split('&')
      .filter(p => !/^utm_|^ref/.test(p))
      .join('&');
    const host = url.host.toLowerCase();
    const path = url.pathname.replace(/\/$/, '');
    return `${url.protocol}//${host}${path}`;
  } catch {
    return u.toLowerCase().replace(/\/$/, '');
  }
}

export function normTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normAuthors(a: string[]): string[] {
  return a.map(s => s.toLowerCase().trim());
}

export function pickYear(meta: Record<string, unknown>): number | undefined {
  return meta?.publishedPrint || meta?.publishedOnline || meta?.year || meta?.created || meta?.updated;
}
