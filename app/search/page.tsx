/* SPDX-License-Identifier: MIT
 * Federated search UI page for Open Idea.
 */
'use client';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '../components/ui/Container';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Papers', value: 'paper' },
  { label: 'Datasets', value: 'dataset' },
  { label: 'Code', value: 'code' },
  { label: 'Models', value: 'model' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Videos', value: 'video' },
];

export default function SearchPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summarizing, setSummarizing] = useState<string | null>(null);
  const TABS = [
    { label: 'All', value: 'all' },
    { label: 'Papers', value: 'paper' },
    { label: 'Datasets', value: 'dataset' },
    { label: 'Code', value: 'code' },
    { label: 'Models', value: 'model' },
    { label: 'Hardware', value: 'hardware' },
    { label: 'Videos', value: 'video' },
  ];

  async function search() {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function summarizeItem(item: any) {
    try {
      setSummarizing(item.id || item.url || item.title);
      const payload = item.description?.length ? { text: item.description } : { url: item.url };
      const res = await fetch('/api/summarize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Summarization failed');
      const data = await res.json();
      const summary = data.summary || 'No summary available';
      // Attach summary to the matching item (by id/url/title fallback)
      const key = item.id || item.url || item.title;
      setResults(prev => prev.map(r => ((r.id || r.url || r.title) === key ? { ...r, summary } : r)));
    } catch (e: any) {
      alert(e.message || 'Failed to summarize');
    } finally {
      setSummarizing(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <Container>
        <main className="py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-8">Federated Search</h1>
        {/* Tabs for resource types */}
        <div className="flex gap-2 mb-6">
          {TABS.map(tab => (
            <button
              key={tab.value}
              className={`px-5 py-2 rounded-full font-bold border-2 transition text-lg ${type === tab.value ? 'bg-emerald-500 text-white border-emerald-500 shadow' : 'bg-black/60 text-gray-200 border-emerald-900 hover:bg-emerald-900/20'}`}
              onClick={() => setType(tab.value)}
              disabled={loading}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <section className="rounded-2xl shadow-lg p-6 mb-8 border border-emerald-900/30 bg-transparent">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              id="query"
              className="flex-1 border border-emerald-400/40 rounded-lg px-4 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow"
              placeholder="Search papers, datasets, code, models, videos..."
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button className="ml-2 bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-emerald-600 transition" onClick={search} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </section>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {!loading && results.length === 0 && <div className="text-gray-400 text-lg text-center">No results.</div>}
        <div className="grid gap-6">
          {results.map((r, i) => (
            <div key={r.id || i} className="border border-emerald-900/20 rounded-2xl p-6 bg-gradient-to-br from-[#121f22] via-[#0c2321] to-[#0a1016] shadow-lg flex flex-col gap-2 relative">
              <div className="flex gap-2 items-center mb-1">
                <span className="text-xs px-2 py-1 rounded bg-gray-800/80 font-mono text-gray-100 border border-gray-700">{r.source}</span>
                {r.type && (
                  <span className={`text-xs px-2 py-1 rounded font-bold border ${
                    r.type === 'paper' ? 'bg-blue-900/30 text-blue-200 border-blue-800' :
                    r.type === 'dataset' ? 'bg-yellow-900/30 text-yellow-200 border-yellow-800' :
                    r.type === 'code' ? 'bg-purple-900/30 text-purple-200 border-purple-800' :
                    r.type === 'model' ? 'bg-pink-900/30 text-pink-200 border-pink-800' :
                    r.type === 'video' ? 'bg-red-900/30 text-red-200 border-red-800' :
                    r.type === 'hardware' ? 'bg-green-900/30 text-green-200 border-green-800' :
                    'bg-gray-800/80 text-gray-200 border-gray-700'
                  }`}>
                    {r.type === 'model' ? 'Model'
                      : r.type === 'video' ? 'Video'
                      : r.type === 'hardware' ? 'Hardware'
                      : r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                  </span>
                )}
                {r.license && <span className="text-xs px-2 py-1 rounded bg-emerald-900/30 text-emerald-200 border border-emerald-800">{r.license}</span>}
                <span className="ml-auto text-xs text-gray-400 font-semibold">{r.year || ''}</span>
              </div>
              <div className="font-extrabold text-2xl text-white leading-snug mb-1">{r.title}</div>
              {/* Special fields for model/hardware/video */}
              {r.type === 'model' && r.meta?.pipeline && (
                <div className="text-xs text-pink-200 font-mono mb-1">Pipeline: {r.meta.pipeline}</div>
              )}
              {r.type === 'hardware' && r.meta?.cert_id && (
                <div className="text-xs text-green-200 font-mono mb-1">Cert ID: {r.meta.cert_id}</div>
              )}
              {r.type === 'video' && (r.meta?.duration || r.meta?.channel) && (
                <div className="text-xs text-red-200 font-mono mb-1">
                  {r.meta?.duration && <>Duration: {r.meta.duration} </>}
                  {r.meta?.channel && <>Channel: {r.meta.channel}</>}
                </div>
              )}
              <div className="text-sm text-gray-300 font-medium mb-1">{r.authors?.join(', ')}</div>
              {r.tags && r.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {r.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-200 border border-cyan-800">{tag}</span>
                  ))}
                </div>
              )}
              <div className="text-sm text-gray-400 line-clamp-2 mb-2">{r.description}</div>
              {r.summary && (
                <div className="mt-2 p-3 rounded bg-emerald-900/20 border border-emerald-800 text-emerald-100 text-sm">
                  <div className="font-semibold mb-1">Summary</div>
                  <p className="whitespace-pre-wrap leading-relaxed">{r.summary}</p>
                </div>
              )}
              <div className="flex gap-2 mt-2">
                <a href={r.url} target="_blank" rel="noopener" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-emerald-700 transition">Open</a>
                <button className="px-4 py-1.5 bg-gray-800/60 rounded-lg text-xs text-gray-300 font-semibold" disabled>Save</button>
                <button
                  className="px-4 py-1.5 bg-gray-800/60 rounded-lg text-xs text-gray-300 font-semibold hover:bg-gray-800"
                  onClick={() => summarizeItem(r)}
                  disabled={!!summarizing}
                >{summarizing && (summarizing === (r.id || r.url || r.title)) ? 'Summarizing...' : 'Summarize'}</button>
              </div>
              <span className="absolute right-4 top-4 text-xs text-gray-700">{r.score !== undefined ? `Score: ${r.score.toFixed(2)}` : ''}</span>
            </div>
          ))}
        </div>
        </main>
      </Container>
      <Footer />
    </div>
  );
}
