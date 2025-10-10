'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the existing ResourcesBrowser component
const ResourcesPageContent = dynamic(() => import('../components/resources/ResourcesBrowser'), {
  ssr: false,
  loading: () => <div>Loading resources...</div>
});

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div>Loading resources...</div>}>
      <ResourcesPageContent />
    </Suspense>
  );
}