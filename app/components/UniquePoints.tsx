'use client';

export default function UniquePoints() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0b1619] via-[#141f23] to-[#151e21] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/3 top-1/2 w-[600px] h-[200px] bg-gradient-radial from-emerald-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-base text-cyan-300 font-semibold tracking-widest uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-300 via-cyan-400 to-teal-300 bg-clip-text animate-glow">
            What Makes This Unique?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-700/40 text-cyan-200">
              <i className="fas fa-globe text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">One place for everything open</h3>
            <p className="mt-2 text-base text-teal-100/70">No more bouncing between 10 websites and Slack groups</p>
          </div>
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-400/20 text-emerald-300">
              <i className="fas fa-bolt text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Discovery → Action</h3>
            <p className="mt-2 text-base text-teal-100/70">Don&apos;t just read—build, remix, and do something immediately</p>
          </div>
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-700/30 text-purple-200">
              <i className="fas fa-users text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Community-first</h3>
            <p className="mt-2 text-base text-teal-100/70">Connect with people, not just code/resources. Feedback, help, mentorship, real team formation</p>
          </div>
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-cyan-600/30 text-cyan-200">
              <i className="fas fa-lock-open text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Open-by-default</h3>
            <p className="mt-2 text-base text-teal-100/70">Everything you build, unless private, is instantly reusable by others</p>
          </div>
        </div>
      </div>
      <div className="mt-20 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-40" />
    </section>
  );
}
