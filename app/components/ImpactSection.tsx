'use client';

export default function ImpactSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#14221b] via-[#10201d] to-[#102a20] text-white relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-emerald-500/15 to-transparent blur-3xl opacity-60 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 bg-clip-text animate-glow mb-4">
            Platform Impact
          </h2>
          <p className="text-lg sm:text-xl text-teal-100/90 font-medium">Real numbers from our growing ecosystem</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg hover:shadow-[0_0_28px_#10b98130] transition">
            <div className="text-5xl font-extrabold text-emerald-300 drop-shadow-neon">10M+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Open Resources Indexed</div>
          </div>
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg hover:shadow-[0_0_28px_#10b98130] transition">
            <div className="text-5xl font-extrabold text-emerald-300 drop-shadow-neon">50K+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Active Builders</div>
          </div>
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg hover:shadow-[0_0_28px_#10b98130] transition">
            <div className="text-5xl font-extrabold text-emerald-300 drop-shadow-neon">1,000+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Projects Launched</div>
          </div>
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg hover:shadow-[0_0_28px_#10b98130] transition">
            <div className="text-5xl font-extrabold text-emerald-300 drop-shadow-neon">100+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Countries Represented</div>
          </div>
        </div>
      </div>
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
