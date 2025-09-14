'use client';

export default function CommunitySection() {
  return (
    <section className="pt-8 pb-20 bg-gradient-to-br from-[#131d18] via-[#16231a] to-[#11271b] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-2/4 top-1/3 w-[400px] h-[150px] bg-gradient-radial from-emerald-400/15 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-2 tracking-tight text-center uppercase">
            Our DNA and Community
          </h2>
          <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-lg text-teal-100/80 font-medium text-center">
            Builders, developers, researchers, students, educators, entrepreneurs, creators.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
            {/* Card 1 */}
            <div className="glass-card glass-border p-6 rounded-xl transition-all duration-200 hover:-translate-y-2">
              <h4 className="text-lg font-semibold text-cyan-300">Open by Default</h4>
              <p className="mt-2 text-teal-100/80 text-base">Transparency and collaboration drive breakthrough innovation</p>
            </div>
            {/* Card 2 */}
            <div className="glass-card glass-border p-6 rounded-xl transition-all duration-200 hover:-translate-y-2">
              <h4 className="text-lg font-semibold text-emerald-300">Impact First</h4>
              <p className="mt-2 text-teal-100/80 text-base">Every project should contribute to positive global change</p>
            </div>
            {/* Card 3 */}
            <div className="glass-card glass-border p-6 rounded-xl transition-all duration-200 hover:-translate-y-2">
              <h4 className="text-lg font-semibold text-purple-300">Community Powered</h4>
              <p className="mt-2 text-teal-100/80 text-base">Collective intelligence amplifies individual brilliance</p>
            </div>
          </div>
        </div>
        <div className="mt-14 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
      </div>
    </section>
  );
}
