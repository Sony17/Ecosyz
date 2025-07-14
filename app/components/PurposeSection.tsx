'use client';

export default function PurposeSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#111c1c] via-[#0f2021] to-[#0b1517] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-1/4 top-0 w-[600px] h-[300px] bg-gradient-radial from-cyan-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-cyan-300 font-semibold tracking-widest uppercase">Our Purpose</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 bg-clip-text animate-glow">
            Mission & Vision
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[#162322] rounded-xl border border-emerald-400/30 shadow-lg p-8">
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
          <div className="bg-[#162322] rounded-xl border border-emerald-400/30 shadow-lg p-8">
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
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40" />
    </section>
  );
}
