import { useAuth } from '../contexts/AuthContext';
import NotificationWidget from './NotificationWidget';
import {
  Crown, Shield, Wrench, Settings, UserCheck,
  BarChart3, Users, Building2, Package,
  FolderOpen, Calendar, AlertTriangle, Activity
} from 'lucide-react';

// Super Admin Dashboard
function SuperAdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Crown className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Super Admin Console</h1>
            <p className="text-purple-100">Welcome back, {user?.firstName}! You have full system access.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Makerspaces</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Building2 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Users</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Equipment</p>
              <p className="text-2xl font-bold">156</p>
            </div>
            <Wrench className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold">89</p>
            </div>
            <FolderOpen className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>
      </div>

      <div className="makrcave-card">
        <h3 className="text-lg font-semibold mb-4">System Overview</h3>
        <p className="text-muted-foreground">
          As a Super Admin, you have complete control over the MakrX ecosystem including creating/deleting makerspaces, 
          managing all users, viewing system logs, and configuring feature flags.
        </p>
      </div>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Shield className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Organization Admin</h1>
            <p className="text-blue-100">Welcome, {user?.firstName}! Manage users and view organization data.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Managed Users</p>
              <p className="text-2xl font-bold">324</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role Assignments</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Analytics Reports</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <BarChart3 className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>
      </div>

      <div className="makrcave-card">
        <h3 className="text-lg font-semibold mb-4">Access Limitations</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> As an Admin, you can view all makerspaces and manage users, but you cannot 
            modify makerspace-level inventory or equipment. Contact a Super Admin for advanced system changes.
          </p>
        </div>
      </div>
    </div>
  );
}

// Makerspace Admin Dashboard
function MakerspaceAdminDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-makrx-blue to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Wrench className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">MakrCave Manager</h1>
            <p className="text-blue-100">Hello, {user?.firstName}! Manage your makerspace operations.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Members</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <Users className="w-8 h-8 text-makrx-blue" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipment</p>
              <p className="text-2xl font-bold">18</p>
            </div>
            <Wrench className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <Calendar className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>
      </div>

      <div className="makrcave-card">
        <h3 className="text-lg font-semibold mb-4">Your Makerspace</h3>
        <p className="text-muted-foreground">
          You can manage inventory, approve reservations, add/edit equipment, and oversee all operations 
          within your assigned makerspace. Full control over member management and project oversight.
        </p>
      </div>
    </div>
  );
}

// Service Provider Dashboard
function ServiceProviderDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <Settings className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Service Provider</h1>
            <p className="text-slate-100">Hi, {user?.firstName}! Your account is currently restricted.</p>
          </div>
        </div>
      </div>

      <div className="makrcave-card">
        <div className="text-center py-12">
          <Settings className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold mb-4">Account Under Development</h3>
          <p className="text-muted-foreground mb-6">
            Service provider features are currently being developed. Your future capabilities will include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">Job Management</h4>
              <p className="text-sm text-slate-700">Accept and manage external orders</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">Stock Control</h4>
              <p className="text-sm text-slate-700">Filament and material tracking</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">Processing</h4>
              <p className="text-sm text-slate-700">G-code slicing and preparation</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">Earnings</h4>
              <p className="text-sm text-slate-700">Revenue tracking and reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Maker Dashboard
function MakerDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <UserCheck className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Maker Dashboard</h1>
            <p className="text-green-100">Welcome, {user?.firstName}! Let's create something amazing.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Projects</p>
              <p className="text-2xl font-bold">7</p>
            </div>
            <FolderOpen className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipment Certified</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Bookings</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <Calendar className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="makrcave-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full makrcave-btn-primary text-sm py-3">
              Reserve Equipment
            </button>
            <button className="w-full makrcave-btn-secondary text-sm py-3">
              Start New Project
            </button>
            <button className="w-full makrcave-btn-primary text-sm py-3">
              View Inventory
            </button>
          </div>
        </div>

        <div className="makrcave-card">
          <h3 className="text-lg font-semibold mb-4">Your Access</h3>
          <p className="text-muted-foreground text-sm">
            Create and manage your own projects, reserve equipment you're certified to use, 
            and collaborate with other makers. Add materials to your project BOMs linked to the store.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Role Dashboard Component
export default function RoleDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please log in to view your dashboard.</p>
      </div>
    );
  }

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'makerspace_admin':
      return <MakerspaceAdminDashboard />;
    case 'service_provider':
      return <ServiceProviderDashboard />;
    case 'maker':
      return <MakerDashboard />;
    default:
      return <MakerDashboard />;
  }
}
