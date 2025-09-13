/* SPDX-License-Identifier: MIT
 * Vitest tests for federated search API route.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../app/api/search/route';

// Mock provider modules
vi.mock('../app/api/search/providers/openalex', () => ({ searchOpenAlex: vi.fn() }));
vi.mock('../app/api/search/providers/arxiv', () => ({ searchArxiv: vi.fn() }));
vi.mock('../app/api/search/providers/zenodo', () => ({ searchZenodo: vi.fn() }));
vi.mock('../app/api/search/providers/swh', () => ({ searchSoftwareHeritage: vi.fn() }));

import { searchOpenAlex } from '../app/api/search/providers/openalex';
import { searchArxiv } from '../app/api/search/providers/arxiv';
import { searchZenodo } from '../app/api/search/providers/zenodo';
import { searchSoftwareHeritage } from '../app/api/search/providers/swh';

function makeReq(q = 'test', type = 'all') {
  return { url: `http://localhost/api/search?q=${q}&type=${type}` } as any;
}

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 200 and ≤30 items', async () => {
    (searchOpenAlex as any).mockResolvedValue(Array(15).fill({ id: 'a', type: 'paper', title: 'A', source: 'openalex', url: 'u', license: 'MIT' }));
    (searchArxiv as any).mockResolvedValue(Array(15).fill({ id: 'b', type: 'paper', title: 'B', source: 'arxiv', url: 'u2', license: 'MIT' }));
    (searchZenodo as any).mockResolvedValue([]);
    (searchSoftwareHeritage as any).mockResolvedValue([]);
    const res = await GET(makeReq());
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.length).toBeLessThanOrEqual(30);
  });

  it('dedupes by id', async () => {
    (searchOpenAlex as any).mockResolvedValue([{ id: 'x', type: 'paper', title: 'A', source: 'openalex', url: 'u', license: 'MIT' }]);
    (searchArxiv as any).mockResolvedValue([{ id: 'x', type: 'paper', title: 'A', source: 'arxiv', url: 'u', license: 'MIT' }]);
    (searchZenodo as any).mockResolvedValue([]);
    (searchSoftwareHeritage as any).mockResolvedValue([]);
    const res = await GET(makeReq());
    const data = await res.json();
    expect(data.length).toBe(1);
  });

  it('provider timeout does not fail whole request', async () => {
    (searchOpenAlex as any).mockResolvedValue([{ id: 'a', type: 'paper', title: 'A', source: 'openalex', url: 'u', license: 'MIT' }]);
    (searchArxiv as any).mockRejectedValue(new Error('timeout'));
    (searchZenodo as any).mockResolvedValue([]);
    (searchSoftwareHeritage as any).mockResolvedValue([]);
    const res = await GET(makeReq());
    const data = await res.json();
    expect(data.length).toBe(1);
  });
});
