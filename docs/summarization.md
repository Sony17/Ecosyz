# Summarization: Design, API, and Future Scope

This document explains how summarization works in Ecosyz today, how to configure it, the API contracts (JSON + SSE streaming), and ideas for future enhancements.

## Goals
- Provide fast, zero-LLM extractive summaries for papers and metadata.
- Use PDFs when possible ("deep") and fall back to abstract/title ("quick").
- Stream partial results to the UI for responsiveness.
- Cache results in-memory and optionally in a shared KV store.

## Architecture Overview
- UI: `app/openresources/page.tsx`
  - Presents a search list. Each paper has a `Summarize` button.
  - Summary is shown inline and in a glassy modal.
  - Uses Server-Sent Events (SSE) to stream TL;DR, bullets, and tags.
- API: `app/api/summarize/route.ts` (Node runtime)
  - `POST /api/summarize` returns a full JSON summary.
  - `GET /api/summarize?...` streams partial results via SSE.
  - Deep: attempts to fetch a PDF and summarize extracted text.
  - Quick: summarizes `title + abstract`.

### Flow Diagram (Mermaid)

```mermaid
flowchart TD
  U[User clicks Summarize] --> UI[UI opens glassy modal]\n(EventSource /api/summarize)
  UI -->|SSE| API[API GET /api/summarize]
  API --> KV{KV configured?}
  KV -- yes --> KVGET[KV get(key)]
  KVGET -->|hit| META1[send meta (fromCache=kv)] --> UI
  KVGET -->|hit| TLDR1[send tldr] --> UI
  KVGET -->|hit| BUL1[send bullets] --> UI
  KVGET -->|hit| TAG1[send tags] --> UI
  KVGET -->|hit| DONE1[send done] --> UI
  KV -- no or miss --> MEM{Memory cache hit?}
  MEM -- yes --> META2[send meta (fromCache=memory)] --> UI
  MEM --> TLDR2[send tldr] --> UI
  MEM --> BUL2[send bullets] --> UI
  MEM --> TAG2[send tags] --> UI
  MEM --> DONE2[send done] --> UI
  MEM -- no --> MODE{mode === deep?}
  MODE -- deep --> PDF[Derive PDF URL (provider-specific)]
  PDF -->|arXiv/OpenAlex/Zenodo/Generic| FETCH[Fetch PDF & pdf-parse]
  FETCH -->|ok| SUM[Summarize text (extractive)]
  SUM --> SETMEM[Set memory cache]
  SUM --> SETKV[Set KV (if configured)]
  SUM --> META3[send meta (fromCache=false)] --> UI
  SUM --> TLDR3[send tldr] --> UI
  SUM --> BUL3[send bullets] --> UI
  SUM --> TAG3[send tags] --> UI
  SUM --> DONE3[send done] --> UI
  FETCH -- fail --> ERR1[send error] --> UI
  MODE -- quick --> QSUM[Summarize title+abstract]
  QSUM --> SETMEM
  QSUM --> SETKV
  QSUM --> META4[send meta (fromCache=false)] --> UI
  QSUM --> TLDR4[send tldr] --> UI
  QSUM --> BUL4[send bullets] --> UI
  QSUM --> TAG4[send tags] --> UI
  QSUM --> DONE4[send done] --> UI
```

## Modes: Quick vs Deep
- Quick mode: summarize `title + abstract`. Always available.
- Deep mode: summarize extracted text from a PDF.
  - PDF Derivation:
    - arXiv: build `https://arxiv.org/pdf/<id>.pdf` from `abs/id` or `arxiv:`.
    - OpenAlex: query Works API for OA PDF URLs; confirm via `HEAD` if needed.
    - Zenodo: fetch record files; pick a PDF by mimetype or filename.
    - Generic: accept direct `.pdf` URLs or `HEAD` with `content-type: application/pdf`.
  - Extract text using `pdf-parse` (dynamically imported) and summarize it.

## Summarization Algorithm (Extractive)
- Tokenization, stopwords filtering, and sentence splitting.
- Sentence frequencies score sentences; pick top N (e.g., 5–6), keep original order.
- Outputs:
  - `tldr` (1–2 sentences), `bullets` (top sentences), `tags` (top non-stopword tokens), and `readingTimeMinutes`.
  - `confidence` is a fixed "medium" for now.

## API Contracts
### POST /api/summarize
- Request body:
```json
{
  "id": "string",             // optional but recommended
  "source": "string",         // e.g., "arxiv", "openalex", "zenodo"
  "title": "string",          // title text
  "abstract": "string",       // abstract or description
  "url": "string",            // original resource URL
  "mode": "quick" | "deep"    // requested mode
}
```
- Response (200):
```json
{
  "tldr": "string",
  "bullets": ["..."],
  "tags": ["..."],
  "readingTimeMinutes": 3,
  "confidence": "medium",
  "modeUsed": "quick" | "deep",
  "fromCache": true | false,
  "cache": "kv" | "memory" | "none"
}
```
- Error (4xx/5xx): `{ "error": "message" }`.

### GET /api/summarize (SSE)
- Query params: same fields as POST but via `?id=...&source=...&title=...&abstract=...&url=...&mode=...`.
- Events:
  - `meta`: `{ fromCache, cache, modeUsed | modeRequested }`
  - `tldr`: `string`
  - `bullets`: `string[]`
  - `tags`: `string[]`
  - `done`: `{ ok: true }`
  - `error`: `{ message }`

## Caching
- In-memory (Map with a 7-day TTL) for fast local reuse.
- Optional shared cache via Vercel KV / Upstash (7-day TTL).
  - Set env vars to enable:
    - `KV_REST_API_URL`
    - `KV_REST_API_TOKEN`
  - If not configured, KV is ignored (no-op) and only in-memory cache is used.

## Configuration
- Node runtime routes are required (uses `Buffer`, dynamic import):
  - `app/api/summarize/route.ts` exports `export const runtime = 'nodejs'`.
- Dependencies:
  - `pdf-parse` (dynamic import)
  - Optional: `@vercel/kv` (only if KV env vars are set)

## UI Behavior
- Clicking Summarize opens a glassy modal.
- Results stream in (TL;DR then bullets and tags).
- Badges display mode (Deep vs Quick) and cache source (KV/Memory/Fresh).
- Errors are shown via toasts; modal closes on streaming error.
- Descriptions and summary text are sanitized of HTML tags/entities before rendering.

## Limitations
- Some PDFs are not accessible (paywalled, blocked `HEAD`, or CORS); deep may fail.
- Scanned/image-only PDFs won’t extract text (no OCR).
- Very long PDFs are truncated for responsiveness.

## Future Scope
- LLM Summarization (Optional tier)
  - Use an LLM for abstractive summaries with citations.
  - Stream tokens over SSE (the plumbing already exists).
  - Add safety and cost controls with per-user limits and provider selection.
- OCR for Scanned PDFs
  - Integrate Tesseract or a service to OCR image-based PDFs.
- KV / Durable Cache
  - Add eviction policies, versions, and per-source sanctity checks.
  - Optional background prewarming for popular items.
- User Controls
  - Toggle: Deep only vs Auto (deep → quick fallback).
  - Controls for max sentences, tone (technical/lay), and language.
- Diagnostics & Observability
  - Debug panel showing which PDF URL was chosen, time to fetch/parse, and cache hits.
  - Metrics and tracing for failures and latencies.
- Accessibility & UX
  - Keyboard shortcuts (open modal, navigate bullets, close on Esc).
  - Improved animations and responsive behavior.
- Security & Sanitization
  - Move sanitization server-side for consistent behavior.
  - Add allowlists for domains when following redirects to PDFs.

## Local Development
```bash
npm install
npm run dev
# open http://localhost:3000/openresources
```

## Troubleshooting
- "Module not found: pdf-parse": ensure `pdf-parse` is in `dependencies` and the route runs on Node runtime.
- "Module not found: @vercel/kv": install `@vercel/kv` or remove KV env vars if not using KV.
- Deep summaries failing: check network access to the PDF URL; if blocked, try quick mode or set up a proxy.

---

## How to Add a New Provider to Deep Mode

This guide shows the minimal steps to enable PDF-based deep summaries for an additional provider.

1) Implement PDF URL Derivation
- Add a helper in `app/api/summarize/route.ts` similar to `deriveOpenAlexPdf` or `deriveZenodoPdf`. For example:
  - Call the provider’s record/works API.
  - Find a file link with a PDF mimetype or `.pdf` filename.
  - If the URL doesn’t end with `.pdf`, make a `HEAD` request and confirm `content-type: application/pdf`.

2) Wire the Helper into Deep Mode
- In `POST` and `GET` handlers, extend the `if (mode === 'deep')` section:
  ```ts
  else if (source === 'myprovider') pdfUrl = await deriveMyProviderPdf(url || id || '', controller.signal);
  ```
  - Keep the same fallback flow as existing providers: if no valid PDF URL is found, return an error (deep-only) or fall back to quick (if you opt for auto mode).

3) Sanity & Limits
- Try-catch all network calls and treat non-2xx as no PDF available.
- Enforce a reasonable timeout (e.g., 25s via `AbortController`).
- Cap extracted text size (e.g., 200k chars) before summarization.

4) Caching
- The route already caches by key `${id || title}:${mode}`.
- No extra work is needed to benefit from memory/KV caches.

5) Testing Checklist
- Resource with an accessible PDF → should stream a Deep summary with the badge.
- Resource without a PDF → should error in deep-only mode, or fall back if allowed.
- Very large PDF → processed and truncated; summary still produced.
- Ensure the glassy modal opens, updates progressively, and closes on error.

Tips
- If the provider uses redirects or signed URLs, prefer `redirect: 'follow'` and confirm with `HEAD`.
- If the provider requires auth, do not hardcode secrets. Add a secure fetch layer and read tokens from environment variables.
