'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import to avoid SSR issues with useSearchParams
const ResourcesPageContent = dynamic(() => import('./ResourcesPageContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResourcesPageContent />
    </Suspense>
  );
}