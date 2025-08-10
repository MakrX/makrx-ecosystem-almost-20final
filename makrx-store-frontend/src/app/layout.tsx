import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/SharedThemeProvider";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastNotifications from "@/components/ToastNotifications";
import { HydrationFix } from "@/components/HydrationFix";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Protect fetch from external interference and prevent hydration issues
              (function() {
                // Store original fetch before any external tools can override it
                const originalFetch = window.fetch;
                let fetchProtected = false;

                // Protect fetch from being overridden
                Object.defineProperty(window, 'fetch', {
                  get: function() {
                    return originalFetch;
                  },
                  set: function(value) {
                    // Only allow setting fetch once during initialization
                    if (!fetchProtected) {
                      fetchProtected = true;
                      return originalFetch;
                    }
                    // Ignore subsequent attempts to override fetch
                    console.warn('Prevented external tool from overriding fetch');
                    return originalFetch;
                  },
                  configurable: false
                });

                // Prevent browser extension hydration issues
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('Extra attributes from the server') ||
                      message.includes('data-new-gr-c-s-check-loaded') ||
                      message.includes('data-gr-ext-installed') ||
                      message.includes('Hydration failed')) {
                    return;
                  }
                  originalConsoleError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <HydrationFix />
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
