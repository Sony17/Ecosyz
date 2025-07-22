'use client';

export default function FeatureCards() {
  return (
    <section className="bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] py-20 text-white relative">
      {/* Optional spotlight gradient for visual pop, keep if you like */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-radial from-emerald-500/20 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 tracking-tight max-w-2xl mx-auto text-center leading-tight uppercase">
    Unifying open research, code, data, designs

</h2>

<p className="mt-4 max-w-2xl mx-auto text-lg text-teal-100/80 font-medium ">
  Discover every open resource—research, code, datasets, designs, and more—all in one place. Start projects, remix ideas, and connect with innovators to accelerate your impact.
</p>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* --- Cards stay the same --- */}
          <div className="p-8 rounded-xl border border-emerald-400/40 bg-[#172024] hover:shadow-[0_0_24px_#12ffb890] transition text-center">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-blue-600/70 text-cyan-300 shadow">
              <i className="fas fa-search text-2xl"></i>
            </div>
            <h3 className="mt-6 text-lg font-semibold">Unified Search</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Find open-source code, research papers, datasets, hardware designs, videos, and more from across the web—all in one place.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-emerald-400/40 bg-[#172024] hover:shadow-[0_0_24px_#14ff6e80] transition text-center">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-neon-green text-gray-900 shadow">
              <i className="fas fa-rocket text-2xl"></i>
            </div>
            <h3 className="mt-6 text-lg font-semibold">Build and Launch Projects</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Start new projects using open resources as building blocks. Create public or private workspaces, document your progress, and invite collaborators.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-emerald-400/40 bg-[#172024] hover:shadow-[0_0_24px_#b38fff80] transition text-center">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-purple-600/70 text-purple-100 shadow">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <h3 className="mt-6 text-lg font-semibold">Join the Community</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Connect with fellow innovators, experts, and learners worldwide. Share feedback, ask questions, join groups, and participate in events.
            </p>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
