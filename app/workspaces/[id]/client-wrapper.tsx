'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Use dynamic import to prevent hydration issues with components using browser-only APIs
const WorkspaceClientPage = dynamic(
  () => import('./client-page'),
  { ssr: false }
);

export default function ClientWorkspaceWrapper() {
  const [mounted, setMounted] = useState(false);
  
  // Wait for client-side hydration to complete before rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0c2321] via-[#121f22] to-[#0a1016]">
        <div className="flex flex-col items-center glass-card p-8 rounded-2xl">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-neon-green rounded-full animate-spin"></div>
          <p className="text-white mt-4">Loading workspace...</p>
        </div>
      </div>
    );
  }
  
  return <WorkspaceClientPage />;
}