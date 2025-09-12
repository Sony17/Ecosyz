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
import BetaAccessForm from "./BetaAccessForm";
import { useState } from "react";

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016] min-h-screen flex items-center">
        {/* Globe background image */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/hero-globe.png"
            alt="Digital Globe Background"
            fill
            className="object-cover object-right"
            quality={100}
            priority
          />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-emerald-400/20 to-transparent opacity-80 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="grid lg:grid-cols-12 gap-16 items-center min-h-[70vh]">
              {/* Text */}
              <div className="lg:col-span-6 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
                  <span className="block mb-1 text-gray-100">The future of</span>
                  <span className="block font-extrabold text-5xl md:text-6xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent tracking-tight mb-4">
                    INNOVATION
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-teal-100/90 font-medium mt-6">
                  The World&apos;s Open Innovation Infrastructure
                </p>
                <p className="mt-2 text-teal-200/70 text-lg md:text-xl">
                  Where open minds meet open knowledge—dream it, build it, and change the world together.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row sm:justify-start gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg transition hover:scale-105 hover:shadow-neon"
                  >
                    Join the Beta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal for form */}
        {open && (
          <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
            <div className="relative">
              <button
                className="absolute top-2 right-2 text-cyan-200 text-2xl"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >×</button>
              <BetaAccessForm />
            </div>
          </div>
        )}
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 absolute bottom-0 left-0" />
      </section>
     
    </div>
  );
}
