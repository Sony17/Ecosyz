'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the GitHub Pages documentation site
    window.location.href = 'https://sony17.github.io/Ecosyz/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting to Documentation...</h1>
        <p className="text-gray-600">
          If you are not redirected automatically,{' '}
          <a
            href="https://sony17.github.io/Ecosyz/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}