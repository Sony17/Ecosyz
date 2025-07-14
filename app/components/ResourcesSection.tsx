'use client';

export default function ResourcesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#161e21] via-[#10171a] to-[#1a2926] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 w-[500px] h-[200px] bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-cyan-300 font-semibold tracking-widest uppercase">Resources</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-300 bg-clip-text animate-glow">
            What are "Open Resources"?
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-100/70 font-medium">
            These are freely accessible, reusable, and modifiable assets created by individuals, communities, or institutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-cyan-400/15 p-2 rounded-md">
                <i className="fas fa-code text-cyan-300"></i>
              </span>
              <h3 className="text-lg font-medium">Open Source Software</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              Repositories: GitHub, GitLab, SourceForge<br />
              Package Indexes: PyPI, npm, Maven, CRAN
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-emerald-400/15 p-2 rounded-md">
                <i className="fas fa-database text-emerald-300"></i>
              </span>
              <h3 className="text-lg font-medium">Open Data</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              Portals: data.gov, EU Open Data Portal, Kaggle Datasets<br />
              Domains: government, climate, health, demographics
            </p>
          </div>
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-purple-700/15 p-2 rounded-md">
                <i className="fas fa-book text-purple-200"></i>
              </span>
              <h3 className="text-lg font-medium">Open Access Research</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              Papers: arXiv, PubMed Central, DOAJ<br />
              Preprints: bioRxiv, SSRN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
