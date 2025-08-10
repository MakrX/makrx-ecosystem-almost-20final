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
