'use client';

export default function CommunitySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#131d18] via-[#16231a] to-[#11271b] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-2/4 top-1/3 w-[400px] h-[150px] bg-gradient-radial from-emerald-400/15 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-cyan-300 font-semibold tracking-widest uppercase">Community</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-300 bg-clip-text animate-glow">
            Who It&apos;s For
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-teal-100/80 font-medium">
            Builders, developers, researchers, students, educators, entrepreneurs, creators.
          </p>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-neon-green mb-8">Our Values:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#192527] p-6 rounded-xl border border-cyan-400/30 shadow-md">
              <h4 className="text-lg font-medium text-cyan-300">Open by Default</h4>
              <p className="mt-2 text-teal-100/80">Transparency and collaboration drive breakthrough innovation</p>
            </div>
            <div className="bg-[#192527] p-6 rounded-xl border border-emerald-400/30 shadow-md">
              <h4 className="text-lg font-medium text-neon-green">Impact First</h4>
              <p className="mt-2 text-teal-100/80">Every project should contribute to positive global change</p>
            </div>
            <div className="bg-[#192527] p-6 rounded-xl border border-purple-400/30 shadow-md">
              <h4 className="text-lg font-medium text-purple-300">Community Powered</h4>
              <p className="mt-2 text-teal-100/80">Collective intelligence amplifies individual brilliance</p>
            </div>
          </div>
        </div>
        <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
      </div>
    </section>
  );
}
