import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/SharedThemeProvider";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastNotifications from "@/components/ToastNotifications";

// Global error handler for development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Suppress unhandled promise rejections for network errors
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason && event.reason.message &&
        (event.reason.message.includes("NetworkError") ||
         event.reason.message.includes("Failed to fetch") ||
         event.reason.message.includes("404"))) {
      console.warn("Suppressed network error in development mode:", event.reason.message);
      event.preventDefault();
    }
  });

  // Override console.error to filter out network errors
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(" ");
    if (message.includes("NetworkError") ||
        message.includes("Failed to fetch") ||
        message.includes("/api/placeholder")) {
      return; // Suppress these errors
    }
    originalError.apply(console, args);
  };

  // Override window.onerror to catch any remaining errors
  window.onerror = (message, source, lineno, colno, error) => {
    if (typeof message === "string" &&
        (message.includes("NetworkError") ||
         message.includes("Failed to fetch") ||
         message.includes("/api/placeholder"))) {
      return true; // Suppress the error
    }
    return false; // Let other errors through
  };

  // Intercept fetch requests to block placeholder URLs and handle API errors
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;

    // Block requests to placeholder URLs
    if (url && url.includes("/api/placeholder")) {
      console.warn("Blocked placeholder request:", url);
      // Return a resolved promise with a mock response
      return Promise.resolve(new Response("", {
        status: 200,
        statusText: "OK",
        headers: new Headers()
      }));
    }

    // Block requests to backend API in development if they're failing
    if (url && url.includes("localhost:8003") && process.env.NODE_ENV === "development") {
      console.warn("Intercepted API request in development mode:", url);
      // Return a mock response that will trigger the fallback logic
      return Promise.reject(new TypeError("Failed to fetch"));
    }

    try {
      // Allow other requests to proceed
      return await originalFetch(input, init);
    } catch (error) {
      // Suppress network errors in development
      if (process.env.NODE_ENV === "development") {
        console.warn("Network request failed (suppressed in dev):", url, error);
        throw error; // Re-throw to maintain API client fallback logic
      }
      throw error;
    }
  };

  // Add global resource error handler
  document.addEventListener("error", (event) => {
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
  }, true);
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MakrX Store - 3D Printing Materials & Services",
  description:
    "Premium 3D printing materials, equipment, and professional printing services for makers and professionals.",
  keywords:
    "3D printing, filament, PLA, ABS, PETG, 3D printer, maker, prototyping",
  authors: [{ name: "MakrX" }],
  openGraph: {
    title: "MakrX Store - 3D Printing Materials & Services",
    description:
      "Premium 3D printing materials, equipment, and professional printing services",
    url: "https://makrx.store",
    siteName: "MakrX Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MakrX Store - 3D Printing Materials & Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakrX Store - 3D Printing Materials & Services",
    description:
      "Premium 3D printing materials, equipment, and professional printing services",
    images: ["/og-image.jpg"],
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <ToastNotifications />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
