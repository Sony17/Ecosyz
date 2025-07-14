'use client';

import Link from 'next/link';

export default function OpenClimateModelProject() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#101a18] via-[#162725] to-[#111c1c] text-white px-4">
      {/* HERO */}
      <div className="relative flex flex-col items-center justify-center py-24">
        <div className="absolute inset-0 flex justify-center">
          <div className="w-[540px] h-[200px] bg-gradient-radial from-emerald-300/20 via-cyan-400/10 to-transparent blur-2xl" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-400 bg-clip-text animate-glow drop-shadow-lg text-center">
          Open Climate Model
        </h1>
        <p className="text-lg sm:text-xl text-teal-100/90 max-w-2xl text-center mb-4">
          Collaborative, open-source AI for predicting climate impacts.<br />
          Integrates public data and global code contributions.
        </p>
        <span className="inline-block bg-emerald-400/10 text-emerald-200 px-5 py-1 rounded-full uppercase tracking-widest text-xs font-semibold shadow-sm mb-1 mt-2">
          Open Project
        </span>
      </div>

      {/* CONTENT CARD */}
      <div className="relative max-w-2xl mx-auto -mt-6 z-10">
        <div className="bg-[#16211c]/90 border border-emerald-400/20 rounded-2xl shadow-xl backdrop-blur-lg px-8 py-8 space-y-7">
          {/* About */}
          <section>
            <h2 className="text-xl font-bold text-emerald-200 mb-2">About the Project</h2>
            <p className="text-teal-100/90 leading-relaxed">
              Open Climate Model is an open innovation initiative to build transparent, community-powered climate prediction tools. Anyone can join, contribute datasets, improve AI models, or use our insights for research and action.
            </p>
          </section>
          {/* Features */}
          <section>
            <h2 className="text-lg font-semibold text-cyan-200 mb-2">Key Features</h2>
            <ul className="list-disc pl-5 text-teal-100/90 space-y-1">
              <li>Modular, open-source AI (Python, TensorFlow, PyTorch)</li>
              <li>Global datasets (NASA, NOAA, Copernicus, etc.)</li>
              <li>Real-time dashboards and visualization</li>
              <li>Community-driven and transparent</li>
              <li>For scientists, developers, policymakers, and eco-activists</li>
            </ul>
          </section>
          {/* Get Involved */}
          <section>
            <h2 className="text-lg font-semibold text-emerald-300 mb-2">Get Involved</h2>
            <p className="text-teal-100/90 mb-4">
              Ready to make an impact? Star our repo, contribute code or data, or join our Discord for collab sprints and hackathons!
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/openidea/open-climate-model"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow hover:scale-105 transition"
              >
                View Source
              </a>
              <a
                href="https://discord.gg/your-invite"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-md border border-emerald-400/30 text-emerald-200 bg-[#18261b] font-semibold shadow hover:scale-105 transition"
              >
                Join Discord
              </a>
            </div>
          </section>
          {/* Status */}
          <section>
            <h2 className="text-lg font-semibold text-purple-200 mb-2">Project Status</h2>
            <p className="text-teal-100/80 flex items-center gap-2">
              <span role="img" aria-label="construction">🚧</span>
              Alpha — actively seeking contributors, feedback, and new datasets.
            </p>
          </section>
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/projects" className="inline-block px-6 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold shadow transition hover:scale-105 text-center">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
