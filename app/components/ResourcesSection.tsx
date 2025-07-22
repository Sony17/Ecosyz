'use client';

export default function ResourcesSection() {
  return (
    <section className="pt-6 pb-20 bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 w-[500px] h-[200px] bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 tracking-tight max-w-2xl mx-auto text-center leading-tight uppercase">
            The World’s Open Knowledge
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-teal-100/70 font-medium">
            These are freely accessible, reusable, and modifiable assets created by individuals, communities, or institutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Open Source Software */}
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md transition
            hover:shadow-[0_0_32px_#12ffb880]
            hover:border-cyan-400
            hover:-translate-y-1
            hover:scale-105
          ">
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
          {/* Open Data */}
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md transition
            hover:shadow-[0_0_32px_#16f2b0bb]
            hover:border-emerald-400
            hover:-translate-y-1
            hover:scale-105
          ">
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
          {/* Open Access Research */}
          <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md transition
            hover:shadow-[0_0_32px_#b38fff80]
            hover:border-purple-400
            hover:-translate-y-1
            hover:scale-105
          ">
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
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
