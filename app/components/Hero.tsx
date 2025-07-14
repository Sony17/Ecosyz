'use client';

import Image from 'next/image';
import FeatureCards from './FeatureCards';
import PurposeSection from './PurposeSection';
import UniquePoints from './UniquePoints';
import ResourcesSection from './ResourcesSection';
import ImpactSection from './ImpactSection';
import ChallengesSection from './ChallengesSection';
import TechnologySection from './TechnologySection';
import CommunitySection from './CommunitySection';
import JoinRevolution from './JoinRevolution';
import FAQSection from './FAQSection';
import FinalCTA from './FinalCTA';

export default function Hero() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016]">
        {/* Spot Light Effect */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-emerald-400/20 to-transparent opacity-80 blur-3xl"></div>
        </div>
        {/* Main content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
                <span className="block mb-1 text-gray-100">The future of</span>
                <span className="block text-transparent bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 bg-clip-text animate-glow">
                  INNOVATION
                </span>
              </h1>
              <p className="text-lg md:text-xl text-teal-100/90 font-medium mt-6">
                The World&apos;s Open Innovation Infrastructure
              </p>
              <p className="mt-2 text-teal-200/70 text-lg md:text-xl">
                The Home for Builders, Dreamers, and Doers
              </p>
              <p className="mt-2 text-gray-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0">

                All the world&apos;s open knowledge—unified. Build, collaborate, and change the world together, openly.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:justify-start gap-4 justify-center">
                <a
                  href="#beta"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg transition hover:scale-105 hover:shadow-neon"
                >
                  Join the Beta
                </a>
                <a
                  href="#access"
                  className="inline-block px-8 py-3 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-gray-900 font-semibold rounded-lg transition shadow"
                >
                  Get Early Access
                </a>
              </div>
            </div>
            {/* Image */}
            <div className="lg:col-span-6 flex justify-center items-center mt-14 lg:mt-0">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-2xl bg-gradient-to-tr from-[#19343d] via-[#152624] to-[#0f1b1c] shadow-lg flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl z-0 blur-2xl bg-gradient-radial from-emerald-300/20 to-transparent" />
                <Image
                  src="/eco.png"
                  alt="Open Innovation"
                  fill
                  className="object-contain z-10 drop-shadow-[0_0_32px_#12ffb8bb]"
                  priority
                />


              </div>
            </div>
          </div>
        </div>
        {/* Subtle Divider */}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />
      </section>


      <FeatureCards />
      <PurposeSection />
      <UniquePoints />
      <ResourcesSection />
      <ImpactSection />
      <ChallengesSection />
      <TechnologySection />
      <CommunitySection />
      <JoinRevolution />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
