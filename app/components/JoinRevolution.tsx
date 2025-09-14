'use client';

export default function JoinRevolution() {
  return (
    <section className="pt-8 pb-20 bg-gradient-to-br from-[#152624] via-[#12362f] to-[#1b2a26] text-white relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-radial from-emerald-500/10 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-2 tracking-tight text-center uppercase">
            Shape What’s Next
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {/* Card 1 */}
          <div className="text-center glass-card glass-border rounded-xl p-8 transition-all duration-200 hover:-translate-y-2">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/80 to-cyan-400/70 text-white shadow">
              <i className="fas fa-flask text-2xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">For Innovators & Makers</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Transform your ideas into global impact. Access tools, find collaborators, and scale your projects with community support.
            </p>
            <div className="mt-6">
              <a href="#launch" className="inline-block px-6 py-2 rounded-md bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-medium shadow transition hover:scale-105">
                Launch Your Project
              </a>
            </div>
          </div>
          {/* Card 2 */}
          <div className="text-center glass-card glass-border rounded-xl p-8 transition-all duration-200 hover:-translate-y-2">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-teal-500/80 to-emerald-400/70 text-white shadow">
              <i className="fas fa-briefcase text-2xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">For Investors & Partners</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Back the entire ecosystem of innovation. Support multiple breakthrough technologies through a single platform investment.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-block px-6 py-2 rounded-md border border-cyan-400 text-cyan-200 font-medium shadow transition hover:bg-cyan-400 hover:text-gray-900">
                Partner With Us
              </a>
            </div>
          </div>
          {/* Card 3 */}
          <div className="text-center glass-card glass-border rounded-xl p-8 transition-all duration-200 hover:-translate-y-2">
            <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/80 to-emerald-400/70 text-white shadow">
              <i className="fas fa-globe-americas text-2xl"></i>
            </div>
            <h3 className="mt-4 text-lg font-semibold">For Organizations & NGOs</h3>
            <p className="mt-2 text-base text-teal-100/80">
              Amplify your mission through open innovation. Connect your challenges with global problem-solvers.
            </p>
            <div className="mt-6">
              <a href="#contact" className="inline-block px-6 py-2 rounded-md border border-emerald-400 text-emerald-200 font-medium shadow transition hover:bg-emerald-400 hover:text-gray-900">
                Join the Movement
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium mb-6">Join our community:</h3>
          <div className="flex justify-center space-x-6">
            <a
              href="https://discord.gg/4weahHXQYY"
              className="text-cyan-300 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-discord text-2xl"></i>
            </a>
            <a
              href="mailto:info@openidea.world"
              className="text-cyan-300 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-envelope text-2xl"></i>
            </a>
            <a
              href="https://x.com/OpenIdeaOrg"
              className="text-cyan-300 hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-share-alt text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
