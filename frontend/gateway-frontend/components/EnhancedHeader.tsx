import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../lib/ui";
import AppLauncher from "./AppLauncher";
import {
  Bot,
  Menu,
  X,
  Building2,
  ShoppingCart,
  GraduationCap,
  User,
  LogOut,
  Settings,
  Bell,
  Search,
  Globe,
  MessageCircle,
  BarChart3,
  ChevronDown,
  Activity,
  Package,
  Users,
  Star,
  Grid3X3
} from "lucide-react";

// Import feature flag components
import { NavLinkGuard, FlagGuard, useBooleanFlag, useIsInternalUser } from "../lib/feature-flags";

export default function EnhancedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isInternal = useIsInternalUser();

  // Feature flags for navigation
  const showStore = useBooleanFlag('org.links.store', true);
  const showMakrCave = useBooleanFlag('org.links.makrcave', true);
  const showForum = useBooleanFlag('org.forum.enabled', false);
  const showStatus = useBooleanFlag('org.status.enabled', false);
  const showBilling = useBooleanFlag('org.billing.unified', false);
  const profileEditEnabled = useBooleanFlag('org.profile.edit', true);

  const isActive = (path: string) => location.pathname === path;

  // Build navigation based on feature flags and user role
  const buildNavigation = () => {
    const baseNav = [];

    if (showMakrCave) {
      baseNav.push({
        name: 'MakrCave',
        href: '/makrcave',
        icon: Building2,
        dropdown: [
          { name: 'Portal', href: '/makrcave', icon: Building2 },
          { name: 'Find Spaces', href: '/makrcave/find', icon: Search },
          { name: 'Projects', href: '/makrcave/projects', icon: Star },
        ]
      });
    }

    if (showStore) {
      baseNav.push({
        name: 'Store',
        href: '/store',
        icon: ShoppingCart,
        dropdown: [
          { name: 'Shop', href: '/store', icon: ShoppingCart },
          { name: 'Services', href: '/store/services', icon: Settings },
          { name: 'Upload Design', href: '/store/upload', icon: Package },
        ]
      });
    }

    baseNav.push({
      name: 'Learn',
      href: '/learn',
      icon: GraduationCap,
      dropdown: [
        { name: 'Courses', href: '/learn', icon: GraduationCap },
        { name: 'Skill Badges', href: '/learn/badges', icon: Star },
        { name: 'Certifications', href: '/learn/certifications', icon: Settings },
      ]
    });

    if (showForum) {
      baseNav.push({
        name: 'Community',
        href: '/forum',
        icon: MessageCircle,
        dropdown: [
          { name: 'Forum', href: '/forum', icon: MessageCircle },
          { name: 'Events', href: '/events', icon: Activity },
          { name: 'Stories', href: '/stories', icon: Star },
        ]
      });
    }

    return baseNav;
  };

  const navigation = buildNavigation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-makrx-blue/90 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/botlogofinal-c921e6?format=webp&width=800" 
                alt="MakrBot" 
                className="w-8 h-8 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-makrx-yellow/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-xl font-display font-bold">
              <span className="text-white">Makr</span>
              <span className="text-makrx-yellow">X</span>
            </div>
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const hasDropdown = item.dropdown && item.dropdown.length > 0;
              
              return (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setShowDropdown(item.name)}
                  onMouseLeave={() => setShowDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'text-makrx-yellow bg-makrx-yellow/20'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                    {hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasDropdown && showDropdown === item.name && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                      {item.dropdown.map((dropdownItem) => {
                        const DropdownIcon = dropdownItem.icon;
                        return (
                          <Link
                            key={dropdownItem.href}
                            to={dropdownItem.href}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <DropdownIcon className="w-4 h-4" />
                            {dropdownItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Ecosystem Quick Links */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              <NavLinkGuard flagKey="org.status.enabled">
                <Link
                  to="/status"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Status
                </Link>
              </NavLinkGuard>
              
              {showStatus && showForum && (
                <span className="text-white/30">|</span>
              )}
              
              <FlagGuard flagKey="org.forum.enabled">
                <Link
                  to="/forum"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Forum
                </Link>
              </FlagGuard>
            </div>

            {/* Notifications (for authenticated users) */}
            {isAuthenticated && (
              <button className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
            )}

            {/* App Launcher */}
            <button
              onClick={() => setIsLauncherOpen(true)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Launch Apps"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="icon-only" className="bg-white/10 hover:bg-white/20 border-white/20" />

            {/* Profile/Login */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                {/* Admin Quick Access */}
                {user?.role === 'super_admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                    <div className="w-6 h-6 bg-makrx-yellow rounded-full flex items-center justify-center text-makrx-blue text-sm font-bold">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    {user?.firstName || user?.username}
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <FlagGuard flagKey="org.profile.edit">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </FlagGuard>
                    
                    <Link
                      to="/profile/projects"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Star className="w-4 h-4" />
                      My Projects
                    </Link>
                    
                    <NavLinkGuard flagKey="org.links.store">
                      <Link
                        to="/store/orders"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                    </NavLinkGuard>
                    
                    <FlagGuard flagKey="org.billing.unified">
                      <Link
                        to="/billing"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Billing
                      </Link>
                    </FlagGuard>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 makrx-btn-primary text-sm"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 mt-4">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-makrx-yellow bg-makrx-yellow/20'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                    
                    {/* Mobile Dropdown Items */}
                    {item.dropdown && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.dropdown.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          return (
                            <Link
                              key={dropdownItem.href}
                              to={dropdownItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-white/60 hover:text-white/80 rounded-lg hover:bg-white/5 transition-colors text-sm"
                            >
                              <DropdownIcon className="w-4 h-4" />
                              {dropdownItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              
              {/* Mobile Profile Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-white/10 mt-4">
                  <div className="flex items-center px-4 py-3 text-white">
                    <div className="w-8 h-8 bg-makrx-yellow rounded-full flex items-center justify-center text-makrx-blue font-bold mr-3">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-sm text-white/60">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <FlagGuard flagKey="org.profile.edit">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </FlagGuard>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 makrx-btn-primary mt-4"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Feature Flag Debug Panel (Development Only) */}
      {isInternal && process.env.NODE_ENV === 'development' && (
        <FeatureFlagDebugBanner />
      )}
    </header>
  );
}

// Debug banner for development
function FeatureFlagDebugBanner() {
  const [showDebug, setShowDebug] = useState(false);
  
  const flags = [
    { key: 'org.links.store', label: 'Store' },
    { key: 'org.links.makrcave', label: 'MakrCave' },
    { key: 'org.forum.enabled', label: 'Forum' },
    { key: 'org.status.enabled', label: 'Status' },
    { key: 'org.billing.unified', label: 'Billing' },
    { key: 'org.profile.edit', label: 'Profile Edit' }
  ];

  return (
    <div className="bg-yellow-500 text-yellow-900">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">🚧 Development Mode</span>
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="underline hover:no-underline"
            >
              {showDebug ? 'Hide' : 'Show'} Feature Flags
            </button>
          </div>
        </div>
        
        {showDebug && (
          <div className="pb-3">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {flags.map(flag => (
                <FlagStatusIndicator key={flag.key} flagKey={flag.key} label={flag.label} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlagStatusIndicator({ flagKey, label }: { flagKey: string; label: string }) {
  const isEnabled = useBooleanFlag(flagKey);
  
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-600' : 'bg-red-600'}`} />
      <span>{label}</span>
    </div>
  );
}
