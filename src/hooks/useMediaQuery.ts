import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that tracks whether a CSS media query matches.
 *
 * @param query - A CSS media query string, e.g. '(max-width: 768px)'
 * @returns `true` if the query currently matches, `false` otherwise
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Create listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Returns `true` when the viewport width is ≤ 768px.
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * Returns `true` when the viewport width is between 769px and 1024px.
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

/**
 * Returns `true` when the viewport width is ≥ 1025px.
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}
