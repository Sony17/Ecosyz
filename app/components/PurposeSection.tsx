'use client';

export default function PurposeSection() {
  return (
<section className="pt-4 pb-10 bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] text-white relative">
      {/* Optional glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-0 w-[600px] h-[300px] bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 tracking-tight max-w-2xl mx-auto text-center leading-tight uppercase">
OUR NORTH STAR</h2>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Mission Card */}
          <div className="bg-[#172024] rounded-xl border border-emerald-400/30 shadow-lg p-8 transition hover:shadow-[0_0_24px_#30ffe0bb] hover:border-cyan-400/70">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-cyan-400/20 p-3 rounded-lg">
                <i className="fas fa-bullseye text-cyan-300 text-xl"></i>
              </span>
              <h3 className="text-xl font-bold text-cyan-200">Mission</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              To democratize innovation by providing an open, AI-powered platform where impactful projects across all domains can launch, connect, and thrive together.
            </p>
          </div>
          {/* Vision Card */}
          <div className="bg-[#172024] rounded-xl border border-emerald-400/30 shadow-lg p-8 transition hover:shadow-[0_0_24px_#16f2b0bb] hover:border-emerald-400/80">
            <div className="flex items-center gap-4">
              <span className="flex-shrink-0 bg-emerald-400/20 p-3 rounded-lg">
                <i className="fas fa-eye text-emerald-300 text-xl"></i>
              </span>
              <h3 className="text-xl font-bold text-emerald-200">Vision</h3>
            </div>
            <p className="mt-4 text-teal-100/80">
              A world where every breakthrough innovation—whether in climate action, technology, or social impact—has the platform, community, and resources to change the world.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
