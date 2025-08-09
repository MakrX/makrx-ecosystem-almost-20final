"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Store,
  Wrench,
  Home,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCrossPortalAuth } from "@/contexts/CrossPortalAuth";
import { useAuth } from "@/contexts/AuthContext";

interface Portal {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  features: string[];
  status: "active" | "beta" | "coming_soon";
}

const portals: Portal[] = [
  {
    id: "gateway",
    name: "MakrX Gateway",
    description: "Central hub for navigation and account management",
    icon: Home,
    url: "/",
    features: [
      "Single Sign-On",
      "Profile Management",
      "Cross-Portal Navigation",
    ],
    status: "active",
  },
  {
    id: "makrcave",
    name: "MakrCave",
    description: "Makerspace management and project collaboration",
    icon: Wrench,
    url: "/makrcave",
    features: [
      "Equipment Booking",
      "Inventory Management",
      "Project Tracking",
      "Member Management",
    ],
    status: "active",
  },
  {
    id: "store",
    name: "MakrX Store",
    description: "E-commerce platform for makers and 3D printing services",
    icon: Store,
    url: "/store",
    features: [
      "Product Catalog",
      "3D Printing Services",
      "Order Management",
      "File Upload & Quotes",
    ],
    status: "active",
  },
];

export default function PortalNavigation() {
  const { isAuthenticated } = useAuth();
  const { navigateToPortal, isPortalAuthenticated, generatePortalToken } =
    useCrossPortalAuth();

  const [loadingPortal, setLoadingPortal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePortalNavigation = async (portal: Portal) => {
    if (!isAuthenticated) {
      setError("Please sign in to access portals");
      return;
    }

    setLoadingPortal(portal.id);
    setError(null);

    try {
      await navigateToPortal(portal.id);
      setLoadingPortal(null);
    } catch (error) {
      console.error(`Portal navigation failed:`, error);
      setError(`Failed to navigate to ${portal.name}. Please try again.`);
      setLoadingPortal(null);
    }
  };

  const getPortalStatusBadge = (portal: Portal) => {
    const isAuth = isPortalAuthenticated(portal.id);

    if (portal.status === "coming_soon") {
      return <Badge variant="secondary">Coming Soon</Badge>;
    }

    if (portal.status === "beta") {
      return <Badge variant="outline">Beta</Badge>;
    }

    if (isAuthenticated) {
      return isAuth ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Ready
        </Badge>
      ) : (
        <Badge variant="outline">Authentication Required</Badge>
      );
    }

    return <Badge variant="secondary">Sign In Required</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">MakrX Portal Network</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access all MakrX services with seamless single sign-on authentication.
          Navigate between portals without re-entering your credentials.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Authentication Status */}
      {!isAuthenticated && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Sign in required:</strong> Please sign in to access MakrX
            portals with SSO authentication.
          </AlertDescription>
        </Alert>
      )}

      {/* Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isCurrentPortal = portal.id === "gateway";
          const isLoading = loadingPortal === portal.id;

          return (
            <Card
              key={portal.id}
              className={`relative transition-all hover:shadow-lg ${
                isCurrentPortal ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{portal.name}</CardTitle>
                      {isCurrentPortal && (
                        <Badge variant="outline" className="text-xs">
                          Current Portal
                        </Badge>
                      )}
                    </div>
                  </div>
                  {getPortalStatusBadge(portal)}
                </div>
                <CardDescription className="text-sm">
                  {portal.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {portal.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Navigation Button */}
                <div className="pt-2">
                  {isCurrentPortal ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Home className="w-4 h-4 mr-2" />
                      Current Portal
                    </Button>
                  ) : portal.status === "coming_soon" ? (
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePortalNavigation(portal)}
                      disabled={!isAuthenticated || isLoading}
                      className="w-full"
                      variant={isAuthenticated ? "default" : "outline"}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {isAuthenticated
                            ? `Open ${portal.name}`
                            : "Sign In Required"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SSO Information */}
      {isAuthenticated && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <CheckCircle className="w-5 h-5 mr-2" />
              Single Sign-On Active
            </CardTitle>
            <CardDescription className="text-blue-700">
              You're authenticated across the MakrX ecosystem. Navigate
              seamlessly between portals without re-entering credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Unified Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure Token Exchange</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Real-time Sync</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access */}
      {isAuthenticated && (
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePortalNavigation(portals[1])} // MakrCave
            disabled={loadingPortal === "makrcave"}
          >
            {loadingPortal === "makrcave" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wrench className="w-4 h-4 mr-2" />
            )}
            Quick: MakrCave
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePortalNavigation(portals[2])} // Store
            disabled={loadingPortal === "store"}
          >
            {loadingPortal === "store" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Store className="w-4 h-4 mr-2" />
            )}
            Quick: Store
          </Button>
        </div>
      )}
    </div>
  );
}
