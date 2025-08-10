"use client";

import { useEffect } from 'react';

export default function DevErrorHandler() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Handle unhandled promise rejections that might be related to RSC payload fetching
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      // Check for various development-related error patterns
      if (error && (error.message || error.stack)) {
        const errorMessage = error.message || '';
        const errorStack = error.stack || '';

        // Next.js development errors
        const isNextJSDevError = errorMessage.includes('Failed to fetch') && (
          errorStack.includes('fetchServerResponse') ||
          errorStack.includes('fastRefreshReducerImpl') ||
          errorStack.includes('router-reducer') ||
          errorStack.includes('app-router') ||
          errorStack.includes('hot-reloader-client') ||
          errorStack.includes('webpack') ||
          errorStack.includes('hmrM')
        );

        // FullStory/third-party errors
        const isThirdPartyError = errorStack.includes('fullstory.com') ||
                                 errorStack.includes('fs.js');

        // RSC payload errors
        const isRSCError = errorMessage.includes('RSC payload') ||
                          errorMessage.includes('Failed to fetch RSC');

        if (isNextJSDevError || isThirdPartyError || isRSCError) {
          console.warn('Development: Error suppressed for better development experience:', errorMessage);
          event.preventDefault();
          return;
        }
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
