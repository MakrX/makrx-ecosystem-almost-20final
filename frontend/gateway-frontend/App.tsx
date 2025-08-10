import "./global.css";
import React from "react";

import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./lib/ui";
import { FeatureFlagProvider } from "./lib/feature-flags";
import EnhancedHeader from "./components/EnhancedHeader";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import MakrCave from "./pages/MakrCave";
import Store from "./pages/Store";
import Learn from "./pages/Learn";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import FeatureFlagsAdmin from "./pages/admin/FeatureFlags";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => {
  // Build feature flag context
  const flagContext = {
    userId: undefined, // Will be set by AuthProvider
    sessionId: undefined,
    roles: [],
    environment: process.env.NODE_ENV as 'development' | 'staging' | 'production' || 'development',
    userAgent: navigator.userAgent,
    country: 'IN', // Default to India, can be detected
    pincode: undefined
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
          <FeatureFlagProvider initialContext={flagContext}>
            <AuthProvider>
              <Helmet>
                <title>MakrX - Your Creative Ecosystem | Makerspaces, Tools & Learning</title>
                <meta name="description" content="Access world-class makerspaces, shop cutting-edge tools, and learn new skills. Join India's largest maker ecosystem with 50+ locations, 10K+ creators, and comprehensive learning resources." />
                <meta name="keywords" content="makerspace, 3d printing, laser cutting, electronics, arduino, innovation, learning, tools, india, bangalore, mumbai, delhi" />
                <meta property="og:title" content="MakrX - Your Creative Ecosystem" />
                <meta property="og:description" content="Access world-class makerspaces, shop cutting-edge tools, and learn new skills. Join India's largest maker ecosystem." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://makrx.org" />
                <meta property="og:image" content="https://makrx.org/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@makrx" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://makrx.org" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#1e40af" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Helmet>
              
              
              <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                  <EnhancedHeader />
                  
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/makrcave" element={<MakrCave />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/learn" element={<Learn />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/admin/feature-flags" element={<FeatureFlagsAdmin />} />
                      
                      {/* Additional important pages */}
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-4">Help Center</h1><p>Find answers to common questions</p></div></div>} />
                      <Route path="/privacy" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-4">Privacy Policy</h1><p>Your privacy is important to us</p></div></div>} />
                      <Route path="/terms" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-4">Terms of Service</h1><p>Terms and conditions for using MakrX</p></div></div>} />
                      <Route path="/safety" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-4">Safety Guidelines</h1><p>Safety first in all makerspaces</p></div></div>} />
                      
                      {/* Catch-all route for 404 - MUST be last */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  
                  <Footer />
                </div>
              </BrowserRouter>
            </AuthProvider>
          </FeatureFlagProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

createRoot(document.getElementById("root")!).render(<App />);
