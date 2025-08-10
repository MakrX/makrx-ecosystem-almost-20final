"use client";

import { useEffect } from 'react';

export default function DevErrorHandler() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Handle unhandled promise rejections that might be related to RSC payload fetching
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      // Check if this is a Next.js RSC payload fetch error
      if (error &&
          (error.message?.includes('Failed to fetch') ||
           error.message?.includes('RSC payload') ||
           error.toString?.().includes('fetchServerResponse') ||
           error.toString?.().includes('fastRefreshReducerImpl') ||
           error.toString?.().includes('router-reducer'))) {

        console.warn('Development: RSC payload fetch failed, preventing error propagation');

        // Prevent the error from bubbling up and causing unnecessary noise
        event.preventDefault();

        // Reset error count periodically
        const now = Date.now();
        const lastErrorTime = parseInt(sessionStorage.getItem('rsc-error-time') || '0');
        if (now - lastErrorTime > 30000) { // Reset every 30 seconds
          sessionStorage.setItem('rsc-error-count', '0');
        }
        sessionStorage.setItem('rsc-error-time', now.toString());

        const errorCount = parseInt(sessionStorage.getItem('rsc-error-count') || '0') + 1;
        sessionStorage.setItem('rsc-error-count', errorCount.toString());

        // If too many errors in a short time, suggest refresh
        if (errorCount > 10) {
          console.log('Multiple RSC errors detected. The page will continue to work normally.');
          sessionStorage.setItem('rsc-error-count', '0');
        }

        return; // Exit early to prevent further processing
      }
    };

    // Handle general fetch errors that might be affecting RSC
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        // Check if this looks like an RSC-related fetch
        const url = args[0]?.toString() || '';
        if (url.includes('/_next/') || url.includes('RSC')) {
          console.warn('Development: Next.js internal fetch failed', url, error);
          // Don't throw for internal Next.js fetches in development
          return new Response('{}', { status: 200 });
        }
        throw error;
      }
    };

    // Also handle regular errors that might be related to RSC
    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      if (error &&
          (error.message?.includes('Failed to fetch') ||
           error.message?.includes('RSC payload') ||
           error.message?.includes('fetchServerResponse'))) {
        console.warn('Development: RSC-related error caught and suppressed');
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
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
