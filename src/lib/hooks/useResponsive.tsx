'use client';

import { useState, useEffect } from 'react';

// Responsive breakpoints (matching TailwindCSS defaults)
export const breakpoints = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

export type Breakpoint = keyof typeof breakpoints;

/**
 * Custom hook for responsive design using media queries
 * @param query The media query to check
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check for window to avoid SSR issues
    if (typeof window === 'undefined') return;
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial state
    setMatches(mediaQuery.matches);
    
    // Create handler for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup function
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook for checking if screen is at least a certain breakpoint
 * @param breakpoint The breakpoint to check
 * @returns Boolean indicating if screen is at least the specified breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(breakpoints[breakpoint]);
}

/**
 * Custom hook to get the current active breakpoint
 * @returns The current active breakpoint name
 */
export function useCurrentBreakpoint(): Breakpoint | null {
  const isXs = useMediaQuery(breakpoints.xs);
  const isSm = useMediaQuery(breakpoints.sm);
  const isMd = useMediaQuery(breakpoints.md);
  const isLg = useMediaQuery(breakpoints.lg);
  const isXl = useMediaQuery(breakpoints.xl);
  const is2xl = useMediaQuery(breakpoints['2xl']);
  
  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  if (isSm) return 'sm';
  if (isXs) return 'xs';
  return null;
}

/**
 * Custom hook for responsive design with multiple breakpoints
 * @returns Object with boolean flags for each breakpoint
 */
export default function useResponsive() {
  return {
    isXs: useMediaQuery(breakpoints.xs),
    isSm: useMediaQuery(breakpoints.sm),
    isMd: useMediaQuery(breakpoints.md),
    isLg: useMediaQuery(breakpoints.lg),
    isXl: useMediaQuery(breakpoints.xl),
    is2xl: useMediaQuery(breakpoints['2xl']),
    isMobile: useMediaQuery('(max-width: 767px)'),
    isTablet: useMediaQuery('(min-width: 768px) and (max-width: 1023px)'),
    isDesktop: useMediaQuery('(min-width: 1024px)'),
    current: useCurrentBreakpoint(),
    useBreakpoint,
    useMediaQuery
  };
}