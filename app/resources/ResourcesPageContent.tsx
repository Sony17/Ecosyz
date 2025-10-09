'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ResourcesBrowser from '../components/resources/ResourcesBrowser';
import { useSession } from 'next-auth/react';
import { Sparkles } from 'lucide-react';

export default function ResourcesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Get query params
  const query = searchParams?.get('q') || '';
  const category = searchParams?.get('category') || 'all';

  // State to determine if we're showing personal resources
  const [showPersonal, setShowPersonal] = useState<boolean>(false);

  // Handle tab change
  const handleTabChange = (isPersonal: boolean) => {
    setShowPersonal(isPersonal);

    // Optional: update URL to reflect the view state
    // This could be done with router.push but would cause a page reload
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Resources
              </h1>
              <p className="mt-2 text-lg text-zinc-400 max-w-3xl">
                Explore our curated collection of resources to enhance your knowledge and skills in various domains.
              </p>
            </div>

            {status === 'authenticated' && (
              <div className="mt-6 lg:mt-0">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm text-sm font-medium"
                  onClick={() => router.push('/workspaces/resources/new')}
                >
                  <Sparkles className="w-4 h-4" />
                  Create New Resource
                </button>
              </div>
            )}
          </div>

          {/* View Tabs - Show if user is authenticated */}
          {status === 'authenticated' && (
            <div className="mt-8 border-b border-zinc-800">
              <div className="flex space-x-8">
                <button
                  onClick={() => handleTabChange(false)}
                  className={`py-3 border-b-2 text-sm font-medium ${
                    !showPersonal
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  Explore All
                </button>
                <button
                  onClick={() => handleTabChange(true)}
                  className={`py-3 border-b-2 text-sm font-medium ${
                    showPersonal
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  My Resources
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ResourcesBrowser
          searchQuery={query}
          initialCategory={category}
          userId={showPersonal && session?.user ? session.user.id : undefined}
        />
      </div>
    </div>
  );
}