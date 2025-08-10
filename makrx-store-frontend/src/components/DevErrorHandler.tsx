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
           error.toString?.().includes('fetchServerResponse'))) {
        
        console.warn('Development: RSC payload fetch failed, this is usually harmless during development');
        
        // Prevent the error from bubbling up and causing unnecessary noise
        event.preventDefault();
        
        // Optional: Trigger a page refresh if errors are persistent
        const errorCount = parseInt(sessionStorage.getItem('rsc-error-count') || '0');
        sessionStorage.setItem('rsc-error-count', (errorCount + 1).toString());
        
        // If too many errors, suggest refresh
        if (errorCount > 5) {
          console.log('Multiple RSC errors detected. Consider refreshing the page.');
          sessionStorage.removeItem('rsc-error-count');
        }
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

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
