"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface PortalToken {
  portal: string;
  token: string;
  expires_at: number;
  url: string;
}

interface CrossPortalAuthContextValue {
  portalTokens: Map<string, PortalToken>;
  navigateToPortal: (portal: string, path?: string) => Promise<void>;
  generatePortalToken: (portal: string) => Promise<PortalToken | null>;
  isPortalAuthenticated: (portal: string) => boolean;
  refreshPortalToken: (portal: string) => Promise<void>;
  signOutFromAllPortals: () => Promise<void>;
}

const CrossPortalAuthContext = createContext<
  CrossPortalAuthContextValue | undefined
>(undefined);

const AUTH_SERVICE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8001";

const PORTAL_URLS = {
  gateway: import.meta.env.VITE_GATEWAY_URL || "http://localhost:3000",
  makrcave: import.meta.env.VITE_MAKRCAVE_URL || "http://localhost:3001",
  store: import.meta.env.VITE_STORE_URL || "http://localhost:3003",
};

export function CrossPortalAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, isAuthenticated } = useAuth();
  const [portalTokens, setPortalTokens] = useState<Map<string, PortalToken>>(
    new Map(),
  );

  // Clean up expired tokens
  useEffect(() => {
    const cleanupExpiredTokens = () => {
      const now = Date.now();
      setPortalTokens((prev) => {
        const updated = new Map(prev);
        for (const [portal, tokenData] of updated.entries()) {
          if (tokenData.expires_at < now) {
            updated.delete(portal);
            console.log(`Removed expired token for portal: ${portal}`);
          }
        }
        return updated;
      });
    };

    // Clean up expired tokens every minute
    const interval = setInterval(cleanupExpiredTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  const generatePortalToken = async (
    portal: string,
  ): Promise<PortalToken | null> => {
    if (!isAuthenticated || !token) {
      console.error("User not authenticated for portal token generation");
      return null;
    }

    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/token/exchange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          portal,
          redirect_url: `${PORTAL_URLS[portal as keyof typeof PORTAL_URLS]}/auth/callback`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Portal token generation failed: ${response.status}`);
      }

      const tokenData = await response.json();

      const portalToken: PortalToken = {
        portal,
        token: tokenData.access_token,
        expires_at: Date.now() + tokenData.expires_in * 1000,
        url: PORTAL_URLS[portal as keyof typeof PORTAL_URLS],
      };

      // Store token
      setPortalTokens((prev) => new Map(prev).set(portal, portalToken));

      console.log(`Generated token for portal: ${portal}`);
      return portalToken;
    } catch (error) {
      console.error(`Failed to generate token for portal ${portal}:`, error);
      return null;
    }
  };

  const navigateToPortal = async (
    portal: string,
    path: string = "/",
  ): Promise<void> => {
    if (!isAuthenticated) {
      console.error("User must be authenticated to navigate to portals");
      return;
    }

    try {
      // Check if we have a valid token for this portal
      let portalToken = portalTokens.get(portal);

      // Generate new token if none exists or expired
      if (!portalToken || portalToken.expires_at < Date.now()) {
        console.log(`Generating new token for portal: ${portal}`);
        portalToken = await generatePortalToken(portal);

        if (!portalToken) {
          throw new Error(`Failed to generate token for portal: ${portal}`);
        }
      }

      // Construct portal URL with token and path
      const portalUrl = new URL(portalToken.url);
      portalUrl.searchParams.set("auth_token", portalToken.token);
      portalUrl.searchParams.set("portal_auth", "true");

      // Add path if specified
      if (path && path !== "/") {
        portalUrl.pathname = path;
      }

      // Navigate to portal
      window.open(portalUrl.toString(), "_blank", "noopener,noreferrer");

      console.log(`Navigated to portal: ${portal}${path}`);
    } catch (error) {
      console.error(`Portal navigation failed for ${portal}:`, error);
      throw error;
    }
  };

  const isPortalAuthenticated = (portal: string): boolean => {
    const portalToken = portalTokens.get(portal);
    return portalToken ? portalToken.expires_at > Date.now() : false;
  };

  const refreshPortalToken = async (portal: string): Promise<void> => {
    console.log(`Refreshing token for portal: ${portal}`);
    await generatePortalToken(portal);
  };

  const signOutFromAllPortals = async (): Promise<void> => {
    try {
      // Clear all portal tokens
      setPortalTokens(new Map());

      // Notify all portals of sign out (if they're open in other tabs)
      for (const portal of Object.keys(PORTAL_URLS)) {
        try {
          // Post message to portal windows (if accessible)
          window.postMessage(
            {
              type: "CROSS_PORTAL_SIGNOUT",
              portal,
              timestamp: Date.now(),
            },
            "*",
          );
        } catch (error) {
          // Ignore errors for cross-origin restrictions
        }
      }

      console.log("Signed out from all portals");
    } catch (error) {
      console.error("Error during cross-portal sign out:", error);
    }
  };

  // Listen for authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear all portal tokens when user signs out
      setPortalTokens(new Map());
    }
  }, [isAuthenticated]);

  // Listen for cross-portal messages
  useEffect(() => {
    const handleCrossPortalMessage = (event: MessageEvent) => {
      if (event.data?.type === "CROSS_PORTAL_SIGNOUT") {
        console.log("Received cross-portal signout message");
        setPortalTokens(new Map());
      }
    };

    window.addEventListener("message", handleCrossPortalMessage);
    return () =>
      window.removeEventListener("message", handleCrossPortalMessage);
  }, []);

  const value: CrossPortalAuthContextValue = {
    portalTokens,
    navigateToPortal,
    generatePortalToken,
    isPortalAuthenticated,
    refreshPortalToken,
    signOutFromAllPortals,
  };

  return (
    <CrossPortalAuthContext.Provider value={value}>
      {children}
    </CrossPortalAuthContext.Provider>
  );
}

export function useCrossPortalAuth() {
  const context = useContext(CrossPortalAuthContext);
  if (context === undefined) {
    throw new Error(
      "useCrossPortalAuth must be used within a CrossPortalAuthProvider",
    );
  }
  return context;
}

// Hook for portal-specific token management
export function usePortalToken(portal: string) {
  const { portalTokens, generatePortalToken, refreshPortalToken } =
    useCrossPortalAuth();

  const portalToken = portalTokens.get(portal);
  const isValid = portalToken ? portalToken.expires_at > Date.now() : false;

  const ensureToken = async (): Promise<string | null> => {
    if (isValid && portalToken) {
      return portalToken.token;
    }

    const newToken = await generatePortalToken(portal);
    return newToken?.token || null;
  };

  return {
    token: portalToken?.token || null,
    isValid,
    expires_at: portalToken?.expires_at,
    ensureToken,
    refresh: () => refreshPortalToken(portal),
  };
}
