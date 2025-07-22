'use client';

export default function UniquePoints() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/3 top-1/2 w-[600px] h-[200px] bg-gradient-radial from-emerald-400/20 to-transparent blur-2xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-2 tracking-tight text-center uppercase">
            Our X-Factor
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Card 1 */}
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md transition
            hover:shadow-[0_0_32px_#12ffb880]
            hover:border-emerald-400
            hover:-translate-y-1
            hover:scale-105
          ">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-700/40 text-cyan-200">
              <i className="fas fa-globe text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">One place for everything open</h3>
            <p className="mt-2 text-base text-teal-100/70">No more bouncing between 10 websites and Slack groups</p>
          </div>
          {/* Card 2 */}
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md transition
            hover:shadow-[0_0_32px_#14ff6e80]
            hover:border-emerald-400
            hover:-translate-y-1
            hover:scale-105
          ">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-400/20 text-emerald-300">
              <i className="fas fa-bolt text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Discovery → Action</h3>
            <p className="mt-2 text-base text-teal-100/70">Don&apos;t just read—build, remix, and do something immediately</p>
          </div>
          {/* Card 3 */}
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md transition
            hover:shadow-[0_0_32px_#b38fff80]
            hover:border-emerald-400
            hover:-translate-y-1
            hover:scale-105
          ">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-700/30 text-purple-200">
              <i className="fas fa-users text-xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">Community-first</h3>
            <p className="mt-2 text-base text-teal-100/70">Connect with people, not just code/resources. Feedback, help, mentorship, real team formation</p>
          </div>
          {/* Card 4 */}
          <div className="text-center bg-[#162322] border border-emerald-400/30 rounded-xl p-6 shadow-md transition
            hover:shadow-[0_0_32px_#39fff680]
            hover:border-emerald-400
            hover:-translate-y-1
            hover:scale-105
          ">
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
