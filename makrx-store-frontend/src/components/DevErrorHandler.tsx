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
    const originalConsoleWarn = console.warn;

    console.error = (...args: any[]) => {
      const message = args.join(' ');
      if (isDevelopmentError(message)) {
        return; // Suppress completely
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args.join(' ');
      if (isDevelopmentError(message)) {
        return; // Suppress completely
      }
      originalConsoleWarn.apply(console, args);
    };

    // Also handle regular errors that might be related to RSC
    const handleError = (event: ErrorEvent) => {
      const error = event.error;

      if (error) {
        const errorMessage = error.message || '';
        const errorStack = error.stack || '';

        if (isDevelopmentError(errorMessage, errorStack)) {
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
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
}
