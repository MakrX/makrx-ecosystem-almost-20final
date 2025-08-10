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
import DevErrorHandler from "@/components/DevErrorHandler";
import ErrorBoundary from "@/components/ErrorBoundary";

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
        {/* Development-friendly fetch protection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Aggressive development error suppression
              (function(){
                const isDev = window.location.hostname === 'localhost' ||
                             window.location.hostname.includes('dev') ||
                             window.location.port ||
                             window.location.hostname.includes('fly.dev');
                if (isDev) {
                  // Suppress RSC and development errors early
                  const isDevelopmentError = (msg) => {
                    const text = (msg || '').toLowerCase();
                    return text.includes('failed to fetch') ||
                           text.includes('rsc payload') ||
                           text.includes('fetchserverresponse') ||
                           text.includes('fastrefresh') ||
                           text.includes('hot-reloader') ||
                           text.includes('webpack') ||
                           text.includes('fullstory') ||
                           text.includes('fs.js');
                  };

                  // Override early error handlers
                  window.addEventListener('error', (e) => {
                    if (isDevelopmentError(e.message) || isDevelopmentError(e.error?.message)) {
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', (e) => {
                    if (isDevelopmentError(e.reason?.message)) {
                      e.preventDefault();
                      return false;
                    }
                  }, true);
                } else {
                  // In production, apply fetch protection
                  try{
                    const f=fetch;
                    Object.defineProperty(window,'fetch',{value:f,writable:false,configurable:false});
                  }catch(e){}
                }
              })();
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Hydration issue prevention (production only)
              (function() {
                const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('dev') || window.location.port;
                if (isDev) return; // Skip in development

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
        <DevErrorHandler />
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col bg-background text-foreground">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <ToastNotifications />
              </ErrorBoundary>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
