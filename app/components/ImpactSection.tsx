'use client';

export default function ImpactSection() {
  return (
    <section className="py-10 bg-[#0c2321] text-white relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-emerald-500/15 to-transparent blur-3xl opacity-60 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-2 tracking-tight text-center uppercase">
            PLATFORM AMBITION
          </h2>
          <p className="text-lg sm:text-xl text-teal-100/90 font-medium text-center">
            Numbers we are targeting for our ecosystem
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg transition-all duration-200 ease-in-out hover:border-emerald-400 hover:shadow-[0_0_32px_#10b98180] hover:scale-105 hover:-translate-y-2">
            <div className="text-5xl font-extrabold text-emerald-300">10M+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Open Resources Indexed</div>
          </div>
          {/* Card 2 */}
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg transition-all duration-200 ease-in-out hover:border-emerald-400 hover:shadow-[0_0_32px_#10b98180] hover:scale-105 hover:-translate-y-2">
            <div className="text-5xl font-extrabold text-emerald-300">50K+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Active Builders</div>
          </div>
          {/* Card 3 */}
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg transition-all duration-200 ease-in-out hover:border-emerald-400 hover:shadow-[0_0_32px_#10b98180] hover:scale-105 hover:-translate-y-2">
            <div className="text-5xl font-extrabold text-emerald-300">1,000+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Projects Launched</div>
          </div>
          {/* Card 4 */}
          <div className="bg-[#1c2623] border border-emerald-400/30 rounded-xl p-8 text-center shadow-lg transition-all duration-200 ease-in-out hover:border-emerald-400 hover:shadow-[0_0_32px_#10b98180] hover:scale-105 hover:-translate-y-2">
            <div className="text-5xl font-extrabold text-emerald-300">100+</div>
            <div className="mt-2 text-lg font-medium text-teal-100/80">Countries Represented</div>
          </div>
        </div>
      </div>
      <div className="mt-14 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
