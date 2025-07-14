'use client';

export default function TechnologySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#131f21] via-[#11271b] to-[#1a2926] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/3 w-[500px] h-[200px] bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-cyan-300 font-semibold tracking-widest uppercase">Technology</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-300 bg-clip-text animate-glow">
            AI Built Over Aggregated Open Resources
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-100/80 font-medium">What Innovation Does This Unlock?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-[#192527] p-6 rounded-xl border border-cyan-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-cyan-400/20 p-3 rounded-md">
                <i className="fas fa-brain text-cyan-300 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">Semantic Search and Recommendation</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              AI understands meaning, not just keywords. Users can search "reverse aging gene therapies with open datasets" and get exact matches, even if sources use different language.
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-emerald-400/20 p-3 rounded-md">
                <i className="fas fa-tags text-emerald-300 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">Auto-tagging & Smart Categorization</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              NLP models tag new resources with domains, technologies, methods, outcomes, licenses—without manual effort. Detects "hidden" connections.
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-purple-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-purple-700/20 p-3 rounded-md">
                <i className="fas fa-file-alt text-purple-200 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">Resource Summarization</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              LLMs auto-summarize research papers, datasets, or code repos into 1-minute reads or bullet points. Generate customized weekly digests.
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-cyan-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-cyan-400/20 p-3 rounded-md">
                <i className="fas fa-link text-cyan-300 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">Automatic Linking & Knowledge Graph</h3>
            </div>
            <p className="mt-4 text-teal-100/80">AI detects and links related resources across silos. Surfaces non-obvious combinations for innovation.</p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-red-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-red-400/20 p-3 rounded-md">
                <i className="fas fa-random text-red-300 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">"Remix" or "Build with AI"</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              AI suggests possible project ideas: "You could combine these datasets and this code to create a new anti-aging predictor." Auto-generate starter project templates.
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-cyan-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-indigo-400/20 p-3 rounded-md">
                <i className="fas fa-comments text-indigo-200 text-xl"></i>
              </span>
              <h3 className="text-lg font-medium">Expert Q&A/Assistant</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              An LLM trained on your platform acts as a "community brain"—answering questions, suggesting resources, providing mentorship.
            </p>
          </div>
        </div>
        <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
      </div>
    </section>
  );
}
