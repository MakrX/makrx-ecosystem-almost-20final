"use client";

import { useEffect } from 'react';

export default function DevErrorHandler() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // More aggressive pattern matching for development errors
    const isDevelopmentError = (message: string, stack?: string) => {
      const errorText = (message + ' ' + (stack || '')).toLowerCase();

      return (
        errorText.includes('failed to fetch') ||
        errorText.includes('rsc payload') ||
        errorText.includes('fetchserverresponse') ||
        errorText.includes('fastrefreshreducerimpl') ||
        errorText.includes('hot-reloader-client') ||
        errorText.includes('router-reducer') ||
        errorText.includes('app-router') ||
        errorText.includes('webpack') ||
        errorText.includes('hmrm') ||
        errorText.includes('fullstory') ||
        errorText.includes('fs.js') ||
        errorText.includes('use-reducer-with-devtools') ||
        errorText.includes('action-queue')
      );
    };

    // Handle unhandled promise rejections that might be related to RSC payload fetching
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;

      if (error) {
        const errorMessage = error.message || '';
        const errorStack = error.stack || '';

        if (isDevelopmentError(errorMessage, errorStack)) {
          event.preventDefault();
          return;
        }
      }
    };

    // Suppress console errors for development-related issues
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args.join(' ');

      // Check for development-specific error patterns
      if (message.includes('Failed to fetch') && (
          message.includes('RSC payload') ||
          message.includes('fetchServerResponse') ||
          message.includes('fastRefreshReducerImpl') ||
          message.includes('hot-reloader-client')
        )) {
        // Suppress these development errors
        return;
      }

      // Call original console.error for other errors
      originalConsoleError.apply(console, args);
    };

    // Also handle regular errors that might be related to RSC
    const handleError = (event: ErrorEvent) => {
      const error = event.error;

      if (error && (error.message || error.stack)) {
        const errorMessage = error.message || '';
        const errorStack = error.stack || '';

        // Development-related error patterns
        const isDevelopmentError = (
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('RSC payload') ||
          errorStack.includes('fetchServerResponse') ||
          errorStack.includes('fastRefreshReducerImpl') ||
          errorStack.includes('webpack') ||
          errorStack.includes('fullstory.com') ||
          errorStack.includes('hot-reloader-client')
        );

        if (isDevelopmentError) {
          console.warn('Development: Error caught and suppressed:', errorMessage);
          event.preventDefault();
          return false;
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      // Restore original console.error
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
