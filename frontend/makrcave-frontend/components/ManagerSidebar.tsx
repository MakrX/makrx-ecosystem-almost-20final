import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Wrench,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Building2,
  LogOut
} from 'lucide-react';

export default function ManagerSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/portal/dashboard',
      icon: LayoutDashboard,
      active: isActive('/portal/dashboard')
    },
    {
      name: 'Inventory',
      href: '/portal/inventory',
      icon: Package,
      active: isActive('/portal/inventory')
    },
    {
      name: 'Equipment',
      href: '/portal/equipment',
      icon: Wrench,
      active: isActive('/portal/equipment')
    },
    {
      name: 'Projects',
      href: '/portal/projects',
      icon: FolderOpen,
      active: isActive('/portal/projects')
    },
    {
      name: 'Reservations',
      href: '/portal/reservations',
      icon: Calendar,
      active: isActive('/portal/reservations')
    },
    {
      name: 'Analytics & Reports',
      href: '/portal/analytics',
      icon: BarChart3,
      active: isActive('/portal/analytics')
    }
  ];

  const managementNavigation = [
    {
      name: 'Member Management',
      href: '/portal/members',
      icon: Users,
      active: isActive('/portal/members')
    },
    {
      name: 'Billing & Payments',
      href: '/portal/billing',
      icon: DollarSign,
      active: isActive('/portal/billing')
    },
    {
      name: 'Maintenance',
      href: '/portal/maintenance',
      icon: AlertTriangle,
      active: isActive('/portal/maintenance')
    },
    {
      name: 'Makerspace Settings',
      href: '/portal/settings',
      icon: Settings,
      active: isActive('/portal/settings')
    }
  ];

  return (
    <div className="makrcave-sidebar bg-gradient-to-b from-blue-50 to-blue-100/50 border-r border-blue-200">
      {/* Logo & Title */}
      <div className="p-6 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-makrx-blue to-blue-700 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-makrx-blue">MakrCave</h2>
            <p className="text-xs text-blue-600">Manager Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-makrx-teal rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.firstName?.[0] || 'M'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-makrx-blue">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </p>
            <p className="text-xs text-blue-600 truncate">
              MakrCave Manager
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
                    ? 'bg-makrx-blue text-white'
                    : 'text-gray-700 hover:text-makrx-blue hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Management Section */}
        <div className="mt-8">
          <h3 className="px-3 mb-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Management
          </h3>
          <div className="space-y-1">
            {managementNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-makrx-brown text-white'
                      : 'text-gray-700 hover:text-makrx-brown hover:bg-amber-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-makrx-blue hover:bg-blue-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
