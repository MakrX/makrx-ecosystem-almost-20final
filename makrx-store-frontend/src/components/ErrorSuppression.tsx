"use client";

import { useEffect } from "react";

export function ErrorSuppression() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Only handle essential console error filtering for hydration warnings
    const originalError = console.error;
    const filteredError = (...args: any[]) => {
      const message = args.join(" ");
      if (message.includes("Extra attributes from the server") ||
          message.includes("data-new-gr-c-s-check-loaded") ||
          message.includes("data-gr-ext-installed") ||
          message.includes("Hydration failed")) {
        return; // Suppress these hydration-related errors
      }
      originalError.apply(console, args);
    };

    // Set up minimal error handling
    console.error = filteredError;

    console.info("🔧 Development Mode: Hydration error suppression enabled");

    // Cleanup function
    return () => {
      console.error = originalError;
    };
  }, []);

  return null; // This component doesn't render anything
}
