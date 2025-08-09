import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "../../packages/ui/contexts/ThemeContext";
import EnhancedHeader from "./components/EnhancedHeader";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MakrCave from "./pages/MakrCave";
import Store from "./pages/Store";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import ProfilePage from "./pages/ProfilePage";
import FeatureFlagsAdmin from "./pages/admin/FeatureFlags";
import NotFound from "./pages/NotFound";

// Import feature flag provider
import { FeatureFlagProvider } from "../../packages/feature-flags/src/components/FeatureFlagProvider";

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
      <TooltipProvider>
        <FeatureFlagProvider initialContext={flagContext}>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <EnhancedHeader />
              <Routes>
                <Route path="/" element={<EnhancedIndex />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/makrcave" element={<MakrCave />} />
                <Route path="/store" element={<Store />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/profile" element={<EnhancedProfile />} />
                <Route path="/admin/feature-flags" element={<FeatureFlagsAdmin />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </FeatureFlagProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
