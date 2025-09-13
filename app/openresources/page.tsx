'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container } from '../components/ui/Container';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Papers', value: 'paper' },
  { label: 'Datasets', value: 'dataset' },
  { label: 'Code', value: 'code' },
  { label: 'Models', value: 'model' },
  { label: 'Hardware', value: 'hardware' },
  { label: 'Videos', value: 'video' },
];

export default function OpenResourcesPage() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
  <div className="min-h-screen flex flex-col overflow-x-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]">
      <Header />
      <section
        id="open-resources"
        className="py-6 sm:py-10 bg-zinc-950 text-white relative"
      >
        {/* Soft spot background */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-radial from-emerald-400/10 to-transparent blur-2xl pointer-events-none" />
        <Container>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 text-center uppercase">
              Open Resources
            </h2>
            <p className="mt-6 text-xl text-teal-100/90 max-w-2xl mx-auto font-medium">
              Freely accessible, reusable, and modifiable assets to power your next big idea.
            </p>
          </div>

          {/* --- Neon Search Bar + Federated Results --- */}
          <div className="flex flex-col items-center mb-10 w-full">
            <div className="w-full max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mb-4">
                {TABS.map(tab => (
                  <button
                    key={tab.value}
                    className="px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-300/90 hover:bg-emerald-500/10 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                    data-active={type === tab.value}
                    style={type === tab.value ? { background: 'rgba(16, 185, 129, 0.12)' } : {}}
                    onClick={() => setType(tab.value)}
                    disabled={loading}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 w-full">
                <input
                  id="query"
                  className="w-full h-11 rounded-lg border border-white/10 bg-white/5 px-4 placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="Search papers, datasets, code, models, videos..."
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                />
                <button className="h-11 rounded-lg bg-emerald-500 text-black font-medium px-5 disabled:opacity-50 w-full sm:w-auto" onClick={search} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
            {/* Federated search results */}
            {(q || loading) && (
              <div className="w-full max-w-2xl mt-8">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {!loading && results.length === 0 && <div className="text-gray-400 text-lg text-center">No results.</div>}
                <div className="space-y-4 sm:space-y-6">
                  {results.map((r, i) => (
                    <div key={r.id || i} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3 relative">
                      {/* Icon or badge could go here if desired */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
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
                          <span className="ml-auto text-xs text-white/60 font-semibold">{r.year || ''}</span>
                        </div>
                        <div className="text-base sm:text-lg font-semibold text-white leading-snug mb-1">{r.title}</div>
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
                        <div className="text-xs sm:text-sm text-white/60 font-medium mb-1">{r.authors?.join(', ')}</div>
                        {r.tags && r.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1">
                            {r.tags.map((tag: string, idx: number) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded bg-cyan-900/30 text-cyan-200 border border-cyan-800">{tag}</span>
                            ))}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-white/60 line-clamp-2 mb-2">{r.description}</div>
                        <div className="flex gap-2 mt-2">
                          <a href={r.url} target="_blank" rel="noopener" className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow hover:bg-emerald-700 transition">Open</a>
                          <button className="px-4 py-1.5 bg-gray-800/60 rounded-lg text-xs text-gray-300 font-semibold" disabled>Save</button>
                          <button className="px-4 py-1.5 bg-gray-800/60 rounded-lg text-xs text-gray-300 font-semibold" disabled>Summarize</button>
                        </div>
                        <span className="absolute right-4 top-4 text-xs text-gray-700">{r.score !== undefined ? `Score: ${r.score.toFixed(2)}` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* --- End Neon Search Bar + Federated Results --- */}

          {/* --- Original Resource Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
            {/* Card 1 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-code text-2xl sm:text-3xl text-cyan-400 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Open Source Software</h3>
                <p className="text-xs sm:text-sm text-white/60">GitHub, GitLab, SourceForge, PyPI, npm, Maven — reusable code for every stack.</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-database text-2xl sm:text-3xl text-emerald-400 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Open Data</h3>
                <p className="text-xs sm:text-sm text-white/60">Portals like data.gov, EU Open Data, Kaggle Datasets — structured data for insights and analysis.</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-book text-2xl sm:text-3xl text-purple-300 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Open Access Research</h3>
                <p className="text-xs sm:text-sm text-white/60">Access papers on arXiv, PubMed Central, DOAJ — cutting-edge science at your fingertips.</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-graduation-cap text-2xl sm:text-3xl text-yellow-300 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Educational Resources</h3>
                <p className="text-xs sm:text-sm text-white/60">MIT OCW, OpenStax, Wikibooks — free courses and textbooks for lifelong learners.</p>
              </div>
            </div>
            {/* Card 5 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-microchip text-2xl sm:text-3xl text-pink-300 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Open Hardware</h3>
                <p className="text-xs sm:text-sm text-white/60">Arduino, Hackaday, OpenCompute — open designs and 3D models for hardware projects.</p>
              </div>
            </div>
            {/* Card 6 */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 flex items-start gap-3">
              <i className="fas fa-brain text-2xl sm:text-3xl text-indigo-300 mt-1"></i>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">AI Models & APIs</h3>
                <p className="text-xs sm:text-sm text-white/60">Hugging Face, TensorFlow Hub, OpenAI code samples — models and tools to build intelligent apps.</p>
              </div>
            </div>
          </div>
          {/* --- End Original Resource Cards --- */}
        </Container>
      </section>
      <Footer />
    </div>
  );
}
