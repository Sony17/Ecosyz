# In-Memory LRU Cache for Federated Search API

This project uses an in-memory LRU (Least Recently Used) cache in `app/api/search/route.ts` to optimize federated search queries.

## What It Does
- **Reduces API Rate Limits:** By caching recent search results, repeated queries are served from memory instead of hitting external APIs, reducing the risk of rate limiting.
- **Speeds Up Repeated Searches:** Cached results are returned instantly for repeated queries, improving user experience.
- **Automatic Expiry:** Each cache entry has a time-to-live (TTL) (default: 5 minutes). Old entries are automatically removed.
- **LRU Eviction:** When the cache exceeds its maximum size (default: 100 queries), the least recently used entry is evicted.

## How It Works
- The cache is a JavaScript `Map` where keys are query+type and values are `{ ts, data }` objects.
- On every search, the cache is checked first. If a valid entry exists, it is returned and marked as most recently used.
- When a new result is cached, it is added as most recently used. If the cache is full, the oldest entry is removed.
- TTL and max size can be tuned in the code.

## Code Reference
See the `getCache` and `setCache` functions in `app/api/search/route.ts` for implementation details.

---

For distributed or persistent caching, consider using Redis or a similar external cache.
