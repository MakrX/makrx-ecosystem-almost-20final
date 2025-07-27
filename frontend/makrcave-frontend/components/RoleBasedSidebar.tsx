import { useAuth } from '../contexts/AuthContext';
import SuperAdminSidebar from './SuperAdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import MakerSidebar from './MakerSidebar';

// Admin Sidebar Component
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  UserCog
} from 'lucide-react';

function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigation = [
    {
      name: 'Global Dashboard',
      href: '/portal/dashboard',
      icon: LayoutDashboard,
      active: isActive('/portal/dashboard')
    },
    {
      name: 'User Management',
      href: '/portal/admin/users',
      icon: Users,
      active: isActive('/portal/admin/users')
    },
    {
      name: 'Role Management',
      href: '/portal/admin/roles',
      icon: UserCog,
      active: isActive('/portal/admin/roles')
    },
    {
      name: 'Analytics',
      href: '/portal/analytics',
      icon: BarChart3,
      active: isActive('/portal/analytics')
    }
  ];

  return (
    <div className="makrcave-sidebar bg-gradient-to-b from-blue-900/20 to-blue-800/10 border-r border-blue-200">
      {/* Logo & Title */}
      <div className="p-6 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-blue-700">Admin</h2>
            <p className="text-xs text-blue-600">Organization Manager</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-700">
              {user?.firstName?.[0] || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-blue-700">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </p>
            <p className="text-xs text-blue-600 truncate">
              Organization Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Restricted Access Notice */}
        <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-1">Limited Access</h4>
          <p className="text-xs text-yellow-700">
            Cannot modify makerspace inventory or machines. View-only access to most resources.
          </p>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Service Provider Sidebar Component
function ServiceProviderSidebar() {
  const { user, logout } = useAuth();

  return (
    <div className="makrcave-sidebar bg-gradient-to-b from-yellow-900/20 to-yellow-800/10 border-r border-yellow-200">
      {/* Logo & Title */}
      <div className="p-6 border-b border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-yellow-700">Service Provider</h2>
            <p className="text-xs text-yellow-600">Currently Restricted</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-yellow-700">
              {user?.firstName?.[0] || 'S'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-yellow-700">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </p>
            <p className="text-xs text-yellow-600 truncate">
              Service Provider
            </p>
          </div>
        </div>
      </div>

      {/* Restricted Notice */}
      <div className="flex-1 p-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Account Restricted</h3>
          <p className="text-xs text-yellow-700 mb-3">
            Service provider features are currently disabled. Future features will include:
          </p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Job acceptance</li>
            <li>• Filament stock management</li>
            <li>• G-code slicing</li>
            <li>• Earnings reports</li>
          </ul>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-yellow-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Main Role-Based Sidebar Component
export default function RoleBasedSidebar() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminSidebar />;
    case 'admin':
      return <AdminSidebar />;
    case 'makerspace_admin':
      return <ManagerSidebar />;
    case 'service_provider':
      return <ServiceProviderSidebar />;
    case 'maker':
      return <MakerSidebar />;
    default:
      return <MakerSidebar />;
  }
}
