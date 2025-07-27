import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  Wrench,
  Package,
  User,
  BookOpen,
  Award,
  MessageSquare,
  Heart,
  LogOut
} from 'lucide-react';

export default function MakerSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigation = [
    {
      name: 'My Dashboard',
      href: '/portal/dashboard',
      icon: LayoutDashboard,
      active: isActive('/portal/dashboard')
    },
    {
      name: 'My Projects',
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
      name: 'Equipment',
      href: '/portal/equipment',
      icon: Wrench,
      active: isActive('/portal/equipment')
    },
    {
      name: 'Available Materials',
      href: '/portal/materials',
      icon: Package,
      active: isActive('/portal/materials')
    }
  ];

  const communityNavigation = [
    {
      name: 'My Profile',
      href: '/portal/profile',
      icon: User,
      active: isActive('/portal/profile')
    },
    {
      name: 'Learning Hub',
      href: '/portal/learning',
      icon: BookOpen,
      active: isActive('/portal/learning')
    },
    {
      name: 'Achievements',
      href: '/portal/achievements',
      icon: Award,
      active: isActive('/portal/achievements')
    },
    {
      name: 'Community',
      href: '/portal/community',
      icon: MessageSquare,
      active: isActive('/portal/community')
    }
  ];

  return (
    <div className="makrcave-sidebar bg-gradient-to-b from-green-50 to-emerald-100/50 border-r border-green-200">
      {/* Logo & Title */}
      <div className="p-6 border-b border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-makrx-teal to-makrx-teal-dark rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-green-700">MakrSpace</h2>
            <p className="text-xs text-green-600">Maker Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-makrx-teal rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.firstName?.[0] || 'M'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-green-700">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </p>
            <p className="text-xs text-green-600 truncate">
              Creative Maker
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-green-200">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-white/70 rounded-lg p-2">
            <p className="text-lg font-bold text-green-700">3</p>
            <p className="text-xs text-green-600">Active Projects</p>
          </div>
          <div className="bg-white/70 rounded-lg p-2">
            <p className="text-lg font-bold text-green-700">12</p>
            <p className="text-xs text-green-600">Hours This Month</p>
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
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Community Section */}
        <div className="mt-8">
          <h3 className="px-3 mb-2 text-xs font-semibold text-green-600 uppercase tracking-wider">
            Community & Growth
          </h3>
          <div className="space-y-1">
            {communityNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-makrx-teal text-white'
                      : 'text-gray-700 hover:text-makrx-teal hover:bg-makrx-teal/10'
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
      <div className="p-4 border-t border-green-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
