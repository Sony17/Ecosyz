# Federated Search Deduplication Pipeline

## Overview
This document describes the conservative, no-loss deduplication pipeline for federated search results in Open Idea. The pipeline merges only when there is strong identity evidence and otherwise keeps items separate, ensuring no unique resource is lost.

## Pipeline Steps

### 1. Normalization (`normalize.ts`)
- **stripDoi(s):** Lowercase, remove DOI URL/prefixes.
- **normUrl(u):** Lowercase host, remove hash, drop utm_* & ref params, strip trailing slash.
- **normTitle(t):** Lowercase, strip punctuation, collapse whitespace.
- **normAuthors(a):** Lowercase, trim.
- **pickYear(meta):** Prefer published-print, else online, else created/updated year.

### 2. Identity Keys (`keys.ts`)
- **deriveKeys(r):** Returns keys in priority order:
  1. `doi:<normalized-doi>`
  2. `swh:<swhid>`
  3. `url:<normalized-url>`
  4. `srctitle:<source>:<normalized-title>`

### 3. Merge Policy (`merge.ts`)
- **mergeResources(a, b):**
  - Description: keep longer/richer
  - License: keep whichever has it
  - Authors/tags: set union (case-insensitive)
  - Meta: shallow-merge; preserve helpful fields
  - Meta.sources: append `{source, url}` for provenance
  - Never drop original URL; keep canonical/earliest

### 4. Deduplication (`dedupe.ts`)
- **dedupeConservative(items):**
  - Build clusters by strong keys (DOI, SWHID, URL)
  - Merge only when strong key matches, else keep separate
  - Optional heuristic merge (title+year+authors) if:
    - Title similarity ≥ 0.92
    - |yearDelta| ≤ 1
    - Authors overlap ≥ 1
  - Never merge generic titles or code repos with different owners
  - Always preserve license and provenance
  - Returns merged items, cluster/merge counts, and merge decisions

## Edge Cases
- Never merge if year difference > 1
- Never merge generic titles by title alone
- Never merge papers with no author overlap
- Never merge code repos with different owners unless URL identical

## Guarantees
- No-loss: No unique item is dropped
- Strong keys always merge; weak keys only with high-confidence heuristic
- Licenses and provenance are always preserved

## Integration
- The API route `/api/search/route.ts` uses this pipeline and returns coverage metadata and (optionally) merge decisions for debugging.
