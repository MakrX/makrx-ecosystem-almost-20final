"use client";

import { useEffect } from 'react';

export default function DevErrorHandler() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Handle unhandled promise rejections that might be related to RSC payload fetching
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      // Be more specific about RSC errors - only handle development-specific Next.js errors
      if (error && error.stack && (
          (error.message?.includes('Failed to fetch') &&
           (error.stack.includes('fetchServerResponse') ||
            error.stack.includes('fastRefreshReducerImpl') ||
            error.stack.includes('router-reducer'))) ||
          error.message?.includes('RSC payload'))) {

        // Only suppress these specific Next.js development errors
        console.warn('Development: Next.js RSC fetch error suppressed for better development experience');
        event.preventDefault();

        return; // Exit early to prevent further processing
      }
    };

    // Don't interfere with fetch operations in development
    // Let Next.js handle its own RSC fetches without intervention

    // Also handle regular errors that might be related to RSC
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      if (error && error.stack && (
          (error.message?.includes('Failed to fetch') &&
           error.stack.includes('fetchServerResponse')) ||
          error.message?.includes('RSC payload'))) {
        console.warn('Development: Next.js RSC-related error caught and suppressed');
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
