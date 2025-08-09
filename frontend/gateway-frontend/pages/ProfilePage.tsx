import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  User,
  Settings,
  Star,
  Package,
  Building2,
  Activity,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Github,
  Instagram,
  Globe,
  Edit,
  Save,
  X,
  Trophy,
  Target,
  Clock,
  ShoppingCart,
  FileText,
  Bell,
  Shield,
  CreditCard,
  Download
} from "lucide-react";

// Import feature flag components
import { FlagGuard, NavLinkGuard } from "../../../packages/feature-flags/src/components/FlagGuard";
import { useBooleanFlag } from "../../../packages/feature-flags/src/hooks/useFeatureFlags";

export default function EnhancedProfile() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Feature flags
  const profileEditEnabled = useBooleanFlag('org.profile.edit', true);
  const showStore = useBooleanFlag('org.links.store', true);
  const showMakrCave = useBooleanFlag('org.links.makrcave', true);
  const billingEnabled = useBooleanFlag('org.billing.unified', false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please sign in to view your profile and maker dashboard.
          </p>
          <Link to="/login" className="makrx-btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'projects', label: 'Projects', icon: Star },
    ...(showStore ? [{ id: 'orders', label: 'Orders', icon: Package }] : []),
    ...(showMakrCave ? [{ id: 'makerspaces', label: 'Makerspaces', icon: Building2 }] : []),
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-makrx-blue rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      @{user?.username}
                    </p>
                  </div>
                  
                  <FlagGuard flagKey="org.profile.edit">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="makrx-btn-secondary flex items-center gap-2"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </FlagGuard>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-makrx-blue">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-makrx-yellow">8</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">3</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Makerspaces</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">1.2k</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Maker XP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Bio */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Passionate maker with expertise in 3D printing, electronics, and woodworking. 
                Active member of TechSpace Makerspace and contributor to open-source hardware projects.
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-makrx-blue text-makrx-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'projects' && <ProjectsTab />}
              {activeTab === 'orders' && showStore && <OrdersTab />}
              {activeTab === 'makerspaces' && showMakrCave && <MakerspacesTab />}
              {activeTab === 'activity' && <ActivityTab />}
              {activeTab === 'settings' && <SettingsTab billingEnabled={billingEnabled} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/makrcave/projects/new" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Star className="w-6 h-6 text-makrx-blue" />
            <div>
              <div className="font-medium">Start Project</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Begin a new maker project</div>
            </div>
          </Link>
          
          <NavLinkGuard flagKey="org.links.store">
            <Link to="/store/upload" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Package className="w-6 h-6 text-makrx-yellow" />
              <div>
                <div className="font-medium">Upload Design</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Get 3D printing quote</div>
              </div>
            </Link>
          </NavLinkGuard>
          
          <Link to="/makrcave/find" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Building2 className="w-6 h-6 text-green-500" />
            <div>
              <div className="font-medium">Find Makerspace</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Discover local spaces</div>
            </div>
          </Link>
          
          <Link to="/learn" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Trophy className="w-6 h-6 text-purple-500" />
            <div>
              <div className="font-medium">Learn Skills</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Earn new badges</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-makrx-blue rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Earned "3D Printing Expert" badge</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-makrx-yellow rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Order #1234 shipped</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Yesterday</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Started "IoT Weather Station" project</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">3 days ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Projects</h3>
        <Link to="/makrcave/projects/new" className="makrx-btn-primary flex items-center gap-2">
          <Star className="w-4 h-4" />
          New Project
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Card */}
        <div className="border rounded-lg p-4">
          <div className="h-32 bg-gradient-to-br from-makrx-blue to-makrx-yellow rounded-lg mb-4"></div>
          <h4 className="font-semibold mb-2">IoT Weather Station</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Arduino-based weather monitoring system with real-time data logging.
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              In Progress
            </span>
            <span className="text-sm text-gray-500">75% complete</span>
          </div>
        </div>
        
        {/* Add more project cards */}
        <div className="border rounded-lg p-4">
          <div className="h-32 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg mb-4"></div>
          <h4 className="font-semibold mb-2">3D Printed Quadcopter</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Custom designed quadcopter frame with integrated electronics housing.
          </p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </span>
            <span className="text-sm text-gray-500">100% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Order History</h3>
        <Link to="/store" className="makrx-btn-secondary flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
      
      <div className="space-y-4">
        {/* Order Item */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold">Order #1234</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Placed on Dec 15, 2024</div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Shipped
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Custom 3D Print - Mechanical Part</span>
              <span>₹1,250</span>
            </div>
            <div className="flex items-center justify-between">
              <span>PLA Filament - 1kg White</span>
              <span>₹850</span>
            </div>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>₹2,100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MakerspacesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Makerspaces</h3>
        <Link to="/makrcave/find" className="makrx-btn-secondary flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Find More
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-makrx-blue rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold">TechSpace Makerspace</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">San Francisco, CA</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Member since</span>
              <span>Jan 2023</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Role</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Activity Timeline</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-makrx-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Earned "3D Printing Expert" badge</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed advanced 3D printing certification course
            </div>
            <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-makrx-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Order #1234 shipped</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Your custom 3D printed parts are on the way
            </div>
            <div className="text-xs text-gray-500 mt-1">Yesterday at 3:24 PM</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium">Started "IoT Weather Station" project</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              New project created in TechSpace Makerspace
            </div>
            <div className="text-xs text-gray-500 mt-1">3 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ billingEnabled }: { billingEnabled: boolean }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Account Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Account</h4>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <span>Edit Profile</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <span>Security</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <span>Notifications</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>

        {/* Ecosystem Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Ecosystem</h4>
          <div className="space-y-3">
            <FlagGuard flagKey="org.billing.unified">
              <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span>Billing & Payments</span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </FlagGuard>
            
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <span>Data Export</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <span>Privacy Settings</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
