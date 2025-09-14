/* SPDX-License-Identifier: MIT
 * Lightweight extractive summarization API for Open Idea.
 *
 * POST /api/summarize
 * Body: { text?: string; url?: string; max_sentences?: number }
 *
 * If `text` is provided it will be summarized directly. If only `url` is
 * provided, the route will fetch the page and attempt to extract text from
 * meta description and the main content. Returns a concise summary using a
 * frequency-based sentence scoring approach (extractive summarization).
 */

import { NextRequest, NextResponse } from 'next/server';

// Minimal English stopword list (kept small and local – no deps)
const STOPWORDS = new Set([
  'a','an','and','are','as','at','be','but','by','for','if','in','into','is','it','no','not','of','on','or','such','that','the','their','then','there','these','they','this','to','was','will','with','we','you','your','from','have','has','had','were','our','can','could','should','would','may','might','about','over','under','between','within','also'
]);

function sentenceSplit(text: string): string[] {
  // Split on periods/question/exclamation while keeping it simple
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function wordTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w && !STOPWORDS.has(w) && w.length > 2);
}

function scoreSentences(sentences: string[]): { idx: number; text: string; score: number }[] {
  const allWords = wordTokens(sentences.join(' '));
  const freq = new Map<string, number>();
  for (const w of allWords) freq.set(w, (freq.get(w) || 0) + 1);
  const maxFreq = Math.max(1, ...Array.from(freq.values()));

  // Normalize frequencies
  for (const [w, c] of freq) freq.set(w, c / maxFreq);

  // Score each sentence by sum of normalized word frequencies
  return sentences.map((s, idx) => {
    const tokens = wordTokens(s);
    const score = tokens.reduce((sum, t) => sum + (freq.get(t) || 0), 0) / Math.sqrt(tokens.length || 1);
    return { idx, text: s, score };
  });
}

async function fetchPageText(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'OpenIdeaSummarizer/1.0' }, next: { revalidate: 60 } });
    const html = await res.text();
    // Try meta description and OpenGraph/Twitter cards first
    const metaDesc = html.match(/<meta[^>]+name=[\"']description[\"'][^>]+content=[\"']([^\"']+)[\"'][^>]*>/i)?.[1]
      || html.match(/<meta[^>]+property=[\"']og:description[\"'][^>]+content=[\"']([^\"']+)[\"'][^>]*>/i)?.[1]
      || html.match(/<meta[^>]+name=[\"']twitter:description[\"'][^>]+content=[\"']([^\"']+)[\"'][^>]*>/i)?.[1];

    // Strip tags from body as fallback (very naive extraction)
    const body = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const text = [metaDesc, body].filter(Boolean).join('. ');
    return text.slice(0, 60_000); // safety cap
  } catch {
    return '';
  }
}

function summarize(text: string, maxSentences = 3): string {
  const sentences = sentenceSplit(text);
  if (sentences.length <= maxSentences) return sentences.join(' ');

  const scored = scoreSentences(sentences)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(maxSentences, 8)))
    .sort((a, b) => a.idx - b.idx); // keep original order

  return scored.map(s => s.text).join(' ');
}

export async function POST(req: NextRequest) {
  try {
    const { text, url, max_sentences } = await req.json().catch(() => ({}));
    const max = Math.max(1, Math.min(6, Number(max_sentences) || 3));

    let sourceText = '';
    if (typeof text === 'string' && text.trim().length > 0) {
      sourceText = text.trim();
    } else if (typeof url === 'string' && url.startsWith('http')) {
      sourceText = await fetchPageText(url);
    }

    if (!sourceText) {
      return NextResponse.json({ error: 'No text available to summarize' }, { status: 400 });
    }

    const summary = summarize(sourceText, max);
    return NextResponse.json({ summary, length: summary.length });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Summarization failed' }, { status: 500 });
  }
}
