"use client";

import { useEffect } from "react";

export function ErrorSuppression() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Suppress unhandled promise rejections for network errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message &&
          (event.reason.message.includes("NetworkError") ||
           event.reason.message.includes("Failed to fetch") ||
           event.reason.message.includes("404") ||
           event.reason.message.includes("ECONNREFUSED") ||
           event.reason.message.includes("ERR_NETWORK"))) {
        console.warn("Suppressed network error in development mode:", event.reason.message);
        event.preventDefault();
      }
    };

    // Override console.error to filter out network errors and hydration warnings
    const originalError = console.error;
    const filteredError = (...args: any[]) => {
      const message = args.join(" ");
      if (message.includes("NetworkError") ||
          message.includes("Failed to fetch") ||
          message.includes("/api/placeholder") ||
          message.includes("ERR_NETWORK") ||
          message.includes("ERR_INTERNET_DISCONNECTED") ||
          message.includes("localhost:8003") ||
          message.includes("ECONNREFUSED") ||
          message.includes("Extra attributes from the server") ||
          message.includes("data-new-gr-c-s-check-loaded") ||
          message.includes("data-gr-ext-installed") ||
          message.includes("Hydration failed")) {
        return; // Suppress these errors
      }
      originalError.apply(console, args);
    };

    // Override window.onerror to catch any remaining errors
    const handleWindowError = (
      message: string | Event,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      if (typeof message === "string" &&
          (message.includes("NetworkError") ||
           message.includes("Failed to fetch") ||
           message.includes("/api/placeholder") ||
           message.includes("ECONNREFUSED") ||
           message.includes("Extra attributes from the server") ||
           message.includes("data-new-gr-c-s-check-loaded") ||
           message.includes("data-gr-ext-installed") ||
           message.includes("Hydration failed"))) {
        return true; // Suppress the error
      }
      return false; // Let other errors through
    };

    // Store original fetch for cleanup, but don't intercept it
    const originalFetch = window.fetch;

    // Add global resource error handler
    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target && target.tagName === "IMG") {
        const imgTarget = target as HTMLImageElement;
        // Replace broken images with placeholder
        if (imgTarget.src.includes("/api/placeholder") || !imgTarget.src.startsWith("http")) {
          imgTarget.src = "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Image";
          console.warn("Replaced broken image:", imgTarget.src);
          event.preventDefault();
          return;
        }
      }

      // Handle other resource loading errors
      if (target && (target.tagName === "SCRIPT" || target.tagName === "LINK")) {
        const src = (target as any).src || (target as any).href;
        if (src && (src.includes("/api/") || src.includes("localhost:8003"))) {
          console.warn("Suppressed resource loading error in development:", src);
          event.preventDefault();
        }
      }
    };

    // Set up all handlers
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    console.error = filteredError;
    window.onerror = handleWindowError;
    window.fetch = interceptedFetch;
    document.addEventListener("error", handleResourceError, true);

    console.info("🔧 Development Mode: Network error suppression enabled");

    // Cleanup function
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      console.error = originalError;
      window.onerror = null;
      window.fetch = originalFetch;
      document.removeEventListener("error", handleResourceError, true);
    };
  }, []);

  return null; // This component doesn't render anything
}
