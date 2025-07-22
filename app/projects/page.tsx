'use client';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Projects() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="py-20  text-white relative">
               <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-radial from-emerald-400/10 to-transparent blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text mb-4 text-center uppercase">
              Explore Open Projects
            </h1>
            <p className="text-lg text-teal-100/80 font-medium max-w-2xl mx-auto">
              Discover, remix, and contribute to breakthrough innovations. All projects here are community-powered and open by default.
            </p>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Project 1 */}
            <div className="bg-[#192527]/90 p-6 rounded-xl border border-emerald-400/10 shadow-lg hover:shadow-[0_0_32px_#10b98145] transition flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-emerald-200 mb-2">Open Climate Model</h2>
                <p className="text-teal-100/80 mb-6">
                  Collaborative, open-source AI for predicting climate impacts. Integrates public data and global code contributions.
                </p>
              </div>
              <Link
                href="/projects/open-climate-model"
                className="inline-block px-6 py-2 mt-auto bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-md shadow transition hover:scale-105 text-sm text-center"
              >
                View Project
              </Link>
            </div>
            {/* Project 2 */}
            <div className="bg-[#192535]/90 p-6 rounded-xl border border-cyan-400/10 shadow-lg hover:shadow-[0_0_32px_#00d9ff45] transition flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-cyan-200 mb-2">Healthcare AI Toolkit</h2>
                <p className="text-teal-100/80 mb-6">
                  Open health datasets and code for diagnosis, available for doctors and researchers worldwide.
                </p>
              </div>
              <Link
                href="/projects/healthcare-ai-toolkit"
                className="inline-block px-6 py-2 mt-auto bg-gradient-to-r from-cyan-400 to-emerald-400 text-gray-900 font-semibold rounded-md shadow transition hover:scale-105 text-sm text-center"
              >
                View Project
              </Link>
            </div>
            {/* Project 3 */}
            <div className="bg-[#1a2531]/90 p-6 rounded-xl border border-purple-400/10 shadow-lg hover:shadow-[0_0_32px_#c084fc45] transition flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-purple-200 mb-2">Open Hardware Lab</h2>
                <p className="text-teal-100/80 mb-6">
                  Build and share 3D printable hardware, circuits, and robotics—all designs open for remix.
                </p>
              </div>
              <Link
                href="/projects/open-hardware-lab"
                className="inline-block px-6 py-2 mt-auto bg-gradient-to-r from-purple-300 to-cyan-400 text-gray-900 font-semibold rounded-md shadow transition hover:scale-105 text-sm text-center"
              >
                View Project
              </Link>
            </div>
          </div>

          {/* Create Project Button */}
          <div className="mt-20 text-center">
            <a href="#create" className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg transition hover:scale-105">
              Start a New Project
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
