import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Bot, 
  Zap, 
  Users, 
  Cog, 
  ShoppingCart, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  Cpu,
  Wrench,
  Building2,
  Package,
  MapPin,
  Calendar,
  Star,
  Globe,
  Settings,
  BarChart3,
  Search,
  MessageCircle,
  BookOpen,
  Trophy,
  Bell,
  Activity
} from "lucide-react";

// Import feature flag components
import {
  FlagGuard,
  NavLinkGuard,
  ModuleGuard
} from "../../../packages/feature-flags/src/components/FlagGuard";

import {
  useBooleanFlag,
  useIsInternalUser
} from "../../../packages/feature-flags/src/hooks/useFeatureFlags";

export default function EnhancedIndex() {
  const { user, isAuthenticated } = useAuth();
  const isInternal = useIsInternalUser();
  
  // Feature flags for navigation
  const showStore = useBooleanFlag('org.links.store', true);
  const showMakrCave = useBooleanFlag('org.links.makrcave', true);
  const showForum = useBooleanFlag('org.forum.enabled', false);
  const showStatus = useBooleanFlag('org.status.enabled', false);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Enhanced for Different User Types */}
      <section className="relative overflow-hidden bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90">
        <div className="absolute inset-0 makrx-circuit-bg opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 makrx-float opacity-30">
          <Cog className="w-16 h-16 text-white" />
        </div>
        <div className="absolute top-40 right-20 makrx-float-delay opacity-30">
          <Cpu className="w-12 h-12 text-makrx-yellow" />
        </div>
        <div className="absolute bottom-40 left-20 makrx-float opacity-30">
          <Wrench className="w-14 h-14 text-white" />
        </div>
        
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* MakrBot Mascot */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src="https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/botlogofinal-c921e6?format=webp&width=800" 
                  alt="MakrBot Mascot" 
                  className="w-32 h-32 makrx-float"
                />
                <div className="absolute inset-0 bg-makrx-yellow/20 rounded-full blur-xl" />
              </div>
            </div>

            {/* Hero Title - Personalized */}
            <h1 className="text-5xl lg:text-7xl font-display font-black mb-6 text-balance">
              <span className="text-white">
                {isAuthenticated ? `Welcome back, ${user?.firstName}!` : 'Welcome to '}
              </span>
              <br />
              <span className="text-white">Makr</span>
              <span className="text-makrx-yellow makrx-glow-text">X</span>
              <br />
              <span className="text-2xl lg:text-4xl font-light text-white/90">
                {isAuthenticated ? 'Your Maker Hub Awaits' : 'The Maker Ecosystem Hub'}
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto text-balance">
              {isAuthenticated
                ? `Continue where you left off. Access your projects, orders, and makerspace communities.`
                : `A unified, modular platform connecting makers, inventors, and creative communities with the tools, spaces, and resources they need to design, prototype, and manufacture anything — efficiently, collaboratively, and at scale.`
              }
            </p>

            {/* Role-Based Quick Entry Buttons */}
            <RoleBasedQuickActions user={user} isAuthenticated={isAuthenticated} />

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-makrx-yellow/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-makrx-yellow" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
                <p className="text-white/80">Built for speed with modern tech stack</p>
              </div>

              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Community Driven</h3>
                <p className="text-white/80">Built by makers, for makers worldwide</p>
              </div>

              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-makrx-yellow/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-makrx-yellow" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Modular Design</h3>
                <p className="text-white/80">Enable only what you need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Dashboard Section (for logged-in users) */}
      {isAuthenticated && <PersonalizedDashboard user={user} />}

      {/* Ecosystem Overview */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                The Complete <span className="text-makrx-yellow">Maker Ecosystem</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to bring ideas to life, build and manage makerspaces,
                and connect with a global community of creators. From empty room to thriving hub — we provide end-to-end support.
              </p>
            </div>

            {/* Ecosystem Cards with Feature Flags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* MakrCave */}
              <NavLinkGuard flagKey="org.links.makrcave">
                <Link to="/makrcave" className="group">
                  <div className="makrx-glass-card h-full group-hover:border-makrx-blue/50 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-makrx-blue/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Building2 className="w-8 h-8 text-makrx-blue" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">MakrCave</h3>
                        <p className="text-makrx-blue font-semibold">Makerspace Management Portal</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Complete makerspace management: inventory tracking, workstation booking, 
                      project collaboration, and member management all in one place.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Inventory</span>
                      <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Projects</span>
                      <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Booking</span>
                    </div>
                  </div>
                </Link>
              </NavLinkGuard>

              {/* MakrX Store */}
              <NavLinkGuard flagKey="org.links.store">
                <Link to="/store" className="group">
                  <div className="makrx-glass-card h-full group-hover:border-makrx-yellow/50 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-makrx-yellow/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-8 h-8 text-makrx-yellow" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">MakrX Store</h3>
                        <p className="text-makrx-yellow font-semibold">3D Printing & Commerce Hub</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Upload designs, get instant quotes, order custom 3D prints, and browse 
                      a marketplace of maker-created products and services.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">3D Printing</span>
                      <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Marketplace</span>
                      <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Design Upload</span>
                    </div>
                  </div>
                </Link>
              </NavLinkGuard>

              {/* Community Forum (Feature Flagged) */}
              <FlagGuard flagKey="org.forum.enabled" showComingSoon={true}>
                <Link to="/forum" className="group">
                  <div className="makrx-glass-card h-full group-hover:border-makrx-yellow/50 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Community Forum</h3>
                        <p className="text-green-500 font-semibold">Connect & Collaborate</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Join discussions, share projects, ask questions, and connect with 
                      makers from around the world in our vibrant community.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Discussions</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Projects</span>
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-sm">Q&A</span>
                    </div>
                  </div>
                </Link>
              </FlagGuard>

              {/* Learning Hub */}
              <div className="makrx-glass-card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-makrx-yellow/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-makrx-yellow" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Learning Hub</h3>
                    <p className="text-makrx-yellow font-semibold">Skills & Certification Platform</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Interactive courses, skill badges, and certification paths for everything 
                  from basic electronics to advanced manufacturing techniques.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Courses</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Badges</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Certification</span>
                </div>
              </div>
            </div>

            {/* Find Makerspace Section */}
            <FindMakerspaceSection />

            {/* Architecture Highlight */}
            <div className="text-center">
              <div className="makrx-glass-card max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="text-makrx-blue">Open Source</span> · 
                  <span className="text-makrx-yellow"> Self-Hostable</span> · 
                  <span className="text-makrx-brown"> Modular</span>
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Built with modern microservices architecture. Docker-ready, Kubernetes-native, 
                  and designed to scale from single maker to global makerspace networks.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-makrx-blue/10 text-makrx-blue px-4 py-2 rounded-full">React + TypeScript</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-4 py-2 rounded-full">FastAPI</span>
                  <span className="bg-makrx-brown/10 text-makrx-brown px-4 py-2 rounded-full">Keycloak</span>
                  <span className="bg-makrx-blue/10 text-makrx-blue px-4 py-2 rounded-full">PostgreSQL</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-4 py-2 rounded-full">Docker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories & Community */}
      <FeaturedStoriesSection />

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-makrx-blue to-makrx-yellow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 makrx-float">
            <Cog className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 makrx-float-delay">
            <Bot className="w-32 h-32 text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            {isAuthenticated ? 'Continue Your Journey' : 'Ready to Start Making?'}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {isAuthenticated 
              ? 'Your maker ecosystem is just a click away. Jump back into your projects and community.'
              : 'Join thousands of makers worldwide who are building the future with MakrX.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <NavLinkGuard flagKey="org.links.makrcave">
              <Link 
                to="/makrcave" 
                className="bg-white text-makrx-blue font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-all duration-300 flex items-center gap-2 justify-center hover:shadow-2xl hover:scale-105"
              >
                <Building2 className="w-5 h-5" />
                {isAuthenticated ? 'Go to MakrCave' : 'Start with MakrCave'}
              </Link>
            </NavLinkGuard>
            <NavLinkGuard flagKey="org.links.store">
              <Link 
                to="/store" 
                className="bg-makrx-blue/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-makrx-blue/30 transition-all duration-300 flex items-center gap-2 justify-center border border-white/20 hover:shadow-2xl hover:scale-105"
              >
                <Package className="w-5 h-5" />
                {isAuthenticated ? 'Browse Store' : 'Explore Store'}
              </Link>
            </NavLinkGuard>
          </div>
        </div>
      </section>
    </div>
  );
}

// Role-based quick actions component
function RoleBasedQuickActions({ user, isAuthenticated }: { user: any; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <NavLinkGuard flagKey="org.links.makrcave">
          <Link to="/makrcave" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <MapPin className="w-5 h-5" />
            Find a Makerspace
          </Link>
        </NavLinkGuard>
        <NavLinkGuard flagKey="org.links.store">
          <Link to="/store" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <ShoppingCart className="w-5 h-5" />
            Shop Maker Gear
          </Link>
        </NavLinkGuard>
        <Link to="/learn" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
          <GraduationCap className="w-5 h-5" />
          Start Learning
        </Link>
        <Link to="/register" className="makrx-btn-primary text-lg flex items-center gap-2 justify-center">
          <ArrowRight className="w-5 h-5" />
          Join Community
        </Link>
      </div>
    );
  }

  // Role-based actions for authenticated users
  const role = user?.role || 'maker';
  
  switch (role) {
    case 'super_admin':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <Link to="/admin/feature-flags" className="makrx-btn-primary text-lg flex items-center gap-2 justify-center">
            <Settings className="w-5 h-5" />
            Feature Flags
          </Link>
          <Link to="/admin/analytics" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <BarChart3 className="w-5 h-5" />
            System Analytics
          </Link>
          <NavLinkGuard flagKey="org.links.makrcave">
            <Link to="/makrcave" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
              <Building2 className="w-5 h-5" />
              Manage Spaces
            </Link>
          </NavLinkGuard>
          <NavLinkGuard flagKey="org.links.store">
            <Link to="/store" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
              <Package className="w-5 h-5" />
              Store Admin
            </Link>
          </NavLinkGuard>
        </div>
      );
    
    case 'makerspace_admin':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link to="/makrcave" className="makrx-btn-primary text-lg flex items-center gap-2 justify-center">
            <Building2 className="w-5 h-5" />
            Manage Makerspace
          </Link>
          <Link to="/makrcave/members" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <Users className="w-5 h-5" />
            Manage Members
          </Link>
          <Link to="/makrcave/analytics" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <BarChart3 className="w-5 h-5" />
            View Analytics
          </Link>
        </div>
      );
    
    case 'service_provider':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link to="/makrcave/jobs" className="makrx-btn-primary text-lg flex items-center gap-2 justify-center">
            <Activity className="w-5 h-5" />
            Available Jobs
          </Link>
          <Link to="/makrcave/provider" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
            <Settings className="w-5 h-5" />
            Provider Portal
          </Link>
          <NavLinkGuard flagKey="org.links.store">
            <Link to="/store" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
              <Package className="w-5 h-5" />
              Browse Store
            </Link>
          </NavLinkGuard>
        </div>
      );
    
    default: // General makers/students
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link to="/profile/projects" className="makrx-btn-primary text-lg flex items-center gap-2 justify-center">
            <Star className="w-5 h-5" />
            My Projects
          </Link>
          <NavLinkGuard flagKey="org.links.makrcave">
            <Link to="/makrcave" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
              <Building2 className="w-5 h-5" />
              My Makerspaces
            </Link>
          </NavLinkGuard>
          <NavLinkGuard flagKey="org.links.store">
            <Link to="/store/orders" className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center">
              <Package className="w-5 h-5" />
              My Orders
            </Link>
          </NavLinkGuard>
        </div>
      );
  }
}

// Personalized dashboard for logged-in users
function PersonalizedDashboard({ user }: { user: any }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Your Maker Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Projects */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-makrx-blue/20 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-makrx-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Active Projects</h3>
                  <p className="text-2xl font-bold text-makrx-blue">3</p>
                </div>
              </div>
              <Link to="/profile/projects" className="text-sm text-makrx-blue hover:underline">
                View all projects →
              </Link>
            </div>

            {/* Pending Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-makrx-yellow/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-makrx-yellow" />
                </div>
                <div>
                  <h3 className="font-semibold">Pending Orders</h3>
                  <p className="text-2xl font-bold text-makrx-yellow">2</p>
                </div>
              </div>
              <Link to="/store/orders" className="text-sm text-makrx-yellow hover:underline">
                Track orders →
              </Link>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Upcoming Events</h3>
                  <p className="text-2xl font-bold text-green-500">1</p>
                </div>
              </div>
              <Link to="/events" className="text-sm text-green-500 hover:underline">
                View calendar →
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-2xl font-bold text-red-500">5</p>
                </div>
              </div>
              <Link to="/notifications" className="text-sm text-red-500 hover:underline">
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Find Makerspace section
function FindMakerspaceSection() {
  return (
    <div className="makrx-glass-card mb-16">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h3 className="text-3xl font-bold mb-4">Find Your Local Makerspace</h3>
          <p className="text-muted-foreground mb-6">
            Connect with maker communities near you. Over 500+ makerspaces worldwide 
            use MakrX to manage their operations and connect with members.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Enter your city or ZIP code"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-makrx-blue focus:border-transparent"
              />
            </div>
            <button className="makrx-btn-primary flex items-center gap-2">
              <Search className="w-4 h-4" />
              Find Spaces
            </button>
          </div>
        </div>
        <div className="w-full lg:w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-12 h-12 text-makrx-blue mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive Map</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Featured stories section
function FeaturedStoriesSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Featured Maker Stories</h2>
            <p className="text-xl text-muted-foreground">
              See what amazing things makers are creating with MakrX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Story 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gradient-to-br from-makrx-blue to-makrx-yellow"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-makrx-yellow" />
                  <span className="text-sm font-medium text-makrx-yellow">Featured Project</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Robotic Arm Control System</h3>
                <p className="text-muted-foreground mb-4">
                  Built using components from MakrX Store and assembled at TechSpace Makerspace...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-makrx-blue rounded-full"></div>
                    <span className="text-sm">Alex Chen</span>
                  </div>
                  <span className="text-sm text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Featured Story 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Community</span>
                </div>
                <h3 className="text-xl font-bold mb-2">MakerSpace Network Launch</h3>
                <p className="text-muted-foreground mb-4">
                  50 new makerspaces joined the MakrX network this month, bringing innovative tools...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    <span className="text-sm">MakrX Team</span>
                  </div>
                  <span className="text-sm text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </div>

            {/* Featured Story 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-500">Learning</span>
                </div>
                <h3 className="text-xl font-bold mb-2">3D Printing Mastery Course</h3>
                <p className="text-muted-foreground mb-4">
                  New comprehensive course covering everything from basics to advanced techniques...
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Sarah Kim</span>
                  </div>
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <FlagGuard flagKey="org.forum.enabled" showComingSoon={true}>
              <Link to="/forum" className="makrx-btn-secondary">
                View All Stories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </FlagGuard>
          </div>
        </div>
      </div>
    </section>
  );
}
